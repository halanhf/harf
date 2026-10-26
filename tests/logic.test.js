// runs the page's pure helpers and data checks under node, no browser needed: node --test tests/logic.test.js
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const block=id=>{const m=html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)</script>`));assert.ok(m,`script ${id} missing`);return m[1];};
const ctx={module:{exports:{}}};
vm.createContext(ctx);
vm.runInContext(block("logic"),ctx);
vm.runInContext(block("data")+";this.D={LETTERS,VOWELS,SHIFTS,PAIRS,COURSE,SYLLABUS,MSA};",ctx);
const L=ctx.module.exports, D=ctx.D;
const DAY=86400000, now=1e12;

test("normalize strips vowels and unifies letter variants, including gulf letters",()=>{
  assert.equal(L.normalizeArabic("كِتَاب"),"كتاب");
  assert.equal(L.normalizeArabic("أَنَا"),"انا");
  assert.equal(L.normalizeArabic("مَدْرَسَة"),"مدرسه");
  assert.equal(L.normalizeArabic("باچر"),L.normalizeArabic("باكر"));
  assert.equal(L.normalizeArabic("گهوة"),L.normalizeArabic("قهوة"));
});
test("similarity ignores vowel marks",()=>{
  assert.equal(L.similarity("كتاب","كِتَاب"),1);
  assert.ok(L.similarity("كتاب","سيارة")<0.4);
});
test("letter forms",()=>{
  assert.deepEqual({...L.letterForms("ب",true)},{isolated:"ب",initial:"بـ",medial:"ـبـ",final:"ـب"});
  assert.deepEqual({...L.letterForms("د",false)},{isolated:"د",initial:"د",medial:"ـد",final:"ـد"});
});
test("fsrs: new card goes through 1m and 10m steps, then graduates to days",()=>{
  const a=L.schedule({},2,now); assert.equal(a.st,1); assert.equal(a.d,now+10*60000); assert.equal(a.i,0);
  const b=L.schedule(a,2,now+10*60000); assert.equal(b.st,-1); assert.ok(b.i>=3&&b.i<=6,`graduated interval ${b.i}`);
  const again=L.schedule({},0,now); assert.equal(again.st,0); assert.equal(again.d,now+60000);
  const easy=L.schedule({},3,now); assert.equal(easy.st,-1); assert.ok(easy.i>=10,`easy first interval ${easy.i}`);
});
test("fsrs: intervals grow on success and a lapse sends the card back to relearning with lower stability",()=>{
  let c=L.schedule(L.schedule({},2,now),2,now+600000); let t=c.d; const ivs=[c.i];
  for(let k=0;k<4;k++){ c=L.schedule(c,2,t); ivs.push(c.i); t=c.d; }
  for(let k=1;k<ivs.length;k++) assert.ok(ivs[k]>ivs[k-1],`intervals ${ivs}`);
  const s0=c.s; const lapsed=L.schedule(c,0,t); assert.ok(lapsed.s<s0); assert.equal(lapsed.l,1); assert.equal(lapsed.st,0); assert.equal(lapsed.d,t+10*60000);
  const back=L.schedule(lapsed,2,t+10*60000); assert.equal(back.st,-1); assert.ok(back.i>=1);
});
test("fsrs: higher retention target means shorter intervals; difficulty stays in 1..10",()=>{
  const base=L.schedule(L.schedule({},2,now),2,now+600000);
  const lo=L.schedule(base,2,base.d,0.85), hi=L.schedule(base,2,base.d,0.95);
  assert.ok(hi.i<lo.i,`0.95 -> ${hi.i}, 0.85 -> ${lo.i}`);
  let c=base; for(let k=0;k<10;k++){ c=L.schedule(c,1,c.d); assert.ok(c.k>=1&&c.k<=10); }
  assert.ok(Math.abs(L.retrievability(5,5)-0.9)<1e-9); assert.ok(Math.abs(L.intervalDays(5,0.9)-5)<1e-9);
});
test("cards pack and unpack; old sm-2 cards migrate",()=>{
  const c=L.schedule(L.schedule({},2,now),2,now+600000); const u=L.unpackCard(L.packCard(c));
  for(const k of ["r","l","st","i"]) assert.equal(u[k],c[k],k); assert.ok(Math.abs(u.s-c.s)<0.001); assert.ok(Math.abs(u.d-c.d)<60000);
  const old=L.unpackCard([250,7.5,3,Math.round((now+7.5*DAY)/60000),0]);
  assert.equal(old.st,-1); assert.equal(old.i,7.5); assert.ok(old.s>=7); assert.equal(old.k,5);
  const reviewed=L.schedule(old,2,old.d); assert.ok(reviewed.i>7.5);
  assert.equal(L.isLeech({l:4}),true); assert.equal(L.isLeech({l:3}),false);
});
test("card modes get harder with reps; fuṣḥā track stays receptive",()=>{
  assert.equal(L.cardMode(undefined,false),"recognize");
  assert.equal(L.cardMode({r:1},false),"recognize");
  assert.equal(L.cardMode({r:2},false),"listen");
  const later=[3,4,5,6,7,8,9,10].map(r=>L.cardMode({r},false));
  assert.ok(later.filter(m=>m==="produce").length>=4);
  for(let r=0;r<10;r++) assert.notEqual(L.cardMode({r},true),"produce");
  assert.equal(L.cardMode({r:0},false,true),"build"); assert.equal(L.cardMode({r:4},false,true),"produce");
});
test("soundShift flags gulf pronunciations the phone voice will miss",()=>{
  assert.deepEqual([...L.soundShift("قهوة","gahwa")],["ق is said g"]);
  assert.deepEqual([...L.soundShift("باكر","bāchir")],["ك is said ch"]);
  assert.deepEqual([...L.soundShift("غالي","ghāli")],[]);
  assert.deepEqual([...L.soundShift("دجاج","diyāy")],["ج is said y"]);
});
test("planDay: oldest due first, capped, new lesson paused when backlog is big",()=>{
  const cards={a:{d:now-3},b:{d:now-1},c:{d:now+DAY},d:{d:now-2}};
  const p=L.planDay(cards,{d:1},now);
  assert.deepEqual([...p.reviews],["a","b"]); assert.equal(p.allowNew,true);
  const many={}; for(let i=0;i<50;i++) many["x"+i]={d:now-i};
  const q=L.planDay(many,{},now,{maxReviews:60,backlogLimit:40}); assert.equal(q.allowNew,false); assert.equal(q.reviews.length,50);
});
test("interleave avoids back-to-back cards from one unit",()=>{
  const ids=["u1.0","u1.1","u1.2","u2.0","u2.1","u3.0"]; const out=L.interleave(ids,id=>id.split(".")[0]);
  assert.equal(out.length,6); assert.deepEqual([...out].sort(),[...ids].sort());
  for(let i=1;i<out.length;i++) assert.notEqual(out[i].split(".")[0],out[i-1].split(".")[0]);
});
test("stageStatus needs every unit done and 80% of live items mature",()=>{
  const st={unitsDone:{u1:"x",u2:"x"},suspended:{"u2.1":1},cards:{"u1.0":{i:8},"u1.1":{i:9},"u2.0":{i:1}}};
  const s=L.stageStatus(["u1","u2"],["u1.0","u1.1","u2.0","u2.1"],st);
  assert.equal(s.items,3); assert.equal(s.mature,2); assert.equal(s.complete,false);
  st.cards["u2.0"].i=7; assert.equal(L.stageStatus(["u1","u2"],["u1.0","u1.1","u2.0","u2.1"],st).complete,true);
  assert.equal(L.stageStatus([],[],{unitsDone:{},cards:{}}).complete,false);
});
test("validateUnit accepts a good ai lesson and rejects bad shapes",()=>{
  const good={title:"Family",goal:"Talk about your family",tip:"Possessive endings attach to nouns.",
    dialogue:[{who:"A",ar:"عندك إخوان؟",tr:"ʿindak ikhwān?",en:"Do you have brothers?"},{who:"B",ar:"إي، ثنين",tr:"ī, thnēn",en:"Yes, two."},{who:"A",ar:"ما شاء الله",tr:"mā shāʼ allāh",en:"Lovely."}],
    items:[0,1,2,3].map(i=>({ar:"أخو"+i,tr:"akhu",en:"brother",msa:""}))};
  assert.deepEqual([...L.validateUnit(good)],[]);
  assert.ok(L.validateUnit(null).length);
  assert.ok(L.validateUnit({...good,items:good.items.slice(0,2)}).length);
  assert.ok(L.validateUnit({...good,dialogue:[...good.dialogue.slice(0,2),{who:"C",ar:"x",tr:"x",en:"x"}]}).length);
  assert.ok(L.validateUnit({...good,items:[...good.items.slice(0,3),{ar:"hello",tr:"x",en:"x"}]}).length);
});
test("data: 28 letters, six non-joiners",()=>{
  assert.equal(D.LETTERS.length,28);
  assert.equal(D.LETTERS.filter(x=>!x[5]).map(x=>x[0]).join(""),"ادذرزو");
});
test("data: every course unit is well formed with 7±2 phrases and no duplicate phrases",()=>{
  const seen=new Set(); const ids=new Set();
  for(const u of D.COURSE){
    assert.ok(!ids.has(u.id)); ids.add(u.id); assert.equal(u.stage,1);
    assert.ok(u.title&&u.goal&&u.tip,u.id);
    assert.ok(u.items.length>=5&&u.items.length<=9,`${u.id} has ${u.items.length} items`);
    assert.ok(u.dialogue.length>=3&&u.dialogue.length<=8,u.id);
    for(const l of u.dialogue){ assert.equal(l.length,4,u.id); assert.ok(["A","B"].includes(l[0])); assert.match(l[1],/[ء-ي]/); }
    for(const it of u.items){ assert.equal(it.length,5,`${u.id} ${it[0]}`); assert.match(it[0],/[ء-ي]/); assert.ok(it[1]&&it[2]);
      const k=L.normalizeArabic(it[0]); assert.ok(!seen.has(k),`duplicate phrase ${it[0]}`); seen.add(k); }
    // the converted unit passes the same check ai lessons must pass
    const conv={title:u.title,goal:u.goal,tip:u.tip,dialogue:u.dialogue.map(([who,ar,tr,en])=>({who,ar,tr,en})),items:u.items.map(([ar,tr,en,msa])=>({ar,tr,en,msa}))};
    assert.deepEqual([...L.validateUnit(conv)],[],u.id);
  }
});
test("data: syllabus covers stages 2-5 with ten topics each; pairs and fuṣḥā list are well formed",()=>{
  for(const n of [2,3,4,5]) assert.equal(D.SYLLABUS[n].topics.length,10);
  for(const p of D.PAIRS){ assert.equal(p.length,2); assert.notEqual(p[0][0],p[1][0]); }
  const seen=new Set(); for(const m of D.MSA){ assert.equal(m.length,3); assert.ok(!seen.has(m[0])); seen.add(m[0]); }
});

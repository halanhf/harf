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
vm.runInContext(block("data")+";this.D={LETTERS,VOWELS,SHIFTS,PAIRS,COURSE,SYLLABUS,MSA,GRAMMAR,NUMBERS};",ctx);
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
test("card modes follow how well a card is known, not how often it was seen",()=>{
  assert.equal(L.cardMode(undefined,false),"recognize");
  // a brand-new card failed twice is still learning: no jump to speaking on day one
  let c=L.schedule({},0,now); c=L.schedule(c,0,now+60000); c=L.schedule(c,0,now+120000);
  assert.equal(L.cardMode(c,false),"recognize");
  c=L.schedule(L.schedule({},2,now),2,now+600000); assert.equal(c.st,-1); assert.ok(c.i<3||L.cardMode(c,false)!=="recognize");
  assert.equal(L.cardMode({st:-1,i:2,r:3},false),"listen");
  const mature=[3,4,5,6,7,8,9,10].map(r=>L.cardMode({st:-1,i:12,r},false));
  assert.ok(mature.filter(m=>m==="produce").length>=4,`${mature}`);
  // a lapse sends it back to recognise
  const lapsed=L.schedule({s:20,k:5,d:now,t:now-20*DAY,r:8,l:0,st:-1,i:20},0,now); assert.equal(L.cardMode(lapsed,false),"recognize");
  for(let r=0;r<10;r++){ assert.notEqual(L.cardMode({st:-1,i:30,r},true),"produce"); assert.notEqual(L.cardMode({st:-1,i:30,r},true,false),"build"); }
  assert.equal(L.cardMode(undefined,false,true),"build"); assert.equal(L.cardMode({st:-1,i:3,r:6},false,true),"build");
  const ms=[0,1,2,3,4,5].map(r=>L.cardMode({st:-1,i:10,r},false,true)); assert.ok(ms.includes("produce")&&ms.includes("build"),`${ms}`);
});
test("soundShift flags gulf pronunciations the phone voice will miss",()=>{
  assert.deepEqual([...L.soundShift("قهوة","gahwa")],["ق is said g"]);
  assert.deepEqual([...L.soundShift("باكر","bāchir")],["ك is said ch"]);
  assert.deepEqual([...L.soundShift("غالي","ghāli")],[]);
  assert.deepEqual([...L.soundShift("دجاج","diyāy")],["ج is said y"]);
  assert.deepEqual([...L.soundShift("شاي","chāy")],["ش is said ch here"]);
  assert.deepEqual([...L.soundShift("شلونج؟","shlōnich?")],["ج here is said ch"]);
  assert.deepEqual([...L.soundShift("شلونك؟","shlōnak?")],[]);
});
test("planDay: oldest due first, capped, new lesson paused when backlog is big",()=>{
  const cards={a:{d:now-3},b:{d:now-1},c:{d:now+DAY},d:{d:now-2}};
  const p=L.planDay(cards,{d:1},now);
  assert.deepEqual([...p.reviews],["a","b"]); assert.equal(p.allowNew,true);
  const many={}; for(let i=0;i<50;i++) many["x"+i]={d:now-i};
  const q=L.planDay(many,{},now,{maxReviews:60,backlogLimit:40}); assert.equal(q.allowNew,false); assert.equal(q.reviews.length,50);
  // a restored card (negative marker) is back in the plan
  assert.deepEqual([...L.planDay(cards,{d:-5},now).reviews],["a","d","b"]);
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
  // three phrases is the floor a generated lesson can reach after known ones are removed; it must still load everywhere
  assert.deepEqual([...L.validateUnit({...good,items:good.items.slice(0,3)})],[]);
  assert.deepEqual([...L.validateUnit({...good,items:good.items.map(it=>({...it,note:"to a woman: x"}))})],[]);
  assert.ok(L.validateUnit({...good,items:good.items.map(it=>({...it,note:7}))}).length);
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
  for(const n of [2,3,4,5]){ const t=D.SYLLABUS[n].topics; assert.ok(t.length>=10,`stage ${n}`); assert.equal(new Set(t).size,t.length,`stage ${n} has duplicate topics`); }
  for(const p of D.PAIRS){ assert.equal(p.length,2); assert.notEqual(p[0][0],p[1][0]); }
  const seen=new Set(); for(const m of D.MSA){ assert.equal(m.length,3); assert.ok(!seen.has(m[0])); seen.add(m[0]); }
});
test("word match marks which target words speech recognition caught",()=>{
  const m=L.wordMatch("أبي قهوة لو سمحت","ابي قهوه لو"); assert.deepEqual([...m.words.map(w=>w.ok)],[true,true,true,false]); assert.ok(m.pct>=60&&m.pct<100);
  assert.equal(L.wordMatch("زين","زين").pct,100); assert.equal(L.wordMatch("زين","").words[0].ok,false);
});
test("streak: consecutive days grow it, freezes cover gaps, a time-zone change can't reset it",()=>{
  let s={streak:0,freezes:0,lastDay:""}; s=L.nextStreak(s,"2026-01-01"); assert.equal(s.streak,1);
  s=L.nextStreak(s,"2026-01-02"); assert.equal(s.streak,2); assert.equal(L.nextStreak(s,"2026-01-02").newDay,false);
  // flying west: the clock goes back a day; nothing resets
  const w=L.nextStreak(s,"2026-01-01"); assert.equal(w.streak,2); assert.equal(w.newDay,false);
  for(let d=3;d<=7;d++) s=L.nextStreak(s,`2026-01-0${d}`); assert.equal(s.streak,7); assert.equal(s.freezes,1);
  const gap=L.nextStreak(s,"2026-01-09"); assert.equal(gap.streak,8); assert.equal(gap.freezes,0);
  assert.equal(L.nextStreak(s,"2026-01-10").streak,1);
  assert.equal(L.visibleStreak(s,"2026-01-09"),7); assert.equal(L.visibleStreak(s,"2026-01-10"),0);
  assert.equal(L.nextStreak({streak:30,lastDay:"2026-02-28"},"2026-03-01").streak,31);
});
test("merge: a stale copy never overwrites newer work, from either side",()=>{
  const card=(t,r)=>[1,5,r,t+1440,0,t,-1,1];
  const phone={updatedAt:100,lastDay:"2026-03-02",streak:9,cards:{a:card(5000,4),b:card(1000,2)},unitsDone:{u1:"2026-03-01"},suspended:{x:50},custom:[{id:"c1",ar:"ا"}],log:{"2026-03-02":5},session:{day:"2026-03-02",done:{review:1}}};
  const pc={updatedAt:900,lastDay:"2026-03-01",streak:8,cards:{a:card(3000,3),b:card(2000,3),c:card(10,1)},unitsDone:{u2:"2026-03-01"},suspended:{x:-80},custom:[{id:"c2",ar:"ب"}],log:{"2026-03-02":2,"2026-03-01":7},session:{day:"2026-03-01",done:{learn:1}}};
  for(const m of [L.mergeProgress(phone,pc),L.mergeProgress(pc,phone)]){
    assert.equal(m.cards.a[5],5000); assert.equal(m.cards.b[5],2000); assert.ok(m.cards.c);
    assert.deepEqual(Object.keys(m.unitsDone).sort(),["u1","u2"]);
    assert.equal(m.suspended.x,-80); assert.equal(L.isHidden(m.suspended,"x"),false);
    assert.deepEqual([...m.custom.map(c=>c.id)].sort(),["c1","c2"]);
    assert.equal(m.log["2026-03-02"],5); assert.equal(m.log["2026-03-01"],7);
    assert.equal(m.lastDay,"2026-03-02"); assert.equal(m.streak,9); assert.equal(m.session.day,"2026-03-02");
    assert.equal(m.updatedAt,900);
  }
  // old 5-element cards still merge
  assert.ok(L.mergeProgress({cards:{a:[100,2,1,999999,0]}},{cards:{}}).cards.a);
});
test("merge: starting over wins over older progress on other devices, but keeps work done after it",()=>{
  const R=Date.UTC(2026,2,5); const rMin=Math.floor(R/60000);
  const reset={updatedAt:R,resetAt:R,resetDay:"2026-03-05",cards:{},unitsDone:{},lastDay:"",streak:0};
  const old={updatedAt:R+5,lastDay:"2026-03-04",streak:12,cards:{a:[1,5,3,rMin+999,0,rMin-100,-1,2],b:[1,5,1,rMin+999,0,rMin+50,-1,1]},unitsDone:{u1:"2026-03-01",u2:"2026-03-05"},custom:[{id:"c"+(R-1000).toString(36)+"abc"},{id:"c"+(R+1000).toString(36)+"abc"}]};
  const m=L.mergeProgress(old,reset);
  assert.deepEqual(Object.keys(m.cards),["b"]); assert.deepEqual(Object.keys(m.unitsDone),["u2"]); assert.equal(m.streak,0); assert.equal(m.custom.length,1);
  assert.equal(m.resetAt,R);
});
test("grade labels say when the card comes back",()=>{
  assert.equal(L.whenLabel(60000),"in 1 min"); assert.equal(L.whenLabel(10*60000),"in 10 min"); assert.equal(L.whenLabel(3*3600000),"in 3 h");
  assert.equal(L.whenLabel(DAY),"tomorrow"); assert.equal(L.whenLabel(9*DAY),"in 9 days"); assert.equal(L.whenLabel(90*DAY),"in 3 mo");
});
test("data: grammar tables and numbers are well formed; stage 1 keeps 7±2 phrases per lesson",()=>{
  for(const g of D.GRAMMAR){ assert.ok(g.title&&Array.isArray(g.rows)&&g.rows.length>=4,g.title); for(const r of g.rows){ assert.equal(r.length,3,g.title); assert.match(r[0],/[ء-ي]/); } }
  const seen=new Set(); for(const n of D.NUMBERS){ assert.equal(n.length,4); assert.match(n[1],/[ء-ي]/); assert.ok(!seen.has(n[3])); seen.add(n[3]); }
  assert.ok(D.COURSE.length>=14); assert.equal(D.COURSE[0].id,"u1");
  for(const p of D.VOWELS) assert.equal(p.length,6); for(const p of D.SHIFTS) assert.equal(p.length,7);
});
test("fsrs: stability has a floor, so a card failed many times keeps its history instead of restarting as new",()=>{
  let c=L.schedule(L.schedule({},2,now),2,now+600000); let t=c.d;
  c=L.schedule(c,0,t); for(let k=1;k<=20;k++){ t+=60000; c=L.schedule(c,0,t); }
  assert.ok(c.s>=L.S_MIN,`s ${c.s}`); assert.equal(c.l,1); assert.ok(c.r>20);
  const u=L.unpackCard(L.packCard(c)); assert.ok(u.s>0); const k0=u.k;
  const next=L.schedule(u,2,t+600000); assert.equal(next.st,-1); assert.ok(Math.abs(next.k-k0)<2,"difficulty kept");
  // a card saved with s 0 by the older code is repaired on load, not treated as brand new
  const old=L.unpackCard([0,6.4,25,Math.round(t/60000),3,Math.round(t/60000),0,0]); assert.ok(old.s>0); assert.equal(L.schedule(old,2,t).r,26);
});
test("fsrs: review intervals keep hard < good < easy, stay capped, and a bad retention setting can't make NaN",()=>{
  let c=L.schedule(L.schedule({},2,now),2,now+600000);
  for(const days of [1,3,30]){ const t=c.d+days*DAY; const iv=[1,2,3].map(g=>L.schedule(c,g,t).i); assert.ok(iv[0]<iv[1]&&iv[1]<iv[2],`${iv}`); c=L.schedule(c,2,t); }
  for(const r of ["x",5,-1,null,NaN]){ const x=L.schedule(c,2,c.d,r); assert.ok(Number.isFinite(x.d)&&Number.isFinite(x.i),String(r)); }
  const huge=L.schedule({s:1e7,k:1,d:now,t:now-1e7*DAY,r:9,l:0,st:-1,i:1e7},3,now); assert.ok(huge.i<=L.MAX_IVL);
});
test("planDay: cards held back by the daily cap stay out of a topped-up session",()=>{
  const many={}; for(let i=0;i<100;i++) many["x"+i]={d:now-100+i};
  const first=L.planDay(many,{},now); assert.equal(first.reviews.length,60);
  const held=new Set(L.planDay(many,{},now,{maxReviews:1e9}).reviews.filter(id=>!first.reviews.includes(id)));
  many.x0={d:now+60000}; // reviewed in the session, comes back in a minute
  const top=L.planDay(many,{},now+120000,{maxReviews:500,exclude:held}).reviews; assert.ok(top.includes("x0")); assert.ok(top.every(id=>!held.has(id)));
});
test("merge and cleanSaved: a damaged or hostile backup never replaces good progress",()=>{
  const good=[1,5,3,1000,0,900,-1,2];
  const local={updatedAt:5,cards:{a:good,b:good}};
  const bad={updatedAt:9e15,cards:{a:[1,5,3,"x",0,"zzz",-1,2],b:null,c:[1,2]},custom:{},unitsDone:"abc",resetAt:9e15,resetDay:"9999-12-31"};
  const clean=L.cleanSaved(bad,now,"2026-11-14");
  assert.deepEqual(Object.keys(clean.cards),[]); assert.equal(JSON.stringify(clean.unitsDone),"{}"); assert.equal(clean.resetAt,0); assert.equal(clean.resetDay,"");
  const skew=L.cleanSaved({resetAt:now+60000,resetDay:"2026-11-15"},now,"2026-11-14"); assert.equal(skew.resetAt,now); assert.equal(skew.resetDay,"2026-11-14");
  const m=L.mergeProgress(local,clean); assert.deepEqual([...m.cards.a],good); assert.deepEqual([...m.cards.b],good);
  // even unclean, merge itself never picks a broken card or throws on a non-array word list
  const m2=L.mergeProgress(local,{cards:bad.cards,custom:{}}); assert.deepEqual([...m2.cards.a],good); assert.deepEqual([...m2.cards.b],good); assert.equal(m2.cards.c,undefined);
  assert.equal(JSON.stringify(L.cleanSaved(null,now).cards),"{}"); assert.equal(L.cleanSaved([1,2],now).custom.length,0);
});
test("validGen accepts generated lessons only",()=>{
  const u={id:"gabc12",stage:2,title:"T",goal:"G",tip:"t",dialogue:[1,2,3].map(()=>({who:"A",ar:"هلا",tr:"hala",en:"hi"})),items:[1,2,3].map(i=>({ar:"زين"+i,tr:"zēn",en:"good"}))};
  assert.equal(L.validGen(u),true); assert.equal(L.validGen({...u,id:"u1"}),false); assert.equal(L.validGen({...u,stage:"x"}),false); assert.equal(L.validGen({...u,items:[]}),false);
});
test("streak: a clock that was days ahead and got corrected carries on instead of freezing the streak",()=>{
  const s=L.nextStreak({streak:5,freezes:1,lastDay:"2027-01-10"},"2026-11-14"); assert.equal(s.newDay,true); assert.equal(s.lastDay,"2026-11-14"); assert.equal(s.streak,5);
  assert.equal(L.nextStreak(s,"2026-11-15").streak,6);
});
test("built app: no third-party requests, and the csp allows exactly its own inline scripts",()=>{
  const crypto=require("node:crypto");
  const built=fs.readFileSync(path.join(__dirname,"..","docs","index.html"),"utf8");
  assert.ok(!/fonts\.g(oogleapis|static)/.test(built)); assert.ok(!/<(script|link)[^>]*(src|href)="https?:/.test(built));
  const csp=built.match(/Content-Security-Policy" content="([^"]+)"/)[1];
  const scripts=[...built.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  assert.ok(scripts.length>=4);
  for(const js of scripts) assert.ok(csp.includes(`'sha256-${crypto.createHash("sha256").update(js).digest("base64")}'`),"script hash missing from csp");
  assert.match(csp,/default-src 'self'/); assert.match(csp,/object-src 'none'/);
});
test("built app: an update precaches fresh files, not the previous version still in the http cache",()=>{
  const sw=fs.readFileSync(path.join(__dirname,"..","docs","sw.js"),"utf8");
  assert.match(sw,/addAll\(SHELL\.map\(u=>new Request\(u,\{cache:"reload"\}\)\)\)/);
  assert.match(sw,/const CACHE="harf-v[0-9a-f]{10}"/);
  // cloudflare pages redirects /index.html to /, and a redirected cached copy fails to open offline: only "./" is stored
  assert.ok(!/"\.\/index\.html"/.test(sw),"sw must not precache or store ./index.html");
  assert.match(sw,/const SHELL=\["\.\/",/); assert.match(sw,/c\.put\("\.\/",copy\)/); assert.match(sw,/catch\(\(\)=>caches\.match\("\.\/"\)\)/);
});
test("colours: every text/background token pair passes WCAG AA (4.5:1) in light and dark",()=>{
  const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const vars=src=>Object.fromEntries([...src.matchAll(/--([a-z-]+):(#[0-9a-f]{6})/g)].map(m=>[m[1],m[2]]));
  const light=vars(css.match(/:root\{([^}]*)\}/)[1]), dark={...light,...vars(css.match(/:root\[data-theme="dark"\]\{([^}]*)\}/)[1])};
  const lum=h=>{ const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4); return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]; };
  const ratio=(a,b)=>{ const x=lum(a), y=lum(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); };
  // [text, background]: body and muted text, links and chips, the primary button, the review badge, right/wrong feedback
  const pairs=[["ink","paper"],["ink","card"],["muted","paper"],["muted","card"],["muted","tile-soft"],["tile","card"],["tile","tile-soft"],
    ["saffron-ink","card"],["saffron-ink","paper"],["paper","tile"],["card","saffron-ink"],["good","card"],["bad","card"],["bad","paper"]];
  for(const [name,t] of [["light",light],["dark",dark]]) for(const [fg,bg] of pairs){ const r=ratio(t[fg],t[bg]); assert.ok(r>=4.5,`${name}: --${fg} on --${bg} is ${r.toFixed(2)}:1`); }
  assert.match(css,/\.badge\{[^}]*background:var\(--saffron-ink\);color:var\(--card\)/);
});
test("back gesture: a lesson closes on back, back (asking first) without leaving the app or adding history without a tap",()=>{
  // runs the page's history code against a fake browser history. chrome skips entries a page adds without a fresh tap,
  // so the next back would quit the app: every push must come from a tap
  const main=html.match(/<script>\r?\n\(function\(\)\{([\s\S]*?)<\/script>/)[1];
  const code=main.slice(main.indexOf("let skipPop"),main.indexOf("function show("));
  const entries=[{state:null}]; let at=0, tap=false; const pops=[], clicks=[], pushes=[];
  const history={get state(){ return entries[at].state; },get length(){ return entries.length; },
    pushState(s){ pushes.push(tap); entries.splice(at+1); entries.push({state:s}); at++; },replaceState(s){ entries[at].state=s; },
    go(n){ at+=n; tap=false; pops.forEach(f=>f()); }};
  const body={focus:false,classList:{contains:c=>c==="focus"&&body.focus}};
  let armed=false; const x={click(){ if(!armed){ armed=true; return; } closeLesson(); }};
  const env={history,document:{body,addEventListener:(t,f)=>{ if(t==="click") clicks.push(f); }},addEventListener:(t,f)=>{ if(t==="popstate") pops.push(f); },$:()=>x};
  vm.createContext(env); vm.runInContext(code+";this.api={pushBack,dropBack,setClose:f=>{closeFocus=f;}};",env);
  const closeLesson=()=>{ body.focus=false; armed=false; env.api.setClose(null); env.api.dropBack(); };
  const open=()=>{ tap=true; body.focus=true; env.api.setClose(closeLesson); env.api.pushBack(); };
  const back=()=>{ assert.ok(at>0,"back would leave the app"); history.go(-1); };
  open(); back(); assert.equal(body.focus,true); assert.equal(armed,true); // first back asks
  back(); assert.equal(body.focus,false); assert.equal(at,0);            // second back closes, still in the app
  open(); tap=true; clicks.forEach(f=>f({isTrusted:true})); closeLesson(); assert.equal(at,0); assert.equal(entries[at].state,null); // the x leaves nothing behind
  open(); back(); tap=true; clicks.forEach(f=>f({isTrusted:true})); armed=false; back(); assert.equal(body.focus,true); back(); assert.equal(body.focus,false);
  assert.ok(pushes.length>=4&&pushes.every(Boolean),"history added without a tap: "+pushes);
});
test("export on claude.ai never fakes a download: a page-started download is blocked there",()=>{
  assert.match(html,/try\{ if\(window\.claude\) throw 0; const a=el\("a"/);
  assert.match(html,/document\.addEventListener\("touchstart",\(\)=>\{\},\{passive:true\}\)/); // ios shows the pressed state only with a touch listener
});

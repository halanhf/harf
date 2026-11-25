// runs the page's pure helpers and data checks under node, no browser needed: node --test tests/logic.test.js
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const block=id=>{const m=html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)</script>`));assert.ok(m,`script ${id} missing`);return m[1];};
const ctx={module:{exports:{}},TextEncoder,TextDecoder,atob,btoa};
vm.createContext(ctx);
vm.runInContext(block("logic"),ctx);
vm.runInContext(block("data")+";this.D={LETTERS,VOWELS,SHIFTS,PAIRS,COURSE,STAGE_LEVELS,MSA,READINGS,GRAMMAR,NUMBERS};",ctx);
const L=ctx.module.exports, D=ctx.D;
const DAY=86400000, now=1e12;
// the page's own state, sync and boot code, run against fakes (no browser, no network)
const main=html.match(/<script>\r?\n\(function\(\)\{([\s\S]*?)<\/script>/)[1];
const cut=(a,b)=>{ const i=main.indexOf(a), j=b?main.indexOf(b,i):main.lastIndexOf("})();"); assert.ok(i>=0&&j>i,`section ${a} missing`); return main.slice(i,j); };
const tick=async(n=12)=>{ for(let i=0;i<n;i++) await new Promise(r=>setImmediate(r)); };
let EXPOSE="readRemote,writeRemote,pushRemote,serialize,save,flush,sync,setS:x=>{S=hydrate(x);},S:()=>S,stamps:()=>shardStamp,use:(db,uid)=>{DB=db;UID=uid;synced=true;}";
function loadUi(o={}){
  const store=o.store||new Map(Object.entries(o.saved||{})); const note={hidden:true,textContent:""}; const on={}, calls=[], timers=new Map(); let tid=0;
  const env={module:{exports:{}},TextEncoder,TextDecoder,atob,btoa,AbortController,
    setTimeout:(f,ms)=>{ timers.set(++tid,{f,ms}); return tid; },clearTimeout:id=>{ timers.delete(id); },
    $:s=>s==="#sync-note"?note:null,
    localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>{ store.set(k,String(v)); },removeItem:k=>{ store.delete(k); }},
    document:{visibilityState:"visible",addEventListener:(t,f)=>{ on[t]=f; }},addEventListener:(t,f)=>{ on[t]=f; },
    window:{claude:o.claude,HARF_PWA:o.pwa},navigator:{onLine:o.online!==false},fetch:o.fetch||(()=>{ throw new Error("unexpected fetch"); }),
    rebuild(){},refresh(){},busy:false,currentTab:"today",RENDER:{today(){ calls.push("render"); }},show(){ calls.push("show"); },
    feedMsa(){ calls.push("msa"); },feedSentences(){ calls.push("sentences"); },afterRemoteChange(){ calls.push("changed"); },firstMergeDone(){}};
  vm.createContext(env); vm.runInContext(block("logic"),env);
  vm.runInContext(cut("// ===== state =====","// ===== items index =====")+";this.T={"+EXPOSE+"};",env);
  if(o.boot) vm.runInContext(cut("// ===== boot ====="),env);
  const runTimers=()=>{ const all=[...timers.values()]; timers.clear(); all.forEach(x=>x.f()); };
  return Object.assign(env.T,{store,note,on,calls,timers,runTimers,env,fed:()=>calls.filter(c=>c==="msa"||c==="sentences")});
}
// a stand-in for the account store: doc(path).get()/set(), paths that can be made to fail, and a gate that holds reads back
function fakeDb(docs={}){ const db={m:new Map(Object.entries(docs)),fail:new Set(),reads:0,gate:null};
  db.hold=()=>{ let open; db.gate=new Promise(r=>{ open=r; }); return open; };
  db.doc=p=>({get:async()=>{ db.reads++; if(db.gate) await db.gate; if(db.fail.has(p)) throw Object.assign(new Error("x"),{code:"unavailable"}); return {exists:db.m.has(p),data:()=>db.m.get(p)}; },
    set:async v=>{ db.m.set(p,JSON.parse(JSON.stringify(v))); },collection:()=>({limit:()=>({get:async()=>({docs:[]})}),doc:()=>({set:async()=>{}})})});
  return db; }
const claudeWith=db=>({use:async n=>n==="db"?db:n==="user"?{id:async()=>"u1"}:null});
const P="data/users/u1/", pcard=(t,r)=>[1,5,r,t+1440,0,t,-1,1];

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
test("data: every course unit is well formed (5-9 phrases, 3-10 dialogue lines) with no duplicate phrases",()=>{
  const seen=new Set(); const ids=new Set();
  for(const u of D.COURSE){
    assert.ok(!ids.has(u.id)); ids.add(u.id); assert.ok(u.stage>=1&&u.stage<=5,u.id);
    assert.ok(u.title&&u.goal&&u.tip,u.id);
    assert.ok(u.items.length>=5&&u.items.length<=9,`${u.id} has ${u.items.length} items`);
    assert.ok(u.dialogue.length>=3&&u.dialogue.length<=10,u.id);
    for(const l of u.dialogue){ assert.equal(l.length,4,u.id); assert.ok(["A","B"].includes(l[0])); assert.match(l[1],/[ء-ي]/); }
    for(const it of u.items){ assert.equal(it.length,5,`${u.id} ${it[0]}`); assert.match(it[0],/[ء-ي]/); assert.ok(it[1]&&it[2]);
      const k=L.normalizeArabic(it[0]); assert.ok(!seen.has(k),`duplicate phrase ${it[0]}`); seen.add(k); }
    // the converted unit passes the same check ai lessons must pass
    const conv={title:u.title,goal:u.goal,tip:u.tip,dialogue:u.dialogue.map(([who,ar,tr,en])=>({who,ar,tr,en})),items:u.items.map(([ar,tr,en,msa])=>({ar,tr,en,msa}))};
    assert.deepEqual([...L.validateUnit(conv)],[],u.id);
  }
});
test("data: the course runs stage by stage in teaching order; pairs and fuṣḥā list are well formed",()=>{
  let last=1; const ids=new Set();
  for(const u of D.COURSE){ assert.ok(u.stage>=last,`${u.id} is out of stage order`); last=u.stage; assert.ok(!ids.has(u.id),`duplicate unit ${u.id}`); ids.add(u.id);
    assert.ok(/^(u\d+|s[1-5]u\d{3})$/.test(u.id),u.id); assert.ok(D.STAGE_LEVELS[u.stage],u.id); }
  for(const p of D.PAIRS){ assert.equal(p.length,2); assert.notEqual(p[0][0],p[1][0]); }
  const seen=new Set(); for(const m of D.MSA){ assert.ok(m.length>=3&&m.length<=5); const k=m[0].replace(/\u0640/g,"").trim(); assert.ok(!seen.has(k),`duplicate fuṣḥā word ${m[0]}`); seen.add(k); // vowelled: homographs are different words
    if(m[3]) assert.ok(/^(G=|G~ .+|M \S.+)$/.test(m[3]),`${m[0]} gulf column: ${m[3]}`); if(m[4]) assert.ok(["function","signs","forms","services","news","religion","general"].includes(m[4]),`${m[0]} domain ${m[4]}`); }
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
  const old={updatedAt:R+5,lastDay:"2026-03-04",streak:12,cards:{a:[1,5,3,rMin+999,0,rMin-100,-1,2],b:[1,5,1,rMin+999,0,rMin+50,-1,1]},unitsDone:{u1:"2026-03-01",u2:"2026-03-06"},custom:[{id:"c"+(R-1000).toString(36)+"abc"},{id:"c"+(R+1000).toString(36)+"abc"}]};
  const m=L.mergeProgress(old,reset);
  assert.deepEqual(Object.keys(m.cards),["b"]); assert.deepEqual(Object.keys(m.unitsDone),["u2"]); assert.equal(m.streak,0); assert.equal(m.custom.length,1);
  assert.equal(m.resetAt,R);
});
test("grade labels say when the card comes back",()=>{
  assert.equal(L.whenLabel(60000),"in 1 min"); assert.equal(L.whenLabel(10*60000),"in 10 min"); assert.equal(L.whenLabel(3*3600000),"in 3 h");
  assert.equal(L.whenLabel(DAY),"tomorrow"); assert.equal(L.whenLabel(9*DAY),"in 9 days"); assert.equal(L.whenLabel(90*DAY),"in 3 mo");
  // review grades are labelled in whole days: the evening before the clocks go forward, "tomorrow" is only 23 h away
  assert.match(html,/whenLabel\(nx\.st<0\?nx\.i\*DAY:nx\.d-now\)/);
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
test("review days: a card due tomorrow is in all of tomorrow's session (from 4am), across dst, a time-zone change and a clock going back",()=>{
  const tz=process.env.TZ;
  try{
    process.env.TZ="Europe/London";
    const at=(y,m,d,h)=>new Date(y,m-1,d,h).getTime();
    // graded "tomorrow" at 8pm: due in tomorrow's 7am session, not only from 8pm
    let c=L.schedule(L.schedule({},2,at(2026,11,10,19)),2,at(2026,11,10,20)); c=Object.assign({},c,{i:1,d:at(2026,11,10,20)+DAY});
    assert.ok(L.dueAt(c)<=at(2026,11,11,7),"due by 7am the next day");
    assert.ok(L.dueAt(c)>at(2026,11,11,3),"not before that day starts at 4am");
    assert.equal(L.planDay({a:c},{},at(2026,11,11,7)).reviews.length,1);
    assert.equal(L.planDay({a:c},{},at(2026,11,11,2)).reviews.length,0);
    // minute learning steps stay exact
    const step=L.schedule({},2,at(2026,11,10,20)); assert.equal(L.dueAt(step),step.d);
    // the uk clocks go forward on 29 march 2026: a card graded the evening before is due that morning
    const dst={s:3,k:5,r:3,l:0,st:-1,i:1,t:at(2026,3,28,21),d:at(2026,3,28,21)+DAY};
    assert.equal(L.planDay({a:dst},{},at(2026,3,29,6)).reviews.length,1);
    assert.equal(L.learnDay(at(2026,3,29,6))-L.learnDay(dst.t),1);
    // reviewed next morning, it counts as a day later (not a same-day review), so it grows like any other review
    const next=L.schedule(dst,2,at(2026,3,29,7)); assert.ok(next.i>=2,`next interval ${next.i}`);
    // the clock went back (or a flight west): no negative days, no NaN
    const back=L.schedule(dst,2,dst.t-3*3600000); assert.ok(Number.isFinite(back.d)&&back.i>=1);
    // a long absence (two years): finite, and the interval keeps growing
    const away=L.schedule({s:30,k:5,r:9,l:0,st:-1,i:30,t:at(2024,11,10,9),d:at(2024,12,10,9)},2,at(2026,11,10,9)); assert.ok(Number.isFinite(away.s)&&away.i>30&&away.i<=L.MAX_IVL,`${away.i}`);
    // graded just after 4am the day before the clocks go back (or the hour before 4am ahead of them going forward):
    // the interval still lands that many review days later, not one early (due again the same day) or one late
    for(const t of [at(2026,10,24,4)+30*60000,at(2026,3,28,3)+30*60000]) for(const g of [1,2,3]){
      const x=L.schedule({s:5,k:5,r:3,l:0,st:-1,i:1,t:t-DAY,d:t},g,t);
      assert.equal(L.learnDay(L.dueAt(x))-L.learnDay(t),x.i,`${new Date(t)} grade ${g}`); }
    const one=L.schedule({s:5,k:5,r:3,l:0,st:-1,i:1,t:at(2026,10,23,4)+1800000,d:at(2026,10,24,4)+1800000},0+1,at(2026,10,24,4)+1800000);
    assert.equal(L.planDay({a:one},{},at(2026,10,24,5)).reviews.length,0,"not due again the same morning");
    // saved due times from before review days: a card comes due at the start of its own review day, never later (so none
    // vanish) and never more than that day early (so a big deck doesn't all come due at once)
    for(let k=0;k<2000;k++){ const t=at(2025,1,1,0)+k*4567891, i=1+k%40, old={s:3,k:5,r:3,l:0,st:-1,i,t,d:t+i*DAY};
      const due=L.dueAt(old); assert.ok(due<=old.d&&old.d-due<DAY+3600001&&L.learnDay(due)===L.learnDay(old.d),`${new Date(old.d)}`); }
    // flying from london to dubai after grading: still due the next local day
    process.env.TZ="Asia/Dubai"; assert.equal(L.planDay({a:c},{},at(2026,11,11,9)).reviews.length,1);
  }finally{ if(tz===undefined) delete process.env.TZ; else process.env.TZ=tz; }
});
test("cleanSaved: junk day fields can't win every merge or stop the streak",()=>{
  const o=L.cleanSaved({lastDay:"zzz",msaDay:7,freezeUsed:"2026-01-02",session:{day:"x",done:{review:1}}},now,"2026-11-14");
  assert.equal(o.lastDay,""); assert.equal(o.msaDay,""); assert.equal(o.freezeUsed,"2026-01-02"); assert.equal(o.session.day,"");
  assert.equal(L.mergeProgress({lastDay:"2026-11-14",streak:5},o).streak,5);
  const ok=L.cleanSaved({lastDay:"2026-11-14",session:{day:"2026-11-14",done:{review:1}}},now,"2026-11-14"); assert.equal(ok.lastDay,"2026-11-14"); assert.equal(ok.session.done.review,1);
});
test("back gesture: reopened mid-lesson (reload, or the phone closed the app in the background), back isn't dead twice",()=>{
  const main=html.match(/<script>\r?\n\(function\(\)\{([\s\S]*?)<\/script>/)[1];
  const code=main.slice(main.indexOf("let skipPop"),main.indexOf("function show("));
  const run=framed=>{
    const entries=[{state:null},{state:{harf:1}},{state:{harf:2}}]; let at=2;
    const history={get state(){ return entries[at].state; },get length(){ return entries.length; },pushState(){},replaceState(s){ entries[at].state=s; },go(n){ at+=n; }};
    const win={}; win.top=framed?{}:win;
    const env={history,window:win,document:{body:{classList:{contains:()=>false}},addEventListener(){}},addEventListener(){},$:()=>null};
    vm.createContext(env); vm.runInContext(code,env); return {at,state:entries[at].state};
  };
  assert.deepEqual(run(false),{at:0,state:null}); // the installed app steps back over its old lesson entries
  const f=run(true); assert.equal(f.at,2); assert.equal(f.state,null); // inside claude.ai it leaves history alone (the page around may have added some)
});
test("service worker: the page opens from the saved copy offline, on a stalled connection, and updates it when online",async()=>{
  const sw=fs.readFileSync(path.join(__dirname,"..","docs","sw.js"),"utf8");
  const store=new Map(); const cache={put:async(k,v)=>{ store.set(String(k),v); },match:async k=>store.get(String(k)),addAll:async()=>{}};
  const handlers={}; let net=()=>new Promise(()=>{});
  const env={self:{addEventListener:(t,f)=>{ handlers[t]=f; },skipWaiting(){},clients:{claim(){}}},location:{origin:"https://h.test",href:"https://h.test/sw.js"},URL,Request:function(u){ this.url=u; },
    Response:{error:()=>({error:true})},setTimeout:f=>{ f(); return 0; },fetch:()=>net(),
    caches:{open:async()=>cache,match:async k=>store.get(String(k)),keys:async()=>[],delete:async()=>true}};
  vm.createContext(env); vm.runInContext(sw,env);
  const open=async()=>{ let p; const waits=[]; handlers.fetch({request:{method:"GET",mode:"navigate",url:"https://h.test/"},respondWith:x=>{ p=x; },waitUntil:x=>waits.push(x)}); const r=await p; return r; };
  store.set("./",{ok:true,body:"saved"});
  assert.equal((await open()).body,"saved","stalled connection: the saved copy after the timeout");
  net=()=>Promise.reject(new TypeError("offline")); assert.equal((await open()).body,"saved","offline: the saved copy");
  const fresh={ok:true,body:"new",clone(){ return {ok:true,body:"new"}; }}; net=()=>Promise.resolve(fresh);
  env.setTimeout=()=>0; // online and quick: the network answer wins and is saved for next time
  assert.equal((await open()).body,"new"); await new Promise(r=>setImmediate(r)); assert.equal(store.get("./").body,"new");
  // slow but working: the saved copy opens after the timeout, the download finishes anyway, and the next open has the update
  store.set("./",{ok:true,body:"saved"}); let arrive; net=()=>new Promise(ok=>{ arrive=()=>ok({ok:true,body:"v2",clone(){ return {ok:true,body:"v2"}; }}); });
  env.setTimeout=f=>{ f(); return 0; }; assert.equal((await open()).body,"saved"); arrive(); await new Promise(r=>setImmediate(r)); assert.equal(store.get("./").body,"v2");
  // another file opened in the app's scope (a font licence, a folder listing) never replaces the saved page
  const lic={ok:true,body:"licence",clone(){ return this; }}; net=()=>Promise.resolve(lic); let p2;
  handlers.fetch({request:{method:"GET",mode:"navigate",url:"https://h.test/fonts/"},respondWith:x=>{ p2=x; },waitUntil(){}}); await p2; await new Promise(r=>setImmediate(r));
  assert.equal(store.get("./").body,"v2");
  store.clear(); net=()=>Promise.reject(new TypeError("offline")); assert.equal((await open()).error,true,"nothing saved yet and offline: a network error, not a hang");
});
test("import after start over: the preview counts the backup cards the reset will drop, so a restore is never a silent no-op",()=>{
  const R=Date.UTC(2026,10,14); const rMin=Math.floor(R/60000);
  const here={resetAt:R,resetDay:"2026-11-14",cards:{}};
  const backup=L.cleanSaved({cards:{a:[3,5,3,rMin+999,0,rMin-3000,-1,3],b:[3,5,3,rMin+999,0,rMin+5,-1,3]}},R+DAY,"2026-11-15");
  const merged=L.mergeProgress(here,backup); const gone=Object.keys(backup.cards).filter(k=>!merged.cards[k]);
  assert.deepEqual(gone,["a"]);
  assert.match(html,/gone=Object\.keys\(state\.cards\)\.filter\(k=>!merged\.cards\[k\]\)/); assert.match(html,/won't`\} come back\. Start over can't be undone with a backup/);
});
test("account copy is split by card group, and joining gives the same progress back",()=>{
  assert.equal(L.shardOf("u12.3"),"s1"); assert.equal(L.shardOf("u3.s2"),"s1"); assert.equal(L.shardOf("s3u041.2"),"s3"); assert.equal(L.shardOf("s5u120.s4"),"s5");
  assert.equal(L.shardOf("m.40"),"msa"); assert.equal(L.shardOf("cabc123"),"own"); assert.equal(L.shardOf("gk2j.1"),"gen"); assert.equal(L.shardOf("weird"),"other");
  const card=(t,r)=>[1,5,r,t+1440,0,t,-1,1];
  const full={updatedAt:5,streak:3,cards:{"u1.0":card(10,1),"s2u001.0":card(20,1),"m.1":card(30,1),"cxyz":card(40,1)}};
  const {meta,shards}=L.splitProgress(full); assert.equal(meta.cards,undefined); assert.equal(meta.streak,3);
  assert.deepEqual(Object.keys(shards.s1),["u1.0"]); assert.deepEqual(Object.keys(shards.s2),["s2u001.0"]); assert.deepEqual(Object.keys(shards.own),["cxyz"]);
  assert.deepEqual(JSON.parse(JSON.stringify(L.joinProgress(meta,shards))),full);
  // a legacy main document that still holds cards: the newer review wins whichever document it came from
  const joined=L.joinProgress({cards:{"u1.0":card(10,1)}},{s1:{"u1.0":card(99,2)}}); assert.equal(joined.cards["u1.0"][5],99);
  const joined2=L.joinProgress({cards:{"u1.0":card(99,2)}},{s1:{"u1.0":card(10,1)}}); assert.equal(joined2.cards["u1.0"][5],99);
});
test("data: readings are well formed and their answers are among the options",()=>{
  const ids=new Set();
  for(const r of D.READINGS){ assert.ok(/^r[1-5]-\d{2}$/.test(r.id)&&!ids.has(r.id),r.id); ids.add(r.id);
    assert.ok(r.level>=1&&r.level<=5&&r.stage>=1&&r.stage<=5&&r.title,r.id);
    assert.ok(Array.isArray(r.lines)&&r.lines.length>=2); for(const l of r.lines){ assert.equal(l.length,2,r.id); assert.match(l[0],/[ء-ي]/); assert.ok(l[1]); }
    assert.ok(Array.isArray(r.questions)&&r.questions.length>=1); for(const [q,o,a] of r.questions){ assert.ok(q&&o.length>=2&&o.includes(a),`${r.id}: ${q}`); } }
});
test("merge: readings done on either device are kept",()=>{
  const m=L.mergeProgress({read:{r001:"2026-03-01"},updatedAt:1},{read:{r002:"2026-03-02",r001:"2026-03-05"},updatedAt:2});
  assert.deepEqual({...m.read},{r001:"2026-03-05",r002:"2026-03-02"});
});
test("page: every inline script parses (a syntax error anywhere blanks the whole app)",()=>{
  for(const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) assert.doesNotThrow(()=>new vm.Script(m[1]),m[0].slice(0,40));
});

test("account read: a card group that fails to load leaves nothing marked as read, so the next save can't overwrite it",async()=>{
  const db=fakeDb({[P+"progress"]:{updatedAt:5,shards:{s1:"a1",s2:"b1"}},[P+"cards_s1"]:{cards:{"u1.0":pcard(100,3)}},[P+"cards_s2"]:{cards:{"s2u001.0":pcard(200,3)}}});
  const t=loadUi(); t.use(db,"u1");
  db.fail.add(P+"cards_s2"); await assert.rejects(t.readRemote()); assert.deepEqual({...t.stamps()},{});
  await t.pushRemote(); assert.equal(t.sync.state,"error"); assert.ok(db.m.get(P+"cards_s1").cards["u1.0"],"not rewritten while unread");
  db.fail.clear(); await t.pushRemote();
  assert.ok(db.m.get(P+"cards_s1").cards["u1.0"]); assert.ok(t.S().cards["u1.0"]&&t.S().cards["s2u001.0"]);
  assert.deepEqual({...t.stamps()},{...db.m.get(P+"progress").shards});
});
test("merge: start over wins over everything older on a device that hadn't heard of it, the same day included",()=>{
  const R=Date.UTC(2026,2,5,12), rMin=Math.floor(R/60000), RD="2026-03-05";
  const fresh={updatedAt:R,resetAt:R,resetDay:RD,cards:{},unitsDone:{},lastDay:"",streak:0};
  // the other device studied that morning, before the reset, and hasn't seen it yet
  const stale={updatedAt:R+5,lastDay:RD,streak:12,freezes:1,reviewsToday:40,newToday:1,talks:9,msaDay:RD,
    cards:{a:[1,5,3,rMin+999,0,rMin-100,-1,2]},unitsDone:{sounds:"2026-03-01",u1:RD},log:{[RD]:40,"2026-03-04":10},
    rp:{u1:RD},read:{"r1-01":RD},seen:{letters:1},session:{day:RD,done:{review:1}}};
  for(const m of [L.mergeProgress(stale,fresh),L.mergeProgress(fresh,stale)]){
    for(const f of ["cards","unitsDone","log","rp","read","seen"]) assert.equal(JSON.stringify(m[f]),"{}",f);
    for(const f of ["streak","freezes","reviewsToday","newToday","talks"]) assert.equal(m[f]||0,0,f);
    assert.equal(m.lastDay,""); assert.equal(m.msaDay,""); assert.equal(m.session.day,""); assert.equal(m.resetAt,R); assert.equal(m.resetDay,RD);
  }
  // the device that started over then studies the same day: its own work stays
  const after=Object.assign({},fresh,{updatedAt:R+60000,lastDay:RD,streak:1,reviewsToday:3,unitsDone:{sounds:RD},log:{[RD]:3},read:{"r1-02":RD},seen:{vowels:1},talks:1,session:{day:RD,done:{learn:1}}});
  for(const m of [L.mergeProgress(after,stale),L.mergeProgress(stale,after)]){
    assert.equal(m.streak,1); assert.equal(m.reviewsToday,3); assert.equal(m.log[RD],3); assert.equal(m.talks,1);
    assert.deepEqual(Object.keys(m.unitsDone),["sounds"]); assert.deepEqual(Object.keys(m.read),["r1-02"]); assert.deepEqual(Object.keys(m.seen),["vowels"]); assert.deepEqual({...m.session.done},{learn:1});
  }
  // work done on the other device on later days still counts, but its streak can't reach back past the reset
  const later=Object.assign({},stale,{lastDay:"2026-03-07",streak:14,unitsDone:{u1:RD,u2:"2026-03-06"},cards:{b:[1,5,1,rMin+9999,0,rMin+2000,-1,1]}});
  const k=L.mergeProgress(fresh,later); assert.deepEqual(Object.keys(k.cards),["b"]); assert.deepEqual(Object.keys(k.unitsDone),["u2"]); assert.equal(k.streak,2); assert.equal(k.lastDay,"2026-03-07");
  // two copies that both carry the reset keep everything either has
  const p=Object.assign({},after,{unitsDone:{u3:RD}}); assert.deepEqual(Object.keys(L.mergeProgress(after,p).unitsDone).sort(),["sounds","u3"]);
});
test("start over: the account push replaces instead of merging, and the button asks for that",async()=>{
  const db=fakeDb({[P+"progress"]:{updatedAt:5,lastDay:"2026-03-01",streak:4,shards:{s1:"a1"}},[P+"cards_s1"]:{cards:{"u1.0":pcard(100,3)}}});
  const t=loadUi(); t.use(db,"u1"); await t.pushRemote(); assert.ok(t.S().cards["u1.0"]);
  const R=Date.now(); t.setS({resetAt:R,resetDay:"2026-03-05",updatedAt:R}); const before=db.reads;
  await t.pushRemote({replace:true});
  assert.equal(db.reads,before,"a replace push reads nothing"); assert.deepEqual(db.m.get(P+"cards_s1"),{cards:{}}); assert.equal(db.m.get(P+"progress").resetAt,R); assert.equal(db.m.get(P+"progress").streak,0);
  assert.match(html,/S\.resetAt=Date\.now\(\); S\.resetDay=today\(\); save\(\); flush\(\{replace:true\}\)/);
});
test("daily cards are added only after the first merge has been tried",async()=>{
  // account configured: nothing is added until the first read has come back
  const db=fakeDb(); const open=db.hold(); const t=loadUi({boot:true,claude:claudeWith(db)});
  await tick(); assert.deepEqual(t.fed(),[]); open(); await tick(); assert.deepEqual(t.fed(),["msa","sentences"]);
  // the first read fails: still added, once
  const db2=fakeDb(); db2.fail.add(P+"progress"); const t2=loadUi({boot:true,claude:claudeWith(db2)}); await tick(); assert.deepEqual(t2.fed(),["msa","sentences"]);
  // no remote at all, or no connection: added at once, before the first screen
  const t3=loadUi({boot:true}); assert.deepEqual(t3.fed(),["msa","sentences"]); assert.ok(t3.calls.indexOf("sentences")<t3.calls.indexOf("show"));
  const db4=fakeDb(); db4.hold(); const t4=loadUi({boot:true,online:false,claude:claudeWith(db4)}); assert.deepEqual(t4.fed(),["msa","sentences"]);
  assert.match(html,/function afterRemoteChange\(\)\{ rebuild\(\); feed\(\);/);
});
test("github sync: what each answer from the api means",()=>{
  const k=L.ghKind;
  assert.equal(k("read",200),"ok"); assert.equal(k("write",201),"ok"); assert.equal(k("read",404),"missing"); assert.equal(k("write",404),"repo");
  for(const op of ["read","write","user"]) for(const s of [401,403]) assert.equal(k(op,s),"auth");
  assert.equal(k("user",404),"auth"); assert.equal(k("write",409),"conflict"); assert.equal(k("write",422),"conflict"); assert.equal(k("read",409),"server");
  for(const s of [429,500,502,503,301,418]) assert.equal(k("read",s),"server");
  assert.equal(k("write",0),"offline"); assert.equal(k("read",undefined),"offline");
});
test("github sync: the status line, and how a finished cycle changes it",()=>{
  const t=1e12, line=L.ghLine;
  assert.equal(line(false,{last:t},t),"Not set up");
  assert.equal(line(true,{last:t-59000},t),"Synced just now"); assert.equal(line(true,{last:t-60000},t),"Synced 1 min ago"); assert.equal(line(true,{last:t-125000},t),"Synced 2 min ago");
  assert.equal(line(true,{last:t+5000},t),"Synced just now"); // the clock went back
  assert.equal(line(true,{last:t,waiting:true},t),"Offline, will sync later"); assert.equal(line(true,{last:0},t),"Offline, will sync later"); assert.equal(line(true,null,t),"Offline, will sync later");
  const why={auth:"the token was refused",repo:"the progress repo was not found",server:"GitHub is not responding",conflict:"another device was saving at the same time",bad:"the saved progress could not be read"};
  assert.deepEqual({...L.GH_WHY},why);
  for(const [k,v] of Object.entries(why)) assert.equal(line(true,{last:t,waiting:true,problem:k},t),"Sync problem: "+v);
  assert.equal(line(true,{problem:"zzz"},t),"Sync problem: GitHub is not responding");
  const after=L.ghAfter;
  assert.deepEqual({...after({last:5,waiting:true,problem:"server"},"ok",t)},{last:t,waiting:false,problem:""});
  assert.deepEqual({...after({last:5,waiting:false,problem:"server"},"offline",t)},{last:5,waiting:true,problem:""});
  assert.deepEqual({...after({last:5,waiting:true,problem:""},"auth",t)},{last:5,waiting:true,problem:"auth"});
  assert.deepEqual({...after(null,"server",t)},{last:0,waiting:false,problem:"server"});
});
test("github sync: when a cycle may run, and the one-a-minute limit on saves",()=>{
  const s={on:true,online:true,halted:false,dirty:true}, go=L.ghAllow;
  for(const tr of ["open","online","show","hide","save","timer","manual"]) assert.equal(go(tr,s),"go",tr);
  for(const tr of ["open","save","manual"]) assert.equal(go(tr,{...s,on:false}),"no");
  assert.equal(go("save",{...s,online:false}),"offline"); assert.equal(go("open",{...s,online:false}),"offline"); assert.equal(go("manual",{...s,online:false}),"go");
  assert.equal(go("online",{...s,halted:true}),"no"); assert.equal(go("save",{...s,halted:true}),"no"); assert.equal(go("manual",{...s,halted:true}),"go");
  assert.equal(go("hide",{...s,dirty:false}),"no"); assert.equal(go("hide",{...s,dirty:false,online:false}),"no"); assert.equal(go("show",{...s,dirty:false}),"go");
  const t=1e12; assert.equal(L.ghWait(0,t),0); assert.equal(L.ghWait(t-10000,t),50000); assert.equal(L.ghWait(t-60000,t),0); assert.equal(L.ghWait(t-3600000,t),0);
  assert.equal(L.ghWait(t+5000,t),60000); // the clock went back: never more than a minute
});
test("github sync: what to fetch and what to send",()=>{
  assert.equal(L.canon({b:1,a:{d:[2,{z:1,y:2}],c:null}}),'{"a":{"c":null,"d":[2,{"y":2,"z":1}]},"b":1}');
  assert.equal(L.GH_META,"progress.json"); assert.equal(L.ghFile("s1"),"cards_s1.json");
  const sha={"cards_s1.json":"x1","cards_s2.json":"y1"};
  assert.deepEqual([...L.ghNeed({s1:"x1",s2:"y2",msa:"m1"},sha,new Set())],["s2","msa"]);
  assert.deepEqual([...L.ghNeed({s1:"x1"},sha,new Set(["cards_s1.json","cards_own.json"]))],["s1","own"]); assert.deepEqual([...L.ghNeed({},{},null)],[]);
  const c=[1,5,3,1000,0,900,-1,2], mem={sha,body:{"cards_s1.json":L.canon({cards:{"u1.0":c,"u1.1":c}}),"cards_s2.json":L.canon({cards:{"s2u001.0":c}})}};
  // s1: the same cards in another order, not sent. s2: emptied by "start over", sent. msa: new, sent. own: empty and never stored, not sent
  const ch=L.ghChanged({s1:{"u1.1":c,"u1.0":c},s2:{},msa:{"m.0":c},own:{}},mem);
  assert.deepEqual([...ch.map(f=>f.path)],["cards_s2.json","cards_msa.json"]); assert.equal(ch[0].text,'{"cards":{}}'); assert.equal(ch[1].text,L.canon({cards:{"m.0":c}}));
  const big=JSON.stringify({x:"قهوة ☕ "+"ab".repeat(200000)}); assert.equal(L.b64dec(L.b64enc(big)),big);
  assert.equal(L.b64dec(Buffer.from("هلا").toString("base64").replace(/(.{2})/g,"$1\n")),"هلا"); // github wraps its base64 in newlines
});

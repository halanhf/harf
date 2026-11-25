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
const cut=(a,b,m=main)=>{ const i=m.indexOf(a), j=b?m.indexOf(b,i):m.lastIndexOf("})();"); assert.ok(i>=0&&j>i,`section ${a} missing`); return m.slice(i,j); };
// the built page's inline scripts, in document order; the app script is the one with no id that holds the state section
const builtScripts=()=>[...fs.readFileSync(path.join(__dirname,"..","docs","index.html"),"utf8").matchAll(/<script(?: id="[^"]*")?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const tick=async(n=12)=>{ for(let i=0;i<n;i++) await new Promise(r=>setImmediate(r)); };
let EXPOSE="readRemote,writeRemote,pushRemote,serialize,save,flush,sync,setS:x=>{S=hydrate(x);},S:()=>S,stamps:()=>shardStamp,use:(db,uid)=>{DB=db;UID=uid;synced=true;}";
// a minimal element tree for the panel: attributes set with setAttribute are kept apart from properties, like the real dom
const findId=(n,id)=>!n?null:n.id===id?n:(n.children||[]).map(c=>findId(c,id)).find(Boolean)||null;
function fakeEl(tag){ const e={tag,attrs:{},children:[],setAttribute(k,v){ e.attrs[k]=String(v); },append(...k){ e.children.push(...k); }}; Object.defineProperty(e,"textContent",{get:()=>e._t||"",set:v=>{ e._t=String(v); e.children=[]; }}); return e; }
function loadUi(o={}){
  const store=o.store||new Map(Object.entries(o.saved||{})); const note={hidden:true,textContent:""}; const on={}, calls=[], timers=new Map(); let tid=0;
  const env={module:{exports:{}},TextEncoder,TextDecoder,atob,btoa,AbortController,
    setTimeout:(f,ms)=>{ timers.set(++tid,{f,ms}); return tid; },clearTimeout:id=>{ timers.delete(id); },
    $:s=>s==="#sync-note"?note:findId(env.rootEl,s.slice(1)),
    localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>{ store.set(k,String(v)); },removeItem:k=>{ store.delete(k); }},
    document:{createElement:fakeEl,visibilityState:"visible",addEventListener:(t,f)=>{ on[t]=f; }},addEventListener:(t,f)=>{ on[t]=f; },
    window:{claude:o.claude,HARF_PWA:o.built?undefined:o.pwa},navigator:{onLine:o.online!==false},fetch:o.fetch||(()=>{ throw new Error("unexpected fetch"); }),
    rebuild(){},refresh(){},busy:false,currentTab:"today",RENDER:{today(){ calls.push("render"); }},show(){ calls.push("show"); },
    feedMsa(){ calls.push("msa"); if(o.feed) o.feed(env.T); },feedSentences(){ calls.push("sentences"); },afterRemoteChange(){ calls.push("changed"); },firstMergeDone(){}};
  vm.createContext(env); let m=main;
  if(o.built){ const sc=builtScripts(), mi=sc.findIndex(x=>x.includes("// ===== state =====")); assert.ok(mi>0); sc.slice(0,mi).forEach(x=>vm.runInContext(x,env)); m=sc[mi].match(/\(function\(\)\{([\s\S]*)/)[1]; }
  else vm.runInContext(block("logic"),env);
  vm.runInContext(cut("// ===== state =====","// ===== items index =====",m)+";this.T={"+EXPOSE+"};",env);
  if(o.dom){ vm.runInContext(cut("const ap=","const arSpan=",main),env); env.rootEl=fakeEl("div"); env.renderMe=()=>{ calls.push("renderMe"); }; }
  if(o.boot) vm.runInContext(cut("// ===== boot =====",undefined,m),env);
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
    // stages 1-2 rows may carry a vowelled form as their last element; later stages never do
    for(const l of u.dialogue){ assert.ok(u.stage<=2?(l.length===4||l.length===5):l.length===4,u.id); assert.ok(["A","B"].includes(l[0])); assert.match(l[1],/[ء-ي]/);
      if(l.length===5) assert.ok(typeof l[4]==="string"&&l[4].trim(),u.id); }
    for(const it of u.items){ assert.ok(u.stage<=2?(it.length===5||it.length===6):it.length===5,`${u.id} ${it[0]}`); assert.match(it[0],/[ء-ي]/); assert.ok(it[1]&&it[2]);
      if(it.length===6) assert.ok(typeof it[5]==="string"&&it[5].trim(),`${u.id} ${it[0]}`);
      const k=L.normalizeArabic(it[0]); assert.ok(!seen.has(k),`duplicate phrase ${it[0]}`); seen.add(k); }
    // the converted unit passes the same check ai lessons must pass
    const conv={title:u.title,goal:u.goal,tip:u.tip,dialogue:u.dialogue.map(([who,ar,tr,en])=>({who,ar,tr,en})),items:u.items.map(([ar,tr,en,msa])=>({ar,tr,en,msa}))};
    assert.deepEqual([...L.validateUnit(conv)],[],u.id);
  }
});
test("data: stage 1-2 vowelled forms strip back to the Arabic and tile one-to-one with it",()=>{
  for(const u of D.COURSE){
    const rows=[...u.dialogue.map(l=>[l[1],l[4]]),...u.items.map(it=>[it[0],it[5]])];
    for(const [ar,v] of rows){
      if(v===undefined) continue;
      assert.equal(L.normalizeArabic(v),L.normalizeArabic(ar),`${u.id} ${ar}`);
      const ta=L.tilesOf(ar), tv=L.tilesOf(v);
      assert.equal(tv.length,ta.length,`${u.id} ${ar}`);
      tv.forEach((t,i)=>assert.equal(L.normalizeArabic(t),L.normalizeArabic(ta[i]),`${u.id} ${ar}`));
    }
  }
});
test("harakat: auto follows the learner's current stage, always and never override it",()=>{
  for(const s of [0,1,2]) assert.equal(L.showHarakat("auto",s),true);
  for(const s of [3,6]) assert.equal(L.showHarakat("auto",s),false);
  assert.equal(L.showHarakat("always",4),true);
  assert.equal(L.showHarakat("never",1),false);
  assert.equal(L.showHarakat("junk",1),true);
});
test("harakat: the vowelled form is shown only when marks are on, and only if the row has one",()=>{
  assert.equal(L.shownAr({ar:"ريّال",arv:"رَيَّالْ"},true),"رَيَّالْ");
  assert.equal(L.shownAr({ar:"ريّال",arv:"رَيَّالْ"},false),"ريّال");
  assert.equal(L.shownAr({ar:"زين"},true),"زين");
  assert.equal(L.shownAr({ar:"زين",arv:""},true),"زين");
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
  const skew=L.cleanSaved({resetAt:now+60000,resetDay:"2026-11-15"},now,"2026-11-14"); assert.equal(skew.resetAt,now+60000); assert.equal(skew.resetCut,now); assert.equal(skew.resetDay,"2026-11-14");
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
  assert.equal(csp.replace(/ 'sha256-[^']+'/g,""),"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; connect-src 'self' https://api.github.com; object-src 'none'; base-uri 'none'; form-action 'none'");
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
  for(const s of [429,500,502,503,418]) assert.equal(k("read",s),"server");
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

// a stand-in for the github contents api: files with shas, the answers the app must handle, and a log of every request
const TOKEN="github_pat_TESTTOKEN123";
function fakeHub(files={}){
  let n=0; const h={files:new Map(),log:[],status:{},down:false,login:"someone",before:null};
  h.set=(p,o)=>h.files.set(p,{text:typeof o==="string"?o:JSON.stringify(o),sha:"sha"+(++n)}); for(const [p,o] of Object.entries(files)) h.set(p,o);
  h.json=p=>JSON.parse(h.files.get(p).text); const names=m=>h.log.filter(r=>r.method===m).map(r=>r.url.split("/").pop()); h.puts=()=>names("PUT"); h.gets=()=>names("GET");
  const res=(status,body)=>({status,ok:status<300,json:async()=>body,headers:{get:n=>(h.hdr||{})[String(n).toLowerCase()]??null}});
  h.fetch=async(url,o={})=>{ const method=o.method||"GET"; h.log.push({url,method,headers:o.headers||{},cache:o.cache,redirect:o.redirect,keepalive:!!o.keepalive,body:o.body||""});
    if(h.down||(h.noKeepalive&&o.keepalive)) throw new TypeError("Failed to fetch "+TOKEN);
    const p=url.replace("https://api.github.com","");
    if(h.before) await h.before(method,p);
    const forced=h.status[method+" "+p.split("/").pop()]||h.status[method]||h.status["*"]; if(forced) return res(forced,{message:"no"});
    if(p==="/user") return res(200,{login:h.login});
    const m=/^\/repos\/([^/]+)\/harf-progress\/contents\/(.+)$/.exec(p); if(!m||m[1]!==h.login) return res(404,{message:"Not Found"});
    const f=h.files.get(m[2]);
    if(method==="GET") return f?res(200,{sha:f.sha,size:f.text.length,encoding:"base64",content:Buffer.from(f.text).toString("base64").replace(/(.{60})/g,"$1\n")}):res(404,{message:"Not Found"});
    const b=JSON.parse(o.body); if(f&&!b.sha) return res(422,{message:"sha wasn't supplied"}); if(f&&b.sha!==f.sha) return res(409,{message:"does not match"});
    h.set(m[2],Buffer.from(b.content,"base64").toString()); return res(f?200:201,{content:{sha:h.files.get(m[2]).sha}}); };
  return h;
}
const GNOW=Date.UTC(2026,10,25,12), GDAY="2026-11-25", GT=Math.floor(GNOW/60000)-5000;
const prog=o=>{ const p=L.cleanSaved(Object.assign({updatedAt:GNOW-1000,streak:1,lastDay:"2026-11-24",settings:{translit:"auto"}},o),GNOW,GDAY); return L.mergeProgress(p,p); };
// one device: its progress, what it remembers of the store, and a sync that applies the result the way the page will
const dev=(hub,p)=>{ const d={mem:{sha:{},body:{}},local:p,api:L.ghApi({owner:"someone",repo:"harf-progress",token:TOKEN},hub.fetch)};
  d.sync=async opts=>{ const r=await L.ghCycle(d.api,d.local,d.mem,Object.assign({now:GNOW,today:GDAY},opts)); if(r.merged){ d.local=L.mergeProgress(d.local,r.merged); d.mem=r.mem; } return r; }; return d; };

test("github cycle: the first sync writes card files then progress.json; a second with nothing new writes nothing",async()=>{
  const hub=fakeHub(); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3),"s2u001.0":pcard(GT+1,3)},custom:[{id:"cabc123xyz",ar:"قهوة",tr:"gahwa",en:"coffee"}]}));
  const r=await a.sync(); assert.equal(r.kind,"ok"); assert.deepEqual(hub.puts(),["cards_s1.json","cards_s2.json","progress.json"]);
  assert.deepEqual(Object.keys(hub.json("cards_s1.json")),["cards"]); assert.deepEqual(Object.keys(hub.json("cards_s1.json").cards),["u1.0"]);
  const meta=hub.json("progress.json"); assert.equal(meta.cards,undefined); assert.equal(meta.custom[0].ar,"قهوة");
  assert.deepEqual(meta.shards,{s1:hub.files.get("cards_s1.json").sha,s2:hub.files.get("cards_s2.json").sha});
  hub.log.length=0; const r2=await a.sync(); assert.equal(r2.kind,"ok"); assert.deepEqual(hub.puts(),[]); assert.deepEqual(hub.gets(),["progress.json"]);
  // every request: github only, the token in the header only, never cached
  for(const q of hub.log){ assert.ok(q.url.startsWith("https://api.github.com/")); assert.equal(q.headers.Authorization,"Bearer "+TOKEN); assert.ok(!q.url.includes(TOKEN)&&!q.body.includes(TOKEN)); assert.equal(q.cache,"no-store"); }
});
test("github cycle: two devices converge and then stop writing",async()=>{
  const hub=fakeHub(); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3),"u1.1":pcard(GT,1)}})), b=dev(hub,prog({updatedAt:GNOW-500,cards:{"u1.1":pcard(GT+50,2),"s3u001.0":pcard(GT,1)}}));
  await a.sync(); await b.sync(); await a.sync();
  assert.equal(a.local.cards["u1.1"][5],GT+50); assert.ok(a.local.cards["s3u001.0"]); assert.ok(b.local.cards["u1.0"]);
  hub.log.length=0; await b.sync(); await a.sync(); assert.deepEqual(hub.puts(),[]);
  // a fresh page load on b (nothing remembered) reads everything once and still writes nothing
  b.mem={sha:{},body:{}}; hub.log.length=0; await b.sync(); assert.deepEqual(hub.puts(),[]); assert.deepEqual(hub.gets().sort(),["cards_s1.json","cards_s3.json","progress.json"]);
});
test("github cycle: a refused write is re-read, merged and retried",async()=>{
  const hub=fakeHub(); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3)}})); await a.sync();
  a.local=L.mergeProgress(a.local,prog({updatedAt:GNOW,cards:{"u1.1":pcard(GT+9,1)}}));
  // another device saves between this one's read and its write
  let once=true; hub.before=async(method,p)=>{ if(once&&method==="PUT"&&p.endsWith("cards_s1.json")){ once=false; const d=hub.json("cards_s1.json"); d.cards["u1.2"]=pcard(GT+7,1); hub.set("cards_s1.json",d); } };
  const r=await a.sync(); assert.equal(r.kind,"ok"); assert.deepEqual(Object.keys(hub.json("cards_s1.json").cards).sort(),["u1.0","u1.1","u1.2"]); assert.ok(a.local.cards["u1.2"]);
});
test("github cycle: refused three times, it gives up and keeps local work",async()=>{
  const hub=fakeHub(); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3)}})); hub.status.PUT=409;
  const r=await a.sync(); assert.equal(r.kind,"conflict"); assert.equal(hub.puts().length,3); assert.ok(a.local.cards["u1.0"]);
});
test("github cycle: a card file that fails to load means nothing is noted as read, and the next sync still merges it",async()=>{
  const hub=fakeHub(); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3),"s2u001.0":pcard(GT,3)}})); await a.sync();
  const b=dev(hub,prog({updatedAt:GNOW-9000,cards:{"u1.5":pcard(GT,1)}}));
  hub.status["GET cards_s2.json"]=500; const r=await b.sync(); assert.equal(r.kind,"server"); assert.equal(r.merged,null); assert.deepEqual(b.mem,{sha:{},body:{}}); assert.equal(hub.puts().length,3);
  delete hub.status["GET cards_s2.json"]; const r2=await b.sync(); assert.equal(r2.kind,"ok"); assert.deepEqual(Object.keys(hub.json("cards_s1.json").cards).sort(),["u1.0","u1.5"]); assert.ok(b.local.cards["s2u001.0"]);
});
test("github cycle: refused token, no connection, unreadable file: nothing is written and nothing leaks",async()=>{
  const hub=fakeHub({"progress.json":"{not json"}); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3)}}));
  assert.equal((await a.sync()).kind,"bad"); assert.equal(hub.files.get("progress.json").text,"{not json"); hub.files.clear();
  const cfg={owner:"someone",repo:"harf-progress",token:TOKEN};
  const big=L.ghApi(cfg,async()=>({status:200,json:async()=>({sha:"x",size:2000000,encoding:"none",content:""})})); assert.equal((await big.get("progress.json")).kind,"bad");
  const page=L.ghApi(cfg,async()=>({status:200,json:async()=>{ throw new SyntaxError("<html>"); }})); assert.equal((await page.get("progress.json")).kind,"server"); assert.equal((await page.user()).kind,"server");
  hub.status["*"]=401; assert.equal((await a.sync()).kind,"auth"); hub.status["*"]=403; assert.equal((await a.sync()).kind,"auth"); hub.status={};
  hub.down=true; const r=await a.sync(); assert.equal(r.kind,"offline"); assert.ok(!JSON.stringify(r).includes(TOKEN)); assert.deepEqual(hub.puts(),[]); assert.ok(a.local.cards["u1.0"]);
});
test("github cycle: start over: the push replaces, and wins even from a page that has read nothing yet",async()=>{
  const hub=fakeHub(); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3),"s2u001.0":pcard(GT,3)},unitsDone:{u1:"2026-11-20"}})); await a.sync();
  const blank=prog({updatedAt:GNOW,resetAt:GNOW,resetDay:GDAY,streak:0,lastDay:""});
  a.local=blank; hub.log.length=0; const r=await a.sync({replace:true}); assert.equal(r.kind,"ok"); assert.deepEqual(hub.gets(),[]);
  assert.deepEqual(hub.json("cards_s1.json"),{cards:{}}); assert.deepEqual(hub.json("cards_s2.json"),{cards:{}}); assert.equal(hub.json("progress.json").resetAt,GNOW); assert.deepEqual(hub.json("progress.json").unitsDone,{});
  // again, from a page that never read the store (reset pressed offline, sent later)
  const hub2=fakeHub(); const c=dev(hub2,prog({cards:{"u1.0":pcard(GT,3)},unitsDone:{u1:"2026-11-20"}})); await c.sync();
  const d=dev(hub2,blank); const r2=await d.sync({replace:true}); assert.equal(r2.kind,"ok"); assert.deepEqual(hub2.json("cards_s1.json"),{cards:{}}); assert.equal(hub2.json("progress.json").resetAt,GNOW); assert.deepEqual(Object.keys(d.local.cards),[]);
  // and the device that hadn't heard of it drops its old work on its next sync
  await c.sync(); assert.deepEqual(Object.keys(c.local.cards),[]); assert.deepEqual(Object.keys(c.local.unitsDone),[]);
});
test("github cycle: a card file that exists but isn't listed is merged, never overwritten",async()=>{
  const hub=fakeHub({"cards_s1.json":{cards:{"u1.7":pcard(GT,2)}}}); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3)}}));
  const r=await a.sync(); assert.equal(r.kind,"ok"); assert.deepEqual(Object.keys(hub.json("cards_s1.json").cards).sort(),["u1.0","u1.7"]);
});
test("github client: keepalive only for bodies a browser will accept",async()=>{
  const hub=fakeHub(); const api=L.ghApi({owner:"someone",repo:"harf-progress",token:TOKEN},hub.fetch);
  await api.put("progress.json","{}",undefined,true); await api.put("cards_s1.json",JSON.stringify({x:"a".repeat(70000)}),undefined,true);
  assert.deepEqual(hub.log.map(q=>q.keepalive),[true,false]);
});
test("github cycle: a file of unknown shape is never replaced",async()=>{
  for(const [files,why] of [[{"progress.json":{updatedAt:1,shards:{s1:"zzz"}},"cards_s1.json":{cards:"x"}},"cards string"],[{"progress.json":{updatedAt:1,shards:{s1:"zzz"}},"cards_s1.json":{cards:[]}},"cards array"],[{"progress.json":{updatedAt:1,shards:"x"}},"shards string"],[{"progress.json":{updatedAt:1,shards:[]}},"shards array"]]){
    const hub=fakeHub(files); const before=[...hub.files].map(([p,f])=>p+f.text+f.sha).join("|"); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3)}}));
    const r=await a.sync(); assert.equal(r.kind,"bad",why); assert.deepEqual(hub.puts(),[],why); assert.equal(r.merged,null,why); assert.equal([...hub.files].map(([p,f])=>p+f.text+f.sha).join("|"),before,why); }
});
test("github cycle: a write refused part-way keeps what was written and finishes the rest next time",async()=>{
  const hub=fakeHub(); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3),"s2u001.0":pcard(GT,3)}}));
  const localBefore=JSON.stringify(a.local); hub.status["PUT cards_s2.json"]=500;
  const r=await L.ghCycle(a.api,a.local,a.mem,{now:GNOW,today:GDAY}); assert.equal(r.kind,"server"); assert.equal(JSON.stringify(a.local),localBefore);
  assert.equal(hub.puts().filter(n=>n==="cards_s1.json").length,1); assert.deepEqual([...r.wrote],["cards_s1.json"]);
  assert.equal(r.mem.sha["cards_s1.json"],hub.files.get("cards_s1.json").sha); assert.equal(r.mem.sha["cards_s2.json"],undefined);
  a.local=r.merged; a.mem=r.mem; delete hub.status["PUT cards_s2.json"]; hub.log.length=0;
  const r2=await a.sync(); assert.equal(r2.kind,"ok"); assert.deepEqual(hub.puts(),["cards_s2.json","progress.json"]);
});
test("github client: results never carry the token, and fetch never follows a redirect",async()=>{
  const hub=fakeHub(); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3)}}));
  for(const st of [401,500,409]){ hub.status["*"]=st; const r=await a.sync(); assert.ok(!JSON.stringify(r).includes(TOKEN)); assert.ok(["auth","server","conflict"].includes(r.kind)); } hub.status={};
  hub.files.clear(); hub.set("progress.json","{not json"); const r=await a.sync(); assert.equal(r.kind,"bad"); assert.ok(!JSON.stringify(r).includes(TOKEN));
  for(const q of hub.log) assert.equal(q.redirect,"manual");
  assert.ok(hub.log.length>0);
});

// ===== the offline app syncs through github =====
EXPOSE+=",ghSync,ghForget,ghSave,savedMsg,gh:()=>GH";
EXPOSE+=",ghConnect,ghPanel,startOver";
const KEY="harf-gulf-v1", CFG=JSON.stringify({owner:"someone",repo:"harf-progress",token:TOKEN});
// a store that already holds another device's progress
function hubWith(p){ const hub=fakeHub(); const {meta,shards}=L.splitProgress(p); const st={};
  for(const n of L.SHARDS) if(Object.keys(shards[n]).length){ hub.set("cards_"+n+".json",{cards:shards[n]}); st[n]=hub.files.get("cards_"+n+".json").sha; }
  hub.set("progress.json",Object.assign({},meta,{shards:st})); return hub; }
// progress as another device running this app would have saved it (every field present)
const saved=o=>{ const d=loadUi(); d.setS(L.cleanSaved(o,now,"2026-11-14")); return d.serialize(); };
const study=(t,id="u1.9")=>{ const p=t.serialize(); p.cards[id]=pcard(Math.floor(Date.now()/60000),2); t.setS(p); t.save(); };

test("offline app: on open the remote copy is merged before daily cards are added, and a second sync sends nothing",async()=>{
  const hub=hubWith(saved({updatedAt:5,lastDay:"2026-03-01",streak:4,cards:{"u1.0":pcard(100,3),"m.0":pcard(200,5)}}));
  const t=loadUi({boot:true,pwa:true,fetch:hub.fetch,saved:{[KEY+"-gh"]:CFG}});
  assert.ok(t.calls.includes("show"),"the first screen never waits for the network"); assert.deepEqual(t.fed(),[]);
  await tick(); assert.ok(t.S().cards["u1.0"]&&t.S().cards["m.0"]); assert.equal(t.S().streak,4); assert.deepEqual(t.fed(),["msa","sentences"]);
  assert.equal(t.savedMsg(),"Synced just now"); assert.equal(JSON.parse(t.store.get(KEY+"-ghs")).waiting,false);
  hub.log.length=0; await t.ghSync("manual"); assert.deepEqual(hub.puts(),[]); assert.deepEqual(hub.gets(),["progress.json"]);
});
test("offline app: saves while studying share one timer; going to the background sends at once, with keepalive",async()=>{
  const hub=fakeHub(); const t=loadUi({boot:true,pwa:true,fetch:hub.fetch,saved:{[KEY+"-gh"]:CFG}}); await tick(); hub.log.length=0;
  study(t); t.save(); t.save();
  const pend=[...t.timers.values()]; assert.equal(pend.length,1); assert.ok(pend[0].ms>55000&&pend[0].ms<=60000,`waits ${pend[0].ms} ms`); assert.equal(hub.log.length,0);
  t.env.document.visibilityState="hidden"; t.on.visibilitychange(); await tick();
  assert.ok(hub.puts().includes("cards_s1.json")); assert.ok(hub.log.every(q=>q.keepalive)); assert.equal(t.timers.size,0);
  hub.log.length=0; t.on.pagehide(); await tick(); assert.equal(hub.log.length,0,"nothing new, nothing sent");
  // the timer path: one cycle when it fires
  t.env.document.visibilityState="visible"; study(t,"u1.8"); assert.equal(t.timers.size,1); t.runTimers(); await tick(); assert.deepEqual(hub.puts(),["cards_s1.json","progress.json"]);
});
test("offline app: no connection is not an error, and the waiting state survives a reload",async()=>{
  const hub=fakeHub(); const store=new Map([[KEY+"-gh",CFG]]); let n=0;
  const t=loadUi({boot:true,pwa:true,online:false,store,fetch:()=>{ n++; return Promise.reject(new Error("x")); }});
  assert.deepEqual(t.fed(),["msa","sentences"]); assert.equal(n,0); assert.equal(t.savedMsg(),"Offline, will sync later"); assert.equal(t.note.hidden,true);
  assert.equal(JSON.parse(store.get(KEY+"-ghs")).waiting,true);
  assert.equal(loadUi({pwa:true,online:false,store}).savedMsg(),"Offline, will sync later");
  // a request that fails while the browser says it's online is the same state
  hub.down=true; const t3=loadUi({boot:true,pwa:true,store,fetch:hub.fetch}); await tick(); assert.equal(t3.savedMsg(),"Offline, will sync later"); assert.equal(t3.note.hidden,true); assert.deepEqual(t3.fed(),["msa","sentences"]);
  hub.down=false; t3.on.online(); await tick(); assert.equal(t3.savedMsg(),"Synced just now"); assert.ok(hub.files.has("progress.json"));
});
test("offline app: a refused token stops automatic sync, keeps progress, says so, and the token is never shown or saved elsewhere",async()=>{
  const hub=fakeHub(); const store=new Map([[KEY+"-gh",CFG]]); const t=loadUi({boot:true,pwa:true,fetch:hub.fetch,store}); await tick();
  study(t); hub.status["*"]=401; await t.ghSync("manual");
  assert.equal(t.savedMsg(),"Sync problem: the token was refused"); assert.equal(t.note.hidden,false); assert.equal(t.note.textContent,"Sync problem: the token was refused. Open Progress, Sync and paste a new token.");
  assert.ok(t.S().cards["u1.9"]); assert.ok(JSON.parse(store.get(KEY)).cards["u1.9"]);
  hub.log.length=0; t.save(); t.runTimers(); t.on.online(); t.on.visibilitychange(); await tick(); assert.equal(hub.log.length,0,"no automatic retries");
  for(const text of [t.note.textContent,store.get(KEY),store.get(KEY+"-ghs"),JSON.stringify(t.serialize())]) assert.ok(!text.includes(TOKEN));
  hub.status={}; await t.ghSync("manual"); assert.equal(t.savedMsg(),"Synced just now"); assert.equal(t.note.hidden,true); assert.ok(hub.json("cards_s1.json").cards["u1.9"]);
  for(const f of hub.files.values()) assert.ok(!f.text.includes(TOKEN));
});
test("claude.ai build: never talks to github, even with a stored token",async()=>{
  const db=fakeDb(); let n=0; const t=loadUi({boot:true,claude:claudeWith(db),saved:{[KEY+"-gh"]:CFG},fetch:()=>{ n++; return Promise.reject(new Error("x")); }}); await tick();
  assert.equal(t.gh(),null); t.save(); t.runTimers(); t.on.online(); t.on.visibilitychange(); t.on.pagehide(); await tick();
  assert.equal(n,0); assert.ok(db.m.has(P+"progress")); assert.equal(t.savedMsg(),"Saved to your account");
});
test("offline app: a connection that never answers is given up on, so nothing waits on it for good",async()=>{
  let aborted=0; const hang=(u,o)=>new Promise((_,rej)=>o.signal.addEventListener("abort",()=>{ aborted++; rej(new Error("aborted")); }));
  const t=loadUi({boot:true,pwa:true,fetch:hang,saved:{[KEY+"-gh"]:CFG}}); await tick(); assert.ok(t.calls.includes("show")); assert.deepEqual(t.fed(),[]);
  assert.deepEqual([...t.timers.values()].map(x=>x.ms),[30000]); t.runTimers(); await tick();
  assert.equal(aborted,1); assert.deepEqual(t.fed(),["msa","sentences"]); assert.equal(t.savedMsg(),"Offline, will sync later");
});
test("offline app: disconnecting in another tab stops this one",async()=>{
  const hub=fakeHub(); const store=new Map([[KEY+"-gh",CFG]]); const t=loadUi({boot:true,pwa:true,fetch:hub.fetch,store}); await tick();
  store.delete(KEY+"-gh"); store.delete(KEY+"-ghs"); t.on.storage({key:KEY+"-gh",newValue:null}); assert.equal(t.gh(),null); assert.equal(t.savedMsg(),"This browser only");
  hub.log.length=0; study(t); t.runTimers(); t.on.online(); await tick(); assert.equal(hub.log.length,0);
});
test("offline app: saving the connection trims the token, and refuses one that would make every request throw",()=>{
  const store=new Map(); const t=loadUi({pwa:true,store});
  assert.deepEqual({...t.ghSave({owner:"someone",repo:"harf-progress",token:"  "+TOKEN+"\n"})},{ok:true}); assert.deepEqual(JSON.parse(store.get(KEY+"-gh")),{owner:"someone",repo:"harf-progress",token:TOKEN}); assert.equal(t.gh().token,TOKEN);
  t.ghForget(); assert.ok(!store.has(KEY+"-gh"));
  for(const bad of ["","   ","git hub_pat","tok\nen","tok\ten","tokén","tok\u0000en","تو كن","tok​en"]){
    assert.deepEqual({...t.ghSave({owner:"someone",repo:"harf-progress",token:bad})},{ok:false,kind:"auth",why:"the token was refused"},JSON.stringify(bad)); assert.ok(!store.has(KEY+"-gh"),"nothing stored"); assert.equal(t.gh(),null); }
});

// ===== fix round 1 =====
test("built app: the installed-app flag is set before the app script reads it, so a stored connection is picked up on load",async()=>{
  const sc=builtScripts(), flag=sc.findIndex(x=>/window\.HARF_PWA\s*=\s*true/.test(x)), app=sc.findIndex(x=>x.includes("// ===== state ====="));
  assert.ok(flag>=0&&flag<app,`flag script ${flag}, app script ${app}`);
  const hub=fakeHub(); const t=loadUi({built:true,boot:true,fetch:hub.fetch,saved:{[KEY+"-gh"]:CFG}});
  assert.ok(t.gh(),"the saved connection is loaded"); await tick(); assert.ok(hub.log.length>0,"the open sync made its first request");
});
test("offline app: a server that sends headers and then stalls the body is given up on too",async()=>{
  let n=0; const stall=async()=>{ n++; return {status:200,ok:true,json:()=>new Promise(()=>{})}; };
  const t=loadUi({boot:true,pwa:true,fetch:stall,saved:{[KEY+"-gh"]:CFG}}); await tick(); assert.deepEqual(t.fed(),[]);
  assert.deepEqual([...t.timers.values()].map(x=>x.ms),[30000],"the timeout is still running while the body is read"); t.runTimers(); await tick();
  assert.deepEqual(t.fed(),["msa","sentences"]); assert.equal(t.savedMsg(),"Offline, will sync later");
  const before=n, again=t.ghSync("manual"); await tick(); assert.equal(n,before+1,"a later trigger starts a new cycle"); t.runTimers(); assert.equal(await again,"offline");
});
function heldCycle(t,first){ const calls=[]; const orig=t.env.ghCycle; let go; t.env.ghCycle=(api,l,m,o)=>{ calls.push(o); return calls.length===1?new Promise(r=>{ go=()=>r(first||orig(api,l,m,o)); }):orig(api,l,m,o); }; return {calls,release:()=>go()}; }
test("offline app: a start-over queued behind a running cycle is not lost to a later automatic trigger",async()=>{
  const hub=fakeHub(); const t=loadUi({pwa:true,fetch:hub.fetch,saved:{[KEY+"-gh"]:CFG}}); const h=heldCycle(t);
  const p=t.ghSync("open"); t.ghSync("manual",{replace:true}); t.ghSync("online"); t.ghSync("show"); h.release(); await p; await tick();
  assert.equal(h.calls.length,2); assert.equal(h.calls[1].replace,true);
});
test("offline app: a refused token during a cycle stops what was queued behind it, unless it was queued by hand",async()=>{
  const hub=fakeHub(); const t=loadUi({pwa:true,fetch:hub.fetch,saved:{[KEY+"-gh"]:CFG}}); const h=heldCycle(t,{kind:"auth",merged:null,mem:{sha:{},body:{}}});
  const p=t.ghSync("open"); t.ghSync("online"); t.ghSync("show"); h.release(); await p; await tick();
  assert.equal(h.calls.length,1); assert.equal(hub.log.length,0); assert.equal(t.savedMsg(),"Sync problem: the token was refused");
  const t2=loadUi({pwa:true,fetch:hub.fetch,saved:{[KEY+"-gh"]:CFG}}); const h2=heldCycle(t2,{kind:"auth",merged:null,mem:{sha:{},body:{}}});
  const p2=t2.ghSync("open"); t2.ghSync("online"); t2.ghSync("manual"); h2.release(); await p2; await tick(); assert.equal(h2.calls.length,2);
});
test("offline app: saving the connection refuses an empty owner or repo",()=>{
  const store=new Map(); const t=loadUi({pwa:true,store});
  for(const c of [{owner:"",repo:"harf-progress"},{owner:"  ",repo:"harf-progress"},{owner:"someone",repo:""},{owner:"someone",repo:" \n"},{owner:"someone"},{repo:"harf-progress"}]){
    assert.deepEqual({...t.ghSave(Object.assign({token:TOKEN},c))},{ok:false,kind:"repo",why:"the progress repo was not found"},JSON.stringify(c)); assert.ok(!store.has(KEY+"-gh")); assert.equal(t.gh(),null); }
  assert.deepEqual({...t.ghSave({owner:" someone ",repo:" harf-progress ",token:TOKEN})},{ok:true}); assert.deepEqual(JSON.parse(store.get(KEY+"-gh")),{owner:"someone",repo:"harf-progress",token:TOKEN});
});

test("connect: the owner comes from /user, the token is kept only under its own key, and a bad token or repo is not kept",async()=>{
  const hub=fakeHub(); hub.login="a-learner"; const store=new Map(); const t=loadUi({boot:true,pwa:true,fetch:hub.fetch,store}); await tick();
  assert.equal(t.savedMsg(),"This browser only");
  assert.equal(await t.ghConnect("  "+TOKEN+"\n",""),"ok");
  assert.deepEqual(JSON.parse(store.get(KEY+"-gh")),{owner:"a-learner",repo:"harf-progress",token:TOKEN}); assert.ok(hub.files.has("progress.json")); assert.equal(t.savedMsg(),"Synced just now");
  for(const [k,v] of store) if(k!==KEY+"-gh") assert.ok(!v.includes(TOKEN),k);
  for(const f of hub.files.values()) assert.ok(!f.text.includes(TOKEN));
  for(const q of hub.log){ assert.ok(q.url.startsWith("https://api.github.com/")); assert.ok(!q.url.includes(TOKEN)&&!q.body.includes(TOKEN)); }
  t.ghForget(); assert.ok(!store.has(KEY+"-gh")&&!store.has(KEY+"-ghs")); assert.equal(t.gh(),null);
  hub.log.length=0; assert.equal(await t.ghConnect("","harf-progress"),"auth"); assert.equal(await t.ghConnect(TOKEN,"a-learner/harf-progress"),"repo"); assert.equal(await t.ghConnect("tok\u00e9n","harf-progress"),"auth"); assert.equal(hub.log.length,0);
  hub.status["GET user"]=401; assert.equal(await t.ghConnect(TOKEN,"harf-progress"),"auth"); assert.ok(!store.has(KEY+"-gh")); hub.status={};
  // the repo isn't there, or the token can't reach it: found out on the first write, and not kept
  assert.equal(await t.ghConnect(TOKEN,"other-repo"),"repo"); assert.ok(!store.has(KEY+"-gh")); assert.equal(t.note.hidden,true);
  t.env.navigator.onLine=false; assert.equal(await t.ghConnect(TOKEN,"harf-progress"),"offline"); assert.ok(!store.has(KEY+"-gh"));
  // not the offline app: nothing happens
  const c=loadUi({boot:true,claude:claudeWith(fakeDb()),fetch:hub.fetch}); await tick(); hub.log.length=0; assert.equal(await c.ghConnect(TOKEN,"harf-progress"),"no"); assert.equal(hub.log.length,0);
});
test("connect: a browser that won't store the token is told so, and nothing is kept",async()=>{
  const hub=fakeHub(); const t=loadUi({boot:true,pwa:true,fetch:hub.fetch}); await tick();
  t.env.localStorage.setItem=()=>{ throw new Error("full"); };
  assert.equal(await t.ghConnect(TOKEN,"harf-progress"),"store"); assert.equal(t.gh(),null); assert.equal(hub.files.size,0);
});
test("sync panel: a password field outside any form, one place that names github, and a backup that is still progress only",()=>{
  const panel=html.slice(html.indexOf("function ghPanel("),html.indexOf("// ===== items index =====")); assert.ok(panel.length>500);
  assert.ok(!/<form\b/i.test(html)&&!/el\("form"/.test(panel)); // the csp has form-action 'none'; the chat box has its own form, the panel has none
    assert.match(html,/select,input\[type=text\],input\[type=password\],textarea\{/);
  assert.ok(!/console\./.test(html)); assert.equal(html.split("api.github.com").length-1,1);
  assert.match(html,/state:serialize\(\),gen:S\.gen\}/);
  for(const s of ["Not set up","Synced just now","Offline, will sync later","Sync problem: ","Connecting…","Disconnect","Sync now"]) assert.ok(html.includes(s),s);
});

test("sync panel: the input hints are real attributes on the built inputs, not properties",()=>{
  const t=loadUi({pwa:true,dom:true}); const sec=t.env.rootEl; t.ghPanel(sec);
  for(const id of ["gh-token","gh-repo"]){ const i=findId(sec,id); assert.ok(i,id); assert.equal(i.attrs.autocomplete,"off"); assert.equal(i.attrs.autocapitalize,"off"); assert.equal(i.attrs.autocorrect,"off"); assert.equal(i.attrs.spellcheck,"false"); }
  assert.equal(findId(sec,"gh-token").type,"password"); assert.equal(findId(sec,"gh-repo").value,"harf-progress");
  const tags=n=>[n.tag,...(n.children||[]).flatMap(c=>c&&c.tag?tags(c):[])]; assert.ok(!tags(sec).includes("form"),"the page forbids form submission, so the panel has no form");
});
test("disconnect stops the cycle that is running: nothing more goes out with the old token, and a reconnect syncs on its own",async()=>{
  const OLD="github_pat_OLDTOKEN9999"; const hub=fakeHub(); let first=true, release; const gate=new Promise(r=>{ release=r; });
  hub.before=async(m,p)=>{ if(first&&m==="GET"&&p.includes("/contents/")){ first=false; await gate; } };
  const store=new Map([[KEY+"-gh",JSON.stringify({owner:"someone",repo:"harf-progress",token:OLD})]]);
  const t=loadUi({boot:true,pwa:true,fetch:hub.fetch,store}); await tick();
  const oldReqs=()=>hub.log.filter(q=>q.headers.Authorization==="Bearer "+OLD).length; assert.equal(oldReqs(),1);
  t.ghForget(); assert.equal(await Promise.race([t.ghConnect(TOKEN,"harf-progress"),tick(30).then(()=>"joined the old run")]),"ok"); assert.ok(hub.files.has("progress.json"));
  release(); await tick(); assert.equal(oldReqs(),1); assert.equal(t.gh().token,TOKEN); assert.equal(t.savedMsg(),"Synced just now");
  // and with no reconnect: still nothing more
  const hub2=fakeHub(); let rel2; const g2=new Promise(r=>{ rel2=r; }); let f2=true; hub2.before=async(m,p)=>{ if(f2&&m==="GET"&&p.includes("/contents/")){ f2=false; await g2; } };
  const t2=loadUi({boot:true,pwa:true,fetch:hub2.fetch,store:new Map([[KEY+"-gh",CFG]])}); await tick(); const n=hub2.log.length; t2.ghForget(); rel2(); await tick(); assert.equal(hub2.log.length,n); assert.equal(t2.gh(),null);
});
test("another tab changing or removing the connection stops the cycle running here, and the next sync starts fresh with the new one",async()=>{
  const OLD="github_pat_OLDTOKEN9999", NEW="github_pat_NEWTOKEN7777", cfg=tk=>JSON.stringify({owner:"someone",repo:"harf-progress",token:tk});
  const mk=async()=>{ const hub=fakeHub(); let first=true, release; const gate=new Promise(r=>{ release=r; });
    hub.before=async(m,p)=>{ if(first&&m==="GET"&&p.includes("/contents/")){ first=false; await gate; } };
    const store=new Map([[KEY+"-gh",cfg(OLD)]]); const t=loadUi({boot:true,pwa:true,fetch:hub.fetch,store}); await tick();
    return {hub,store,t,release,old:()=>hub.log.filter(q=>q.headers.Authorization==="Bearer "+OLD).length,fresh:()=>hub.log.filter(q=>q.headers.Authorization==="Bearer "+NEW).length}; };
  // removed in another tab
  let x=await mk(); assert.equal(x.old(),1);
  x.store.delete(KEY+"-gh"); x.store.delete(KEY+"-ghs"); x.t.on.storage({key:KEY+"-gh",newValue:null}); x.release(); await tick();
  assert.equal(x.old(),1,"no request with the old token after it was removed"); assert.equal(x.hub.log.length,1);
  // changed in another tab: the held run is dropped, the next sync is a fresh cycle with the new token
  x=await mk(); assert.equal(x.old(),1);
  x.store.set(KEY+"-gh",cfg(NEW)); x.t.on.storage({key:KEY+"-gh",newValue:cfg(NEW)});
  const next=x.t.ghSync("manual"); await tick(); assert.ok(x.fresh()>0,"the next sync starts at once with the new token, not by joining the old run");
  x.release(); await next; await tick(); assert.equal(x.old(),1,"the old run sent nothing more"); assert.ok(x.hub.files.has("progress.json"));
});
test("connect: a failure shows on the panel that is on screen when it ends, never with the token, and clears on the next attempt",async()=>{
  const hub=fakeHub(); let release; const gate=new Promise(r=>{ release=r; }); hub.before=async(m,p)=>{ if(p==="/user") await gate; }; hub.status["GET user"]=401;
  const t=loadUi({pwa:true,dom:true,fetch:hub.fetch}); const sec=t.env.rootEl; t.ghPanel(sec);
  findId(sec,"gh-token").value=TOKEN; const first=findId(sec,"gh-go").onclick();
  sec.children=[]; t.ghPanel(sec); // the page redraws while Connect is pending
  assert.equal(findId(sec,"gh-go").disabled,true); assert.equal(findId(sec,"gh-go").textContent,"Connecting…");
  release(); await first; await tick();
  assert.equal(findId(sec,"gh-line").textContent,"Sync problem: the token was refused"); assert.equal(findId(sec,"gh-go").disabled,false); assert.equal(findId(sec,"gh-go").textContent,"Connect");
  assert.ok(!JSON.stringify(sec,(k,v)=>k==="onclick"?undefined:v).includes(TOKEN.slice(4)));
  sec.children=[]; t.ghPanel(sec); assert.equal(findId(sec,"gh-line").textContent,"Sync problem: the token was refused"); // kept until the next try
  hub.status={}; hub.before=null; findId(sec,"gh-token").value=TOKEN; await findId(sec,"gh-go").onclick(); assert.ok(t.gh()); assert.ok(t.calls.includes("renderMe"));
  t.ghForget(); sec.children=[]; t.ghPanel(sec); assert.equal(findId(sec,"gh-line").textContent,"Not set up");
});

// ===== final fix wave =====
// a card as a feed, a lesson or "add my own word" first creates it has r (reps) 1; any grade makes it 2 or more
test("merge: a card nobody has graded since it was added never replaces one that has been graded, whatever the clocks say",()=>{
  const T=Math.floor(now/60000), graded=[1,5,3,T-3000,0,T-3000,-1,4], fresh=[1.18,5,1,T,0,T,1,0]; // the fresh copy has the later review time
  const mk=c=>({updatedAt:now,cards:{"m.10":c}});
  for(const [a,b] of [[mk(graded),mk(fresh)],[mk(fresh),mk(graded)]]) assert.deepEqual(L.mergeProgress(a,b).cards["m.10"],graded);
  // both graded: the later review wins, as before
  const later=[1,5,4,T+9000,0,T-10,-1,6]; for(const [a,b] of [[mk(graded),mk(later)],[mk(later),mk(graded)]]) assert.deepEqual(L.mergeProgress(a,b).cards["m.10"],later);
  // neither graded: the later one wins
  const fresh2=[1.18,5,1,T+5,0,T-1,1,0]; for(const [a,b] of [[mk(fresh),mk(fresh2)],[mk(fresh2),mk(fresh)]]) assert.deepEqual(L.mergeProgress(a,b).cards["m.10"],fresh);
  // start over: a graded card from before the reset does not come back, the card added after it stays
  const R=now-60000, RD="2026-11-25", rMin=Math.floor(R/60000);
  const before={updatedAt:R-5000,cards:{"m.10":[1,5,3,rMin-100,0,rMin-3000,-1,4]}}, after={updatedAt:R+5000,resetAt:R,resetDay:RD,cards:{"m.10":[1.18,5,1,rMin+5,0,rMin+5,1,0]}};
  for(const [a,b] of [[before,after],[after,before]]) assert.deepEqual(L.mergeProgress(a,b).cards["m.10"],after.cards["m.10"]);
});
test("offline app: opening with no signal adds the day's cards, and they never reset the reviews another device made of the same words",async()=>{
  const nowMin=Math.floor(Date.now()/60000), reviewed=id=>[3,5,3,nowMin+9000,0,nowMin-600,-1,4];
  // the other device already added and reviewed m.10 to m.12; this one was last synced the day before
  const hub=hubWith(saved({updatedAt:5,lastDay:"2026-03-01",streak:4,cards:{"m.10":reviewed(),"m.11":reviewed(),"m.12":reviewed()}}));
  const feed=t=>{ const p=t.serialize(); for(const id of ["m.10","m.11","m.12"]) if(!p.cards[id]) p.cards[id]=[1.18,5,1,nowMin,0,nowMin,1,0]; t.setS(p); t.save(); };
  const t=loadUi({boot:true,pwa:true,online:false,fetch:hub.fetch,feed,saved:{[KEY+"-gh"]:CFG}});
  assert.deepEqual(t.fed(),["msa","sentences"]); assert.equal(t.S().cards["m.10"].r,1,"fed offline"); assert.equal(hub.log.length,0);
  t.env.navigator.onLine=true; t.on.online(); await tick();
  for(const id of ["m.10","m.11","m.12"]){ assert.equal(t.S().cards[id].r,3,id+" locally"); assert.equal(hub.json("cards_msa.json").cards[id][2],3,id+" in the store"); }
  assert.equal(t.savedMsg(),"Synced just now");
});
test("start over with a clock that is ahead: the other device keeps the marker as sent, so its own later work the same day stays",()=>{
  const RD="2026-11-25", R=now+300000; // the device that started over has a clock 5 minutes ahead of this one
  const A={updatedAt:R,resetAt:R,resetDay:RD,cards:{},unitsDone:{},lastDay:"",streak:0};
  const B0=L.cleanSaved(A,now,RD); assert.equal(B0.resetAt,R,"the marker is kept as sent"); assert.equal(B0.resetCut,now,"work from here on is not dropped"); assert.equal(B0.resetDay,RD);
  assert.equal(L.cleanSaved(A,R+1,RD).resetCut,undefined,"a marker that isn't ahead needs no cut"); assert.equal(L.cleanSaved({resetAt:now+2*DAY,resetDay:RD},now,RD).resetAt,0,"far ahead is still junk");
  // this device then studies, still before R on its own clock, and its copy goes back to the other one
  const tMin=Math.floor((now+60000)/60000);
  const B=Object.assign({},B0,{updatedAt:now+60000,lastDay:RD,streak:1,reviewsToday:2,unitsDone:{u1:RD},log:{[RD]:2},cards:{"u1.0":[1,5,2,tMin+1,0,tMin,-1,1]}});
  for(const m of [L.mergeProgress(A,B),L.mergeProgress(B,A),L.mergeProgress(L.mergeProgress(A,B),A)]){
    assert.equal(m.streak,1); assert.equal(m.lastDay,RD); assert.deepEqual(Object.keys(m.unitsDone),["u1"]); assert.equal(m.log[RD],2); assert.deepEqual(Object.keys(m.cards),["u1.0"]); assert.equal(m.resetAt,R); }
  // work from before the reset (this device's clock) is still removed
  const old={updatedAt:now-9000,lastDay:RD,streak:7,unitsDone:{u0:RD},cards:{"u1.5":[1,5,3,Math.floor(now/60000)-50,0,Math.floor(now/60000)-100,-1,2]}};
  const k=L.mergeProgress(B0,old); assert.deepEqual(Object.keys(k.cards),[]); assert.deepEqual(Object.keys(k.unitsDone),[]);
});

// ===== final fix wave: the api client, the panel and start over =====
const findText=(n,s)=>!n?null:n.textContent===s?n:(n.children||[]).map(c=>findText(c,s)).find(Boolean)||null;
test("github sync: a 403 that is a rate limit is a busy server, not a refused token, and Connect keeps the token",async()=>{
  assert.equal(L.ghKind("read",403,true),"server"); assert.equal(L.ghKind("write",403,true),"server"); assert.equal(L.ghKind("read",403),"auth"); assert.equal(L.ghKind("read",401,true),"auth");
  const hub=fakeHub(); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3)}}));
  hub.status["*"]=403; hub.hdr={"x-ratelimit-remaining":"0"}; assert.equal((await a.sync()).kind,"server");
  hub.hdr={"retry-after":"60"}; assert.equal((await a.sync()).kind,"server");
  hub.hdr={"x-ratelimit-remaining":"41"}; assert.equal((await a.sync()).kind,"auth"); hub.hdr={}; assert.equal((await a.sync()).kind,"auth");
  hub.status={}; const store=new Map(); const t=loadUi({boot:true,pwa:true,fetch:hub.fetch,store}); await tick();
  hub.status["GET progress.json"]=403; hub.hdr={"x-ratelimit-remaining":"0"};
  assert.equal(await t.ghConnect(TOKEN,"harf-progress"),"server"); assert.ok(store.has(KEY+"-gh"),"the token is kept"); assert.equal(t.savedMsg(),"Sync problem: GitHub is not responding");
  t.ghForget(); hub.hdr={}; assert.equal(await t.ghConnect(TOKEN,"harf-progress"),"auth"); assert.ok(!store.has(KEY+"-gh"),"a plain 403 still drops it");
});
test("github client: a repo that moved answers with a redirect, which is never followed and reads as not found",async()=>{
  assert.equal(L.ghKind("read",301),"repo"); assert.equal(L.ghKind("write",308),"repo"); assert.equal(L.ghKind("user",301),"server");
  const hub=fakeHub(); const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3)}})); hub.status["*"]=301;
  const r=await a.sync(); assert.equal(r.kind,"repo"); assert.ok(hub.log.length>0); for(const q of hub.log) assert.equal(q.redirect,"manual");
  // a browser hides the status of a redirect it was told not to follow
  const opaque=async()=>({type:"opaqueredirect",status:0,json:async()=>{ throw new Error("no body"); }});
  const api=L.ghApi({owner:"someone",repo:"harf-progress",token:TOKEN},opaque); assert.deepEqual({...await api.get("progress.json")},{kind:"repo"}); assert.deepEqual({...await api.put("progress.json","{}")},{kind:"repo"});
  const t=loadUi({boot:true,pwa:true,fetch:opaque,saved:{[KEY+"-gh"]:CFG}}); await tick(); assert.equal(t.savedMsg(),"Sync problem: the progress repo was not found");
});
test("github client: a keepalive request the browser refuses is sent again without keepalive before it counts as offline",async()=>{
  const hub=fakeHub(); hub.noKeepalive=true; const a=dev(hub,prog({cards:{"u1.0":pcard(GT,3)}}));
  const r=await a.sync({keepalive:true}); assert.equal(r.kind,"ok"); assert.ok(hub.files.has("progress.json"));
  assert.ok(hub.log.some(q=>q.keepalive)&&hub.log.some(q=>!q.keepalive));
  hub.log.forEach((q,i)=>{ if(q.keepalive){ const n=hub.log[i+1]; assert.ok(n&&!n.keepalive&&n.url===q.url&&n.method===q.method&&n.body===q.body,"one plain retry"); } });
  const hub2=fakeHub(); hub2.down=true; const b=dev(hub2,prog({})); assert.equal((await b.sync({keepalive:true})).kind,"offline"); assert.equal(hub2.log.length,2,"one retry, then offline");
  // the page: going to the background still ends synced
  const hub3=fakeHub(); hub3.noKeepalive=true; const t=loadUi({boot:true,pwa:true,fetch:hub3.fetch,saved:{[KEY+"-gh"]:CFG}}); await tick();
  study(t); t.env.document.visibilityState="hidden"; t.on.visibilitychange(); await tick();
  assert.equal(t.savedMsg(),"Synced just now"); assert.ok(hub3.json("cards_s1.json").cards["u1.9"]);
});
test("sync panel: Connect and Sync now always come back, even when the sync itself fails",async()=>{
  const t=loadUi({pwa:true,dom:true}); const sec=t.env.rootEl; t.ghPanel(sec); let n=0; t.env.ghConnect=()=>{ n++; return Promise.reject(new Error("boom")); };
  findId(sec,"gh-token").value=TOKEN; await findId(sec,"gh-go").onclick();
  assert.equal(findId(sec,"gh-go").disabled,false); assert.equal(findId(sec,"gh-go").textContent,"Connect"); assert.equal(findId(sec,"gh-line").textContent,"Sync problem: GitHub is not responding"); assert.equal(findId(sec,"gh-token").value,"");
  await findId(sec,"gh-go").onclick(); assert.equal(n,2,"a second press is not ignored");
  const u=loadUi({pwa:true,dom:true,saved:{[KEY+"-gh"]:CFG}}); const s2=u.env.rootEl; u.ghPanel(s2); u.env.ghSync=()=>Promise.reject(new Error("boom"));
  const btn=findText(s2,"Sync now"); assert.ok(btn); await btn.onclick({currentTarget:btn}); assert.equal(btn.disabled,false); assert.ok(u.calls.includes("renderMe"));
});
test("sync panel: Disconnect asks for a second tap, and the first one wears off",()=>{
  const store=new Map([[KEY+"-gh",CFG]]); const t=loadUi({pwa:true,dom:true,store}); const sec=t.env.rootEl; t.ghPanel(sec);
  const b=findText(sec,"Disconnect"); assert.ok(b); b.onclick(); assert.equal(b.textContent,"Tap again to disconnect"); assert.ok(t.gh()); assert.ok(store.has(KEY+"-gh"));
  t.runTimers(); assert.equal(b.textContent,"Disconnect"); b.onclick(); assert.ok(t.gh(),"a tap after it wore off only asks again");
  b.onclick(); assert.equal(t.gh(),null); assert.ok(!store.has(KEY+"-gh")); assert.ok(t.calls.includes("renderMe"));
});
test("sync panel: the connected panel shows the repo and never the token, and a refused token says what to do",async()=>{
  const hub=fakeHub(); const store=new Map([[KEY+"-gh",CFG]]); const t=loadUi({pwa:true,dom:true,fetch:hub.fetch,store}); const sec=t.env.rootEl; t.ghPanel(sec);
  const dump=()=>JSON.stringify(sec,(k,v)=>typeof v==="function"?undefined:v);
  assert.ok(!dump().includes(TOKEN)&&!dump().includes(TOKEN.slice(4))); assert.ok(findText(sec,"someone/harf-progress")); assert.ok(!findId(sec,"gh-token"),"no token box while connected"); assert.equal(findId(sec,"gh-hint"),null);
  hub.status["*"]=401; await t.ghSync("manual"); sec.children=[]; t.ghPanel(sec);
  assert.equal(findId(sec,"gh-line").textContent,"Sync problem: the token was refused"); assert.equal(findId(sec,"gh-hint").textContent,"Press Disconnect, then paste a new token."); assert.ok(!dump().includes(TOKEN.slice(4)));
  assert.equal(t.note.textContent,"Sync problem: the token was refused. Open Progress, Sync and paste a new token."); assert.ok(!t.note.textContent.includes("will sync when it can"));
  const t2=loadUi({pwa:true,dom:true,fetch:hub.fetch,store:new Map([[KEY+"-gh",CFG]])}); hub.status={"*":404}; await t2.ghSync("manual");
  assert.equal(t2.savedMsg(),"Sync problem: the progress repo was not found"); assert.equal(t2.note.textContent,"Sync problem: the progress repo was not found. Open Progress, Sync and check the repo name.");
});
test("start over on the offline app: the next cycle replaces what the repo holds, and the old work does not come back",async()=>{
  const hub=fakeHub(); const t=loadUi({pwa:true,dom:true,fetch:hub.fetch,saved:{[KEY+"-gh"]:CFG}});
  study(t); await t.ghSync("manual"); assert.deepEqual(Object.keys(hub.json("cards_s1.json").cards),["u1.9"]);
  hub.log.length=0; t.startOver(); await tick();
  assert.deepEqual(hub.gets(),[],"a replace reads nothing first"); assert.deepEqual(hub.json("cards_s1.json"),{cards:{}}); assert.ok(t.S().resetAt>0); assert.equal(hub.json("progress.json").resetAt,t.S().resetAt); assert.ok(t.calls.includes("renderMe"));
  assert.deepEqual(Object.keys(t.S().cards),[]);
});
test("start over on the claude.ai build: the account copy is replaced, not merged",async()=>{
  const db=fakeDb({[P+"progress"]:{updatedAt:5,lastDay:"2026-03-01",streak:4,shards:{s1:"a1"}},[P+"cards_s1"]:{cards:{"u1.0":pcard(100,3)}}});
  const t=loadUi({dom:true}); t.use(db,"u1"); await t.pushRemote(); assert.ok(t.S().cards["u1.0"]); const before=db.reads;
  t.startOver(); await tick(); assert.equal(db.reads,before); assert.deepEqual(db.m.get(P+"cards_s1"),{cards:{}}); assert.ok(t.S().resetAt>0); assert.equal(db.m.get(P+"progress").resetAt,t.S().resetAt);
});

// ===== second wave =====
test("merge: a migrated old card with reps 1 but a lapse and a long interval is not 'never graded', in either order",()=>{
  const T=Math.floor(now/60000), graded=[1,5,3,T-3000,0,T-3000,-1,4], legacy=[2,5,1,T+4000,1,T,-1,30], mk=c=>({updatedAt:now,cards:{"u1.0":c}});
  for(const [a,b] of [[mk(graded),mk(legacy)],[mk(legacy),mk(graded)]]) assert.deepEqual(L.mergeProgress(a,b).cards["u1.0"],legacy);
  const noStep=[1,5,1,T+1,0,T,-1,0]; for(const [a,b] of [[mk(graded),mk(noStep)],[mk(noStep),mk(graded)]]) assert.deepEqual(L.mergeProgress(a,b).cards["u1.0"],noStep);
});
test("start over: a damaged or hand-edited cut can't make the reset stop removing older cards",()=>{
  const R=now-3600000, RD="2026-11-25", rMin=Math.floor(R/60000);
  const c=L.cleanSaved({resetAt:R,resetDay:RD,resetCut:1,cards:{}},now,RD); assert.equal(c.resetAt,R); assert.equal(c.resetCut,undefined);
  const other={updatedAt:R-9000,cards:{"u1.0":[1,5,3,rMin-30,0,rMin-60,-1,2]}};
  for(const m of [L.mergeProgress(c,other),L.mergeProgress(other,c),L.mergeProgress({resetAt:R,resetDay:RD,resetCut:1,cards:{}},other)]) assert.deepEqual(Object.keys(m.cards),[]);
  assert.equal(L.cleanSaved({resetAt:now+300000,resetDay:RD,resetCut:now-2*DAY},now,RD).resetCut,now,"a cut more than a day before the marker is ignored");
});
test("start over: two devices with the same marker time agree on the reset day, whichever copy comes first",()=>{
  // the phone's clock is ahead: it starts over at 00:10 on the 21st; the PC hears at 23:50 on the 20th and finishes a lesson that day
  const R=Date.UTC(2026,10,21,0,10), pcNow=R-20*60000;
  const phone={updatedAt:R,resetAt:R,resetDay:"2026-11-21",cards:{},unitsDone:{},lastDay:"",streak:0};
  const heard=L.cleanSaved(phone,pcNow,"2026-11-20"); assert.equal(heard.resetDay,"2026-11-20");
  const pc=Object.assign({},heard,{updatedAt:pcNow+60000,lastDay:"2026-11-20",streak:1,unitsDone:{u1:"2026-11-20"},log:{"2026-11-20":1}});
  const x=L.mergeProgress(phone,pc), y=L.mergeProgress(pc,phone);
  assert.equal(JSON.stringify(x.unitsDone),'{"u1":"2026-11-20"}'); assert.equal(x.resetDay,"2026-11-20"); assert.equal(x.streak,1);
  for(const f of ["unitsDone","resetDay","resetAt","streak","lastDay","log"]) assert.equal(JSON.stringify(y[f]),JSON.stringify(x[f]),f);
});

// ===== vowel marks: the setting and every place a stage 1-2 phrase is shown =====
test("settings: vowel marks default to auto, keep a valid choice, and drop a junk one",()=>{
  const T=loadUi();
  T.setS({settings:{}}); assert.equal(T.S().settings.harakat,"auto");
  T.setS({settings:{harakat:"never"}}); assert.equal(T.S().settings.harakat,"never"); assert.equal(T.serialize().settings.harakat,"never");
  T.setS({settings:{harakat:"tap"}}); assert.equal(T.S().settings.harakat,"auto");
  T.setS({}); assert.equal(T.S().settings.harakat,"auto");
});
test("settings: the newer copy's vowel-mark choice wins a merge, and the account split keeps it",()=>{
  const a={updatedAt:2,settings:{translit:"never",harakat:"never"}}, b={updatedAt:1,settings:{translit:"auto",harakat:"always"}};
  assert.equal(L.mergeProgress(a,b).settings.harakat,"never"); assert.equal(L.mergeProgress(b,a).settings.harakat,"never");
  const sp=L.splitProgress({settings:{harakat:"always"},cards:{}}); assert.equal(sp.meta.settings.harakat,"always");
  assert.equal(L.joinProgress(sp.meta,sp.shards).settings.harakat,"always");
});
test("progress: the vowel marks control sits after pronunciation lines, with auto, always and never",()=>{
  const k='select("set-harakat","Vowel marks",[["auto","Auto"],["always","Always"],["never","Never"]],S.settings.harakat,';
  const i=main.indexOf(k); assert.ok(i>0); assert.ok(i>main.indexOf('select("set-translit"')); assert.ok(i<main.indexOf('select("set-new"'));
});
test("harakat: the vowelled form is display-only: no audio, speech, matching or tile call is given it",()=>{
  for(const re of [/\b(?:say|speakPart|sayQueue|auto|playBtn|slowBtn|shadowBtn|recordWidget|speakWidget|wordMatch|similarity|pickOptions|nativeLink|soundShift|normalizeArabic|addCustom)\([^()]*\b(?:shownAr|arv)\b/,/text:\s*(?:shownAr|[\w.]*\barv\b)/,/bigAr\(\s*shownAr/,/"aria-label":[^,]*shownAr/])
    assert.ok(!re.test(main),String(re));
  assert.ok(main.split("shownAr(").length-1>=10,"one shownAr( per display site");
});

// the screens themselves, run against a small fake dom with the audio and checking calls recorded
function uiEl(tag){ const e={tag,attrs:{},children:[],parent:null,style:{},hidden:false,className:"",
  setAttribute(k,v){ e.attrs[k]=String(v); },
  detached:false, get isConnected(){ for(let n=e;n;n=n.parent) if(n.detached) return false; return true; },
  // like the browser: a node is added as it is, anything else (null, undefined, false, a number) becomes a text node of its string form
  append(...k){ for(const c of k){ if(c&&typeof c==="object"){ c.parent=e; c.detached=false; } e.children.push(c&&typeof c==="object"?c:String(c)); } },
  remove(){ if(e.parent) e.parent.children=e.parent.children.filter(x=>x!==e); e.parent=null; e.detached=true; },
  contains(n){ return n===e||e.children.some(c=>c&&typeof c==="object"&&c.contains(n)); },
  classList:{add:c=>{ e.className=(e.className+" "+c).trim(); },remove:c=>{ e.className=e.className.split(/\s+/).filter(x=>x&&x!==c).join(" "); },contains:c=>e.className.split(/\s+/).includes(c)},
  get lastChild(){ return e.children[e.children.length-1]||null; },
  querySelectorAll(sel){ const c=sel.slice(1); return walk(e).slice(1).filter(n=>n.className.split(/\s+/).includes(c)); },
  scrollIntoView(){}, focus(){} };
  const own={}; e.dataset=new Proxy(own,{get:(o,k)=>k in o?o[k]:e.attrs["data-"+String(k).replace(/[A-Z]/g,c=>"-"+c.toLowerCase())]});
  Object.defineProperty(e,"textContent",{get:()=>e._t||"",set:v=>{ e._t=String(v); e.children.forEach(c=>{ if(c&&typeof c==="object"){ c.parent=null; c.detached=true; } }); e.children=[]; }}); return e; }
const walk=n=>typeof n==="string"||!n?[]:[n,...n.children.flatMap(walk)];
const txt=n=>typeof n==="string"?n:(n._t||"")+n.children.map(txt).join("");
const byText=(root,t)=>walk(root).find(n=>n.tag==="button"&&txt(n)===t);
const talkOf=sc=>{ const s=uiEl("div"); s.id="talk"; sc.env.rootEl=s; Object.assign(sc.env,{DIALECT:"Gulf",learnerGender:()=>"",stageLine:()=>"",knownList:()=>""}); return s; };
const byId=(root,id)=>walk(root).find(n=>n.id===id);
const press=n=>{ assert.ok(n,"control missing"); n.onclick({currentTarget:n}); };
const MARKS=/[\u064B-\u0652\u0670]/;
const UNIT={id:"u1",stage:1,title:"Greetings",goal:"g",tip:"t",
  items:[{ar:"هلا",tr:"hala",en:"hi",arv:"هَلَا"},{ar:"شلونك",tr:"shlōnak",en:"how are you",arv:"شْلَوْنَكْ"},{ar:"زين",tr:"zēn",en:"good",arv:"زَيْنْ"},{ar:"مع السلامة",tr:"maʿ is-salāma",en:"bye",arv:"مَعْ السَّلَامَة"}],
  dialogue:[{who:"A",ar:"شلونك",tr:"shlōnak",en:"how are you",arv:"شْلَوْنَكْ"},{who:"B",ar:"زين",tr:"zēn",en:"good",arv:"زَيْنْ"}]};
function loadScreens({harakat="auto",stage=1}={}){
  const t=loadUi(), env=t.env; t.setS({settings:{harakat}}); env.__stage=stage; env.currentStage=()=>env.__stage;
  const spy={say:[],queue:[],auto:[],widget:[],view:null}; env.document.createElement=uiEl;
  const rec=name=>text=>{ spy.widget.push([name,text]); return uiEl("span"); };
  Object.assign(env,{say(text){ spy.say.push(text); return Promise.resolve(); },sayQueue(parts){ spy.queue.push(parts.map(p=>p.text)); return Promise.resolve(); },auto:text=>{ spy.auto.push(text); },
    voiceRow:()=>null,playBtn:rec("play"),slowBtn:rec("slow"),shadowBtn:rec("shadow"),recordWidget:rec("record"),speakWidget:rec("speak"),nativeLink:()=>uiEl("span"),shiftChip:()=>null,
    trLine:tr=>{ const p=uiEl("p"); p.textContent=tr; return p; },icon:()=>uiEl("span"),
    focusView:()=>{ spy.view={body:uiEl("div"),progress(){},alive:()=>true}; return spy.view; },focusCard(){},announce(){},buzz(){},stopAudio(){},keepAwake(){},
    sched:c=>c,touchDay(){},logActivity(){},addSentenceCards(){},show(){},refresh(){},heatmap:()=>uiEl("div"),forecastBars:()=>uiEl("div"),savedMsg:()=>"",
    STAGE_NAMES:[],stageInfo:()=>({}),shownStreak:()=>0,lessonsDone:()=>0,standalone:()=>false,ghPanel(){},installEvt:null,cleanIn:x=>x,DAY:86400000,SAMPLE:null,micBlocked:false,SR:null,DB:null,GH:null});
  vm.runInContext("var enVoice=null, TTS=null, chatLog=[], generating=false, DICT=null, dictSink=null, dictLang='ar-AE'; let keyHandler=null;",env);
  for(const s of [cut("const ap=","const SVG="),cut("let ITEMS={}","function rebuild"),cut("const liveCards=","const lessonsDone"),
      cut("const harOn=","\n"),cut("const bigAr=","\n"),cut("function openLesson","// ===== role-play"),cut("function roleplay(","// ===== review tab"),cut("let talkMode=","// ===== progress"),cut("function startReview","// ===== hands-free"),cut("function audioDrill","// ===== course"),cut("function renderMe","// ===== boot")])
    vm.runInContext(s,env);
  const items={}, unitOf={}; UNIT.items.forEach((it,i)=>{ items["u1."+i]=Object.assign({id:"u1."+i,unit:"u1",stage:1},it); unitOf["u1."+i]="u1"; });
  const s0=Object.assign({id:"u1.s0",unit:"u1",stage:"s1",sentence:true},UNIT.items[3]); items["u1.s0"]=s0; unitOf["u1.s0"]="u1";
  vm.runInContext("this.__set=(i,u,m)=>{ ITEMS=i; UNITS=u; ITEM_UNIT=m; };",env); env.__set(items,[UNIT],unitOf);
  const card=(st,i,r)=>({s:1,k:5,d:1,t:0,r,l:0,st,i});
  return {t,env,spy,items,card,shown:root=>walk(root).filter(n=>n.lang==="ar").map(txt)};
}
// what each screen puts on the page, in order, as {shown: arabic texts on screen}, while the spies keep what audio, speech and checking were given
function tour(sc){
  const {env,spy,shown}=sc, out={}; const body=()=>spy.view.body;
  env.openLesson(UNIT); out.step1=shown(body()); out.step1Labels=walk(body()).filter(n=>n.attrs["aria-label"]).map(n=>n.attrs["aria-label"]);
  press(byText(body(),"Learn the phrases →")); out.step2=[]; out.step2Labels=[];
  for(let k=0;k<UNIT.items.length;k++){ out.step2.push(shown(body())[0]); out.step2Labels.push(walk(body()).find(n=>/\bsay\b/.test(n.className)).attrs["aria-label"]); press(byText(body(),k<3?"Next →":"Quick check →")); }
  out.step3=walk(body()).filter(n=>n.attrs["data-ar"]!==undefined).map(n=>({data:n.attrs["data-ar"],shown:shown(n)[0]}));
  env.roleplay(UNIT); out.rpA=shown(body()); out.rpALabel=walk(body()).find(n=>/\bsay\b/.test(n.className)).attrs["aria-label"]; press(byText(body(),"Your turn →"));
  out.rpB=shown(body());
  return out;
}
const PLAIN=UNIT.items.map(x=>x.ar), VOW=UNIT.items.map(x=>x.arv);
test("harakat off: every lesson and role-play screen shows today's text and nothing else",()=>{
  for(const sc of [loadScreens({harakat:"never",stage:1}),loadScreens({harakat:"auto",stage:3}),loadScreens({harakat:"auto",stage:6})]){
    const o=tour(sc);
    assert.deepEqual(o.step1,["شلونك","زين"]); assert.deepEqual(o.step2,PLAIN); assert.deepEqual(o.step3.map(x=>x.shown),o.step3.map(x=>x.data));
    assert.deepEqual(o.rpA,["شلونك"]); assert.deepEqual(o.rpB,["زين"]);
    for(const s of [...o.step1,...o.step2,...o.rpA,...o.rpB,...o.step3.map(x=>x.shown)]) assert.ok(!MARKS.test(s),s);
  }
});
test("harakat on: lesson and role-play screens show the vowelled form, audio and labels keep the plain spelling",()=>{
  for(const sc of [loadScreens({harakat:"always",stage:4}),loadScreens({harakat:"auto",stage:1}),loadScreens({harakat:"auto",stage:0}),loadScreens({harakat:"auto",stage:2})]){
    const o=tour(sc);
    assert.deepEqual(o.step1,["شْلَوْنَكْ","زَيْنْ"]); assert.deepEqual(o.step2,VOW); assert.equal(o.step3.length,4);
    for(const x of o.step3){ const row=UNIT.items.find(i=>i.ar===x.data); assert.ok(row,"data-ar is a plain spelling: "+x.data); assert.equal(x.shown,row.arv); }
    assert.deepEqual(o.rpA,["شْلَوْنَكْ"]); assert.deepEqual(o.rpB,["زَيْنْ"]);
    assert.deepEqual(o.step2Labels,PLAIN.map(a=>"Hear: "+a)); assert.equal(o.rpALabel,"Hear: شلونك");
    for(const s of [...o.step1Labels,...o.step2Labels,o.rpALabel]) assert.ok(!MARKS.test(s),s);
    // everything handed to audio, recording and speech scoring is the plain text
    const heard=[...sc.spy.auto,...sc.spy.say,...sc.spy.queue.flat(),...sc.spy.widget.map(w=>w[1])];
    assert.ok(heard.length>=8,"audio and widgets were reached"); for(const h of heard) assert.ok(PLAIN.includes(h),"plain text only: "+h);
  }
});
test("harakat on: tapping the big phrase and the answer check use the plain spelling",()=>{
  const sc=loadScreens({harakat:"always",stage:1}); const {env,spy}=sc; env.openLesson(UNIT); press(byText(spy.view.body,"Learn the phrases →"));
  press(walk(spy.view.body).find(n=>/\bsay\b/.test(n.className))); assert.deepEqual(spy.say,["هلا"]);
  for(let k=0;k<4;k++) press(byText(spy.view.body,k<3?"Next →":"Quick check →"));
  const right=walk(spy.view.body).filter(n=>n.attrs["data-ar"]!==undefined); const en=walk(spy.view.body).find(n=>n.className==="en"&&UNIT.items.some(i=>i.en===txt(n))); const it=UNIT.items.find(i=>i.en===txt(en));
  const wrong=right.find(n=>n.attrs["data-ar"]!==it.ar); press(wrong); assert.ok(/\bright\b/.test(right.find(n=>n.attrs["data-ar"]===it.ar).className),"the plain spelling is the right answer"); assert.ok(/\bwrong\b/.test(wrong.className));
  assert.equal(spy.say.at(-1),it.ar);
});
const reviewOf=(sc,id,c)=>{ sc.t.S().cards[id]=c; sc.env.startReview(null); return sc.spy.view.body; };
const bigOf=n=>walk(n).filter(x=>x.lang==="ar"&&/\bbig\b/.test(x.className)).map(txt);
test("harakat: review recognise card shows the vowelled form, labels and audio keep the plain one",()=>{
  for(const [hk,stage,want] of [["always",4,"مَعْ السَّلَامَة"],["auto",1,"مَعْ السَّلَامَة"],["never",1,"مع السلامة"],["auto",3,"مع السلامة"]]){
    const sc=loadScreens({harakat:hk,stage}); const body=reviewOf(sc,"u1.3",sc.card(0,0,0)); assert.ok(/What does it mean/.test(txt(body)));
    const b=walk(body).find(n=>/\bsay\b/.test(n.className)); assert.equal(txt(b),want); assert.equal(b.attrs["aria-label"],"Hear: مع السلامة"); press(b); assert.deepEqual(sc.spy.say,["مع السلامة"]);
    press(byText(body,"Show answer")); for(const a of sc.spy.auto) assert.equal(a,"مع السلامة");
  }
});
test("harakat: build-the-sentence tiles show the marks, but the check compares the plain words",()=>{
  for(const hk of ["always","never"]){
    const sc=loadScreens({harakat:hk,stage:1}); const body=reviewOf(sc,"u1.s0",sc.card(-1,3,6)); assert.ok(/Build the sentence/.test(txt(body)),txt(body));
    const target=["مع","السلامة"], vow=["مَعْ","السَّلَامَة"]; const bank=()=>walk(body).filter(n=>/wtile/.test(n.className)&&n.parent&&n.parent.tag==="div"&&/center/.test(n.parent.className));
    const tilesNow=bank(); assert.equal(tilesNow.length,2);
    const label=n=>txt(n); const want=hk==="always"?vow:target; assert.deepEqual(tilesNow.map(label).sort(),[...want].sort());
    for(let i=0;i<2;i++){ const t=bank().find(n=>label(n)===want[i]); press(t); }
    press(byText(body,"Check")); const built=walk(body).find(n=>/\bbuilt\b/.test(n.className)); assert.ok(/ok/.test(built.className),"built in order is right: "+built.className);
    assert.ok(sc.spy.say.concat(sc.spy.auto).every(x=>x==="مع السلامة"));
  }
  // the wrong order is still wrong with marks shown
  const sc=loadScreens({harakat:"always",stage:1}); const body=reviewOf(sc,"u1.s0",sc.card(-1,3,6)); const bank=()=>walk(body).filter(n=>/wtile/.test(n.className)&&/center/.test(n.parent.className));
  press(bank().find(n=>txt(n)==="السَّلَامَة")); press(bank().find(n=>txt(n)==="مَعْ")); press(byText(body,"Check")); assert.ok(/\bno\b/.test(walk(body).find(n=>/\bbuilt\b/.test(n.className)).className));
});
test("harakat: the taller line is used only while marks are shown (tiles and quick-check options)",()=>{
  assert.ok(/\.wtile\{font:400 24px\/1\.4 /.test(html),"tiles keep their old line height by default");
  assert.ok(/\.wtile\.har\{font:400 24px\/1\.8 /.test(html),"the taller line is on .wtile.har");
  assert.ok(/\.options \.btn \.ar\{font-size:26px;line-height:1\.5\}/.test(html)&&/\.options\.har \.btn \.ar\{[^}]*line-height:1\.8/.test(html));
  for(const [hk,on] of [["always",true],["never",false]]){
    const sc=loadScreens({harakat:hk,stage:1}); const body=reviewOf(sc,"u1.s0",sc.card(-1,3,6));
    const tiles=walk(body).filter(n=>/wtile/.test(n.className)); assert.equal(tiles.length,2);
    for(const t of tiles) assert.equal(/\bhar\b/.test(t.className),on,hk+" tile: "+t.className);
    const sc2=loadScreens({harakat:hk,stage:1}); sc2.env.openLesson(UNIT); press(byText(sc2.spy.view.body,"Learn the phrases →"));
    for(let k=0;k<4;k++) press(byText(sc2.spy.view.body,k<3?"Next →":"Quick check →"));
    const opt=walk(sc2.spy.view.body).find(n=>n.attrs["data-ar"]!==undefined); assert.ok(opt);
    assert.equal(/\bhar\b/.test(opt.parent.className),on,hk+" options: "+opt.parent.className);
  }
});
test("harakat: tiles fall back to the plain words when the vowelled form splits into a different number of words",()=>{
  const sc=loadScreens({harakat:"always",stage:1}); sc.items["u1.s0"].arv="مَعْالسَّلَامَة";
  const body=reviewOf(sc,"u1.s0",sc.card(-1,3,6)); assert.deepEqual(walk(body).filter(n=>/wtile/.test(n.className)).map(txt).sort(),["السلامة","مع"].sort());
});
test("harakat: the review answer shows the vowelled form and a stage 3 phrase without one is untouched",()=>{
  const sc=loadScreens({harakat:"always",stage:1}); const body=reviewOf(sc,"u1.s0",sc.card(-1,3,6)); assert.deepEqual(bigOf(body),["مَعْ السَّلَامَة"]);
  const sc2=loadScreens({harakat:"always",stage:4}); delete sc2.items["u1.s0"].arv; assert.deepEqual(bigOf(reviewOf(sc2,"u1.s0",sc2.card(-1,3,6))),["مع السلامة"]);
  const sc3=loadScreens({harakat:"never",stage:1}); assert.deepEqual(bigOf(reviewOf(sc3,"u1.s0",sc3.card(-1,3,6))),["مع السلامة"]);
});
test("harakat: the hands-free drill reveals the vowelled form but speaks the plain one",()=>{
  for(const [hk,want] of [["always","شْلَوْنَكْ"],["never","شلونك"]]){
    const sc=loadScreens({harakat:hk,stage:1}); sc.t.S().cards["u1.1"]=sc.card(-1,3,6); sc.env.audioDrill();
    assert.deepEqual(bigOf(sc.spy.view.body),[want]); assert.deepEqual(sc.spy.queue.flat().filter(Boolean),["شلونك","شلونك"]);
  }
});
test("harakat: Progress shows tricky cards vowelled when marks are on, and the control saves the choice",()=>{
  for(const [hk,stage,want] of [["always",4,"شْلَوْنَكْ"],["auto",1,"شْلَوْنَكْ"],["never",1,"شلونك"],["auto",3,"شلونك"]]){
    const sc=loadScreens({harakat:hk,stage}); const me=uiEl("div"); me.id="me"; sc.env.rootEl=me; sc.t.S().cards["u1.1"]=Object.assign(sc.card(-1,3,6),{l:5});
    sc.env.renderMe(); const row=walk(me).find(n=>n.lang==="ar"&&/\bmid\b/.test(n.className)); assert.equal(txt(row),want);
    assert.deepEqual(sc.spy.widget.filter(w=>w[0]==="play").map(w=>w[1]),["شلونك"]);
  }
  const sc=loadScreens({harakat:"auto",stage:1}); const me=uiEl("div"); me.id="me"; sc.env.rootEl=me; sc.env.renderMe();
  const sel=walk(me).find(n=>n.id==="set-harakat"); assert.ok(sel,"the control is there"); assert.deepEqual(sel.children.map(o=>[o.value,txt(o)]),[["auto","Auto"],["always","Always"],["never","Never"]]);
  assert.equal(sel.children.find(o=>o.selected).value,"auto"); sel.value="never"; sel.onchange(); assert.equal(sc.t.S().settings.harakat,"never"); assert.equal(sc.t.serialize().settings.harakat,"never");
  const ids=walk(me).filter(n=>n.tag==="select").map(n=>n.id); assert.ok(ids.indexOf("set-harakat")===ids.indexOf("set-translit")+1&&ids.indexOf("set-new")===ids.indexOf("set-harakat")+1,ids.join());
});
test("harakat: the memory-aid prompt for a tricky card is built from the plain spelling",()=>{
  const sc=loadScreens({harakat:"always",stage:1}); const me=uiEl("div"); me.id="me"; sc.env.rootEl=me; sc.t.S().cards["u1.1"]=Object.assign(sc.card(-1,3,6),{l:5});
  const asked=[]; sc.env.DIALECT="Gulf Arabic"; sc.env.SAMPLE={json:(q)=>{ asked.push(q); return new Promise(()=>{}); }}; sc.env.renderMe();
  press(byText(me,"Help me remember")); assert.equal(asked.length,1); assert.ok(asked[0].includes('"شلونك"')); assert.ok(!MARKS.test(asked[0]));
});

// native append() prints the text "null" for a null child: lessons, review answers and stories must never show that
const texts=root=>{ const out=[]; const go=n=>{ if(typeof n==="string") out.push(n); else if(n){ if(n._t) out.push(n._t); n.children.forEach(go); } }; go(root); return out; };
const junk=root=>texts(root).filter(t=>/^\s*(null|undefined|false|true)\s*$/.test(t));
const gulfRow=gulf=>({id:"m.0",unit:"msa",stage:"msa",msaTrack:true,ar:"ماء",tr:"maa",en:"water",gulf});
const msaAnswer=gulf=>{ const sc=loadScreens({harakat:"never",stage:3}); sc.items["m.0"]=gulfRow(gulf); return reviewOf(sc,"m.0",sc.card(0,0,0)); };
test("a lesson without grammar or culture shows no stray null text, and still shows title, tip and dialogue",()=>{
  const sc=loadScreens({harakat:"never"}); sc.env.openLesson(UNIT); const body=sc.spy.view.body, all=texts(body);
  assert.deepEqual(junk(body),[]);
  assert.ok(all.includes("Greetings")&&all.includes("Tip: t"),all.join("|"));
  assert.ok(!all.some(t=>/^(Grammar|Culture):/.test(t)));
  assert.deepEqual(sc.shown(body),["شلونك","زين"]);
});
test("a lesson with grammar and culture shows the Grammar chip and the Culture note",()=>{
  const sc=loadScreens(); sc.env.openLesson(Object.assign({},UNIT,{grammar:"past tense",culture:"Greet first"})); const body=sc.spy.view.body, all=texts(body);
  assert.deepEqual(junk(body),[]); assert.ok(all.includes("Grammar: past tense")&&all.includes("Culture: Greet first")&&all.includes("Tip: t"),all.join("|"));
});
test("a fuṣḥā review answer shows no null text, whatever the gulf field holds",()=>{
  for(const g of ["","  ","G?","M x","nonsense"]){ const body=msaAnswer(g); assert.deepEqual(junk(body),[],JSON.stringify(g)); assert.ok(!texts(body).some(t=>/^Gulf speech/.test(t))); assert.ok(texts(body).includes("water")); }
  assert.ok(texts(msaAnswer("G=")).includes("Gulf speech uses this word too."));
  assert.ok(texts(msaAnswer("G~ maay")).includes("Gulf speech says it: maay"));
  const m=msaAnswer("M مي maay"); assert.deepEqual(junk(m),[]); assert.ok(texts(m).includes("Gulf speech uses ")&&texts(m).includes("maay")&&texts(m).includes(" instead."),texts(m).join("|"));
});
test("the AI story shows no null text for a plain story and the fuṣḥā chip only for a fuṣḥā one",async()=>{
  for(const [rand,chip] of [[0.9,false],[0.1,true]]){
    const sc=loadScreens({stage:3}); vm.runInContext("Math.random=()=>"+rand,sc.env); sc.env.DIALECT="Gulf Arabic"; sc.env.knownList=()=>"";
    sc.env.SAMPLE={json:async()=>({title:"The market",lines:[{ar:"هلا",tr:"hala",en:"hi"}],question:{q:"Who?",options:["a","b","c"],answer:"a"},new_words:[]})};
    const sec=uiEl("div"); sc.env.renderStory(sec); press(byText(sec,"Write me a story")); await tick();
    const all=texts(sec); assert.ok(all.includes("The market"),all.join("|")); assert.deepEqual(junk(sec),[]);
    assert.equal(all.some(t=>/^Fuṣḥā story/.test(t)),chip);
  }
});
test("guard: no screen the harness can reach shows a bare null or undefined",async()=>{
  const sc=loadScreens({harakat:"always",stage:3}); const {env,spy}=sc, seen=[];
  const check=what=>{ const j=junk(spy.view.body); if(j.length) seen.push(what+": "+j); };
  env.openLesson(UNIT); check("lesson 1"); press(byText(spy.view.body,"Learn the phrases →")); check("lesson 2");
  for(let k=0;k<4;k++){ press(byText(spy.view.body,k<3?"Next →":"Quick check →")); check("lesson step "+k); }
  env.roleplay(UNIT); check("role-play A"); press(byText(spy.view.body,"Your turn →")); check("role-play B");
  for(const card of [sc.card(0,0,0),sc.card(1,2,3),sc.card(2,3,5),sc.card(-1,3,6)]) for(const id of ["u1.1","u1.3","u1.s0"]){ sc.t.S().cards[id]=card; env.startReview(null); check("review "+id+" "+JSON.stringify(card)); }
  sc.items["m.0"]=gulfRow("G="); sc.t.S().cards={"m.0":sc.card(0,0,0)}; env.startReview(null); check("review msa");
  sc.t.S().cards={"u1.1":sc.card(-1,3,6)}; env.audioDrill(); check("drill");
  const me=uiEl("div"); me.id="me"; env.rootEl=me; sc.t.S().cards["u1.1"]=Object.assign(sc.card(-1,3,6),{l:5}); env.renderMe(); if(junk(me).length) seen.push("progress: "+junk(me));
  assert.deepEqual(seen,[]);
});

test("typing boxes: chat and sentence boxes follow the text's direction with autocorrect and autocapitalise off, as attributes; the topic box follows direction",async()=>{
  const sc=loadScreens(), sec=talkOf(sc); sc.env.SAMPLE={json:async()=>({english:"I want coffee",hint:"abi"})};
  const want={dir:"auto",autocapitalize:"off",autocorrect:"off",spellcheck:"false"}, has=(n)=>Object.fromEntries(Object.keys(want).map(k=>[k,n.attrs[k]]));
  sc.env.renderTalk(); assert.deepEqual(has(byId(sec,"chat-input")),want);
  vm.runInContext('talkMode="practice"',sc.env); sc.env.renderTalk(); await tick(); assert.deepEqual(has(byId(sec,"practice-input")),want);
  sc.env.generateUnit(6,null,()=>{}); const topic=byId(sc.spy.view.body,"topic-input"); assert.equal(topic.attrs.dir,"auto"); assert.equal(topic.attrs.autocorrect,undefined);
});
test("redraw: a chat draft survives the Talk tab being drawn again, and sending clears it",async()=>{
  const sc=loadScreens(), sec=talkOf(sc); sc.env.SAMPLE={json:()=>new Promise(()=>{})};
  sc.env.renderTalk(); const inp=byId(sec,"chat-input"); inp.value="شلونك"; inp.oninput();
  sc.env.renderTalk(); assert.equal(byId(sec,"chat-input").value,"شلونك");
  walk(sec).find(n=>n.tag==="form").onsubmit({preventDefault(){}}); sc.env.renderTalk(); assert.equal(byId(sec,"chat-input").value,"");
});
test("redraw: sentence practice keeps its sentence, your answer and your tries, and asks for no new sentence",async()=>{
  const sc=loadScreens(), sec=talkOf(sc); let asks=0, give; sc.env.SAMPLE={json:()=>{ asks++; return new Promise(r=>{ give=r; }); }};
  vm.runInContext('talkMode="practice"',sc.env); sc.env.renderTalk(); sc.env.renderTalk(); // redrawn while the sentence is still coming
  give({english:"I want coffee",hint:"abi"}); await tick(); assert.equal(asks,1); assert.ok(texts(sec).includes("I want coffee"));
  const inp=byId(sec,"practice-input"); inp.value="ابي قهوة"; inp.oninput(); sc.env.renderTalk(); await tick();
  assert.equal(asks,1); assert.ok(texts(sec).includes("I want coffee")); assert.equal(byId(sec,"practice-input").value,"ابي قهوة");
});

// the speech-out section against a fake speechSynthesis. fire: "end" (starts then ends), "start" (starts, never ends), "error", "none" (nothing ever fires)
function loadSpeech({voices=[{lang:"ar-SA"}],engine=true,fire="end",store,quietCancel=false,throwSpeak=false}={}){
  const t=loadUi({store}), env=t.env, note=uiEl("p"), spoken=[], cancels=[], announced=[]; note.hidden=true; let cur=null; env.announce=x=>{ announced.push(x); };
  env.document.createElement=uiEl; env.$=s=>s==="#voice-note"?note:s==="#sync-note"?t.note:null;
  env.SpeechSynthesisUtterance=function(text){ this.text=text; };
  if(engine) env.window.speechSynthesis={getVoices:()=>voices,addEventListener(){},cancel(){ cancels.push(1); if(!quietCancel&&cur&&cur.onerror) cur.onerror({error:"interrupted"}); cur=null; },
    speak(u){ if(throwSpeak) throw new Error("boom"); cur=u; spoken.push(u.text); if(fire==="end"){ u.onstart&&u.onstart(); u.onend(); } else if(fire==="start") u.onstart&&u.onstart(); else if(fire==="error") u.onerror({error:"synthesis-failed"}); }};
  vm.runInContext(cut("const ap=","const SVG=")+cut("const synth=","// ===== speech in")+";this.__tts=x=>{ TTS=x; pickVoices(); }; Object.assign(this,{VOICE_NONE,VOICE_NOAR,VOICE_STALL});",env);
  return {t,env,note,spoken,cancels,announced,run:async()=>{ for(let i=0;i<4;i++){ t.runTimers(); await tick(); } }};
}
test("audio: a voice that never answers is given up on, the queue carries on, and one line says so",async()=>{
  const s=loadSpeech({fire:"none"}); let done; s.env.sayQueue([{text:"هلا"},{pause:400},{text:"زين"}]).then(r=>{ done=r; });
  await s.run(); assert.equal(done,true); assert.deepEqual(s.spoken,["هلا","زين"]);
  assert.equal(s.note.hidden,false); assert.ok(txt(s.note).startsWith(s.env.VOICE_STALL));
  const e=loadSpeech({fire:"error"}); await e.env.say("هلا"); assert.ok(txt(e.note).startsWith(e.env.VOICE_STALL),"an error before it starts is the same");
});
test("audio: a voice that starts is never cut off or reported, and an interrupted line is not a failure",async()=>{
  const s=loadSpeech({fire:"start"}); let done=false; s.env.say("هلا").then(()=>{ done=true; }); await s.run(); assert.equal(done,true); assert.equal(s.note.hidden,true);
  const i=loadSpeech({fire:"none"}); i.env.say("هلا"); i.env.say("زين"); await tick(); assert.equal(i.note.hidden,true,"the second tap interrupted the first");
  const ok=loadSpeech(); await ok.env.say("هلا"); assert.equal(ok.note.hidden,true);
});
test("audio: no speech engine and no Claude voice shows one line at load, and play goes on at once; the claude.ai voice clears it",async()=>{
  const s=loadSpeech({engine:false}); assert.ok(txt(s.note).startsWith(s.env.VOICE_NONE)); await s.env.say("هلا");
  s.env.__tts({speak:async()=>{},stop:async()=>{}}); assert.equal(s.note.hidden,true);
});
test("audio: the Claude voice that never finishes is given up on too (claude.ai build)",async()=>{
  const s=loadSpeech({voices:[]}); s.env.__tts({speak:()=>new Promise(()=>{}),stop:async()=>{}}); let done=false;
  s.env.say("هلا").then(()=>{ done=true; }); await s.run(); assert.equal(done,true); assert.ok(txt(s.note).startsWith(s.env.VOICE_STALL));
});
test("voice notice: Hide keeps it hidden on this device after a reload, and it is not part of progress",async()=>{
  const s=loadSpeech({voices:[{lang:"en-GB"}]}); assert.ok(txt(s.note).startsWith(s.env.VOICE_NOAR)); const before=JSON.stringify(s.t.serialize());
  press(byText(s.note,"Hide")); assert.equal(s.note.hidden,true); assert.equal(s.t.store.get(KEY+"-voice"),"hidden"); assert.equal(JSON.stringify(s.t.serialize()),before);
  const r=loadSpeech({voices:[{lang:"en-GB"}],fire:"none",store:s.t.store}); assert.equal(r.note.hidden,true); r.env.say("هلا"); await r.run(); assert.equal(r.note.hidden,true);
});

// fix round 1
const talkSend=(sec,text)=>{ const f=walk(sec).find(n=>n.tag==="form"); const i=byId(sec,"chat-input"); i.value=text; i.oninput(); return f.onsubmit({preventDefault(){}}); };
const typeIn=(sec,id,text)=>{ const i=byId(sec,id); i.value=text; i.oninput(); return i; };
test("dictation: dictated text reaches the draft, survives a redraw, and a dictation left over from before the redraw writes nowhere",async()=>{
  const sc=loadScreens(), sec=talkOf(sc); sc.env.SAMPLE={json:()=>new Promise(()=>{})}; let stopped=0;
  vm.runInContext("DICT=null",sc.env); sc.env.__dict={start:async()=>{},stop:async()=>{ stopped++; }}; vm.runInContext("DICT=this.__dict",sc.env);
  sc.env.renderTalk(); const old=byId(sec,"chat-input"); walk(sec).find(n=>n.attrs["aria-label"]==="Dictate in Arabic").onclick();
  const sink=vm.runInContext("dictSink",sc.env); sink.final="مرحبا"; sink.update();
  sc.env.renderTalk(); assert.equal(byId(sec,"chat-input").value.trim(),"مرحبا"); assert.equal(stopped,1); assert.equal(vm.runInContext("dictSink",sc.env),null);
  old.value=""; sink.final="مرحبا بك"; sink.update(); assert.equal(old.value,""); assert.equal(byId(sec,"chat-input").value.trim(),"مرحبا");
});
test("dictation: dictated text in the sentence box reaches the practice draft",async()=>{
  const sc=loadScreens(), sec=talkOf(sc); sc.env.SAMPLE={json:async()=>({english:"I want coffee",hint:"abi"})};
  sc.env.__dict={start:async()=>{},stop:async()=>{}}; vm.runInContext("DICT=this.__dict; talkMode='practice'",sc.env);
  sc.env.renderTalk(); await tick(); walk(sec).find(n=>n.attrs["aria-label"]==="Dictate in Arabic").onclick();
  const sink=vm.runInContext("dictSink",sc.env); sink.final="ابي قهوة"; sink.update(); sc.env.renderTalk(); await tick();
  assert.equal(byId(sec,"practice-input").value.trim(),"ابي قهوة");
});
test("scenario buttons: the starter text is the draft even when a reply is still on its way",async()=>{
  const sc=loadScreens(), sec=talkOf(sc); sc.env.SAMPLE={json:()=>new Promise(()=>{})};
  sc.env.renderTalk(); talkSend(sec,"hi"); const form=walk(sec).find(n=>n.tag==="form"); form.requestSubmit=()=>form.onsubmit({preventDefault(){}});
  press(byText(sec,"Order at a café")); sc.env.renderTalk();
  assert.equal(byId(sec,"chat-input").value,"Let's role-play: order at a café. You start.");
});
test("chat errors: a failed send puts the text back and it survives a redraw; Try again does too",async()=>{
  const sc=loadScreens(), sec=talkOf(sc); sc.env.SAMPLE={json:async()=>{ throw new Error("x"); }};
  sc.env.renderTalk(); await talkSend(sec,"hello"); assert.equal(byId(sec,"chat-input").value,"hello"); sc.env.renderTalk(); assert.equal(byId(sec,"chat-input").value,"hello");
  const sc2=loadScreens(), sec2=talkOf(sc2); sc2.env.SAMPLE={json:async()=>({arabic:"زين",translit:"zēn",english:"good",correction:"c",hint:"h"})};
  sc2.env.renderTalk(); await talkSend(sec2,"bad"); assert.equal(byId(sec2,"chat-input").value,"");
  press(byText(sec2,"Try again")); assert.equal(byId(sec2,"chat-input").value,"bad"); sc2.env.renderTalk(); assert.equal(byId(sec2,"chat-input").value,"bad");
});
test("chat errors: a send that fails after a redraw writes to the box on screen, and never over a newer draft",async()=>{
  for(const newer of [null,"newer"]){
    const sc=loadScreens(), sec=talkOf(sc); let fail; sc.env.SAMPLE={json:()=>new Promise((_,rej)=>{ fail=rej; })};
    sc.env.renderTalk(); const sent=talkSend(sec,"hello"); sc.env.renderTalk(); const now=byId(sec,"chat-input"); if(newer) typeIn(sec,"chat-input",newer);
    fail(new Error("x")); await sent; assert.equal(byId(sec,"chat-input"),now); assert.equal(now.value,newer||"hello"); sc.env.renderTalk(); assert.equal(byId(sec,"chat-input").value,newer||"hello");
  }
});
const PRACTICE_OK={verdict:"correct",best:{ar:"ابي قهوة",tr:"abi gahwa"},explanation:"ok"};
test("practice: tries are kept across a redraw, so the second check reveals the answer",async()=>{
  const sc=loadScreens(), sec=talkOf(sc); const replies=[{english:"I want coffee",hint:"abi"},{verdict:"wrong",hint:"h",best:{ar:"ابي قهوة",tr:"abi gahwa"},explanation:"e"}]; let n=0;
  sc.env.SAMPLE={json:async()=>replies[Math.min(n++,1)]}; vm.runInContext('talkMode="practice"',sc.env); sc.env.renderTalk(); await tick();
  typeIn(sec,"practice-input","x"); press(byText(sec,"Check")); await tick(); assert.equal(vm.runInContext("practiceTries",sc.env),1);
  sc.env.renderTalk(); await tick(); assert.equal(vm.runInContext("practiceTries",sc.env),1); assert.ok(!byText(sec,"Next sentence"));
  press(byText(sec,"Check")); await tick(); assert.ok(byText(sec,"Next sentence"));
});
test("practice: a redraw after the answer is shown keeps the answer and its buttons, and asks for nothing new",async()=>{
  const sc=loadScreens(), sec=talkOf(sc); let n=0; sc.env.SAMPLE={json:async()=>n++?PRACTICE_OK:{english:"I want coffee",hint:"abi"}};
  vm.runInContext('talkMode="practice"',sc.env); sc.env.renderTalk(); await tick(); typeIn(sec,"practice-input","ابي قهوة"); press(byText(sec,"Check")); await tick();
  assert.ok(byText(sec,"Next sentence")); sc.env.renderTalk(); await tick();
  assert.equal(n,2); assert.ok(byText(sec,"Next sentence")); assert.ok(byText(sec,"+ Add to my cards")); assert.ok(!byText(sec,"Check")); assert.ok(texts(sec).includes("I want coffee"));
  press(byText(sec,"Next sentence")); await tick(); assert.equal(n,3); assert.ok(!byText(sec,"Next sentence"));
});
test("practice: a redraw while checking keeps Check disabled and shows the result in the box on screen",async()=>{
  const sc=loadScreens(), sec=talkOf(sc); let n=0, give; sc.env.SAMPLE={json:()=>n++?new Promise(r=>{ give=r; }):Promise.resolve({english:"I want coffee",hint:"abi"})};
  vm.runInContext('talkMode="practice"',sc.env); sc.env.renderTalk(); await tick(); typeIn(sec,"practice-input","ابي قهوة"); press(byText(sec,"Check")); await tick();
  sc.env.renderTalk(); await tick(); assert.equal(byText(sec,"Check").disabled,true); assert.ok(texts(sec).includes("Checking…"));
  give(PRACTICE_OK); await tick(); assert.ok(byText(sec,"Next sentence")); assert.equal(n,2);
});
test("start over: the Talk draft, sentence, answer and result are forgotten",()=>{
  const sc=loadScreens(); vm.runInContext('chatDraft="a"; practiceQ={english:"x"}; practiceDraft="b"; practiceTries=1; practiceRes={}; practiceBusy=true;',sc.env); sc.env.resetTalk();
  assert.deepEqual(JSON.parse(vm.runInContext("JSON.stringify([chatDraft,practiceQ,practiceAsk,practiceDraft,practiceTries,practiceRes,practiceBusy])",sc.env)),["",null,null,"",0,null,false]);
  assert.ok(/function startOver\(\)\{[^\n]*\bresetTalk\(\)/.test(main));
});

test("audio: a given-up line is stopped before the next one, on the Claude voice and the device voice, and a line that started is left alone",async()=>{
  const log=[], c=loadSpeech({voices:[]}); c.env.__tts({speak:t=>{ log.push("speak "+t); return new Promise(()=>{}); },stop:async()=>{ log.push("stop"); }}); log.length=0;
  c.env.sayQueue([{text:"هلا"},{text:"زين"}]); await c.run(); await c.run();
  assert.deepEqual(log,["stop","speak هلا","stop","speak زين","stop"],"each given-up line is stopped before the next is spoken"); assert.ok(txt(c.note).startsWith(c.env.VOICE_STALL));
  const d=loadSpeech({fire:"none"}); d.env.say("هلا"); const before=d.cancels.length; await d.run(); assert.equal(d.cancels.length,before+1,"a line that never started is cancelled");
  const st=loadSpeech({fire:"start"}); st.env.say("هلا"); const b2=st.cancels.length; await st.run(); assert.equal(st.cancels.length,b2,"a line that started is not cut off");
});
test("audio: speak, the utterance or the Claude voice throwing ends the part like a failure and the queue still completes",async()=>{
  const a=loadSpeech({throwSpeak:true}); let done; a.env.sayQueue([{text:"هلا"},{text:"زين"}]).then(r=>{ done=r; }); await a.run(); assert.equal(done,true); assert.ok(txt(a.note).startsWith(a.env.VOICE_STALL));
  const b=loadSpeech(); b.env.SpeechSynthesisUtterance=function(){ throw new Error("boom"); }; await b.env.say("هلا"); assert.ok(txt(b.note).startsWith(b.env.VOICE_STALL));
  const c=loadSpeech({voices:[]}); c.env.__tts({speak:()=>{ throw new Error("boom"); },stop:async()=>{}}); await c.env.say("هلا"); assert.ok(txt(c.note).startsWith(c.env.VOICE_STALL));
});
test("audio: a voices-changed event does not clear a didn't-play notice, but still updates the no-voice one",async()=>{
  const s=loadSpeech({fire:"none"}); s.env.say("هلا"); await s.run(); assert.ok(txt(s.note).startsWith(s.env.VOICE_STALL)); s.env.pickVoices(); assert.equal(s.note.hidden,false); assert.ok(txt(s.note).startsWith(s.env.VOICE_STALL));
  const n=loadSpeech({voices:[{lang:"en-GB"}]}); assert.equal(n.note.hidden,false); n.env.__tts({speak:async()=>{},stop:async()=>{}}); assert.equal(n.note.hidden,true);
});
test("audio: after one line in a queue stalls the rest get a short limit and the notice shows once; a new tap starts fresh",async()=>{
  const s=loadSpeech({fire:"none"}); let shown=0; const ap=s.note.append; s.note.append=(...a)=>{ shown++; ap.apply(s.note,a); };
  s.env.sayQueue([{text:"هلا"},{text:"زين"},{text:"شلونك"}]); const ms=()=>[...s.t.timers.values()].map(x=>x.ms);
  assert.ok(ms()[0]>=4000); s.t.runTimers(); await tick();
  assert.deepEqual(ms(),[1500],"the second line waits only the short limit"); await s.run(); assert.equal(shown,1,"one notice, not one per line");
  s.env.say("هلا"); assert.ok(ms().every(x=>x>=4000),"a new play tap gets the full limit again");
});
test("audio: the notice sits in the main page, which a focus view leaves visible",()=>{
  assert.match(html,/<main>\s*<p class="notice" id="voice-note"/); assert.doesNotMatch(html,/body\.focus[^{}]*(main|voice-note)[^{}]*\{[^}]*display:none/);
});
test("voice notice: a Settings row brings hidden notices back",()=>{
  const s=loadSpeech({voices:[{lang:"en-GB"}]}); assert.equal(s.env.voiceRow(),null,"no row while the notice is not hidden");
  press(byText(s.note,"Hide")); let again=0; const row=s.env.voiceRow(()=>{ again++; }); assert.ok(row); assert.ok(txt(row).startsWith("Audio notices are hidden"));
  press(byText(row,"Show them again")); assert.equal(s.t.store.has(KEY+"-voice"),false); assert.equal(s.note.hidden,false); assert.ok(txt(s.note).startsWith(s.env.VOICE_NOAR)); assert.equal(again,1); assert.equal(s.env.voiceRow(),null);
});
test("audio: a line cut by the next tap stays quiet, even when the engine says nothing on cancel, and for an interrupted Claude line",async()=>{
  const s=loadSpeech({fire:"none",quietCancel:true}); s.env.say("هلا"); s.env.stopAudio(); const c0=s.cancels.length; await s.run(); assert.equal(s.note.hidden,true); assert.equal(s.cancels.length,c0,"a stale timer cancels nothing");
  const stops=[], c=loadSpeech({voices:[]}); let rej; c.env.__tts({speak:()=>new Promise((_,r)=>{ rej=r; }),stop:async()=>{ stops.push(1); }});
  c.env.say("هلا"); c.env.stopAudio(); rej({code:"interrupted"}); const n0=stops.length; await c.run(); assert.equal(c.note.hidden,true); assert.equal(stops.length,n0);
});

// a claude.ai voice that reports the documented states: speak() returns a promise the test settles, onState hands the handler over
function fakeVoice({withState=true}={}){ const v={calls:[],stops:0,h:null,pend:[]};
  v.speak=t=>{ v.calls.push(t); return new Promise((res,rej)=>{ v.pend.push({res,rej}); }); }; v.stop=async()=>{ v.stops++; };
  if(withState) v.onState=h=>{ v.h=h; return ()=>{}; }; v.emit=state=>v.h&&v.h({state}); return v; }
test("audio: a claude.ai line that reaches speaking is not reported, and one still speaking at its limit is not cut off or played over",async()=>{
  const s=loadSpeech({voices:[]}), v=fakeVoice(); s.env.__tts(v); let done; s.env.sayQueue([{text:"هلا"},{text:"زين"}]).then(r=>{ done=r; });
  v.emit("starting"); v.emit("speaking"); s.t.runTimers(); await tick();
  assert.deepEqual(v.calls,["هلا"],"the next line waits for the one that is playing"); assert.equal(s.note.hidden,true); assert.equal(v.stops,1,"only the stop that opened the queue");
  v.pend[0].res({playedMs:900}); await tick(); assert.deepEqual(v.calls,["هلا","زين"]); v.emit("starting"); v.emit("speaking"); v.pend[1].res({playedMs:900}); await tick(); assert.equal(done,true); assert.equal(s.note.hidden,true);
});
test("audio: a claude.ai line that never reaches speaking is stopped and reported; a stale speaking event cannot start the next line",async()=>{
  const s=loadSpeech({voices:[]}), v=fakeVoice(); s.env.__tts(v); s.env.say("هلا"); v.emit("starting"); const st=v.stops; s.t.runTimers(); await tick();
  assert.equal(v.stops,st+1); assert.ok(txt(s.note).startsWith(s.env.VOICE_STALL));
  const t=loadSpeech({voices:[]}), w=fakeVoice(); t.env.__tts(w); t.env.say("هلا"); w.emit("starting"); w.emit("speaking"); t.env.say("زين"); w.emit("speaking"); // the old line's event arrives after the new tap
  const s2=w.stops; t.t.runTimers(); await tick(); assert.equal(w.stops,s2+1,"the new line never started"); assert.ok(txt(t.note).startsWith(t.env.VOICE_STALL));
});
test("audio: a claude.ai voice with no onState behaves as before",async()=>{
  const s=loadSpeech({voices:[]}), v=fakeVoice({withState:false}); s.env.__tts(v); s.env.say("هلا"); const st=v.stops; s.t.runTimers(); await tick();
  assert.equal(v.stops,st+1); assert.ok(txt(s.note).startsWith(s.env.VOICE_STALL));
});
test("voice notice: a new notice is announced once and a repeat is not",async()=>{
  const s=loadSpeech({fire:"none"}); assert.deepEqual(s.announced,[]); s.env.say("هلا"); await s.run(); assert.deepEqual(s.announced,[s.env.VOICE_STALL]);
  s.env.say("زين"); await s.run(); assert.equal(s.announced.length,1,"the same notice again is not announced");
});
test("record yourself: Compare plays your recording inside the tap, then the model; a recording that won't play still plays the model",async()=>{
  for(const fails of [false,true]){
    const sc=loadScreens(), {env,spy,t}=sc, audios=[]; let tapping=false;
    Object.assign(env,{policyBlocksMic:()=>false,Blob:class{},URL:{createObjectURL:()=>"blob:1"},
      MediaRecorder:class{ constructor(){ this.state="inactive"; } start(){ this.state="recording"; } stop(){ this.state="inactive"; this.ondataavailable({data:"x"}); this.onstop(); } },
      Audio:class{ constructor(){ this.plays=[]; audios.push(this); } play(){ this.plays.push(tapping); return fails?Promise.reject(new Error("no")):Promise.resolve(); } }});
    env.window.MediaRecorder=env.MediaRecorder; env.navigator.mediaDevices={getUserMedia:async()=>({getTracks:()=>[{stop(){}}]})};
    vm.runInContext(cut("let recBlocked=false","// phone and claude voices"),env);
    const w=env.recordWidget("هلا"); press(walk(w).find(n=>n.tag==="button")); await tick(); t.runTimers();
    tapping=true; press(byText(w,"Compare: you, then the model")); tapping=false;
    assert.deepEqual(audios[0].plays,[true],"played inside the tap"); await tick();
    if(!fails){ assert.deepEqual(spy.queue,[]); audios[0].onended(); } assert.deepEqual(spy.queue.flat(),["هلا"]);
  }
});
test("speech check: caught and missed words differ by underline style, not only colour",()=>{
  const sc=loadScreens(); Object.assign(sc.env,{canListen:()=>true,srListen:cb=>cb({alts:["مع"]})});
  vm.runInContext(cut("function speakWidget","// record yourself"),sc.env);
  const w=sc.env.speakWidget("مع السلامة"); press(byText(w,"Say it"));
  const words=walk(w).filter(n=>n.parent&&/\bwords\b/.test(n.parent.className)); assert.deepEqual(words.map(n=>[txt(n),n.className]),[["مع","hit"],["السلامة","miss"]]);
  assert.ok(texts(w).includes("Underlined with dashes: words it didn't catch. Listen again and say those clearly."));
  assert.match(html,/\.words \.hit\{border-bottom:3px solid var\(--good\)\}/); assert.match(html,/\.words \.miss\{border-bottom:3px dashed var\(--bad\);/);
});

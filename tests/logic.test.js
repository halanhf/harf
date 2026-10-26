// runs the page's pure helpers and data checks under node, no browser needed: node --test tests/
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
vm.runInContext(block("data")+";this.LETTERS=LETTERS;this.DECKS=DECKS;",ctx);
const L=ctx.module.exports;
test("normalize strips vowel marks and unifies letter variants",()=>{
  assert.equal(L.normalizeArabic("كِتَاب"),"كتاب");
  assert.equal(L.normalizeArabic("أَنَا"),"انا");
  assert.equal(L.normalizeArabic("مَدْرَسَة"),"مدرسه");
  assert.equal(L.normalizeArabic("  شُكْرًا!  "),"شكرا");
  assert.equal(L.normalizeArabic("إِنْ شَاءَ اللّٰه"),"ان شاء الله");
});
test("similarity is 1 for the same word with or without vowels, lower for different words",()=>{
  assert.equal(L.similarity("كتاب","كِتَاب"),1);
  assert.ok(L.similarity("كتاب","كتب")<1);
  assert.ok(L.similarity("كتاب","سيارة")<0.4);
  assert.equal(L.similarity("",""),1);
});
test("levenshtein basics",()=>{
  assert.equal(L.levenshtein("abc","abc"),0);
  assert.equal(L.levenshtein("abc","abd"),1);
  assert.equal(L.levenshtein("","abc"),3);
});
test("letter forms: joining letters get four shapes, non-joining get two",()=>{
  assert.deepEqual({...L.letterForms("ب",true)},{isolated:"ب",initial:"بـ",medial:"ـبـ",final:"ـب"});
  assert.deepEqual({...L.letterForms("د",false)},{isolated:"د",initial:"د",medial:"ـد",final:"ـد"});
});
test("schedule: again comes back in a minute, good grows the interval, ease never drops below 1.3",()=>{
  const now=1e12, day=86400000;
  const a=L.schedule({},0,now); assert.equal(a.due,now+60000); assert.equal(a.reps,0);
  const g1=L.schedule({},2,now); assert.equal(g1.due,now+day);
  const g2=L.schedule(g1,2,now); assert.equal(g2.due,now+3*day);
  const g3=L.schedule(g2,2,now); assert.equal(g3.interval,3*2.5);
  let c={}; for(let i=0;i<20;i++) c=L.schedule(c,0,now); assert.equal(c.ease,1.3);
  const e=L.schedule({},3,now); assert.ok(e.interval>g1.interval);
});
test("pickOptions always includes the answer, no duplicates",()=>{
  const pool=["a","b","c","d","e"];
  for(let i=0;i<50;i++){ const o=L.pickOptions("c",pool,4); assert.equal(o.length,4); assert.ok(o.includes("c")); assert.equal(new Set(o).size,4); }
  assert.deepEqual([...L.pickOptions("a",["a","b"],4)].sort(),["a","b"]);
});
test("data: 28 letters, six non-joiners, each example starts with its letter",()=>{
  assert.equal(ctx.LETTERS.length,28);
  assert.deepEqual(ctx.LETTERS.filter(x=>!x[5]).map(x=>x[0]).join(""),"ادذرزو");
  for(const x of ctx.LETTERS){ const first=L.normalizeArabic(x[6])[0]; assert.equal(first,L.normalizeArabic(x[0]),`${x[2]} example ${x[6]}`); }
});
test("data: every deck row has arabic, transliteration and english, no duplicates",()=>{
  const seen=new Set();
  for(const [d,rows] of Object.entries(ctx.DECKS)) for(const r of rows){
    assert.equal(r.length,3,d); assert.match(r[0],/[ء-ي]/); assert.ok(r[1]&&r[2]);
    assert.ok(!seen.has(r[0]),`duplicate ${r[0]}`); seen.add(r[0]);
  }
});

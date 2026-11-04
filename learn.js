/* SAD Beginner Studio
 * All teaching data is provided by learn-content.js.
 * Offline notes/quizzes work without network; Mermaid is optional.
 */
(()=>{"use strict";
const data=window.SAD_COURSE,app=document.getElementById("app");
if(!data||!app){if(app)app.textContent="教材暫時無法載入，請重新整理或返回複習首頁。";return}
const STORE="sad-beginner-course-v1",THEME="sad-beginner-theme";
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let state={passed:{},attempts:{}};
try{const old=JSON.parse(localStorage.getItem(STORE)||"{}");if(old&&typeof old==="object"){state.passed=old.passed&&typeof old.passed==="object"?old.passed:{};state.attempts=old.attempts&&typeof old.attempts==="object"?old.attempts:{}}}catch(e){/* private browsing */}
function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch(e){announce("無法儲存進度：請檢查瀏覽器儲存空間。")}}
const allLessons=data.chapters.flatMap(c=>c.lessons),total=allLessons.length;
const findChapter=n=>data.chapters.find(c=>c.id===Number(n));
const findLesson=id=>allLessons.find(l=>l.id===id);
const lessonChapter=id=>findChapter(id.split("-")[0]);
const completed=()=>allLessons.filter(l=>!!state.passed[l.id]).length;
const firstUnfinished=()=>allLessons.find(l=>!state.passed[l.id])||allLessons[0];
const pc=(a,b)=>b?Math.round(a/b*100):0;
const progress=(a,b)=>'<div class="progress" role="progressbar" aria-label="課程完成進度" aria-valuenow="'+a+'" aria-valuemin="0" aria-valuemax="'+b+'"><i style="width:'+pc(a,b)+'%"></i></div>';
const button=(title,route,extra="")=>'<button type="button" class="btn '+extra+'" data-route="'+E(route)+'">'+E(title)+'</button>';
const announcement=document.getElementById("announce");
function announce(s){if(announcement)announcement.textContent=s}
function route(){return decodeURIComponent(location.hash.replace(/^#/,""))||"home"}
function navigate(to){const dest=String(to||"home");if(location.hash.slice(1)===dest){render();window.scrollTo(0,0)}else location.hash=dest}
function jump(to){navigate(to)}
function linkToLesson(l){return "lesson-"+l.id}
function routeName(r){return r==="case"||r.startsWith("case-")?"case":r==="glossary"?"glossary":"home"}
function sectionTitle(name,desc){return '<div class="section-head"><div><h2>'+E(name)+'</h2><p>'+E(desc)+'</p></div></div>'}
function card(text,body){return '<section class="card"><h3>'+E(text)+'</h3>'+body+'</section>'}
function breadcrumbs(items){return '<nav class="crumbs" aria-label="目前位置">'+items.map((x,i)=>i===items.length-1?'<strong>'+E(x.label)+'</strong>':'<button type="button" data-route="'+E(x.route)+'">'+E(x.label)+'</button> <span aria-hidden="true">›</span>').join(" ")+'</nav>'}
function chapterCards(){return data.chapters.map(c=>{const n=c.lessons.filter(l=>state.passed[l.id]).length;
 return '<article class="card chapter-card"><div class="chapter-top"><span class="chapter-num">'+String(c.id).padStart(2,"0")+'</span><div><h3>'+E(c.title)+'</h3><p class="small">'+E(c.en)+'</p></div></div><p>'+E(c.lead)+'</p><div class="chapter-progress">'+progress(n,c.lessons.length)+'<span class="small muted">'+n+'/'+c.lessons.length+'</span></div>'+button(n===c.lessons.length?"重新複習":"進入本章","chapter-"+c.id)+'</article>'
}).join("")}
function home(){
const done=completed(),next=firstUnfinished();
return '<section class="hero"><div><div class="eyebrow">BEGINNER PATH · CH1–CH5</div><h1>第一次學系統分析與設計？<br>從這裡開始。</h1><p>用生活情境理解概念，跟著「大學選課系統」學需求、功能、結構與行為模型。每堂課都有小測驗與回饋，不需要先讀過教科書。</p><div class="actions">'+button(done?"繼續："+next.title:"從第一堂課開始",linkToLesson(next),"primary")+button("查看五階段案例","case-1")+'</div></div><div class="hero-summary"><div class="eyebrow">YOUR MASTERY</div><strong>'+done+' / '+total+'</strong><p>通過理解題的小課程（與單純閱讀進度分開）</p>'+progress(done,total)+'<div class="small" style="margin-top:10px">Ch1 → Ch2 → Ch3 → Ch4 → Ch5</div></div></section>'+
'<div class="stats-grid">'+
'<div class="card stat-card"><span class="muted small">課程單元</span><strong>'+total+'</strong><span class="small muted">循序漸進，從零開始</span></div>'+
'<div class="card stat-card"><span class="muted small">中英術語</span><strong>'+data.glossary.length+'</strong><span class="small muted">可搜尋與依章節篩選</span></div>'+
'<div class="card stat-card"><span class="muted small">跨章應用</span><strong>5 站</strong><span class="small muted">一套大學選課系統案例</span></div></div>'+
'<div class="callout"><h3>新手如何使用這個網站？</h3><div class="path">'+
'<div class="path-card"><b>01 情境</b><span>先知道這個問題為何重要</span></div>'+
'<div class="path-card"><b>02 概念</b><span>白話理解，再認識英文術語</span></div>'+
'<div class="path-card"><b>03 操作</b><span>依步驟套用到選課系統</span></div>'+
'<div class="path-card"><b>04 測驗</b><span>理解題答對才算完成</span></div></div></div>'+
sectionTitle("完整學習地圖","先學習 Ch1 的全貌，再逐步建立系統分析模型。")+
'<div class="chapter-grid">'+chapterCards()+'</div>'+
'<div class="callout"><h3>◎ 實際動手畫 UML</h3><p>完成 Ch3–Ch5 的概念後，進入互動練習室拖放元件，練習 Use-Case、Activity、Class、Sequence Diagram。</p><a class="btn primary" href="uml-lab.html">開始 UML 圖形挑戰 →</a></div>'+
'<div class="callout"><h3>從同一個案例理解全部章節</h3><p>我們會反覆使用「大學選課系統」：先定義問題，再寫需求、畫功能模型，找出類別，最後確認物件的訊息與狀態。</p><div class="actions">'+button("探索五個案例階段","case-1")+button("查詢專有名詞","glossary")+'</div><p class="source">本教室依 2026 年課堂 Ch1–Ch5 的主題組織。選課案例、例題和圖形是本站的教學改編，不是官方教師版解答。期末設計延伸及 113 考古題仍在原複習網站。</p></div>';
}
function chapterPage(c){
const done=c.lessons.filter(l=>state.passed[l.id]).length;
return breadcrumbs([{label:"學習地圖",route:"home"},{label:"Ch"+c.id+" · "+c.title}])+
'<section class="card lesson-head"><span class="pill">CHAPTER '+c.id+'</span><h1>'+E(c.title)+'</h1><p><strong>'+E(c.en)+'</strong></p><p class="chapter-summary">'+E(c.lead)+'</p><p><strong>學完應該做到：</strong>'+E(c.outcome)+'</p>'+progress(done,c.lessons.length)+'<p class="small muted">已掌握 '+done+' / '+c.lessons.length+' 堂課。每堂課需正確完成理解測驗。</p></section>'+
sectionTitle("本章課程","依順序閱讀，也可以自由選擇。")+
'<div class="chapter-list">'+c.lessons.map((l,i)=>'<button type="button" class="lesson-list-item" data-route="'+linkToLesson(l)+'"><span><strong>'+c.id+'.'+(i+1)+' '+E(l.title)+'</strong><small>'+E(l.topic)+'</small></span><span class="'+(state.passed[l.id]?"finished":"muted")+'">'+(state.passed[l.id]?"✓ 已掌握":"開始學習 →")+'</span></button>').join("")+'</div>'+
'<div class="callout"><h3>本章的選課系統案例</h3><p>'+E(data.cases[c.id-1].problem)+'</p>'+button("到案例練習室","case-"+c.id)+'</div>';
}
function sidebar(c,current){
const n=c.lessons.filter(l=>state.passed[l.id]).length;
return '<aside class="card sidebar"><h3>Ch'+c.id+' · '+E(c.title)+'</h3><p class="small muted chapter-mini">小節測驗完成 '+n+' / '+c.lessons.length+'</p><div>'+c.lessons.map((l,i)=>'<button type="button" '+(l.id===current?'class="selected" aria-current="page"':'')+' data-route="'+linkToLesson(l)+'">'+c.id+'.'+(i+1)+' '+E(l.title)+(state.passed[l.id]?'<span class="done">✓</span>':'')+'</button>').join("")+'</div><hr style="border:0;border-top:1px solid var(--border)"><button type="button" data-route="chapter-'+c.id+'">← 回本章總覽</button></aside>';
}
function diagram(code){
return '<section class="diagram-wrap"><p class="small muted">圖形示意（本站原創教學簡化版）</p><div class="mermaid">'+E(code)+'</div><details><summary>查看 Mermaid 圖形原始碼</summary><pre>'+E(code)+'</pre></details><p class="small muted diagram-note">若圖形無法載入，仍可查看上方的 Mermaid 原始碼。</p></section>';
}
function quizPanel(l){
const was=state.attempts[l.id],passed=!!state.passed[l.id];
return '<section class="card lesson-card quiz-panel" id="quiz-panel" aria-label="理解檢測"><span class="pill">CHECK YOUR UNDERSTANDING</span><h2>你真的理解了嗎？</h2><p class="lesson-cue">'+E(l.quiz.q)+'</p><div class="quiz-options">'+l.quiz.choices.map((choice,i)=>'<button type="button" class="quiz-choice '+(passed&&i===l.quiz.answer?"correct":!passed&&was&&was.last===i?"incorrect":"")+'" data-quiz="'+l.id+'" data-choice="'+i+'" '+(passed?'disabled':'')+'><span class="letter">'+String.fromCharCode(65+i)+'</span><span>'+E(choice)+'</span></button>').join("")+'</div>'+
(passed?'<div class="quiz-feedback ok" role="status"><strong>✓ 答對！本課已標記「已掌握」</strong><p>'+E(l.quiz.why)+'</p></div>':was?'<div class="quiz-feedback no" role="status"><strong>還沒答對，再試一次。</strong><p>提示：'+E(l.pitfall)+'</p></div>':'<p class="small muted">選擇答案即可獲得回饋，答對後會自動記錄完成。</p>')+'</section>';
}
function lessonPage(l){
const c=lessonChapter(l.id),ix=c.lessons.findIndex(x=>x.id===l.id),previous=ix>0?c.lessons[ix-1]:null,next=ix<c.lessons.length-1?c.lessons[ix+1]:data.chapters[c.id]?.lessons[0]||null;
const matches=data.glossary.filter(t=>t.ch===c.id&&(l.topic.toLowerCase().includes(t.en.toLowerCase())||l.definition.toLowerCase().includes(t.en.toLowerCase()))).slice(0,5);
const related=matches.length?'<div class="subnav"><span class="small muted">本課相關術語：</span>'+matches.map(t=>'<button type="button" class="btn small" data-term="'+E(t.en)+'">'+E(t.en)+'</button>').join("")+'</div>':"";
return breadcrumbs([{label:"學習地圖",route:"home"},{label:"Ch"+c.id+" "+c.title,route:"chapter-"+c.id},{label:l.title}])+
'<div class="content-layout">'+sidebar(c,l.id)+'<div class="lesson-content"><section class="card lesson-head"><span class="pill">CH'+c.id+' · LESSON '+(ix+1)+' / '+c.lessons.length+'</span><h1>'+E(l.title)+'</h1><p><strong>'+E(l.topic)+'</strong></p><p class="small muted">這是一步步學習的入門教材。進階細節可在整合講義中延伸閱讀。</p>'+related+'</section>'+
'<section class="card lesson-card"><span class="route-label">01 · WHY</span><h2>為什麼需要學這個？</h2><p class="lesson-cue">'+E(l.why)+'</p></section>'+
'<section class="card lesson-card"><span class="route-label">02 · WHAT</span><h2>白話理解核心概念</h2><p>'+E(l.definition)+'</p></section>'+
'<section class="card lesson-card"><span class="route-label">03 · HOW</span><h2>照著步驟思考</h2><ol>'+l.steps.map(s=>'<li>'+E(s)+'</li>').join("")+'</ol></section>'+
'<section class="card lesson-card"><span class="route-label">04 · APPLY</span><h2>套進大學選課系統</h2><div class="example">'+E(l.example)+'</div>'+ (l.diagram?diagram(l.diagram):"")+'</section>'+
'<section class="card lesson-card"><span class="route-label">05 · PITFALL</span><h2>最容易混淆的地方</h2><div class="tip">'+E(l.pitfall)+'</div><p class="source">對應範圍：'+E(l.source)+'。本站的說明、例題與圖形為教學整理與改編，非逐字引述講義。</p></section>'+
quizPanel(l)+
'<div class="lesson-actions"><div>'+(previous?button("← 上一課",linkToLesson(previous)) : button("← 回章節","chapter-"+c.id))+'</div><div>'+button(next?"下一課 →":"完成所有入門課程 →",next?linkToLesson(next):"case-5","primary")+'</div></div>'+
(c.id>=3?'<div class="callout"><h3>換你動手畫 UML</h3><p>把這章的概念用拖放圖形與逐步檢查練習一次。</p><a class="btn" href="uml-lab.html#'+(c.id===3?"usecase":c.id===4?"class":"sequence")+'">進入 UML 練習室 →</a></div>':"")+
'<div class="callout"><strong>還想看完整教授課堂資料？</strong><p class="small muted">原本網站的 Ch'+c.id+' 整合講義有更深入的理論、投影片對照和考前練習。</p><a href="index.html">前往整合教材與模擬考 →</a></div>'+
'</div></div>';
}
function casePage(n){
const step=data.cases[n-1]||data.cases[0];
return breadcrumbs([{label:"學習地圖",route:"home"},{label:"跨章專題：大學選課系統"}])+
'<section class="card lesson-head"><span class="pill">END-TO-END CASE STUDY</span><h1>從一個問題，完成五章系統分析</h1><p>同一個故事會經歷需求、功能、結構、行為建模。先看每章的產出物，再回到課堂深入學習。</p></section>'+
'<nav class="case-tabs" aria-label="專題五個階段">'+data.cases.map(x=>'<button class="case-tab '+(x.ch===n?"active":"")+'" data-route="case-'+x.ch+'" '+(x.ch===n?'aria-current="step"':'')+'>Ch'+x.ch+' · '+["業務問題","需求","功能","結構","行為"][x.ch-1]+'</button>').join("")+'</nav>'+
'<section class="card lesson-card"><span class="pill">CASE '+n+' / 5</span><h2>'+E(step.title)+'</h2><p class="lesson-cue">'+E(step.problem)+'</p><div class="checkpoints"><strong>要回答的問題：</strong><p>'+E(step.problem)+'</p></div>'+
'<h3>本階段的示範成果</h3><div class="case-artifact">'+E(step.artifact)+'</div>'+
(step.diagram?diagram(step.diagram):"")+
'<div class="tip"><strong>回頭想想：</strong>'+E(step.thinking)+'</div>'+
'<p class="source">本系列為配合 2026 課堂 Ch1–Ch5 所設計的簡化選課平台案例；不是正式完整系統規格，也不是教師提供的標準答案。</p></section>'+
'<div class="lesson-actions">'+(n>1?button("← 上一階段","case-"+(n-1)):button("← 回學習地圖","home"))+
(n<5?button("下一階段 →","case-"+(n+1),"primary"):button("回到課程總覽","home","primary"))+'</div>'+
'<section class="callout"><h3>連結到本章學習</h3><p>想知道這個階段的產出物如何推導？先完成 Ch'+n+' 的教學，再回來檢查專題。</p>'+button("打開 Ch"+n+" 完整教學","chapter-"+n)+(n>=3?' <a class="btn" href="uml-lab.html#'+(n===3?"usecase":n===4?"class":"sequence")+'">練習本章 UML →</a>':"")+'</section>';
}
let termFilter="",termChapter="all";
function glossaryResults(){
const q=termFilter.trim().toLocaleLowerCase();
const matched=data.glossary.filter(t=>(termChapter==="all"||t.ch===Number(termChapter))&&(!q||[t.en,t.zh,t.meaning,t.example].some(v=>v.toLocaleLowerCase().includes(q))));
return '<div class="section-head"><h2>搜尋結果</h2><span class="small muted">'+matched.length+' 個術語</span></div>'+
(matched.length?'<div class="term-grid">'+matched.map(t=>'<article class="card term-card"><span class="pill">CH'+t.ch+'</span><h3>'+E(t.en)+'</h3><div class="term-zh">'+E(t.zh)+'</div><p>'+E(t.meaning)+'</p><p class="small muted"><strong>例：</strong>'+E(t.example)+'</p></article>').join("")+'</div>':'<div class="card empty">找不到符合的術語，試試英文縮寫或中文關鍵字。</div>');
}
function glossaryPage(){
return breadcrumbs([{label:"學習地圖",route:"home"},{label:"雙語術語字典"}])+
'<section class="card lesson-head"><span class="pill">BILINGUAL GLOSSARY</span><h1>中英術語字典</h1><p>快速查詢 UML、Requirements、Class、State Machine 等概念，並用選課系統例子理解。</p></section>'+
'<section class="search-bar" aria-label="搜尋與篩選術語"><input id="termSearch" type="search" autocomplete="off" placeholder="搜尋 Actor、類別、非功能需求…" value="'+E(termFilter)+'" aria-label="搜尋術語"><select id="termChapter" aria-label="依章節篩選"><option value="all">全部章節</option>'+data.chapters.map(c=>'<option value="'+c.id+'" '+(termChapter===String(c.id)?"selected":"")+'>Ch'+c.id+' '+E(c.title)+'</option>').join("")+'</select></section>'+
'<section id="termResults" aria-live="polite">'+glossaryResults()+'</section>';
}
function updateQuiz(id,choice){
const l=findLesson(id);
if(!l||state.passed[id]||!(choice>=0&&choice<l.quiz.choices.length))return;
const right=choice===l.quiz.answer;
state.attempts[id]={last:choice,tries:(state.attempts[id]?.tries||0)+1};
if(right)state.passed[id]=true;
save();
const region=document.getElementById("quiz-panel");
if(region){region.outerHTML=quizPanel(l)}
announce(right?"答對："+l.title+"，已記錄完成。":"尚未答對，請參考提示再試一次。");
}
let mermaid;
async function hydrateDiagrams(){
const els=[...document.querySelectorAll(".diagram-wrap .mermaid")];if(!els.length)return;
const current=els.slice();
try{
 if(!mermaid){const m=await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs");mermaid=m.default;mermaid.initialize({startOnLoad:false,securityLevel:"strict",theme:"default"})}
 const visible=current.filter(x=>x.isConnected&&!x.dataset.processed);
 if(visible.length)await mermaid.run({nodes:visible});
}catch(err){
 current.forEach(el=>{if(!el.isConnected)return;const p=el.parentElement.querySelector(".diagram-note");if(p)p.textContent="圖形暫時無法顯示，請展開下方的 Mermaid 原始碼查看模型。";el.style.whiteSpace="pre-wrap"});
}
}
function render(){
let r=route(),out;
const lessonMatch=r.match(/^lesson-([1-5]-\d+)$/),chapterMatch=r.match(/^chapter-([1-5])$/),caseMatch=r.match(/^case-([1-5])$/);
if(r==="home")out=home();
else if(r==="glossary")out=glossaryPage();
else if(r==="case")out=casePage(1);
else if(caseMatch)out=casePage(Number(caseMatch[1]));
else if(chapterMatch&&findChapter(chapterMatch[1]))out=chapterPage(findChapter(chapterMatch[1]));
else if(lessonMatch&&findLesson(lessonMatch[1]))out=lessonPage(findLesson(lessonMatch[1]));
else{out=home();r="home"}
app.innerHTML=out;
document.querySelectorAll("[data-nav]").forEach(el=>{let on=el.dataset.nav===routeName(r);el.classList.toggle("active",on);if(on)el.setAttribute("aria-current","page");else el.removeAttribute("aria-current")});
document.title=(r==="home"?"學習地圖":r==="glossary"?"術語字典":r.startsWith("case")?"選課系統跨章案例":lessonMatch&&findLesson(lessonMatch[1])?findLesson(lessonMatch[1]).title:chapterMatch?findChapter(chapterMatch[1]).title:"SAD 自學教室")+"｜SAD 零基礎自學教室";
hydrateDiagrams();
}
document.addEventListener("click",e=>{
const routeButton=e.target.closest("[data-route]");
if(routeButton){jump(routeButton.dataset.route);return}
const nav=e.target.closest("[data-nav]");if(nav){jump(nav.dataset.nav);return}
const term=e.target.closest("[data-term]");if(term){termFilter=term.dataset.term;termChapter="all";jump("glossary");return}
const q=e.target.closest("[data-quiz][data-choice]");if(q){updateQuiz(q.dataset.quiz,Number(q.dataset.choice))}
});
document.addEventListener("input",e=>{
if(e.target.id==="termSearch"){termFilter=e.target.value;const box=document.getElementById("termResults");if(box)box.innerHTML=glossaryResults()}
});
document.addEventListener("change",e=>{
if(e.target.id==="termChapter"){termChapter=e.target.value;const box=document.getElementById("termResults");if(box)box.innerHTML=glossaryResults()}
});
window.addEventListener("hashchange",()=>{render();window.scrollTo(0,0)});
const themeBtn=document.getElementById("themeToggle");
let dark=false;try{dark=localStorage.getItem(THEME)==="dark"}catch(e){}
function paintTheme(){document.documentElement.dataset.theme=dark?"dark":"light";if(themeBtn){themeBtn.textContent=dark?"☀":"☾";themeBtn.setAttribute("aria-label",dark?"切換淺色模式":"切換深色模式")}}
themeBtn?.addEventListener("click",()=>{dark=!dark;try{localStorage.setItem(THEME,dark?"dark":"light")}catch(e){}paintTheme()});
paintTheme();render();
window.SAD_LEARN_TEST={getState:()=>JSON.parse(JSON.stringify(state)),getTotal:()=>total,getChapterCounts:()=>data.chapters.map(c=>c.lessons.length)};
})();

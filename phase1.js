/* Phase 1: learning progress, guided navigation, and balanced mock-exam coverage.
   Incremental enhancement of the existing 2026 course site. */
(function phase1(){
"use strict";
if(typeof DATA==="undefined"||typeof renderHome!=="function"||typeof renderChapters!=="function")return;
const extraQuestions=[
{id:39,chapter:4,type:"tf",points:2,question:"In a UML Class Diagram, generalization represents an is-a relationship, and the hollow triangle points to the more general class.",options:["True","False"],answer:0,en:"Generalization connects a specialized class to its superclass, which is at the hollow triangle end.",zh:"泛化是 is-a 關係；空心三角形箭頭指向父類別（較一般的類別）。"},
{id:40,chapter:4,type:"choice",points:2,question:"Which UML relationship best expresses that an Undergraduate is a Student?",options:["Association","Aggregation","Generalization","Composition"],answer:2,en:"An Undergraduate is a kind of Student, so use generalization, not a part-of relation.",zh:"Undergraduate 是 Student 的一種，因此使用 Generalization（泛化／繼承）。"},
{id:41,chapter:4,type:"choice",points:2,question:"Which three elements are the core of a CRC card?",options:["Class, Responsibility, Collaborator","Class, Relationship, Constraint","Create, Read, Change","Component, Role, Connection"],answer:0,en:"CRC stands for Class–Responsibility–Collaboration. Cards help discover responsibilities and interacting classes.",zh:"CRC 指 Class、Responsibility、Collaboration（類別、責任、協作者）。"},
{id:42,chapter:4,type:"choice",points:2,question:"In a library system, one Member can have many Loan records, but each Loan belongs to exactly one Member. Which multiplicities are appropriate?",options:["Member 0..* — 0..* Loan","Member 1 — 0..* Loan","Member 1 — 1 Loan","Member 0..1 — 1 Loan"],answer:1,en:"Each Loan links to exactly one Member; a Member may have zero or many Loan records.",zh:"每筆 Loan 都屬於一位 Member；一位 Member 可以有 0 到多筆 Loan。"},
{id:43,chapter:4,type:"short",points:4,question:"Explain the difference between a Class and an Object, and provide a concrete example.",answer:"A class is a template defining attributes and operations. An object is an instance of that class. Example: Student is a class; a particular student with ID S001 is an object.",en:"Distinguish a reusable class definition from a specific instance with concrete values.",zh:"Class 是類別範本；Object 是類別的具體實例。例：Student 類別與學號 S001 的某位學生。",keywords:["class","object","example"]},
{id:44,chapter:4,type:"diagram",points:5,question:"Draw a Class Diagram for a course-registration system with Student, Course and Enrollment. Show that each Enrollment belongs to one Student and one Course; each Student and Course may link to many Enrollments. Use Mermaid classDiagram syntax.",answer:"classDiagram\n class Student\n class Course\n class Enrollment\n Student \"1\" -- \"0..*\" Enrollment : registers\n Course \"1\" -- \"0..*\" Enrollment : contains",en:"Use three classes and multiplicities. The Enrollment record models a student's registration in one course.",zh:"類別為 Student、Course、Enrollment。每筆 Enrollment 對應一名學生及一門課，雙方均可有多筆 Enrollment。",diagramKind:"class",diagramKeys:["classDiagram","Student","Course","Enrollment","0..*"]},
{id:45,chapter:5,type:"tf",points:2,question:"A Behavioral State Machine primarily models how the state of an important object changes in response to events.",options:["True","False"],answer:0,en:"State machines focus on one object's states and transitions, rather than message order between multiple objects.",zh:"State Machine 著重重要物件的狀態與狀態轉移，不等同 Sequence Diagram。"},
{id:46,chapter:5,type:"choice",points:2,question:"Which UML diagram emphasizes the time ordering of messages exchanged between objects?",options:["Class Diagram","Object Diagram","Sequence Diagram","Use-Case Diagram"],answer:2,en:"Sequence diagrams show time-ordered messages; communication diagrams focus on object links and message flow.",zh:"Sequence Diagram 著重訊息的時間順序；Communication Diagram 較重視物件間的互動連結。"},
{id:47,chapter:5,type:"choice",points:2,question:"In the course notation for a Sequence Diagram, how is a return message typically displayed?",options:["Solid line with a hollow triangle","Dashed arrow with a returned value","Diamond connected to a class","Actor outside a system boundary"],answer:1,en:"Operation calls use solid arrows, while returns are conventionally displayed as dashed arrows.",zh:"循序圖中呼叫訊息常用實線箭頭，回傳值通常以虛線箭頭表示。"},
{id:48,chapter:5,type:"short",points:5,question:"Write out the five operations in CRUDE and explain why a CRUDE matrix is useful when checking object interactions.",answer:"Create, Read, Update, Delete, Execute. A CRUDE matrix cross-checks which classes or objects perform actions for a use case, helping find missing or inconsistent responsibilities and interactions.",en:"CRUDE = Create, Read, Update, Delete, Execute; it helps verify coverage and consistency of object collaboration.",zh:"CRUDE 是 Create、Read、Update、Delete、Execute，用來核對物件的操作與互動是否完整一致。",keywords:["create","read","update","delete","execute"]},
{id:49,chapter:5,type:"diagram",points:5,question:"Draw a State Machine for an Enrollment object: initially Submitted, then Confirmed on approval or Cancelled on rejection; a Confirmed enrollment may later be Cancelled. Use Mermaid stateDiagram-v2 syntax.",answer:"stateDiagram-v2\n [*] --> Submitted\n Submitted --> Confirmed : approved\n Submitted --> Cancelled : rejected\n Confirmed --> Cancelled : withdraw\n Cancelled --> [*]",en:"State transitions describe the changing status of an Enrollment object.",zh:"請畫 Enrollment 的狀態從 Submitted 經核准變成 Confirmed，或經拒絕變成 Cancelled；已確認亦可退出。",diagramKind:"state",diagramKeys:["stateDiagram","Submitted","Confirmed","Cancelled","-->"]},
{id:50,chapter:5,type:"short",points:4,question:"Explain how an instance Sequence Diagram differs from a generic Sequence Diagram. Which type is used in the course exercises?",answer:"An instance sequence diagram describes one use-case scenario, usually the main event flow; a generic sequence diagram can combine multiple scenarios. The 2026 course focuses on instance sequence diagrams.",en:"Instance diagrams represent one executable path; generic diagrams can capture alternatives. The lecture specifies instance diagrams for exercises.",zh:"Instance Sequence Diagram 只呈現某一情境（常為主要事件流程）；Generic Diagram 可呈現多種情境。本課程練習採 Instance 類型。",keywords:["instance","generic","scenario"]}
];
const existing=new Set(DATA.mock.map(q=>q.id));
extraQuestions.forEach(q=>{if(!existing.has(q.id))DATA.mock.push(q)});
if(typeof RULE_SYNONYMS==="object"){
Object.assign(RULE_SYNONYMS,{
"object":["物件","實例"],
"instance":["實例","單一情境"],
"generic":["一般性","通用"],
"scenario":["情境","事件流程"],
"create":["建立","新增"],
"read":["讀取","查詢"],
"update":["更新","修改"],
"delete":["刪除"],
"execute":["執行"]
});
}
const contentName={1:"System Development & SA&D",2:"Requirements Determination",3:"Functional Modeling",4:"Structural Modeling",5:"Behavioral Modeling"};
const originalHome=renderHome;
renderHome=function(){
const total=DATA.chapters.reduce((n,c)=>n+c.topics.length,0),done=DATA.chapters.reduce((n,c)=>n+c.topics.filter((_,i)=>state.seen[c.id+"-"+i]).length,0),resume=DATA.chapters.find(c=>c.topics.some((_,i)=>!state.seen[c.id+"-"+i]))?.id||1;
const cards=DATA.chapters.map(c=>{
const read=c.topics.filter((_,i)=>state.seen[c.id+"-"+i]).length,percent=Math.round(read/c.topics.length*100);
return `<article class="card phase1-chapter-card"><div class="phase1-chapter-heading"><span class="phase1-number">CH${c.id}</span><div><strong>${E(contentName[c.id]||c.title)}</strong><div class="small muted">${E(c.subtitle)}</div></div></div><div class="phase1-progressline"><div class="progress"><i style="width:${percent}%"></i></div><span class="small muted">${read}/${c.topics.length} 已閱讀</span></div><button class="btn phase1-link" onclick="openChapter(${c.id})">學習這一章 →</button></article>`
}).join("");
return `<section class="phase1-hero"><span class="eyebrow">SAD LEARNING STUDIO · 2026</span><h1>從零開始學習系統分析與設計</h1><p>先理解企業需求，再一步步學會需求分析、功能模型、結構模型與行為模型。教材以 2026 課堂 Ch1–Ch5 為主，考前練習與設計延伸另外整理。</p><div class="phase1-hero-actions"><button class="btn primary" onclick="openChapter(${resume})">▶ ${done?"繼續學習":"從 Ch1 開始學習"}</button><button class="btn" onclick="navigate('mock')">期中模擬練習</button></div></section>
<section class="phase1-stats">${stat("已閱讀小節",done+" / "+total,"閱讀勾選，不代表測驗掌握")}${stat("學習進度",pct(done,total)+"%","可在各章勾選已閱讀")}${stat("期中練習題",DATA.mock.length,"Ch4、Ch5 已補強")}${stat("目前範圍","Ch1–Ch5","以 2026 課堂投影片為準")}</section>
<div class="sectiontitle"><h2>依照課程順序學習</h2><span class="small muted">推薦先從 Ch1 開始</span></div>
<section class="phase1-chapter-grid">${cards}</section>
<section class="phase1-home-bottom"><div class="card"><h3>⚡ 今日快速檢測</h3><p class="small muted">選三道練習題，確認閱讀後能不能辨認概念。</p><div id="quickBox"></div><button class="btn ghost" onclick="newQuick()">換三題 ↻</button></div>
<div class="card"><h3>其他學習工具</h3><p>想準備考試？可切換至模擬試卷、期末設計延伸或 113 年期末考古題。</p><p><a href="final-review.html">期末速記與重點整理</a></p><p><a href="past-exam-113.html">113 年期末原卷逐題解析</a></p><p class="small muted">補充：期末延伸主題不是 2026 正式 Ch1–Ch5 章次。課本章號與課堂投影片也不完全相同。</p></div></section>`;
};
const originalChapters=renderChapters;
function panel(ch){
const c=DATA.chapters[ch-1];if(!c)return"";
const done=c.topics.filter((_,i)=>state.seen[ch+"-"+i]).length,pc=pct(done,c.topics.length);
return `<section class="card phase1-reading-panel" aria-label="本章閱讀進度"><div class="phase1-reading-top"><div><div class="pill">Ch${ch} Learning Checklist</div><h3>本章閱讀清單</h3><p class="small muted">完成一個主題後勾選「已閱讀」。這是閱讀紀錄，不能取代理解測驗。</p></div><div id="phase1-ch-progress" class="phase1-ch-count" aria-live="polite">${done} / ${c.topics.length}</div></div><div class="progress" aria-label="本章已閱讀百分比"><i id="phase1-ch-progress-bar" style="width:${pc}%"></i></div><div class="phase1-read-grid">${c.topics.map((t,i)=>`<label class="phase1-read-item"><input type="checkbox" ${state.seen[ch+"-"+i]?"checked":""} onchange="setStudyTopicProgress(${ch},${i},this.checked)"><span><b>${ch}.${i+1}</b> ${E(t.title)}</span></label>`).join("")}</div></section>`;
}
window.setStudyTopicProgress=function(ch,i,checked){
const c=DATA.chapters[ch-1];if(!c||!c.topics[i])return;
state.seen[ch+"-"+i]=Boolean(checked);
save();
const read=c.topics.filter((_,j)=>state.seen[ch+"-"+j]).length;
const cnt=document.getElementById("phase1-ch-progress"),bar=document.getElementById("phase1-ch-progress-bar");
if(cnt)cnt.textContent=read+" / "+c.topics.length;
if(bar)bar.style.width=pct(read,c.topics.length)+"%";
};
renderChapters=function(){
let html=originalChapters(),sectionCount=0,links=[];
html=html.replace(/<section class="sad-md-card"><h2>([\s\S]*?)<\/h2>/g,(whole,heading)=>{
const id="phase1-sec-"+chapter+"-"+sectionCount++;
links.push({id,title:heading.replace(/<[^>]+>/g,"")});
return whole.replace('class="sad-md-card"','class="sad-md-card" id="'+id+'"');
});
if(links.length){
const toc=`<nav class="phase1-toc" aria-label="本章內容目錄"><strong>快速跳到：</strong>${links.map(x=>`<a href="#${x.id}">${x.title}</a>`).join("")}</nav>`;
html=html.replace('<div class="full-lesson">','<div class="full-lesson">'+toc);
}
html=html.replace(/(<div class="toolbar">[\s\S]*?<\/div>)/, '$1'+panel(chapter));
return html;
};
const originalMock=renderMock;
renderMock=function(){
const n=DATA.mock.length;
return originalMock().replace(/38 questions/g,n+" questions").replace(/Q1–Q38/g,"Q1–Q"+n)
.replace(/Q1–Q21 True\/False；Q22–Q38 含 Multiple Choice、Matching 和 Written Explanations、UML Diagramming。/g,"題型包含 True/False、Multiple Choice、Matching、簡答及 UML Diagramming；Ch4–Ch5 已新增專屬練習題。")
.replace(/\/38\b/g,"/"+n);
};
const labels={home:"⌂ 學習首頁",chapters:"▤ 章節教材 Ch1–Ch5","final-depth":"◇ 設計延伸",mock:"◷ 期中模擬考"};
Object.entries(labels).forEach(([k,value])=>{const e=document.querySelector(`[data-tab="${k}"]`);if(e)e.textContent=value});
const final=document.querySelector('a[href="final-review.html"]'),past=document.querySelector('a[href="past-exam-113.html"]');
if(final)final.textContent="✦ 期末速記";
if(past)past.textContent="✎ 113 期末考古題";
const brand=document.querySelector(".brand");if(brand){const textNodes=[...brand.childNodes].filter(n=>n.nodeType===3);if(textNodes.length)textNodes[0].textContent=" SAD 自學教室 ";}
if(typeof render==="function")render();
})();

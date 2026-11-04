/* Integrate existing lecture-slide crosschecks, teacher handwriting notes, and
 * topic-specific deep dives into the corresponding chapter reading sections.
 * Preserves the original text and source-page labels; there is no standalone
 * 'expand entire old textbook and handwriting archive' area. */
(function(){
"use strict";
const mapParts={
1:{1:0,2:2,3:2,4:1,5:1,6:1,7:3,8:4},
2:{1:0,2:2,3:2,4:2,5:2,6:1,7:3,8:3,9:4},
3:{1:0,2:2,3:2,4:2,5:2,6:2,7:3,8:2,9:3,10:3,11:4},
4:{1:0,2:1,3:1,4:2,5:2,6:2,7:2,8:4,9:3,10:3,11:4}
};
const handIndex={2:[0,3,3,3],3:[0,2,3],4:[0,0,0,2,2,1],5:[0,0,2,2,3]};
const slideIndex={1:[2,0],2:[0,4],3:[0,3],4:[0,4],5:[0,2]};
const plainIndex={1:[2,0,1,1,1],2:[0,4,2],3:[3,2,3],4:[0,2,2,4],5:[0,2,2,4]};
const ch1Annotations=[
{index:0,page:"p.6–7",heading:"Analysis / Design 填空",text:"Analysis 應先確定 Requirements，透過 UML 建立分析模型；Design 才進一步處理 User Interface、Component Interface 和 Data / Database Specifications。",why:"把需求（WHAT）與具體實作方案（HOW）區別開來。"},
{index:2,page:"p.10–11",heading:"Methodology 比較",text:"投影片比較 Waterfall、Parallel、Phased、Prototyping、Throwaway Prototyping、XP、Scrum 在需求清晰度、技術熟悉度、時程等條件下的適用性。",why:"比較方法時應依情境選擇，不是只背方法名稱。"},
{index:1,page:"UML / UP 手寫頁",heading:"Unified Process 的 Workflows",text:"手寫重點將 Engineering Workflows（Business Model、Requirement、Analysis、Design、Implementation、Test、Deployment）與 Supporting Workflows 分開。",why:"UP 的 Phase 是時間軸，Workflow 是工作類別；同時可能進行多個 Workflow。"},
{index:0,page:"p.22",heading:"Class 與 Object",text:"投影片註記 Object (instance) 是由 Class 具體化而來；手寫答案提示應區分 Class、Object 與 method call。",why:"Class 是類別定義，Object 是具體實例。"}
];
function createTemplate(html){
const t=document.createElement("template");
t.innerHTML=html||"";
return t.content;
}
// Section indexes refer to rendered ## sections, not every ### subheading.
// Clamp as a safety net so a future change to Markdown headings cannot break a chapter.
function put(buckets,index,item){
 if(!buckets.length)return;
 const i=Number.isInteger(index)?Math.max(0,Math.min(index,buckets.length-1)):0;
 buckets[i].push(item);
}
function card(kind,heading,body,page,why){
return '<aside class="sad-topic-supplement"><div class="sad-supp-meta"><span class="sad-supp-kind">'+kind+'</span>'+(page?'<span class="sad-supp-page">'+page+'</span>':"")+'</div><strong>'+heading+'</strong><div class="sad-supp-content">'+body+'</div>'+(why?'<p class="sad-supp-why"><b>理解重點：</b>'+why+'</p>':"")+'</aside>';
}
function extractHand(ch,handHtml,buckets){
const source=createTemplate(handHtml);
const rows=[...source.querySelectorAll("tbody tr")];
rows.forEach((row,i)=>{
const cells=[...row.querySelectorAll("td")].map(x=>x.innerHTML.trim());
if(cells.length<4)return;
const p=cells[0].replace(/<[^>]*>/g,"").trim(),where=handIndex[ch]?.[i]??0;
put(buckets,where,card("老師手寫註記",cells[1],'<p>'+cells[2]+'</p>',p,cells[3]));
});
}
function extractSource(ch,sourceHtml,buckets){
const source=createTemplate(sourceHtml);
const details=[...source.querySelectorAll("details")];
details.forEach((detail,i)=>{
const summary=detail.querySelector("summary")?.innerHTML||"投影片重點";
const c=detail.cloneNode(true);
c.querySelector("summary")?.remove();
const at=slideIndex[ch]?.[i]??0;
put(buckets,at,card("投影片原文對照",summary,c.innerHTML,"", ""));
});
}
function extractPlain(ch,plainHtml,buckets){
const root=createTemplate(plainHtml);
[...root.querySelectorAll("details")].forEach((item,i)=>{
const title=item.querySelector("summary")?.innerHTML||"概念補充";
const c=item.cloneNode(true);c.querySelector("summary")?.remove();
const at=plainIndex[ch]?.[i]??0;
put(buckets,at,card("白話教學補充",title,c.innerHTML,"", ""));
});
}
function extractDepth(ch,fullHtml,buckets){
if(!mapParts[ch]||!fullHtml)return;
const root=createTemplate(fullHtml);
const all=[...root.querySelectorAll("section[id]")].filter(x=>/^part\d+$/.test(x.id));
for(const item of all){
const n=Number(item.id.slice(4)),index=mapParts[ch][n];
if(index==null)continue;
const head=item.querySelector("h2")?.textContent?.trim()||"原版深入教材";
const details='<details class="sad-topic-depth"><summary>進階閱讀 · '+head+'</summary><div class="sad-depth-body">'+item.innerHTML+'</div></details>';
put(buckets,index,details);
}
}
function attach(ch,markup,options={}){
if(ch<1||ch>5)return markup;
const wrapper=createTemplate('<div class="sad-supp-wrapper">'+markup+'</div>');
let sections=[...wrapper.querySelectorAll("section.sad-md-card")];
const legacyMode=sections.length===0;
if(legacyMode)sections=[...wrapper.querySelectorAll("section[id^='part']")];
if(legacyMode&&!sections.length)sections=[...wrapper.querySelectorAll("section.card, section[id]")].slice(0,1);
if(!sections.length)return markup;
const buckets=sections.map(()=>[]);
if(ch===1)ch1Annotations.forEach(a=>put(buckets,a.index,card("教授投影片與手寫補充",a.heading,'<p>'+a.text+'</p>',a.page,a.why)));
if(options.hand)extractHand(ch,options.hand,buckets);
if(options.source)extractSource(ch,options.source,buckets);
if(options.plain)extractPlain(ch,options.plain,buckets);
if(options.full&&!legacyMode)extractDepth(ch,options.full,buckets);
if(ch===5&&options.textbook) {
 const idx=Math.min(2,sections.length-1);
 put(buckets,idx,'<details class="sad-topic-depth"><summary>進階閱讀 · 行為模型完整圖例與課本說明</summary><div class="sad-depth-body">'+options.textbook+'</div></details>');
}
sections.forEach((section,i)=>{
if(!buckets[i].length)return;
const div=document.createElement("div");
div.className="sad-embedded-supplements";
div.innerHTML='<div class="sad-supp-heading">本節補充｜教授投影片、手寫重點與深入教材</div>'+buckets[i].join("");
section.appendChild(div);
});
return wrapper.querySelector(".sad-supp-wrapper").innerHTML;
}
document.addEventListener("toggle",event=>{
if(event.target?.classList?.contains("sad-topic-depth")&&event.target.open&&typeof renderLessonDiagrams==="function")renderLessonDiagrams();
},true);
window.SAD_INLINE_SUPPLEMENTS={attach};
})();

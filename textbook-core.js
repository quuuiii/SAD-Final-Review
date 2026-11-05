/* Textbook open-ended rubric: heuristic concept coverage, never a formal score. */
(function(){
"use strict";
const all=[...(window.SAD_TEXTBOOK_CH1_QUESTIONS||[]),...(window.SAD_TEXTBOOK_CH1_APPLIED||[])];
if(!all.length)return;
const byId=Object.fromEntries(all.map(q=>[q.id,q])),MAX=12000;
const copy=x=>JSON.parse(JSON.stringify(x));
function makeBlank(){return {version:1,answers:{},results:{},flags:{},selfReviewed:{}}}
function normalize(raw){
 const s=makeBlank();
 if(!raw||typeof raw!=="object"||raw.version!==1)return s;
 for(const q of all){
 const id=q.id;
 if(typeof raw.answers?.[id]==="string")s.answers[id]=raw.answers[id].slice(0,MAX);
 if(raw.flags?.[id]===true)s.flags[id]=true;
 if(raw.selfReviewed?.[id]===true)s.selfReviewed[id]=true;
 const r=raw.results?.[id];
 if(r&&Number.isFinite(r.percent)&&typeof r.answerSnapshot==="string")s.results[id]={
   percent:Math.max(0,Math.min(100,Math.round(r.percent))),
   status:["partial","covered","review"].includes(r.status)?r.status:"review",
   matched:Array.isArray(r.matched)?r.matched.filter(Number.isInteger):[],
   checkedAt:Number.isFinite(r.checkedAt)?r.checkedAt:0,
   answerSnapshot:r.answerSnapshot.slice(0,MAX)
 };
 }
 return s;
}
const norm=t=>String(t??"").normalize("NFKC").toLowerCase().replace(/[_‐‑‒–—]/g," ").replace(/\s+/g," ").trim();
function matchTerm(text,rawTerm){
 const term=norm(rawTerm);if(!term)return false;
 if(/[\u3400-\u9fff]/.test(term))return text.includes(term);
 const safe=term.replace(/[\^$.*+?()[\]{}|]/g,"\\$&").replace(/\s+/g,"\\s+");
 const re=term.replace(/\s+/g,"").length<=3?"\\b"+safe+"\\b":"\\b"+safe+"[a-z]*\\b";
 return new RegExp(re,"i").test(text);
}
function grade(q,answer,now=Date.now()){
 const raw=String(answer??"").trim().slice(0,MAX),text=norm(raw);
 const checks=q.criteria.map((c,i)=>({
   index:i,name:c.name,found:c.terms.some(t=>matchTerm(text,t)),examples:c.terms.slice(0,4)
 }));
 const hits=checks.filter(x=>x.found).length;
 const percent=checks.length?Math.round(hits/checks.length*100):0;
 const attempted=raw.length>=8,needsHumanReview=q.type!=="question"||q.needsReview;
 return {status:!attempted?"unanswered":needsHumanReview?"review":percent>=80?"covered":"partial",
   percent,matched:checks.filter(x=>x.found).map(x=>x.index),checks,attempted,needsHumanReview,
   checkedAt:now,answerSnapshot:raw};
}
function needsRegrade(state,id){return !state.results[id]||state.results[id].answerSnapshot!==(state.answers[id]||"").trim()}
function evaluate(state,id,now=Date.now()){
 const q=byId[id];if(!q)return null;
 const r=grade(q,state.answers[id]||"",now);
 if(!r.attempted){delete state.results[id];return r}
 state.results[id]={status:r.status,percent:r.percent,matched:r.matched,checkedAt:now,answerSnapshot:r.answerSnapshot};
 return r;
}
function summary(state,chapter=1){
 const qs=all.filter(q=>q.chapter===chapter),checked=qs.filter(q=>state.results[q.id]&&!needsRegrade(state,q.id));
 return {total:qs.length,questions:qs.filter(q=>q.type==="question").length,
 exercises:qs.filter(q=>q.type==="exercise").length,minicases:qs.filter(q=>q.type==="minicase").length,
 attempted:qs.filter(q=>(state.answers[q.id]||"").trim().length>=8).length,checked:checked.length,
 covered:checked.filter(q=>state.results[q.id].status==="covered").length,followup:checked.filter(q=>state.results[q.id].status!=="covered").length,
 flags:qs.filter(q=>state.flags[q.id]).length,selfReviewed:qs.filter(q=>state.selfReviewed[q.id]).length};
}
function exportMarkdown(state,chapter=1){
 const out=["# SAD Textbook Chapter "+chapter+" · My Answers","",
 "來源：使用者提供之課本第 37–40 頁照片。概念覆蓋率只作學習提示，非老師正式評分。",""];
 for(const q of all.filter(q=>q.chapter===chapter)){
 out.push("## "+q.type.toUpperCase()+" "+q.number+" · p."+q.sourcePage,q.prompt,"","### 我的回答",(state.answers[q.id]||"").trim()||"（未填）","");
 const r=state.results[q.id];if(r&&!needsRegrade(state,q.id))out.push("概念覆蓋率初評："+r.percent+"%（非正式分數）","");
 out.push("### 參考要點（本站編寫）",q.reference,"");
 if(q.scenario)out.push("### 案例背景摘要",q.scenario,"");
 }
 return out.join("\n");
}
window.SAD_TEXTBOOK_ENGINE={all,byId,makeBlank,normalize,grade,evaluate,summary,needsRegrade,exportMarkdown,copy,matchTerm};
})();

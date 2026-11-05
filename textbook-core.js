/* Local-only textbook workbook. Rubric scoring checks terms, not essay meaning. */
(function(){
"use strict";
const chapters={1:window.SAD_TEXTBOOK_CH1,2:window.SAD_TEXTBOOK_CH2,3:window.SAD_TEXTBOOK_CH3,4:window.SAD_TEXTBOOK_CH4};
let bank=chapters[1];
if(!bank||!Array.isArray(bank.entries))return;
function selectChapter(ch){
 const next=chapters[Number(ch)];
 if(!next||!Array.isArray(next.entries))return null;
 bank=next;window.SAD_TEXTBOOK_ENGINE.bank=bank;return bank;
}
const normalizeText=s=>String(s??"").normalize("NFKC").toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g," ").trim();
const words=source=>normalizeText(source).replace(/[^a-z0-9\u3400-\u9fff ]/g," ");
const safe=s=>String(s??"").slice(0,16000);
function matches(text,phrases){
const v=normalizeText(text),flat=words(text);
return phrases.some(phrase=>{
const p=normalizeText(phrase),t=words(phrase).trim();
if(!p)return false;
if(/[\u3400-\u9fff]/.test(p))return v.includes(p);
if(p.length<=3&&/^[a-z0-9]+$/.test(p))return new RegExp("(^|[^a-z0-9])"+p+"([^a-z0-9]|$)","i").test(v);
if(/^[a-z]{4,}$/.test(p)){
 const alternatives=[p];
 if(p.endsWith("ies"))alternatives.push(p.slice(0,-3)+"y");
 else if(p.endsWith("s")&&!p.endsWith("ss")&&!p.endsWith("sis"))alternatives.push(p.slice(0,-1));
 if(!p.endsWith("s"))alternatives.push(p+"s");
 return alternatives.some(a=>new RegExp("(^|[^a-z0-9])"+a+"([^a-z0-9]|$)","i").test(v));
}
return v.includes(p)||(t.length>3&&flat.includes(t));
});
}
function grade(entry,answer){
const value=normalizeText(answer),criteria=entry.criteria||[],textLength=value.replace(/\s/g,"").length;
const criteriaResults=criteria.map(variants=>({concept:variants[0],matched:matches(value,variants),variants}));
const matched=criteriaResults.filter(c=>c.matched).length;
const tokenCount=value.split(/\s+/).filter(Boolean).length;
const substantial=textLength>=25&&(tokenCount>=5||/[\u3400-\u9fff]/.test(value)||(criteria.length>=3&&matched===criteria.length));
let score=criteria.length?Math.round(matched/criteria.length*100):0;
if(!substantial)score=Math.min(score,35);
if(textLength<12)score=Math.min(score,15);
const provisional=entry.manual===true||entry.type!=="Questions"||entry.adapted===true;
const status=!value?"empty":!substantial?"short":score>=80?"covered":score>=45?"partial":"missing";
return {score,status,provisional,matched,total:criteria.length,criteriaResults,wordCount:tokenCount,textLength};
}
function blank(){return {version:1,answers:{},checks:{},updatedAt:0}}
function restore(raw){
const state=blank();
if(!raw||raw.version!==1||typeof raw!=="object")return state;
for(const p of bank.entries){
const answer=raw.answers?.[p.id];
if(typeof answer==="string")state.answers[p.id]=safe(answer);
const rawCheck=raw.checks?.[p.id];
if(rawCheck?.checkedAt&&Number.isFinite(Number(rawCheck.checkedAt)))state.checks[p.id]={checkedAt:Number(rawCheck.checkedAt),answer:safe(rawCheck.answer)};
}
return state;
}
function getGrade(state,id){const entry=bank.entries.find(x=>x.id===id);if(!entry)return null;return grade(entry,state.answers[id]||"")}
function statistics(state){
const report={total:bank.entries.length,answered:0,checked:0,reviewRequired:0,sections:{}};
for(const entry of bank.entries){
let sec=report.sections[entry.type]||(report.sections[entry.type]={total:0,answered:0,checked:0});
sec.total++;
const answer=(state.answers[entry.id]||"").trim();
if(answer){report.answered++;sec.answered++}
const record=state.checks[entry.id];
if(record&&record.answer===answer&&answer){
report.checked++;sec.checked++;
if(grade(entry,answer).provisional)report.reviewRequired++;
}
}
return report;
}
function saveAnswer(state,id,answer){if(!bank.entries.some(e=>e.id===id))return false;state.answers[id]=safe(answer);state.updatedAt=Date.now();return true}
function check(state,id,now=Date.now()){
const entry=bank.entries.find(e=>e.id===id);if(!entry)return null;
const answer=(state.answers[id]||"").trim();
if(!answer)return {score:0,status:"empty",provisional:true};
state.checks[id]={answer,checkedAt:now};return grade(entry,answer);
}
window.SAD_TEXTBOOK_ENGINE={bank,chapters,selectChapter,grade,matches,blank,restore,getGrade,statistics,saveAnswer,check};
})();
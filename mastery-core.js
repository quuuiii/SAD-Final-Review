/* SAD Mastery Review Core
   Deterministic chapter assessments and local spaced-retrieval scheduling.
   No network, no automated reminders; schedule is recalculated on next visit. */
(function(){
"use strict";
const bank=window.SAD_MASTERY_BANK;
if(!bank||!Array.isArray(bank.questions))return;
const byId=Object.fromEntries(bank.questions.map(q=>[q.id,q]));
const allIds=bank.questions.map(q=>q.id);
const DAY=86400000,MAX_HISTORY=60;
const safeNum=v=>Number.isFinite(Number(v))?Number(v):0;
const finiteInt=n=>Math.max(0,Math.floor(safeNum(n)));
const cap=(n,max)=>Math.min(Math.max(n,0),max);
const clone=x=>JSON.parse(JSON.stringify(x));
function makeBlank(){return {version:1,records:{},history:[],session:null}}
function normalize(raw){
const s=makeBlank();
if(!raw||typeof raw!=="object"||raw.version!==1)return s;
if(raw.records&&typeof raw.records==="object"){
for(const [id,rec] of Object.entries(raw.records)){
if(!byId[id]||!rec||typeof rec!=="object")continue;
s.records[id]={
attempts:cap(finiteInt(rec.attempts),100000),
correct:cap(finiteInt(rec.correct),100000),
incorrect:cap(finiteInt(rec.incorrect),100000),
streak:cap(finiteInt(rec.streak),bank.stages.length),
dueAt:cap(finiteInt(rec.dueAt),9999999999999),
lastAt:cap(finiteInt(rec.lastAt),9999999999999),
lastChoice:Number.isInteger(rec.lastChoice)?cap(rec.lastChoice,3):null
};
}
}
if(Array.isArray(raw.history)){
s.history=raw.history.filter(x=>x&&typeof x==="object"&&["chapter","review","mixed"].includes(x.mode)).slice(-MAX_HISTORY).map(x=>({
mode:x.mode,chapter:x.mode==="chapter"&&[1,2,3,4,5].includes(Number(x.chapter))?Number(x.chapter):null,
total:cap(finiteInt(x.total),30),correct:cap(finiteInt(x.correct),30),endedAt:cap(finiteInt(x.endedAt),9999999999999),
ids:Array.isArray(x.ids)?x.ids.filter(z=>byId[z]).slice(0,30):[]
}));
}
const rawSess=raw.session;
if(rawSess&&typeof rawSess==="object"&&["chapter","review","mixed"].includes(rawSess.mode)&&Array.isArray(rawSess.ids)){
const ids=[...new Set(rawSess.ids.filter(id=>byId[id]))].slice(0,30);
if(ids.length){
 const answers={};
 if(rawSess.answers&&typeof rawSess.answers==="object"){
 for(const id of ids){if(Number.isInteger(rawSess.answers[id])&&rawSess.answers[id]>=0&&rawSess.answers[id]<byId[id].options.length)answers[id]=rawSess.answers[id]}
 }
 const index=cap(finiteInt(rawSess.index),ids.length-1);
 s.session={mode:rawSess.mode,chapter:rawSess.mode==="chapter"&&[1,2,3,4,5].includes(Number(rawSess.chapter))?Number(rawSess.chapter):null,
 ids,index,answers,startedAt:finiteInt(rawSess.startedAt),finished:Boolean(rawSess.finished)};
}
}
return s;
}
function currentQuiz(state){const s=state.session;if(!s)return null;return byId[s.ids[s.index]]||null}
function recordAnswer(state,id,choice,now=Date.now()){
const s=state.session,q=byId[id],when=finiteInt(now);
if(!s||s.finished||!q||s.ids[s.index]!==id||!Number.isInteger(choice)||choice<0||choice>=q.options.length)return {ok:false,reason:"invalid"};
if(Object.prototype.hasOwnProperty.call(s.answers,id))return {ok:false,reason:"already-answered"};
s.answers[id]=choice;
const rec=state.records[id]||{attempts:0,correct:0,incorrect:0,streak:0,dueAt:0,lastAt:0,lastChoice:null};
const right=choice===q.answer;
rec.attempts++;rec.lastAt=when;rec.lastChoice=choice;
if(right){
rec.correct++;rec.streak=cap(rec.streak+1,bank.stages.length);
rec.dueAt=when+bank.stages[rec.streak-1]*DAY;
}else{
rec.incorrect++;rec.streak=0;rec.dueAt=when;
}
state.records[id]=rec;
return {ok:true,correct:right,answer:q.answer,nextDueAt:rec.dueAt};
}
function dueQuestions(state,now=Date.now()){
const at=finiteInt(now);
return bank.questions.filter(q=>{
const r=state.records[q.id];
return r&&r.attempts>0&&r.dueAt<=at;
}).sort((a,b)=>{
const x=state.records[a.id],y=state.records[b.id];
return (x.dueAt-y.dueAt)||(y.incorrect-x.incorrect)||(a.chapter-b.chapter);
});
}
function weakLessons(state,now=Date.now()){
const grouped={};
for(const q of bank.questions){
const r=state.records[q.id];
if(!r||!r.incorrect)continue;
let row=grouped[q.lesson];
if(!row)row=grouped[q.lesson]={lesson:q.lesson,chapter:q.chapter,wrong:0,attempts:0,due:0,questions:[]};
row.wrong+=r.incorrect;row.attempts+=r.attempts;
if(r.dueAt<=now)row.due++;
row.questions.push(q.id);
}
return Object.values(grouped).sort((a,b)=>(b.due-a.due)||(b.wrong-a.wrong)||(a.chapter-b.chapter));
}
function chapterSummary(state,ch){
const sessions=state.history.filter(h=>h.mode==="chapter"&&h.chapter===ch);
const latest=sessions.at(-1)||null;
const questionIds=bank.questions.filter(q=>q.chapter===ch).map(q=>q.id);
const attempted=questionIds.filter(id=>state.records[id]?.attempts>0).length;
const maxScore=sessions.reduce((n,x)=>Math.max(n,x.correct),0);
const threshold=Math.ceil(bank.questions.filter(q=>q.chapter===ch).length*bank.threshold);
return {ch,latest,attempted,total:questionIds.length,maxScore,threshold,passed:maxScore>=threshold};
}
function nextDue(state,now=Date.now()){
let first=Infinity;
for(const rec of Object.values(state.records))if(rec.dueAt>now&&rec.dueAt<first)first=rec.dueAt;
return Number.isFinite(first)?first:null;
}
function start(state,mode,chapter=null,now=Date.now()){
if(!["chapter","review","mixed"].includes(mode))return {ok:false,reason:"invalid-mode"};
let ids=[];
if(mode==="chapter"){
const ch=Number(chapter);
if(![1,2,3,4,5].includes(ch))return {ok:false,reason:"invalid-chapter"};
ids=bank.questions.filter(q=>q.chapter===ch).map(q=>q.id);
chapter=ch;
}else if(mode==="review"){
ids=dueQuestions(state,now).slice(0,12).map(x=>x.id);
if(!ids.length)return {ok:false,reason:"nothing-due"};
chapter=null;
}else{
const records=state.records;
const grouped=[1,2,3,4,5].map(c=>bank.questions.filter(x=>x.chapter===c));
for(let round=0;round<3;round++){
 for(const items of grouped){
 const sorted=[...items].sort((a,b)=>(records[a.id]?.attempts||0)-(records[b.id]?.attempts||0)||(records[b.id]?.incorrect||0)-(records[a.id]?.incorrect||0)||a.id.localeCompare(b.id));
 const target=sorted.find(q=>!ids.includes(q.id));
 if(target&&ids.length<10)ids.push(target.id);
 }
}
chapter=null;
}
state.session={mode,chapter,ids,index:0,answers:{},startedAt:finiteInt(now),finished:false};
return {ok:true,session:state.session};
}
function advance(state,now=Date.now()){
const s=state.session;
if(!s||s.finished)return {ok:false,reason:"no-active-session"};
const id=s.ids[s.index];
if(!Object.prototype.hasOwnProperty.call(s.answers,id))return {ok:false,reason:"unanswered"};
if(s.index<s.ids.length-1){s.index++;return {ok:true,finished:false}}
s.finished=true;
const correct=s.ids.filter(qid=>s.answers[qid]===byId[qid].answer).length;
const historyItem={mode:s.mode,chapter:s.chapter,total:s.ids.length,correct,endedAt:finiteInt(now),ids:[...s.ids]};
state.history.push(historyItem);
state.history=state.history.slice(-MAX_HISTORY);
return {ok:true,finished:true,result:historyItem};
}
function currentResult(state){
const s=state.session;
if(!s)return null;
const correct=s.ids.filter(id=>s.answers[id]===byId[id].answer).length;
return {total:s.ids.length,correct,percent:Math.round(correct/s.ids.length*100),
passed:s.mode==="chapter"&&correct>=Math.ceil(s.ids.length*bank.threshold),
wrong:s.ids.filter(id=>Object.prototype.hasOwnProperty.call(s.answers,id)&&s.answers[id]!==byId[id].answer),
unanswered:s.ids.filter(id=>!Object.prototype.hasOwnProperty.call(s.answers,id))}
}
function summary(state,now=Date.now()){
return {due:dueQuestions(state,now).length,weak:weakLessons(state,now),next:nextDue(state,now),
attempted:bank.questions.filter(q=>state.records[q.id]?.attempts).length,
passedChapters:[1,2,3,4,5].filter(ch=>chapterSummary(state,ch).passed).length,
totalChapterCount:5};
}
window.SAD_MASTERY_ENGINE={
makeBlank,normalize,clone,bank,byId,chapterSummary,start,recordAnswer,advance,currentQuiz,currentResult,
dueQuestions,weakLessons,nextDue,summary
};
})();
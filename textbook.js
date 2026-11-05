/* Textbook Chapter 1 study classroom, no server or API. */
(()=>{
"use strict";
const core=window.SAD_TEXTBOOK_ENGINE,root=document.getElementById("textbookApp");
if(!core||!root){if(root)root.textContent="無法載入課本題庫。";return}
const KEY="sad-textbook-practice-v1",all=core.all;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const labels={question:"Questions",exercise:"Exercises",minicase:"Minicases"};
let state;try{state=core.normalize(JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(err){state=core.makeBlank()}
let tab="question",filter="all",search="";
const current=()=>core.byId[decodeURIComponent(location.hash.slice(1))]||all[0];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(err){notice("本機儲存失敗，請匯出作答備份。")}}
const notice=t=>{let e=document.getElementById("textbookNotice");if(e)e.textContent=t};
const B=(label,action,style="")=>'<button type="button" class="btn '+style+'" data-action="'+esc(action)+'">'+esc(label)+'</button>';
const hasText=q=>(state.answers[q.id]||"").trim().length>=8;
const fresh=q=>Boolean(state.results[q.id]&&!core.needsRegrade(state,q.id));
function filtered(){
return all.filter(q=>q.type===tab)
.filter(q=>filter==="all"||(filter==="flag"&&state.flags[q.id])||(filter==="unchecked"&&!fresh(q))||(filter==="draft"&&hasText(q)&&!fresh(q))||(filter==="review"&&fresh(q)&&state.results[q.id].status!=="covered"))
.filter(q=>!search||(q.number+" "+q.prompt+" "+q.reference).toLowerCase().includes(search.toLowerCase()));
}
function stats(){
const s=core.summary(state);
return '<section class="tb-hero"><div><span class="eyebrow" style="color:#e4e6ff">TEXTBOOK CH1 · ORIGINAL QUESTIONS</span><h1>課本原題，一題一題練到會。</h1><p>已收錄使用者提供的課本第 37–40 頁：Questions 1–38、Exercises A–R、Minicases 1–3。</p><p>寫完後檢查關鍵概念覆蓋率；長篇題目仍需人工複核。</p><div class="tb-actions"><a class="btn" href="learn.html#chapter-1">Ch1 教材</a><a class="btn" href="mastery.html#chapter-1">章末選擇題</a></div></div><div class="tb-count"><strong>'+s.attempted+' / '+s.total+'</strong><span>題目已嘗試</span></div></section>'+
'<section class="tb-stats"><div class="card"><strong>'+s.questions+'</strong><span>Questions</span></div><div class="card"><strong>'+s.exercises+'</strong><span>Exercises</span></div><div class="card"><strong>'+s.minicases+'</strong><span>Minicases</span></div><div class="card"><strong>'+s.checked+'</strong><span>已初評</span></div></section>';
}
function itemList(q){
const found=filtered();
return '<aside class="card tb-list"><h2>題目清單</h2><div class="tb-list-controls"><div class="tb-tabs">'+["question","exercise","minicase"].map(t=>'<button type="button" class="tb-tab '+(t===tab?"active":"")+'" data-tab="'+t+'">'+labels[t]+'</button>').join("")+'</div>'+
'<select class="tb-filter" id="textbookFilter" aria-label="篩選題目">'+[["all","全部"],["unchecked","未初評"],["draft","草稿待初評"],["review","待補強／複核"],["flag","已收藏"]].map(x=>'<option value="'+x[0]+'" '+(filter===x[0]?"selected":"")+'>'+x[1]+'</option>').join("")+'</select>'+
'<input class="tb-filter" type="search" id="textbookSearch" placeholder="搜尋題目" value="'+esc(search)+'"></div>'+
'<div class="tb-items" id="textbookItems">'+(found.length?found.map(x=>'<button type="button" data-id="'+x.id+'" class="tb-item '+(x.id===q.id?"active":"")+'"><span class="tb-item-label">'+esc(x.number)+'</span><span class="tb-item-title">'+esc(x.prompt)+'</span><span class="tb-item-state">'+(fresh(x)?"✓":hasText(x)?"•":"○")+'</span></button>').join(""):'<p class="tb-empty">沒有符合條件的題目。</p>')+'</div><p class="tb-tip">○ 未答 · • 草稿 · ✓ 已檢查</p>'+B("匯出所有作答 Markdown","export")+'</aside>';
}
function diagnostics(q){
if(!fresh(q)){
if(hasText(q))return '<div class="tb-notice">回答已修改或尚未初評，請按「檢查關鍵概念」取得最新結果。</div>';
return "";
}
const report=core.grade(q,state.answers[q.id]),saved=state.results[q.id];
return '<section class="tb-result" aria-live="polite"><h3>自動概念初評</h3><div class="tb-result-score"><strong>'+saved.percent+'%</strong><p>這是**預設概念詞覆蓋率**，不是內容正確率、學校成績或 AI 語意評分。</p></div>'+
'<div class="tb-result-list">'+report.checks.map(x=>'<div class="tb-check '+(x.found?"hit":"miss")+'"><span>'+(x.found?"✓":"△")+'</span><div><b>'+esc(x.name)+'</b><p class="tb-warning">'+(x.found?"偵測到相關用語，請再確認意思有沒有寫對。":"尚未偵測到預設用語，其他同義表達仍可能正確。")+'</p>'+(!x.found?'<p class="tb-warning">可參考：'+esc(x.examples.join(" / "))+'</p>':"")+'</div></div>').join("")+'</div>'+
((q.needsReview||q.type!=="question")?'<div class="tb-notice"><b>必須人工複核：</b>本題涉及論證、畫圖、資料查證或不同合理解法，關鍵字無法決定真正對錯。</div>':"")+'</section>';
}
function question(q){
const idx=all.findIndex(x=>x.id===q.id),prev=all[idx-1],next=all[idx+1];
return '<article class="card tb-problem"><div class="tb-breadcrumb">Chapter 1 / '+labels[q.type]+' / '+esc(q.number)+'</div>'+
'<h2>'+labels[q.type]+' '+esc(q.number)+'</h2><p class="tb-source"><span>課本 p.'+q.sourcePage+'</span><span>'+esc(q.id)+'</span></p>'+
(q.scenario?'<details class="tb-scenario" open><summary>案例情境摘要（非課本逐字內容）</summary><p>'+esc(q.scenario)+'</p><p class="tb-warning">'+esc(q.scenarioNote||"")+'</p></details>':"")+
'<div class="tb-english" lang="en">'+esc(q.prompt)+'</div>'+
(q.external?'<div class="tb-notice">這題要求上網查資料；本站無法自動核實資料來源、工具資訊或網頁日期。</div>':"")+
'<label class="tb-label" for="textbookAnswer">你的答案（可使用英文或中文）</label>'+
'<textarea id="textbookAnswer" class="tb-answer" data-answer-id="'+q.id+'" maxlength="12000" placeholder="請先用自己的話完整作答，再檢查預設關鍵概念。">'+esc(state.answers[q.id]||"")+'</textarea>'+
'<p class="tb-warning" id="textbookSaved">輸入後自動存於目前瀏覽器；跨裝置不會同步。</p>'+
'<div class="tb-actions">'+B("檢查關鍵概念","check","primary")+B(state.flags[q.id]?"★ 已收藏":"☆ 收藏","flag")+
(q.needsReview?B(state.selfReviewed[q.id]?"✓ 人工複核已完成":"☐ 標記已人工複核","self"):"")+'</div>'+
diagnostics(q)+
'<details class="tb-reference"><summary>參考要點（本站編寫，非教師／課本標準答案）</summary><p>'+esc(q.reference)+'</p><p class="tb-warning">除了是否提到重點，也要確認解釋是否合理、比較是否有依據。</p></details>'+
'<div class="tb-footer-actions">'+(prev?B("← "+labels[prev.type]+" "+prev.number,"goto-"+prev.id):'<span></span>')+
(next?B(labels[next.type]+" "+next.number+" →","goto-"+next.id,"primary"):'<span></span>')+'</div>'+
'<p class="tb-support">來源：使用者提供課本照片 p.37–40。Questions／Exercises 為照片題目，Minicases 保留問題原文但背景以摘要呈現；參考要點由本站整理。</p></article>';
}
function render(){
const q=current();if(q.type!==tab){tab=q.type;filter="all";search=""}
root.innerHTML=stats()+'<div class="tb-layout">'+itemList(q)+question(q)+'</div>';
document.title="課本 Ch1 "+labels[q.type]+" "+q.number+"｜SAD";
}
function go(id){
if(!core.byId[id])return;
if(decodeURIComponent(location.hash.slice(1))===id)render();
else location.hash=encodeURIComponent(id);
}
function exportFile(){
const blob=new Blob([core.exportMarkdown(state,1)],{type:"text/markdown;charset=utf-8"});
const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="SAD-Textbook-Ch1-Answers.md";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function action(k){
const q=current();
if(k.startsWith("goto-"))return go(k.slice(5));
if(k==="check"){
const r=core.evaluate(state,q.id);
if(!r?.attempted){notice("請先輸入至少八個字再檢查。");const info=document.getElementById("textbookSaved");if(info)info.textContent="至少八個字才能進行初評。";return}
save();render();notice("已更新關鍵概念初評結果。");return;
}
if(k==="flag"){state.flags[q.id]=!state.flags[q.id];save();render();return}
if(k==="self"){state.selfReviewed[q.id]=!state.selfReviewed[q.id];save();render();return}
if(k==="export")exportFile();
}
document.addEventListener("click",e=>{
const a=e.target.closest("[data-action]");if(a){action(a.dataset.action);return}
const q=e.target.closest("[data-id]");if(q){go(q.dataset.id);return}
const t=e.target.closest("[data-tab]");if(t){tab=t.dataset.tab;filter="all";search="";const first=all.find(x=>x.type===tab);if(first)go(first.id)}
});
document.addEventListener("input",e=>{
const target=e.target;
if(target.id==="textbookAnswer"){
const id=target.dataset.answerId;if(!core.byId[id])return;state.answers[id]=target.value;save();
const info=document.getElementById("textbookSaved");if(info)info.textContent="草稿已自動儲存，修改後請重新檢查。";
const result=document.querySelector(".tb-result");if(result)result.innerHTML='<p>草稿已修改，請重新執行概念初評。</p>';
}else if(target.id==="textbookSearch"){search=target.value;updateList()}
});
document.addEventListener("change",e=>{if(e.target.id==="textbookFilter"){filter=e.target.value;updateList()}});
function updateList(){
const list=document.getElementById("textbookItems");if(!list)return;
list.innerHTML=filtered().map(x=>'<button type="button" class="tb-item '+(x.id===current().id?"active":"")+'" data-id="'+x.id+'"><span class="tb-item-label">'+esc(x.number)+'</span><span class="tb-item-title">'+esc(x.prompt)+'</span><span class="tb-item-state">'+(fresh(x)?"✓":hasText(x)?"•":"○")+'</span></button>').join("")||'<p class="tb-empty">沒有符合條件的題目。</p>';
}
window.addEventListener("hashchange",()=>{render();window.scrollTo(0,0)});
render();
window.SAD_TEXTBOOK_TEST={getState:()=>core.copy(state),getCurrent:()=>current().id,getHtml:()=>root.innerHTML,go,action,render};
})();
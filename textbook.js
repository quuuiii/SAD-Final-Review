/* Textbook Ch1: self-paced essay workbook with locally saved answers and transparent concept checks. */
(()=>{
"use strict";
let bank=window.SAD_TEXTBOOK_CH1;const grader=window.SAD_TEXTBOOK_ENGINE,app=document.getElementById("textbookApp");
if(!bank||!grader||!app){if(app)app.textContent="課本題庫未成功載入，請重新整理。";return}
const storageKey=()=> "sad-textbook-ch"+bank.chapter+"-v1",TYPES=["Questions","Exercises","Minicases"],LABELS={Questions:"Questions · 申論題",Exercises:"Exercises · 應用練習",Minicases:"Minicases · 個案分析"};
const ESC=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let state;
try{state=grader.restore(JSON.parse(localStorage.getItem(storageKey())||"null"))}catch(e){state=grader.blank()}
let activeFilter="all",activeType="Questions",activeId="Q1",searchTerm="";
function chooseChapter(n){
 const chosen=grader.selectChapter(n);if(!chosen)return;
 bank=chosen;
 try{state=grader.restore(JSON.parse(localStorage.getItem(storageKey())||"null"))}catch(err){state=grader.blank()}
 activeFilter="all";activeType="Questions";activeId="Q1";searchTerm="";reportOpen=false;render();
}
const item=id=>bank.entries.find(e=>e.id===id),group=type=>bank.entries.filter(e=>e.type===type),answered=e=>(state.answers[e.id]||"").trim().length>0;
function notify(s){const el=document.getElementById("textbookNotice");if(el)el.textContent=s}
function save(){try{localStorage.setItem(storageKey(),JSON.stringify(state))}catch(e){notify("本機儲存失敗。建議先匯出 JSON 備份。")}}
function isChecked(e){const c=state.checks[e.id],text=(state.answers[e.id]||"").trim();return Boolean(text&&c&&c.answer===text)}
function visible(){let list=group(activeType);if(activeFilter==="unanswered")list=list.filter(x=>!answered(x));if(activeFilter==="ungraded")list=list.filter(x=>answered(x)&&!isChecked(x));if(activeFilter==="checked")list=list.filter(isChecked);if(searchTerm)list=list.filter(x=>(x.num+" "+x.prompt).toLowerCase().includes(searchTerm.toLowerCase()));return list}
function selected(){return item(activeId)||bank.entries[0]}
function home(){
const s=grader.statistics(state);
const chapter=bank.chapter,textbookChapter=bank.textbookChapter||chapter;
const chapterNav='<div class="tb-chapter-tabs" role="group" aria-label="選擇課本章節">'+Object.values(grader.chapters).map(c=>'<button type="button" class="tb-tab '+(c.chapter===chapter?'active':'')+'" data-chapter="'+c.chapter+'">'+('第'+(['一','二','三','四'][c.chapter-1]||c.chapter)+'組 · 課本 Ch'+(c.textbookChapter||c.chapter))+'</button>').join("")+'</div>';
return chapterNav+'<section class="tb-hero"><div><span class="eyebrow">COURSE CH'+chapter+' · TEXTBOOK CH'+textbookChapter+'</span><h1>'+('第'+(['一','二','三','四'][chapter-1]||chapter)+'組')+'課本題庫<br>英文申論與重點批改</h1><p>'+ESC(bank.title)+'<br>Questions 1–'+bank.entries.filter(x=>x.type==="Questions").length+'、Exercises A–'+(chapter===1?'R':chapter===2?'M':chapter===3?'W':'X')+'、Minicases 1–'+bank.entries.filter(x=>x.type==="Minicases").length+'。'+(chapter===2?'此處是課堂 Ch2，原書標示 Chapter 3（pp.115–118）。':chapter===3?'此處是課堂 Ch3，原書標示 Chapter 4（pp.158–162）。':chapter===4?'此處是課堂 Ch4，原書標示 Chapter 5（pp.198–201）。':'')+'保留原本題號及頁碼。</p><div class="actions"><a class="btn" href="learn.html#chapter-'+chapter+'">回 Ch'+chapter+' 自學課</a><a class="btn" href="index.html">整合教材</a></div></div><aside class="tb-hero-summary"><span class="eyebrow">PROGRESS</span><strong>'+s.answered+' / '+s.total+'</strong><p>已作答題數</p><div class="progress"><i style="width:'+Math.round(s.answered/s.total*100)+'%"></i></div><p>已執行概念檢查：'+s.checked+' 題</p></aside></section>'+
'<section class="tb-summary">'+TYPES.map(t=>{const d=s.sections[t];return '<div class="card"><strong>'+d.answered+' / '+d.total+'</strong><span>'+ESC(LABELS[t])+' · 已作答</span></div>'}).join("")+'</section>'+
'<div class="tb-warning"><strong>自動批改範圍：</strong>此處以你答案中出現的關鍵概念，計算「概念涵蓋率」並提醒遺漏處；它無法可靠判定申論論證是否正確、是否有矛盾或引用是否真實。<strong>Exercises／Minicases、觀點題與研究題一律需要人工複核。</strong> 文字過短也會被標示。這不是教授給的分數或標準答案。</div>'+
'<div class="tb-toolbar" role="group" aria-label="題型切換">'+TYPES.map(t=>'<button type="button" class="tb-tab '+(activeType===t?"active":"")+'" data-type="'+t+'">'+ESC(LABELS[t])+'</button>').join("")+
'<label class="tb-index-label" for="tbFilter">顯示</label><select id="tbFilter" class="tb-select"><option value="all"'+(activeFilter==="all"?" selected":"")+'>全部題目</option><option value="unanswered"'+(activeFilter==="unanswered"?" selected":"")+'>未作答</option><option value="ungraded"'+(activeFilter==="ungraded"?" selected":"")+'>已答但尚未批改</option><option value="checked"'+(activeFilter==="checked"?" selected":"")+'>已批改</option></select>'+
'<input id="tbSearch" class="tb-select" type="search" placeholder="搜尋題號／題目" aria-label="搜尋題目" value="'+ESC(searchTerm)+'">'+
'<button type="button" class="btn" data-action="report">進度報告</button><button type="button" class="btn" data-action="export">匯出 JSON 備份</button></div>';
}
function navigation(){
const list=visible();
return '<aside class="tb-list" aria-label="題目快速導覽"><h3>'+ESC(LABELS[activeType])+'</h3><p>已作答有底線；已批改有綠框。按題號切換。</p><div class="tb-numbers">'+list.map(e=>'<button type="button" class="tb-number '+(e.id===activeId?"is-current ":"")+(answered(e)?"is-answered ":"")+(isChecked(e)?"is-checked":"")+'" data-select="'+e.id+'" aria-label="前往 '+activeType+' '+e.num+'">'+ESC(e.num)+'</button>').join("")+'</div>'+
(!list.length?'<div class="tb-empty">沒有符合目前篩選條件的題目。</div>':"")+
'<p>教材來源：'+ESC(bank.source)+'</p></aside>';
}
function concepts(result){
return result.criteriaResults.map(r=>'<div class="tb-concept '+(r.matched?"found":"missing")+'"><span aria-hidden="true">'+(r.matched?"✓":"○")+'</span><div><strong>'+ESC(r.concept)+'</strong><div class="small">'+(r.matched?"答案提到了相關概念。":"尚未偵測到此觀念，可以再補充。")+'</div></div></div>').join("");
}
function feedback(entry){
if(!isChecked(entry))return "";
const out=grader.getGrade(state,entry.id);
return '<section class="tb-feedback" aria-live="polite"><span class="pill">'+(out.provisional?"需人工複核":"概念涵蓋率分析")+'</span><h3>自動檢查結果</h3><strong class="tb-score">'+out.score+' / 100 <small>概念涵蓋率估計</small></strong><p>符合 '+out.matched+' / '+out.total+' 個預設概念。這是依關鍵詞判定的初步結果，不代表申論內容正確或教師實際分數。</p>'+
(out.status==="short"?'<div class="tb-warning">答案偏短，系統無法判斷是否充分說明，涵蓋率已受到限制。</div>':"")+
'<h3>逐項檢查</h3>'+concepts(out)+
'<p>評分依據是本站整理的關鍵概念及同義詞。若你使用等義但不同的表達方式，可能需要人工確認；同樣地，僅羅列關鍵詞也可能取得偏高的概念涵蓋率。</p>'+
'<a class="tb-note-link" href="learn.html#chapter-'+bank.chapter+'">回課堂 Ch'+bank.chapter+' 教材核對 →</a></section>';
}
function editor(){
const e=selected(),value=state.answers[e.id]||"",list=group(activeType),index=list.findIndex(x=>x.id===e.id);
if(!visible().some(x=>x.id===e.id))return '<section class="card tb-editor"><div class="tb-empty">目前篩選條件沒有選取的題目。請點左側其他題號或更換篩選。</div></section>';
return '<section class="card tb-editor"><span class="pill">課堂 Ch'+bank.chapter+' · 課本 Ch'+(bank.textbookChapter||bank.chapter)+' · '+ESC(activeType)+' '+ESC(e.num)+'</span><span class="tb-page">　課本 p.'+e.sourcePage+'</span><h2>'+ESC(activeType)+' '+ESC(e.num)+'</h2>'+
(e.adapted?'<div class="tb-warning">本個案背景為方便網頁閱讀的摘要整理，並非課本完整逐字原文；分析要求與題目一致。可對照原始課本 p.'+e.sourcePage+'。</div>':"")+
(e.scenario?'<details class="tb-warning" open><summary>案例背景摘要（非課本逐字原文）</summary><p>'+ESC(e.scenario)+'</p></details>':'')+'<div class="tb-question">'+ESC(e.prompt)+'</div>'+
'<div class="tb-field"><label for="tbAnswer">你的答案（中文／英文皆可）</label><textarea id="tbAnswer" maxlength="16000" spellcheck="true" placeholder="請用自己的話回答。包含核心概念、原因及必要的比較或例子…">'+ESC(value)+'</textarea><p class="tb-tip">文字自動保存在此瀏覽器。切換題目、關閉頁面後可以繼續。</p></div>'+
'<div class="tb-actions"><button type="button" class="btn primary" data-action="check">自動批改這一題</button><button type="button" class="btn" data-action="erase">清空本題答案</button><button type="button" class="btn" data-action="report">查看整體進度</button></div>'+
feedback(e)+
'<div class="tb-foot">'+(index>0?'<button type="button" class="btn" data-select="'+list[index-1].id+'">← 上一題</button>':'<span></span>')+
(index<list.length-1?'<button type="button" class="btn primary" data-select="'+list[index+1].id+'">下一題 →</button>':'<span class="tb-tip">本區最後一題</span>')+'</div></section>';
}
function report(){
const s=grader.statistics(state);
return '<section class="card tb-report"><h2>第 '+bank.chapter+' 組課本練習進度</h2><p>已作答 '+s.answered+' / '+s.total+' 題；已執行概念檢查 '+s.checked+' 題。</p><div class="tb-results"><table><thead><tr><th>題型</th><th>題數</th><th>已作答</th><th>已檢查</th></tr></thead><tbody>'+TYPES.map(t=>{const x=s.sections[t];return '<tr><td>'+ESC(LABELS[t])+'</td><td>'+x.total+'</td><td>'+x.answered+'</td><td>'+x.checked+'</td></tr>'}).join("")+'</tbody></table></div>'+
'<div class="tb-warning"><b>提醒：</b>已檢查不等於教師確認正確。研究、繪圖、綜合比較及個案題目都需人工複核。</div>'+
'<div class="tb-actions"><button type="button" class="btn" data-action="back">回到題目</button><button type="button" class="btn primary" data-action="export">匯出所有答案 JSON</button><button type="button" class="btn" data-action="reset">清除 Ch1 的全部答案與檢查紀錄</button></div></section>';
}
let reportOpen=false;
function render(){app.innerHTML=home()+(reportOpen?report():'<div class="tb-question-layout">'+navigation()+editor()+'</div>')}
function choose(id){const e=item(id);if(!e)return;activeType=e.type;activeId=id;reportOpen=false;render()}
function chooseType(type){if(!TYPES.includes(type))return;activeType=type;activeId=group(type)[0].id;reportOpen=false;activeFilter="all";searchTerm="";render()}
function download(){const body={source:bank.source,exportedAt:new Date().toISOString(),...state};const blob=new Blob([JSON.stringify(body,null,2)],{type:"application/json;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="SAD-Textbook-CourseCh"+bank.chapter+"-TextbookCh"+(bank.textbookChapter||bank.chapter)+"-Answers.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function action(key){
const e=selected();
if(key==="check"){
const result=grader.check(state,e.id,Date.now());
if(result?.status==="empty"){notify("請先寫下答案，再執行檢查。");return}
save();render();notify("已完成初步概念檢查，請查看預設概念與缺漏提示。");return;
}
if(key==="erase"){if(confirm("確定清空這一題的答案嗎？")){grader.saveAnswer(state,e.id,"");delete state.checks[e.id];save();render()}return}
if(key==="report"){reportOpen=true;render();return}
if(key==="back"){reportOpen=false;render();return}
if(key==="reset"){if(confirm("確定清除這一組全部 "+bank.entries.length+" 題的紀錄？另一組會保留。請先匯出備份。")){state=grader.blank();save();reportOpen=false;render()}return}
if(key==="export"){download();return}
}
document.addEventListener("click",ev=>{
const chapterBtn=ev.target.closest("[data-chapter]");if(chapterBtn){chooseChapter(Number(chapterBtn.dataset.chapter));return}
const e=ev.target.closest("[data-select]");if(e){choose(e.dataset.select);return}
const tab=ev.target.closest("[data-type]");if(tab){chooseType(tab.dataset.type);return}
const b=ev.target.closest("[data-action]");if(b)action(b.dataset.action);
});
document.addEventListener("input",ev=>{
if(ev.target.id==="tbAnswer"){grader.saveAnswer(state,activeId,ev.target.value);save();return}
if(ev.target.id==="tbSearch"){searchTerm=ev.target.value;const focus=ev.target.selectionStart;render();const search=document.getElementById("tbSearch");if(search){search.focus();search.setSelectionRange(focus,focus)}return}
});
document.addEventListener("change",ev=>{if(ev.target.id==="tbFilter"){activeFilter=ev.target.value;let list=visible();if(list.length)activeId=list[0].id;render()}});
if(typeof location!=="undefined"&&/^#chapter-[234]$/.test(location.hash||""))chooseChapter(Number(location.hash.slice(-1)));else render();
window.SAD_TEXTBOOK_TEST={getState:()=>JSON.parse(JSON.stringify(state)),getHtml:()=>app.innerHTML,choose,chooseType,chooseChapter,getChapter:()=>bank.chapter,check:id=>{const o=grader.check(state,id);save();render();return o},answer:(id,v)=>{grader.saveAnswer(state,id,v);save();render()},getStatistics:()=>grader.statistics(state)};
})();
/* SAD Mastery Studio: local chapter checks, weakness routing, and spaced recall. */
(()=>{
"use strict";
const bank=window.SAD_MASTERY_BANK,engine=window.SAD_MASTERY_ENGINE,course=window.SAD_COURSE,root=document.getElementById("masteryApp");
if(!bank||!engine||!course||!root){if(root)root.textContent="複習資料載入失敗。";return}
const STORE="sad-mastery-v1",THEME="sad-beginner-theme";
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const allLessons=course.chapters.flatMap(c=>c.lessons);
const lessons=Object.fromEntries(allLessons.map(l=>[l.id,l]));
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}};
let state=engine.normalize(read(STORE)),dark=false;
const notice=s=>{const x=document.getElementById("masteryNotice");if(x)x.textContent=s};
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(state))}catch(e){notice("無法儲存進度，請檢查瀏覽器儲存權限。")}};
const route=()=>decodeURIComponent(location.hash.replace(/^#/,""))||"home";
const go=x=>{if(route()===x){render();window.scrollTo(0,0)}else location.hash=x};
const button=(label,action,cls="")=>'<button type="button" class="btn '+cls+'" data-action="'+E(action)+'">'+E(label)+'</button>';
const progress=(n,d)=>'<div class="progress" role="progressbar" aria-label="學習進度" aria-valuenow="'+n+'" aria-valuemin="0" aria-valuemax="'+d+'"><i style="width:'+Math.round(100*n/d)+'%"></i></div>';
const section=(title,desc="")=>'<div class="section-head"><div><h2>'+E(title)+'</h2>'+(desc?'<p>'+E(desc)+'</p>':"")+'</div></div>';
const date=t=>new Date(t).toLocaleDateString("zh-TW",{year:"numeric",month:"2-digit",day:"2-digit"});
const chTitle=ch=>course.chapters.find(c=>c.id===ch)?.title||("Ch"+ch);
const mLesson=key=>lessons[key]?.title||key;
const due=()=>engine.dueQuestions(state);
function home(){
const s=engine.summary(state),lc=read("sad-beginner-course-v1"),uc=read("sad-uml-lab-v1"),cc=read("sad-capstone-v1");
const pass=lc&&typeof lc.passed==="object"&&lc.passed||{};
const solved=uc&&typeof uc.solved==="object"&&uc.solved||{};
const lessonDone=allLessons.filter(l=>pass[l.id]).length,umlDone=["usecase","activity","class","sequence"].filter(x=>solved[x]).length;
const ongoing=state.session&&!state.session.finished&&Object.keys(state.session.answers).length>0;
return '<section class="ms-hero"><div><span class="eyebrow">CHAPTER CHECK · RETRIEVAL PRACTICE</span><h1>學完之後，<br>用自己的判斷驗證理解。</h1><p>每章六道情境應用題，答錯立即連回相關課程。系統會依答題紀錄安排後續複習，但不會自動推播。</p><div class="actions">'+(ongoing?button("繼續未完成的測驗","resume","primary"):button(s.due?"開始待複習題":"開始 Ch1 章末測驗",s.due?"start-review":"start-chapter-1","primary"))+button("五章綜合挑戰","start-mixed")+'</div></div>'+
'<div class="ms-hero-summary"><span class="eyebrow">CHAPTER CHECKS PASSED</span><strong>'+s.passedChapters+' / 5</strong><p>每章 6 題，答對至少 5 題通過本站的章末檢核，仍需搭配實際建模。</p>'+progress(s.passedChapters,5)+'<p class="small" style="margin-top:12px">待複習 '+s.due+' 題</p></div></section>'+
'<div class="ms-scorecards">'+
'<div class="card"><strong>'+lessonDone+' / 18</strong><small>入門課程已掌握</small></div>'+
'<div class="card"><strong>'+s.passedChapters+' / 5</strong><small>章末檢核已通過</small></div>'+
'<div class="card"><strong>'+umlDone+' / 4</strong><small>UML 組圖挑戰完成</small></div>'+
'<div class="card"><strong>'+s.due+'</strong><small>目前到期複習題</small></div></div>'+
'<section class="ms-note"><b>推薦學習路線：</b>閱讀與理解 → 章末檢核 → 錯題補強 → UML 練習室 → 完整系統分析專題。不同類型的進度分開記錄，避免把「讀過」誤當成「會做」。</section>'+
section("Ch1–Ch5 章末能力檢測","每章六題；至少答對五題才算通過本站的章末檢核。")+
'<section class="ms-chapters">'+course.chapters.map(c=>{
const x=engine.chapterSummary(state,c.id),lessonCount=c.lessons.filter(l=>pass[l.id]).length;
return '<article class="card ms-chapter"><div class="ms-chapter-heading"><span class="ms-chapter-num">0'+c.id+'</span><div><h3>'+E(c.title)+'</h3><p class="small">'+E(c.en)+'</p></div></div><div class="ms-inline-list"><span class="pill">'+(x.passed?"✓ 曾通過":"尚未通過")+'</span><span class="small muted">最近一次：'+(x.latest?x.latest.correct+"/"+x.latest.total:"尚未作答")+'</span><span class="small muted">課程已掌握 '+lessonCount+"/"+c.lessons.length+'</span></div><div class="ms-chapter-footer">'+
button(x.latest?"重新練習六題":"開始六題檢測","start-chapter-"+c.id,x.passed?"":"primary")+'<a class="btn" href="learn.html#chapter-'+c.id+'">回教材</a></div></article>'
}).join("")+'</section>'+
section("個人化複習","答錯立即列入待複習；答對後按 1、3、7、14 天安排下一次。")+
'<section class="card"><h3>'+(s.due?"你有 "+s.due+" 題可以複習":"目前沒有待複習題目")+'</h3><p>'+(s.due?"先把不熟的觀念找回來，再考新的章節。":s.next?"下一批複習預計在 "+date(s.next)+"。":"完成任一測驗後就會建立複習排程。")+'</p><div class="ms-toolbar">'+button("查看弱點與錯題","weak")+button("查看作答紀錄","history")+(s.due?button("開始複習","start-review","primary"):"")+'</div></section>'+
section("實作能力同步練習","概念答對不代表 UML 模型已會畫。")+
'<div class="ms-comparison"><div class="card"><strong>① 自學教室</strong><p>18 堂逐步教材，依弱點回看。</p><a class="btn" href="learn.html">回入門教材</a></div><div class="card"><strong>② UML 組圖</strong><p>四種圖形的操作與診斷。</p><a class="btn" href="uml-lab.html">開始畫圖</a></div><div class="card"><strong>③ 實作專題</strong><p>'+(cc&&cc.version===1?"已有專題草稿，可繼續完成":"從新的器材借用案例開始")+'。</p><a class="btn" href="capstone.html">進入專題</a></div></div>'+
'<p class="ms-source">題目是根據 2026 Ch1–Ch5 授課主題設計的教學改編題，不是教授官方題目。原始投影片與手寫註記仍整合在各章對應的教材小節內。</p>';
}
function quiz(){
const s=state.session;
if(!s)return '<div class="card ms-empty">目前沒有進行中的測驗。'+button("回總覽","home")+'</div>';
if(s.finished)return result();
const q=engine.currentQuiz(state),choice=s.answers[q.id],answered=Number.isInteger(choice),right=choice===q.answer;
const kind=s.mode==="chapter"?"Ch"+s.chapter+" · "+chTitle(s.chapter):s.mode==="review"?"錯題與到期複習":"五章綜合挑戰";
const current=s.index+1,total=s.ids.length;
return '<div class="ms-quiz-shell"><section class="card ms-quiz-head"><span class="pill">CHAPTER CHECK</span><h1>'+E(kind)+'</h1><div class="ms-quiz-meta"><span>第 '+current+' / '+total+' 題</span><span>已作答 '+Object.keys(s.answers).length+' 題</span></div>'+progress(current-1,total)+'</section>'+
'<section class="card ms-question" id="quizQuestion" tabindex="-1"><span class="eyebrow">CH'+q.chapter+' · '+E(q.topic)+'</span><h2>'+E(q.question)+'</h2>'+
'<div class="ms-options">'+q.options.map((option,i)=>'<button type="button" class="ms-option '+(answered?(i===q.answer?"correct":i===choice?"wrong":""):"")+'" data-answer="'+i+'" '+(answered?"disabled":"")+'><span class="ms-letter">'+String.fromCharCode(65+i)+'</span><span>'+E(option)+'</span></button>').join("")+'</div>'+
(answered?'<aside class="ms-feedback '+(right?"success":"error")+'" role="status"><h3>'+(right?"✓ 答對":"這題需要補強")+'</h3><p><b>正確答案：</b>'+String.fromCharCode(65+q.answer)+' · '+E(q.options[q.answer])+'</p><p>'+E(q.explanation)+'</p>'+(!right?'<p><b>常見誤解：</b>'+E(q.misconception)+'</p>':"")+'<p><a href="learn.html#lesson-'+E(q.lesson)+'">對應教材：'+E(mLesson(q.lesson))+' →</a></p></aside>':'<p class="ms-quiz-tip">選擇後會立即顯示原因；本輪無法更改答案。</p>')+
'<div class="ms-question-foot"><span class="ms-quiz-tip">'+E(q.source)+' · 本站改編</span>'+(answered?button(current===total?"完成並查看結果 →":"下一題 →","advance","primary"):"")+'</div></section><div class="ms-toolbar">'+button("返回總覽","home")+'</div></div>';
}
function result(){
const s=state.session;if(!s||!s.finished)return '<section class="card">尚未完成測驗。</section>';
const x=engine.currentResult(state),label=s.mode==="chapter"?"Ch"+s.chapter+" 章末檢核":s.mode==="review"?"間隔複習":"五章綜合挑戰";
return '<div class="ms-quiz-shell"><section class="card ms-result-head"><span class="pill">RESULT & FEEDBACK</span><h1>'+label+' · 完成</h1><strong class="ms-big">'+x.correct+' / '+x.total+'</strong><h3>'+(s.mode==="chapter"?(x.passed?"✓ 達到本站檢核門檻":"尚未達到本站檢核門檻"):"本輪複習已結束")+'</h3><p>正確率 '+x.percent+'%。每章六題需答對至少五題才算通過，且仍需要實際建模練習。</p><div class="ms-toolbar">'+(due().length?button("複習到期題","start-review","primary"):"")+(s.mode==="chapter"?button("重新練習這一章","start-chapter-"+s.chapter):"")+button("查看薄弱概念","weak")+button("回總覽","home")+'</div></section>'+
section("逐題檢視","錯題直接連到對應課程，可以立即補強。")+
'<div class="ms-result-grid">'+s.ids.map(id=>{const q=engine.byId[id],choice=s.answers[id],ok=choice===q.answer;
return '<article class="ms-result-item"><strong class="'+(ok?"good":"bad")+'">'+(ok?"✓ 正確":"✕ 待複習")+' · Ch'+q.chapter+' '+E(q.topic)+'</strong><p>'+E(q.question)+'</p><p class="small"><b>選擇：</b>'+E(q.options[choice]||"未作答")+'</p><p class="small">'+E(q.explanation)+'</p><a href="learn.html#lesson-'+q.lesson+'">回「'+E(mLesson(q.lesson))+'」 →</a></article>'}).join("")+'</div></div>';
}
function weak(){
const items=engine.weakLessons(state),d=due(),summary=engine.summary(state);
return '<section class="card ms-quiz-head"><span class="pill">PERSONAL REVIEW</span><h1>錯題與弱點補強</h1><p>每個薄弱觀念都對應到特定教材。建議讀懂原因後再做一次，而不是記住選項字母。</p></section>'+
'<div class="ms-toolbar">'+button("回學習總覽","home")+(d.length?button("開始複習 "+d.length+" 題","start-review","primary"):"")+button("作答紀錄","history")+'</div>'+
'<div class="ms-scorecards"><div class="card"><strong>'+bank.questions.filter(q=>state.records[q.id]?.incorrect).length+'</strong><small>曾答錯題目</small></div><div class="card"><strong>'+d.length+'</strong><small>目前到期</small></div><div class="card"><strong>'+items.length+'</strong><small>涉及的課程小節</small></div><div class="card"><strong>'+summary.attempted+'/30</strong><small>已嘗試題數</small></div></div>'+
section("推薦回看的課程","優先看目前到期且累積錯誤較多的單元。")+
'<div class="ms-weak-list">'+(items.length?items.map(row=>'<div class="ms-weak-item"><div><b>Ch'+row.chapter+' · '+E(mLesson(row.lesson))+'</b><p>累積錯誤 '+row.wrong+' 次 · 目前到期 '+row.due+' 題</p></div><a class="btn small" href="learn.html#lesson-'+E(row.lesson)+'">回教材補強</a></div>').join(""):'<div class="card ms-empty">尚無錯題資料，可以先做各章測驗。</div>')+'</div>'+
section("複習間隔說明")+
'<div class="card"><p>答錯會立即排入待複習；連續答對後依序延長到 1、3、7、14 天，答錯則重新開始。</p><p>這是瀏覽器內的進度規則，只會在你再次開啟網站時顯示。'+(summary.next?'下次預計排程日期：'+date(summary.next)+'。':"")+'</p><p class="ms-source">本工具只評估這 30 題的選擇題表現，並不能替代 UML 繪圖、專題走查或正式考試。</p></div>';
}
function history(){
const rows=[...state.history].reverse().slice(0,20);
return '<section class="card ms-quiz-head"><span class="pill">YOUR STUDY HISTORY</span><h1>測驗與複習紀錄</h1><p>此工具的資料只存在目前瀏覽器，不會與帳號或其他裝置自動同步。</p></section><div class="ms-toolbar">'+button("回總覽","home")+button("錯題整理","weak")+'</div>'+
'<div class="ms-history-wrap"><table class="ms-history"><thead><tr><th>日期</th><th>模式</th><th>得分</th><th>本輪結果</th></tr></thead><tbody>'+
(rows.length?rows.map(h=>'<tr><td>'+date(h.endedAt)+'</td><td>'+E(h.mode==="chapter"?"Ch"+h.chapter+" 章末檢核":h.mode==="review"?"到期複習":"綜合挑戰")+'</td><td>'+h.correct+'/'+h.total+'</td><td>'+(h.mode==="chapter"?(h.correct>=Math.ceil(h.total*bank.threshold)?"通過":"未達門檻"):"已完成")+'</td></tr>').join(""):'<tr><td colspan="4">尚無紀錄。</td></tr>')+'</tbody></table></div>'+
'<div class="ms-note">若要清除這裡的章末成績與錯題紀錄，可以使用下方功能，原本的 18 堂課、UML 練習進度與專題草稿都不會受影響。</div><div class="ms-toolbar">'+button("清空本工具的所有紀錄","clear")+'</div>';
}
function render(){
const v=route();
root.innerHTML=v==="quiz"?quiz():v==="result"?result():v==="weak"?weak():v==="history"?history():home();
document.title=(v==="quiz"?"章末作答":v==="result"?"測驗結果":v==="weak"?"錯題複習":v==="history"?"作答紀錄":"掌握度檢核")+"｜SAD Learning Studio";
}
function start(mode,ch=null){
if(state.session&&!state.session.finished&&Object.keys(state.session.answers).length&&!confirm("目前有未完成的測驗，開始新練習會取代這一輪。確定繼續？"))return;
const s=engine.start(state,mode,ch,Date.now());
if(!s.ok){notice(s.reason==="nothing-due"?"目前沒有到期題目。":"無法開始練習。");return}
save();go("quiz");
}
function action(x){
if(["home","weak","history"].includes(x)){go(x);return}
if(x==="resume"){go(state.session?.finished?"result":"quiz");return}
if(x.startsWith("start-chapter-")){start("chapter",Number(x.slice(-1)));return}
if(x==="start-review"){start("review");return}
if(x==="start-mixed"){start("mixed");return}
if(x==="advance"){
const n=engine.advance(state,Date.now());
if(!n.ok){notice("請先回答這一題。");return}
save();
if(n.finished)go("result");else{render();root.querySelector("#quizQuestion")?.focus()}
return;
}
if(x==="clear"&&confirm("確定清除本工具的章末測驗、錯題與複習紀錄嗎？")){
state=engine.makeBlank();save();go("home");notice("章末檢測紀錄已清空。");
}
}
document.addEventListener("click",event=>{
const option=event.target.closest("[data-answer]");
if(option){const q=engine.currentQuiz(state);if(!q)return;
const out=engine.recordAnswer(state,q.id,Number(option.dataset.answer),Date.now());
if(out.ok){save();render();notice(out.correct?"本題答對，已安排後續間隔複習。":"本題答錯，已列入待複習。")}
return;
}
const control=event.target.closest("[data-action]");if(control)action(control.dataset.action)
});
window.addEventListener("hashchange",()=>{render();window.scrollTo(0,0)});
const themeBtn=document.getElementById("masteryTheme");
try{dark=localStorage.getItem(THEME)==="dark"}catch(e){}
function paint(){document.documentElement.dataset.theme=dark?"dark":"light";if(themeBtn){themeBtn.textContent=dark?"☀":"☾";themeBtn.setAttribute("aria-label",dark?"切換淺色模式":"切換深色模式")}}
themeBtn?.addEventListener("click",()=>{dark=!dark;try{localStorage.setItem(THEME,dark?"dark":"light")}catch(e){}paint()});
paint();render();
window.SAD_MASTERY_TEST={getState:()=>engine.clone(state),getHtml:()=>root.innerHTML,getRoute:route,start,action,getSummary:()=>engine.summary(state)};
})();
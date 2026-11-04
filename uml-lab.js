/* Guided UML diagram builder for the SAD learning studio.
   Evaluates documented, deterministic slots in four fixed training exercises.
   It does not grade arbitrary UML diagrams or independently prove semantic validity. */
(()=>{
"use strict";
const library=window.SAD_UML_LAB,root=document.getElementById("labApp");
if(!root||!library||!Array.isArray(library.exercises)){if(root)root.textContent="練習資料無法載入，請重新整理頁面。";return}
const STORE="sad-uml-lab-v1",exercises=library.exercises;
const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const svgText=(x,y,s,attrs="")=>'<text x="'+x+'" y="'+y+'" fill="currentColor" text-anchor="middle" font-size="13" '+attrs+'>'+escapeHTML(s)+'</text>';
const svgRect=(x,y,w,h,fill="var(--surface)",rx=7)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" stroke="currentColor" stroke-opacity=".6" stroke-width="1.6"/>';
const svgLine=(x1,y1,x2,y2,dashed=false,arrow=false)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#6466ce" stroke-width="2" '+(dashed?'stroke-dasharray="7 5" ':'')+(arrow?'marker-end="url(#uml-arrow)"':'')+'/>';
const svgArrow=(x1,y1,x2,y2,dashed=false)=>svgLine(x1,y1,x2,y2,dashed,true);
const svgFrame=(w,h,body,label)=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+escapeHTML(label)+'"><title>'+escapeHTML(label)+'</title><defs><marker id="uml-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#6466ce"/></marker></defs>'+body+'</svg>';
const model=Object.fromEntries(exercises.map(x=>[x.id,x]));
let state={drafts:{},solved:{},revealed:{},checks:{}};
try{const old=JSON.parse(localStorage.getItem(STORE)||"{}");if(old&&typeof old==="object")for(const key of ["drafts","solved","revealed","checks"])if(old[key]&&typeof old[key]==="object"&&!Array.isArray(old[key]))state[key]=old[key]}catch(e){}
let active={},hintLevel={},feedback={};
function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch(e){notice("無法儲存進度，請檢查瀏覽器的儲存空間。")}}
function notice(s){const el=document.getElementById("liveNotice");if(el)el.textContent=s}
const count=()=>exercises.filter(e=>state.solved[e.id]).length;
const currentAnswers=ex=>state.drafts[ex.id]||{};
function getAnswer(a,id){return Object.prototype.hasOwnProperty.call(a,id)?a[id]:null}
function getField(ex,a,id){const value=getAnswer(a,id);return value==null?"？":value}
function isSolved(ex){return !!state.solved[ex.id]}
function pc(a,b){return b?Math.round(a/b*100):0}
function bar(a,b){return '<div class="progress" role="progressbar" aria-label="已完成挑戰進度" aria-valuenow="'+a+'" aria-valuemin="0" aria-valuemax="'+b+'"><i style="width:'+pc(a,b)+'%"></i></div>'}
function btn(text,action,variant=""){return '<button type="button" class="btn '+variant+'" data-action="'+escapeHTML(action)+'">'+escapeHTML(text)+'</button>'}
function opts(s){return s.options.map((v,i)=>'<button type="button" class="lab-token" draggable="true" data-token="'+i+'" data-token-slot="'+escapeHTML(s.id)+'" title="可拖到左側相符欄位，或直接點選"><span class="grip" aria-hidden="true">⠿</span>'+escapeHTML(v)+'</button>').join("")}
function svgUsecase(a){
let out='<rect x="201" y="34" width="498" height="275" rx="9" fill="none" stroke="currentColor" stroke-opacity=".62" stroke-width="1.6"/>';
out+=svgText(450,59,getField(a,"boundary"),'font-size="16" font-weight="700"');
out+='<circle cx="86" cy="107" r="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M86 119V160 M60 140L86 130L112 140 M86 160L65 187 M86 160L107 187" fill="none" stroke="currentColor" stroke-width="2"/>';
out+=svgText(87,211,getField(a,"actor"),'font-size="15" font-weight="700"');
out+='<ellipse cx="389" cy="150" rx="117" ry="32" fill="var(--tint)" stroke="#6466ce" stroke-width="2"/>';
out+=svgText(389,155,getField(a,"base"),'font-size="14" font-weight="700"');
out+='<ellipse cx="581" cy="103" rx="105" ry="30" fill="var(--surface)" stroke="#6466ce" stroke-width="1.8"/>';
out+=svgText(581,108,getField(a,"included"),'font-size="13"');
out+='<ellipse cx="568" cy="250" rx="119" ry="32" fill="var(--surface)" stroke="#6466ce" stroke-width="1.8"/>';
out+=svgText(568,255,getField(a,"extension"),'font-size="12"');
out+=svgLine(116,146,270,150);
if(getAnswer(a,"includeDirection")){
const reverse=getAnswer(a,"includeDirection")!=="Enroll → Verify Eligibility";
out+=reverse?svgArrow(502,121,482,141,true):svgArrow(482,141,502,121,true);
out+=svgText(541,76,"«include»",'font-size="12" font-style="italic"');
}
if(getAnswer(a,"extendDirection")){
const reverse=getAnswer(a,"extendDirection")!=="Discount → Enroll";
out+=reverse?svgArrow(445,172,496,228,true):svgArrow(496,228,445,172,true);
out+=svgText(449,228,"«extend»",'font-size="12" font-style="italic"');
}
return svgFrame(720,340,out,"Use-Case Diagram 練習預覽，顯示目前選取的 Actor、Use Cases 與關係方向");
}
function svgActivity(a){
const text=(id)=>getField(a,id);
let out='<circle cx="36" cy="164" r="12" fill="#6466ce" stroke="#6466ce"/>';
out+=svgRect(78,136,139,57,"var(--tint)",11)+svgText(147,168,text("action1"));
out+=svgArrow(48,164,77,164);
out+=svgRect(243,136,169,57,"var(--tint)",11)+svgText(327,168,text("action2"),'font-size="12"');
out+=svgArrow(217,164,242,164);
out+='<polygon points="483,110 544,164 483,218 422,164" stroke="#6466ce" stroke-width="2" fill="var(--surface)"/>';
out+=svgText(483,167,text("decision"),'font-size="11"');
out+=svgArrow(412,164,422,164);
out+=svgRect(597,52,157,57,"var(--tint)",11)+svgText(675,85,text("yes"),'font-size="12"');
out+=svgRect(597,219,157,57,"var(--tint)",11)+svgText(675,250,text("no"),'font-size="12"');
out+='<path d="M514 136 L566 80 L596 80" fill="none" stroke="#6466ce" stroke-width="2" marker-end="url(#uml-arrow)"/>';
out+='<path d="M514 192 L566 247 L596 247" fill="none" stroke="#6466ce" stroke-width="2" marker-end="url(#uml-arrow)"/>';
out+=svgText(555,94,"[Yes]",'font-size="11"')+svgText(552,244,"[No]",'font-size="11"');
out+='<polygon points="806,142 828,164 806,186 784,164" fill="var(--surface)" stroke="#6466ce" stroke-width="1.6"/>';
out+=svgText(806,123,text("merge"),'font-size="12"');
out+='<path d="M754 80 L771 80 L806 142" fill="none" stroke="#6466ce" stroke-width="2" marker-end="url(#uml-arrow)"/>';
out+='<path d="M754 247 L771 247 L806 186" fill="none" stroke="#6466ce" stroke-width="2" marker-end="url(#uml-arrow)"/>';
out+=svgArrow(828,164,856,164);
out+='<circle cx="872" cy="164" r="15" fill="none" stroke="#6466ce" stroke-width="2"/><circle cx="872" cy="164" r="9" fill="#6466ce"/>';
return svgFrame(900,340,out,"Activity Diagram 練習預覽，從起點經名額判斷分流後在 Merge 匯合");
}
function svgClass(a){
const names=["student","course","record"];
const boxes=[{x:48,y:31,w:206,h:121},{x:48,y:205,w:206,h:121},{x:480,y:112,w:214,h:121}];
const fields=["studentId: String","courseId: String","enrollmentId: String"];
let out="";
boxes.forEach((b,i)=>{out+=svgRect(b.x,b.y,b.w,b.h,"var(--surface)",1);out+=svgLine(b.x,b.y+43,b.x+b.w,b.y+43);out+=svgText(b.x+b.w/2,b.y+26,getField(a,names[i]),'font-size="16" font-weight="700"');out+='<text x="'+(b.x+12)+'" y="'+(b.y+67)+'" font-size="13" fill="currentColor">- '+fields[i]+'</text>'});
out+=svgLine(254,96,480,159)+svgLine(254,263,480,200);
out+=svgText(373,108,getField(a,"relation"),'font-size="12"');
out+=svgText(284,86,getField(a,"studentEnd"),'font-size="13"');
out+=svgText(452,145,getField(a,"enrollmentStudentEnd"),'font-size="13"');
out+=svgText(284,282,getField(a,"courseEnd"),'font-size="13"');
out+=svgText(454,228,getField(a,"enrollmentCourseEnd"),'font-size="13"');
return svgFrame(740,352,out,"Class Diagram 練習預覽，Student 和 Course 都與 Enrollment 產生關聯");
}
function svgSequence(a){
const centers={Student:94,UI:266,Controller:448,Course:625,Enrollment:804},names=Object.keys(centers);
let out="";
names.forEach(name=>{
const x=centers[name],actor=name==="Student";
if(actor){out+='<circle cx="'+x+'" cy="41" r="11" fill="none" stroke="currentColor" stroke-width="2"/><path d="M'+x+' 52 V83 M'+(x-17)+' 66 L'+x+' 56 L'+(x+17)+' 66 M'+x+' 83 L'+(x-14)+' 102 M'+x+' 83 L'+(x+14)+' 102" fill="none" stroke="currentColor" stroke-width="1.7"/>'}
else out+=svgRect(x-65,27,130,57,"var(--surface)",4)+svgText(x,59,name,'font-size="14"');
out+='<line x1="'+x+'" y1="'+(actor?104:85)+'" x2="'+x+'" y2="545" stroke="currentColor" stroke-opacity=".45" stroke-width="1.4" stroke-dasharray="5 6"/>'});
const ids=["m1","m2","m3","m4","m5","m6"];
ids.forEach((id,i)=>{
const value=getAnswer(a,id),y=142+i*67;
out+=svgText(27,y+4,String(i+1),'font-size="11"');
if(!value){out+='<line x1="85" y1="'+y+'" x2="820" y2="'+y+'" stroke="currentColor" stroke-opacity=".14" stroke-width="1" stroke-dasharray="3 5"/>';return}
const m=/^(.*?) → (.*?): (.*)$/.exec(value);if(!m)return;
const x1=centers[m[1]],x2=centers[m[2]];if(x1==null||x2==null)return;
const isReturn=/^(available|confirmed)$/.test(m[3]);
out+=svgArrow(x1+(x1<x2?8:-8),y,x2+(x1<x2?-8:8),y,isReturn);
out+=svgText((x1+x2)/2,y-9,m[3],'font-size="12"');
});
return svgFrame(900,580,out,"Instance Sequence Diagram 練習預覽，時間由上往下，虛線表示回傳");
}
function diagram(ex,answers){return ex.diagram==="usecase"?svgUsecase(answers):ex.diagram==="activity"?svgActivity(answers):ex.diagram==="class"?svgClass(answers):svgSequence(answers)}
function home(){
const done=count(),next=exercises.find(x=>!state.solved[x.id])||exercises[0],totalSlots=exercises.reduce((n,x)=>n+x.slots.length,0);
return '<section class="lab-hero"><div><div class="eyebrow">INTERACTIVE UML PRACTICE · 2026 CH3–CH5</div><h1>從看懂 UML，<br>到自己把圖組出來。</h1><p>用同一個大學選課系統，實際練習 Use-Case、Activity、Class 與 Sequence Diagram。點選或拖放卡片、檢查每一項規則，並獲得階段性提示。</p><div class="actions">'+btn(done?"繼續尚未完成的練習":"開始第一個 UML 挑戰","go-"+next.id,"primary")+'<a class="btn" href="learn.html">回到零基礎課程</a></div></div><div class="lab-hero-summary"><div class="eyebrow">已完成練習</div><strong>'+done+' / '+exercises.length+'</strong><p>共 '+totalSlots+' 個需要正確放置的建模元素；只有獨立完成才記錄通過。</p>'+bar(done,exercises.length)+'</div></section>'+
'<div class="callout"><h3>如何操作練習室？</h3><div class="lab-learnings"><div class="lab-learning"><b>01 選欄位</b>先選圖上的問題欄位。</div><div class="lab-learning"><b>02 放元件</b>點選選項，或把卡片拖入欄位；手機可用點選。</div><div class="lab-learning"><b>03 檢查與修改</b>只檢查目前題目的規則，錯誤逐項提醒。</div></div><p class="small muted">這是引導式固定模板練習，不是可任意繪圖的 UML 編輯器。通過結果代表你完成這份題目的規則檢查，不代表任意 UML 圖都已驗證。</p></div>'+
'<div class="section-head"><div><h2>四個 UML 挑戰</h2><p>建議按照 Ch3 → Ch4 → Ch5 順序完成。</p></div></div>'+
'<div class="lab-grid">'+exercises.map(ex=>{
const a=currentAnswers(ex),filled=ex.slots.filter(s=>getAnswer(a,s.id)!=null).length;
return '<article class="card"><div class="lab-card-heading"><div class="lab-round">'+escapeHTML(ex.icon)+'</div><div><span class="pill">Ch'+ex.chapter+' · '+escapeHTML(ex.level)+'</span><h3>'+escapeHTML(ex.title)+'</h3></div></div><p>'+escapeHTML(ex.subtitle)+'</p><div class="lab-smallbar">'+bar(filled,ex.slots.length)+'<span class="small muted">'+filled+'/'+ex.slots.length+' 已填</span></div><p class="small muted">'+escapeHTML(ex.duration)+' · '+(isSolved(ex)?'✓ 已通過':'尚未通過')+'</p>'+btn(isSolved(ex)?"複習這張圖":"開始組裝圖形","go-"+ex.id)+'</article>'
}).join("")+'</div>';
}
function sidebar(ex){
return '<aside class="card lab-sidebar"><h3>四個挑戰</h3><nav aria-label="UML 挑戰列表">'+exercises.map((it,i)=>
'<button type="button" class="lab-side-btn '+(it.id===ex.id?"active":"")+'" data-action="go-'+it.id+'" '+(it.id===ex.id?'aria-current="page"':'')+'><span>'+String(i+1).padStart(2,"0")+' · '+escapeHTML(it.title)+'</span>'+(isSolved(it)?'<span class="status">✓</span>':'')+'<small>Ch'+it.chapter+' · '+escapeHTML(it.level)+'</small></button>').join("")+'</nav><hr style="border:0;border-top:1px solid var(--border)">'+btn("← 返回挑戰列表","home")+'</aside>';
}
function slotCards(ex){
const answers=currentAnswers(ex),activeId=active[ex.id]||ex.slots.find(s=>getAnswer(answers,s.id)==null)?.id||ex.slots[0].id,last=feedback[ex.id];
return ex.slots.map((slot,i)=>{
const val=getAnswer(answers,slot.id),status=last?.statuses?.[slot.id],color=status==="right"?"good":status==="wrong"||status==="missing"?"bad":"";
return '<button type="button" class="lab-slot '+(activeId===slot.id?'active ':'')+color+'" data-slot="'+escapeHTML(slot.id)+'" aria-pressed="'+(activeId===slot.id?'true':'false')+'"><span class="num">SLOT '+String(i+1).padStart(2,"0")+'</span><strong>'+escapeHTML(slot.label)+'</strong><span class="answer '+(val!=null?"filled":"")+'">'+(val!=null?escapeHTML(val):'＋ 點選後選擇元素')+'</span></button>'
}).join("");
}
function palette(ex){
const activeId=active[ex.id]||ex.slots.find(s=>getAnswer(currentAnswers(ex),s.id)==null)?.id||ex.slots[0].id,slot=ex.slots.find(s=>s.id===activeId)||ex.slots[0];
return '<section class="card lab-palette"><div class="pill">TOOLBOX · 可點選或拖放</div><h2>'+escapeHTML(slot.label)+'</h2><p>選一張卡片填入目前欄位。點選其他欄位可以切換題目。</p><div class="lab-palette-items">'+opts(slot)+'</div><div class="lab-help" style="margin-top:12px"><strong>操作提示：</strong>桌面可拖放卡片到對應欄位；鍵盤、平板與手機直接點選卡片即可。</div></section>';
}
function feedbackHtml(ex){
const fb=feedback[ex.id];if(!fb)return"";
const total=ex.slots.length;
if(fb.allCorrect)return '<section class="lab-feedback success" role="status"><strong>✓ '+(fb.revealed?"所有欄位都符合答案，但已看過參考答案":"挑戰通過！這張圖已記錄為掌握")+'</strong><p>'+escapeHTML(fb.revealed?"本次不記錄新通過紀錄。點「重新獨立練習」後，重新完成才能記錄通過。":"你可以前往下一張圖，或回頭比較原始講義的 UML 標記方式。")+'</p></section>';
const wrong=ex.slots.filter(s=>fb.statuses[s.id]!=="right");
return '<section class="lab-feedback warning" role="status"><strong class="count">目前 '+fb.right+' / '+total+' 項符合本題規則</strong><p>可以保留答對的欄位，只要修改下列項目，再次檢查。</p><ul>'+
wrong.map(slot=>{
const status=fb.statuses[slot.id],revealing=Number(state.checks[ex.id]||0)>=2;
return '<li><strong>'+escapeHTML(slot.label)+'</strong>：'+(status==="missing"?"尚未填入。":"目前選擇不符合題意。")+'<br><span class="muted">'+escapeHTML(revealing?slot.why:slot.hint)+'</span></li>'
}).join("")+'</ul></section>';
}
function reference(ex){
const ans=Object.fromEntries(ex.slots.map(s=>[s.id,s.answer]));
return '<section class="lab-reference"><h3>完整參考解答</h3><p>'+escapeHTML(ex.reference)+'</p>'+
'<div class="lab-svgbox">'+diagram(ex,ans)+'</div>'+
'<dl>'+ex.slots.map(s=>'<dt>'+escapeHTML(s.label)+'</dt><dd>'+escapeHTML(s.answer)+'</dd>').join("")+'</dl>'+
'<p class="notice">這份解答已展開。本次若尚未完成挑戰，須點「重新獨立練習」並重新答對，才能取得完成紀錄。</p></section>';
}
function challenge(ex){
const a=currentAnswers(ex),filled=ex.slots.filter(s=>getAnswer(a,s.id)!=null).length,hints=hintLevel[ex.id]||0,next=exercises[exercises.findIndex(x=>x.id===ex.id)+1]||null;
return '<nav class="crumbs" aria-label="階層位置"><button type="button" data-action="home">UML 挑戰列表</button> › <strong>'+escapeHTML(ex.title)+'</strong></nav>'+
'<div class="lab-layout">'+sidebar(ex)+'<div><section class="card lab-page-header"><span class="pill">CH'+ex.chapter+'</span><span class="pill">'+escapeHTML(ex.level)+' · '+escapeHTML(ex.duration)+'</span><h1>'+escapeHTML(ex.title)+'</h1><p>'+escapeHTML(ex.subtitle)+'</p><p><strong>學習成果：</strong>'+escapeHTML(ex.objective)+'</p><p class="source">對應範圍：'+escapeHTML(ex.source)+'。本活動屬固定模板的教學練習，非教師標準答案。</p></section>'+
'<section class="card lab-scene"><span class="pill">SCENARIO</span><h2>本題業務情境</h2><p>'+escapeHTML(ex.intro)+'</p><ol>'+ex.steps.map(t=>'<li>'+escapeHTML(t)+'</li>').join("")+'</ol></section>'+
'<div class="lab-workspace"><section class="card"><h2>① 依序填入圖形元素</h2><p class="lab-hint-line">選取欄位之後，從右側工具箱選擇答案；拖拉與點選皆可。</p><div class="lab-slots">'+slotCards(ex)+'</div>'+
'<div class="lab-checkbar">'+btn("檢查作品","check-"+ex.id,"primary")+btn("💡 提示 "+(hints?String(hints)+"/2":""),"hint-"+ex.id)+btn("清除本次答案","reset-"+ex.id)+'</div>'+
(hints?'<div class="lab-help" role="note"><strong>提示 '+hints+'：</strong> '+escapeHTML(hints===1?ex.hint1:ex.hint2)+'</div>':"")+
'<p class="small muted">目前已填 '+filled+' / '+ex.slots.length+' 個欄位。'+(state.solved[ex.id]?' ✓ 先前已獨立通過此題。':'答對且未先查看完整解答才會記錄掌握。')+'</p>'+
feedbackHtml(ex)+'</section>'+palette(ex)+'</div>'+
'<section class="card lab-preview" aria-label="UML 預覽"><h2>② 即時圖形預覽</h2><p class="hint">預覽會顯示你目前放入的內容，包括可能錯誤的選擇，不代表已通過 UML 規則檢查。</p><div class="lab-svgbox" id="labDiagram">'+diagram(ex,a)+'</div><div class="lab-model-legend">圖中「？」代表尚未選擇的欄位；實際圖形應與老師的課堂 UML 標記方式核對。</div></section>'+
'<div class="lab-checkbar">'+btn(state.revealed[ex.id]?"已顯示參考答案":"查看完整參考答案","reveal-"+ex.id)+btn("重新獨立練習","restart-"+ex.id)+'</div>'+
(state.revealed[ex.id]?reference(ex):'')+
'<div class="lab-next">'+btn("← 返回練習清單","home")+(next?btn("下一個 UML 挑戰 →","go-"+next.id,"primary"):'<a class="btn primary" href="learn.html#case-5">回到跨章整合案例 →</a>')+'</div>'+
'</div></div>';
}
function route(){return decodeURIComponent(location.hash.replace(/^#/,""))||"home"}
function render(){
const id=route(),ex=model[id];
root.innerHTML=ex?challenge(ex):home();
document.title=(ex?ex.title:"UML 互動練習室")+"｜SAD Learning Studio";
}
function navigate(to){if(location.hash.slice(1)===to){render();window.scrollTo(0,0)}else location.hash=to}
function choose(slotId,index){
const ex=model[route()];if(!ex)return;
const slot=ex.slots.find(s=>s.id===slotId);if(!slot||!Number.isInteger(index)||index<0||index>=slot.options.length)return;
const drafts=state.drafts[ex.id]||{};
drafts[slot.id]=slot.options[index];
state.drafts[ex.id]=drafts;active[ex.id]=slot.id;
delete feedback[ex.id];save();render();
notice("已選擇「"+drafts[slot.id]+"」，請繼續填寫其他欄位。");
}
function grade(ex){
const answers=currentAnswers(ex),statuses={},right=ex.slots.reduce((n,s)=>{
const value=getAnswer(answers,s.id);const kind=value==null?"missing":value===s.answer?"right":"wrong";statuses[s.id]=kind;return n+(kind==="right"?1:0)},0);
state.checks[ex.id]=(Number(state.checks[ex.id])||0)+1;
const allCorrect=right===ex.slots.length;
const wasRevealed=!!state.revealed[ex.id];
if(allCorrect&&!wasRevealed)state.solved[ex.id]=true;
feedback[ex.id]={statuses,right,allCorrect,revealed:wasRevealed};save();render();
notice(allCorrect?"已完成所有欄位的規則檢查。":"目前有 "+right+" / "+ex.slots.length+" 項符合規則，請查看下方診斷。");
}
function reset(ex,clearMastery){
delete state.drafts[ex.id];delete state.revealed[ex.id];delete state.checks[ex.id];
if(clearMastery)delete state.solved[ex.id];
delete active[ex.id];delete feedback[ex.id];delete hintLevel[ex.id];
save();render();notice("已清除本次組裝，現在可以重新練習。");
}
function act(action){
if(action==="home"){navigate("home");return}
let match=action.match(/^(go|check|hint|reset|restart|reveal)-([a-z]+)$/);
if(!match||!model[match[2]])return;
const [,type,id]=match,ex=model[id];
if(type==="go"){navigate(id);return}
if(type==="check"){grade(ex);return}
if(type==="hint"){hintLevel[id]=Math.min(2,(hintLevel[id]||0)+1);render();notice("已顯示第 "+hintLevel[id]+" 階段提示。");return}
if(type==="reset"){reset(ex,false);return}
if(type==="restart"){reset(ex,false);return}
if(type==="reveal"){state.revealed[id]=true;save();render();notice("已展開完整參考解答。");return}
}
document.addEventListener("click",e=>{
const option=e.target.closest("[data-token]");if(option){const ex=model[route()],slotId=option.dataset.tokenSlot;if(ex)choose(slotId,Number(option.dataset.token));return}
const slot=e.target.closest("[data-slot]");if(slot){const ex=model[route()];if(ex&&ex.slots.some(s=>s.id===slot.dataset.slot)){active[ex.id]=slot.dataset.slot;delete feedback[ex.id];render();notice("已選取欄位，請選擇右側卡片。")}return}
const action=e.target.closest("[data-action]");if(action)act(action.dataset.action)
});
document.addEventListener("dragstart",e=>{
const token=e.target.closest("[data-token]");if(!token||!e.dataTransfer)return;
const ex=model[route()];if(!ex)return;
e.dataTransfer.setData("text/plain",JSON.stringify({ex:ex.id,slot:token.dataset.tokenSlot,index:Number(token.dataset.token)}));
e.dataTransfer.effectAllowed="copy";
});
document.addEventListener("dragover",e=>{
const target=e.target.closest("[data-slot]");if(target&&e.dataTransfer){e.preventDefault();e.dataTransfer.dropEffect="copy"}
});
document.addEventListener("drop",e=>{
const target=e.target.closest("[data-slot]");if(!target||!e.dataTransfer)return;
e.preventDefault();let payload;
try{payload=JSON.parse(e.dataTransfer.getData("text/plain"))}catch(err){return}
const ex=model[route()];if(!ex||payload.ex!==ex.id)return;
const from=ex.slots.find(x=>x.id===payload.slot),to=ex.slots.find(x=>x.id===target.dataset.slot);
if(!from||!to)return;
const value=from.options[payload.index],index=to.options.indexOf(value);
if(index<0){notice("這張卡片不屬於該欄位，請選擇相應的欄位和工具卡。");return}
choose(to.id,index);
});
window.addEventListener("hashchange",()=>{render();window.scrollTo(0,0)});
render();
window.SAD_UML_LAB_TEST={
getExercise:id=>model[id],getGrade:id=>{const ex=model[id],a=currentAnswers(ex);return ex.slots.map(s=>({id:s.id,ok:a[s.id]===s.answer}))},
setForTest:(id,sid,value)=>{const ex=model[id];if(!ex)return;const s=ex.slots.find(x=>x.id===sid);if(!s)return;choose(sid,s.options.indexOf(value))},
gradeForTest:id=>grade(model[id]),
getState:()=>JSON.parse(JSON.stringify(state)),
getPreview:id=>diagram(model[id],currentAnswers(model[id])),
getCount:count
};
})();

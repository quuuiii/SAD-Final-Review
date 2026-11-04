/* Browser-only capstone editor. All models remain local and can be exported.
   Automated checks are limited, and do not replace a UML walkthrough. */
(()=>{
"use strict";
const data=window.SAD_CAPSTONE,engine=window.SAD_CAPSTONE_ENGINE,app=document.getElementById("capstoneApp");
if(!data||!engine||!app){if(app)app.textContent="專題教材暫時無法載入";return}
const STORAGE="sad-capstone-v1",E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let state;
try{state=engine.normalize(JSON.parse(localStorage.getItem(STORAGE)||"{}"))}catch(err){state=engine.makeBlank()}
let showDiagnostics=false;
const stageIds=data.steps.map(x=>x.id),stage=()=>{let p=decodeURIComponent(location.hash.slice(1));return stageIds.includes(p)?p:"requirements"};
const title=id=>data.steps.find(x=>x.id===id)?.zh||id;
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch(err){notice("無法在此瀏覽器儲存，請立即匯出 JSON 備份")}}
function notice(s){const el=document.getElementById("capstoneNotice");if(el)el.textContent=s}
const btn=(name,action,kind="")=>'<button type="button" class="btn '+kind+'" data-action="'+E(action)+'">'+E(name)+'</button>';
const badge=s=>'<span class="cap-tag">'+E(s)+'</span>';
function progress(n,max){return '<div class="progress" role="progressbar" aria-valuenow="'+n+'" aria-valuemin="0" aria-valuemax="'+max+'" aria-label="已完成階段"><i style="width:'+(max?Math.round(n/max*100):0)+'%"></i></div>'}
function field(group,i,key,title,value,{rows=0,placeholder="",help=""}={}){
const id="field-"+group+"-"+i+"-"+key,props='id="'+E(id)+'" class="cap-input" data-group="'+E(group)+'" data-index="'+i+'" data-field="'+E(key)+'" maxlength="900" placeholder="'+E(placeholder||"請輸入內容")+'"';
const control=rows?'<textarea '+props+' rows="'+rows+'">'+E(value)+'</textarea>':'<input type="text" '+props+' value="'+E(value)+'">';
return '<div class="cap-field"><label for="'+E(id)+'">'+E(title)+'</label>'+control+(help?'<span class="cap-mini">'+E(help)+'</span>':"")+'</div>';
}
function selection(group,i,key,title,value,options){
const id="field-"+group+"-"+i+"-"+key;
return '<div class="cap-field"><label for="'+E(id)+'">'+E(title)+'</label><select id="'+E(id)+'" class="cap-input" data-group="'+E(group)+'" data-index="'+i+'" data-field="'+E(key)+'"><option value="">請選擇</option>'+options.map(v=>{const x=typeof v==="string"?v:v.value;return '<option value="'+E(x)+'" '+(value===x?'selected':'')+'>'+E(typeof v==="string"?v:v.label)+'</option>'}).join("")+'</select></div>';
}
function wrap(title,content,tag="section"){return '<'+tag+' class="cap-row"><h3>'+E(title)+'</h3>'+content+'</'+tag+'>'}
function help(){return '<details class="cap-row"><summary style="cursor:pointer;font-weight:800">對照本階段教學示例（非正式解答）</summary><p>這是本站依情境寫出的參考答案，可能存在其他合理設計。請先自行完成，再決定是否查看完整示例。</p>'+btn("載入完整示範答案（覆蓋目前作品）","sample")+'</details>'}
function requirements(){
return '<div class="cap-kicker">01 · REQUIREMENTS DEFINITION</div><h2>把模糊問題寫成五條可驗收需求</h2><p>依情境完成四條 Functional Requirements 與一條 Performance Nonfunctional Requirement，並寫出對應的驗收方式。</p>'+
state.requirements.map((r,i)=>'<section class="cap-row"><div class="cap-row-top"><h3>'+E(r.id)+' · '+E(data.requirementPrompts[i].prompt)+'</h3>'+badge(r.kind==="performance"?"Nonfunctional":"Functional")+'</div><div class="cap-form-grid">'+field("requirements",i,"text","需求敘述",r.text,{rows:3,placeholder:"系統應…",help:"清楚說明系統必須完成什麼。" })+field("requirements",i,"criterion","驗收條件",r.criterion,{rows:3,placeholder:"當…時，系統會…",help:"明確說明可以觀察、測試的成功標準。" })+'</div></section>').join("")+
'<div class="cap-note">提醒：此題的效能需求應有量化門檻。不要只寫「系統反應很快」。</div>'+help();
}
function reqLinks(u,i){
return '<div class="cap-field"><span>需求追蹤連結 Traceability</span><div class="cap-req-links">'+data.requirementPrompts.filter(x=>x.kind==="functional").map(x=>
'<label><input type="checkbox" data-req-link="'+i+'" data-req-id="'+x.id+'" '+(u.reqIds.includes(x.id)?"checked":"")+'>'+x.id+'</label>').join("")+'</div><span class="cap-mini">從使用者目標回推所支持的 Functional Requirements。</span></div>';
}
function functional(){
return '<div class="cap-kicker">02 · FUNCTIONAL MODEL</div><h2>寫出兩份完整 Use-Case Description</h2><p>分別描述學生借用器材與管理員登記歸還。請補上 Trigger、Precondition、Normal / Alternate Flows、Postcondition，以及需求 ID 連結。</p>'+
state.usecases.map((u,i)=>'<section class="cap-row"><div class="cap-row-top"><h3>'+E(u.id)+" · "+E(u.name)+'</h3>'+badge("Use-Case Description")+'</div><div class="cap-form-grid">'+selection("usecases",i,"actor","Primary Actor",u.actor,data.actors)+field("usecases",i,"trigger","Trigger",u.trigger)+field("usecases",i,"precondition","Precondition",u.precondition)+field("usecases",i,"postcondition","Postcondition",u.postcondition)+'</div><h4>Normal Flow</h4><div class="cap-edit-list">'+u.normal.map((text,j)=>field("normal",i,j,"Step "+(j+1),text,{rows:2,placeholder:"使用者或系統的一項操作"})).join("")+'</div><div style="margin-top:11px">'+field("usecases",i,"alternate","Alternate / Exception Flow",u.alternate,{rows:3})+'</div><div style="margin-top:11px">'+reqLinks(u,i)+'</div></section>').join("")+
'<div class="cap-note"><strong>模型提示：</strong>Actor 是系統外部角色，Use Case 是業務目標。完整的 Use-Case Diagram 也需正確標示 System Boundary 與 Association。</div>'+help();
}
function structural(){
return '<div class="cap-kicker">03 · STRUCTURAL MODEL</div><h2>確認 Class、Attributes 與 Operations</h2><p>從 Borrower、Equipment 和 Loan 三個候選類別出發，釐清它們的責任與互動，並指定兩端的 Multiplicity。</p>'+
state.classes.map((c,i)=>'<section class="cap-row"><h3>'+E(c.name)+'</h3><div class="cap-form-grid">'+field("classes",i,"attributes","Attributes（逗號分隔）",c.attributes,{rows:2})+field("classes",i,"operations","Operations（逗號分隔）",c.operations,{rows:2})+'</div><div style="margin-top:10px">'+field("classes",i,"responsibility","CRC：Responsibility",c.responsibility,{rows:2})+'</div></section>').join("")+
'<h3>Associations & Multiplicity</h3>'+state.associations.map((a,i)=>'<section class="cap-row"><h3>'+E(a.left)+" ↔ "+E(a.right)+'</h3><div class="cap-form-grid">'+selection("associations",i,"leftMultiplicity",a.left+" 端",a.leftMultiplicity,["1","0..1","0..*","1..*"])+selection("associations",i,"rightMultiplicity",a.right+" 端",a.rightMultiplicity,["1","0..1","0..*","1..*"])+'</div><div style="margin-top:10px">'+field("associations",i,"meaning","關係的業務語意",a.meaning,{rows:2})+'</div></section>').join("")+
'<div class="cap-note">每筆 Loan 都對應一位 Borrower、一件 Equipment；同一位學生與同一件器材可以各自對應多筆<b>歷史</b>借用紀錄。</div>'+preview("class")+help();
}
function crudeFields(row,i){
return '<div class="cap-req-links">'+["C","R","U","D","E"].map(op=>'<label title="'+E({C:"Create",R:"Read",U:"Update",D:"Delete",E:"Execute"}[op])+'"><input data-crude="'+i+'" data-op="'+op+'" type="checkbox" '+(row.ops.includes(op)?"checked":"")+'>'+op+'</label>').join("")+'</div>';
}
function behavioral(){
return '<div class="cap-kicker">04 · BEHAVIORAL MODEL</div><h2>完成訊息序列、狀態機與 CRUDE</h2><p>先建模成功借用的一條 Instance Sequence 流程，再用 State Machine 和 CRUDE 檢查借用與歸還的操作。</p>'+
'<h3>UC-01 · Borrow Equipment / Success</h3>'+
state.messages.map((m,i)=>'<section class="cap-row"><div class="cap-row-top"><h3>Message '+(i+1)+'</h3><span class="cap-mini">'+E(data.sequencePrompts[i].hint)+'</span></div><div class="cap-form-grid">'+selection("messages",i,"from","Sender",m.from,data.participants)+selection("messages",i,"to","Receiver",m.to,data.participants)+selection("messages",i,"kind","Message Type",m.kind,[{value:"call",label:"Call →"},{value:"return",label:"Return ⇢"}])+field("messages",i,"message","Message",m.message,{placeholder:"checkAvailability()"})+'</div></section>').join("")+
'<h3>Equipment · State Machine</h3>'+state.transitions.map((t,i)=>'<section class="cap-row"><h3>Transition '+(i+1)+'</h3><div class="cap-form-grid">'+field("transitions",i,"from","From State",t.from)+field("transitions",i,"to","To State",t.to)+field("transitions",i,"event","Event",t.event)+'</div></section>').join("")+
'<h3>CRUDE Matrix</h3><p class="cap-help-text">C = Create、R = Read、U = Update、D = Delete、E = Execute。</p>'+
state.crude.map((r,i)=>'<section class="cap-row"><div class="cap-row-top"><strong>'+E(r.usecase)+" × "+E(r.target)+'</strong>'+badge("CRUDE")+'</div>'+crudeFields(r,i)+'</section>').join("")+
preview("sequence")+preview("state")+help();
}
function preview(type){
const code=type==="class"?engine.classMermaid(state):type==="sequence"?engine.sequenceMermaid(state):engine.stateMermaid(state);
const title=type==="class"?"Class Diagram":type==="sequence"?"Sequence Diagram":"Equipment State Machine";
return '<section class="cap-uml"><h3>'+title+' · 草稿預覽</h3><p class="cap-mini">在下方可查看 Mermaid 原始碼。圖形需要載入 Mermaid；若載入失敗，原始碼仍可使用。</p><div class="cap-graph" data-graph-type="'+type+'"><pre class="mermaid">'+E(code)+'</pre></div><details><summary>檢查原始碼</summary><pre>'+E(code)+'</pre></details></section>';
}
function traceTable(){
const infoMap={
"FR-01":"Equipment.checkAvailability()、UC-01",
"FR-02":"UC-01、Loan.create()、Equipment.markOnLoan()",
"FR-03":"UC-01 的 Alternate Flow（額滿拒絕）",
"FR-04":"UC-02、Loan.close()、Equipment.markAvailable()",
"NFR-01":"Requirements Definition 中的效能量測"
};
return '<div class="cap-trace-table"><table><thead><tr><th>Requirement</th><th>Linked Use Case</th><th>應核對的模型</th></tr></thead><tbody>'+state.requirements.map(r=>{
const links=state.usecases.filter(u=>u.reqIds.includes(r.id)).map(x=>x.id);
return '<tr><td><b>'+E(r.id)+'</b><div class="cap-mini">'+E(r.kind)+'</div></td><td>'+E(links.join(", ")||"（尚未連結）")+'</td><td>'+E(infoMap[r.id])+'</td></tr>'
}).join("")+'</tbody></table></div>';
}
function diagnostic(overview=false){
const report=engine.inspect(state),list=overview?report.checks:report.checks.filter(x=>x.stage===stage());
return '<div class="cap-health"><div class="card"><strong>'+report.counts.fix+'</strong><span class="small">預設規則待修正</span></div><div class="card"><strong>'+report.counts.review+'</strong><span class="small">需人工確認／提醒</span></div><div class="card"><strong>'+state.manual.filter(Boolean).length+'/4</strong><span class="small">人工走查勾選</span></div></div>'+
'<div class="cap-issues">'+(list.length?list.map(x=>'<div class="cap-issue '+(x.severity==="review"?"review":"")+'"><b>'+(x.severity==="review"?"人工確認":"規則待修正")+' · '+E(title(x.stage))+'</b>'+E(x.message)+'</div>').join(""):'<div class="cap-issue pass">✓ 目前沒有檢測到預設規則錯誤；請仍完成人工語意走查。</div>')+'</div>';
}
function review(){
const report=engine.inspect(state);
return '<div class="cap-kicker">05 · CROSS-MODEL VERIFICATION / VALIDATION</div><h2>檢查每個模型是否在描述同一件事</h2><p>確認需求能被 Use Case 支持、類別有對應操作，訊息順序、狀態轉移與 CRUDE 沒有互相矛盾。</p>'+
'<div class="cap-note"><b>自動檢查的限制：</b>可以檢查明確的 ID、固定方向、關聯數量與操作名稱，但不能可靠判定你自由撰寫的需求或 UML 語意是否合理。老師或同學仍需逐圖討論。</div>'+
'<h3>Requirements → Use Case → Behavioral Evidence</h3>'+traceTable()+
'<h3>人工 Walkthrough</h3><div class="cap-check-list">'+data.manualPrompts.map((s,i)=>'<label class="cap-check"><input type="checkbox" data-manual="'+i+'" '+(state.manual[i]?"checked":"")+'><span>'+E(s)+'</span></label>').join("")+'</div>'+
'<div class="cap-actions">'+btn("執行跨模型檢查","check-all","primary")+'</div>'+
(showDiagnostics?diagnostic(true):'<p class="cap-help-text">按上方按鈕檢查需求、類別操作、訊息與 CRUDE 的連結。</p>')+
'<section class="cap-result-summary"><h3>將自己的作品帶走</h3><p>可匯出 Markdown 報告或 JSON 草稿。JSON 可在同一瀏覽器或其他裝置重新匯入後繼續編輯。</p><div class="cap-actions">'+btn("匯出 Markdown 報告","export-md")+btn("備份 JSON 草稿","export-json")+btn("匯入 JSON","import-json")+btn("列印目前頁面","print")+'</div><p class="cap-credits">檢測提示：'+report.counts.fix+' 項待修正，'+report.counts.review+' 項提醒。'+(state.referenceUsed?"本作品已載入過本站參考解答，不能作為獨立作答成果。":"本作品未標記載入示範答案。")+'</p></section>'+help();
}
function activeEditor(){
switch(stage()){
case"requirements":return requirements();
case"functional":return functional();
case"structural":return structural();
case"behavioral":return behavioral();
default:return review();
}
}
function nav(){
return '<nav class="cap-roadmap" aria-label="專題學習五階段">'+data.steps.map((p,i)=>
'<button class="cap-step-btn '+(stage()===p.id?"active":"")+'" data-go="'+p.id+'" '+(stage()===p.id?'aria-current="step"':'')+'><span class="cap-num">'+(i+1)+'</span><span><b>'+E(p.zh)+'</b></span><small>'+E(p.id)+'</small></button>').join("")+'</nav>';
}
function stepCount(){
const r=engine.inspect(state),n=data.steps.filter(s=>r.stages[s.id].fix===0).length;
return n;
}
function side(){
const p=data.steps.find(s=>s.id===stage()),report=engine.inspect(state);
return '<aside class="card cap-side"><h3>這一站要完成什麼？</h3><p>'+E(p.goal)+'</p><div class="cap-note"><b>提示：</b>'+E(p.hint)+'</div><h3>本階段診斷</h3><p>結構問題：'+report.stages[p.id].fix+' 項<br>需人工確認：'+report.stages[p.id].review+' 項</p>'+
btn("檢查當前階段","check-"+stage())+
'<p class="cap-source">對照範圍：'+E(p.source)+'。本站範例是教學改編。</p><hr style="border:0;border-top:1px solid var(--border);margin:14px 0">'+
'<h3>作品管理</h3>'+btn("匯出 JSON 備份","export-json")+btn("匯入 JSON 備份","import-json")+btn("清空並重新開始","reset")+'</aside>';
}
function render(){
const done=stepCount(),position=stageIds.indexOf(stage());
app.innerHTML='<section class="cap-hero"><div><span class="eyebrow">END-TO-END · CAPSTONE PROJECT</span><h1>從零設計一套<br>'+E(data.title)+'</h1><p>'+E(data.brief)+'</p><div class="actions"><a class="btn" href="learn.html">回零基礎教材</a><a class="btn" href="uml-lab.html">複習 UML 練習室</a></div></div><div class="cap-hero-stat"><div class="eyebrow">Structure Checks</div><strong>'+done+' / 5</strong>'+progress(done,5)+'<span>僅表示固定規則暫時沒有待修正項目，不代表老師評分或完整驗證</span></div></section>'+
nav()+'<div class="cap-brief"><h3>這次換你當系統分析師</h3><p>'+E(data.brief)+'</p><div class="cap-mini">本情境是本站設計的原創簡化案例，不是 2026 正式考題或教授標準解答。</div></div>'+
'<div class="cap-page"><section class="card cap-editor">'+activeEditor()+
(stage()!=="review"?'<div class="cap-actions">'+btn("檢查本階段","check-"+stage(),"primary")+'</div>'+(showDiagnostics?diagnostic():""):"")+
'<div class="cap-nav-bottom">'+(position>0?btn("← 上一階段","go-"+stageIds[position-1]):'<a class="btn" href="learn.html">← 回自學教室</a>')+
(position<4?btn("下一階段 →","go-"+stageIds[position+1],"primary"):btn("重新檢查全部","check-all","primary"))+'</div></section>'+side()+'</div>';
document.title=E(data.title)+" · "+E(title(stage()))+"｜SAD Learning Studio";
showMermaid();
}
let mermaid=null;
async function showMermaid(){
const blocks=[...document.querySelectorAll(".cap-graph .mermaid")];if(!blocks.length)return;
try{
 if(!mermaid){const module=await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs");mermaid=module.default;mermaid.initialize({startOnLoad:false,securityLevel:"strict",theme:"default"})}
 await mermaid.run({nodes:blocks.filter(x=>x.isConnected)});
}catch(err){
 blocks.forEach(el=>{if(!el.isConnected)return;el.style.whiteSpace="pre-wrap";el.closest(".cap-uml")?.insertAdjacentHTML("beforeend",'<p class="cap-mini">Mermaid 圖形載入失敗，請查看原始碼。</p>')});
}
}
function download(name,content,mime){
const a=document.createElement("a"),url=URL.createObjectURL(new Blob([content],{type:mime}));
a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function action(name){
if(name.startsWith("go-")){go(name.slice(3));return}
if(name.startsWith("check-")){showDiagnostics=true;render();notice("已更新模型規則診斷");return}
if(name==="reset"){if(confirm("確定清空整份作品及本機進度？請先匯出備份。")){state=engine.makeBlank();save();showDiagnostics=false;render()}return}
if(name==="sample"){if(confirm("示範答案會覆寫目前的全部草稿，是否確定？")){state=engine.sample();save();showDiagnostics=true;render();notice("已載入參考答案，並標記非獨立作答。")}return}
if(name==="export-md"){download("SAD-Capstone-Report.md",engine.markdown(state),"text/markdown;charset=utf-8");return}
if(name==="export-json"){download("SAD-Capstone-Backup.json",JSON.stringify(state,null,2),"application/json;charset=utf-8");return}
if(name==="import-json"){document.getElementById("capstoneImport")?.click();return}
if(name==="print"){window.print();return}
}
document.addEventListener("click",event=>{
const button=event.target.closest("[data-action]");if(button){action(button.dataset.action);return}
const navButton=event.target.closest("[data-go]");if(navButton)go(navButton.dataset.go);
});
document.addEventListener("input",event=>{
const input=event.target.closest("[data-group]");if(!input)return;
const group=input.dataset.group,index=Number(input.dataset.index),f=input.dataset.field;
if(group==="normal"){if(state.usecases[index]?.normal[f]!==undefined)state.usecases[index].normal[f]=input.value}
else if(state[group]?.[index]&&typeof state[group][index][f]==="string")state[group][index][f]=input.value;
save();showDiagnostics=false;
});
document.addEventListener("change",event=>{
const el=event.target;
if(el.matches("[data-req-link]")){
const uc=state.usecases[Number(el.dataset.reqLink)],id=el.dataset.reqId;
if(!uc||!state.requirements.some(r=>r.id===id))return;
uc.reqIds=el.checked?[...new Set([...uc.reqIds,id])]:uc.reqIds.filter(x=>x!==id);
}else if(el.matches("[data-crude]")){
const row=state.crude[Number(el.dataset.crude)],op=el.dataset.op;if(!row||!["C","R","U","D","E"].includes(op))return;
row.ops=el.checked?[...new Set([...row.ops,op])]:row.ops.filter(x=>x!==op);
}else if(el.matches("[data-manual]"))state.manual[Number(el.dataset.manual)]=el.checked;
else if(el.matches("select[data-group]")){const x=state[el.dataset.group]?.[Number(el.dataset.index)];if(x)x[el.dataset.field]=el.value}
else return;
save();showDiagnostics=false;
});
document.getElementById("capstoneImport")?.addEventListener("change",async event=>{
const f=event.target.files?.[0];if(!f)return;
if(f.size>2_000_000){notice("JSON 檔案過大，請確認是否為本站匯出的備份");event.target.value="";return}
try{const raw=JSON.parse(await f.text());if(!raw||raw.version!==1||!Array.isArray(raw.requirements)||!Array.isArray(raw.usecases))throw Error("檔案內容不是本站的專題備份");
const imported=engine.normalize(raw);
if(confirm("確定匯入這份備份並覆蓋目前草稿？")){state=imported;save();showDiagnostics=false;render();notice("匯入成功")}else notice("已取消匯入");
}catch(err){notice("無法匯入：檔案不是有效的 SAD 專題 JSON 備份")}
event.target.value="";
});
window.addEventListener("hashchange",()=>{showDiagnostics=false;render();window.scrollTo(0,0)});
render();
window.SAD_CAPSTONE_TEST={getState:()=>JSON.parse(JSON.stringify(state)),getStep:stage,inspect:()=>engine.inspect(state),loadDemo:()=>{state=engine.sample();save();render()},update:next=>{state=engine.normalize(next);save();render()}};
})();
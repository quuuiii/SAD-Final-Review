/* SAD Capstone data model, deterministic rule checker and export builders.
 * Rule checks cover specified fields and cross-model links only, not general UML correctness. */
(function(){
"use strict";
const data=window.SAD_CAPSTONE;
if(!data)return;
const clone=x=>JSON.parse(JSON.stringify(x));
const cap=(value,max=900)=>String(value??"").slice(0,max);
const plain=s=>cap(s).trim();
const words=s=>plain(s).toLowerCase();
function makeBlank(){
return {
  version:1,referenceUsed:false,
  requirements:data.requirementPrompts.map(p=>({id:p.id,kind:p.kind,text:"",criterion:""})),
  usecases:data.useCasePrompts.map(p=>({id:p.id,name:p.name,actor:"",trigger:"",precondition:"",postcondition:"",normal:p.normal.map(() => ""),alternate:"",reqIds:[]})),
  classes:data.classPrompts.map(p=>({name:p.name,attributes:"",operations:"",responsibility:""})),
  associations:data.associations.map(p=>({left:p.left,right:p.right,leftMultiplicity:"",rightMultiplicity:"",meaning:""})),
  messages:data.sequencePrompts.map(()=>({from:"",to:"",kind:"call",message:""})),
  transitions:data.statePrompts.map(p=>({object:p.object,from:"",to:"",event:""})),
  crude:data.crudePrompts.map(p=>({usecase:p.usecase,target:p.target,ops:[]})),
  manual:data.manualPrompts.map(()=>false)
};
}
function sample(){
const s=makeBlank();
s.referenceUsed=true;
s.requirements.forEach((v,i)=>{v.text=data.requirementPrompts[i].sample;v.criterion=data.requirementPrompts[i].criterion});
s.usecases.forEach((u,i)=>{
const p=data.useCasePrompts[i];
u.actor=p.actor;u.trigger=p.trigger;u.precondition=p.precondition;u.postcondition=p.postcondition;
u.normal=p.normal.slice();u.alternate=p.alternate;u.reqIds=p.req.slice();
});
s.classes.forEach((c,i)=>{const p=data.classPrompts[i];c.attributes=p.attributes;c.operations=p.operations;c.responsibility=p.responsibility});
s.associations.forEach((a,i)=>{const p=data.associations[i];a.leftMultiplicity=p.leftMultiplicity;a.rightMultiplicity=p.rightMultiplicity;a.meaning=p.meaning});
s.messages=data.sequencePrompts.map(p=>({from:p.from,to:p.to,kind:p.kind,message:p.message}));
s.transitions=data.statePrompts.map(p=>({object:p.object,from:p.from,to:p.to,event:p.event}));
s.crude=data.crudePrompts.map(p=>({usecase:p.usecase,target:p.target,ops:p.ops.slice()}));
return s;
}
function normalize(raw){
const s=makeBlank();
if(!raw||typeof raw!=="object"||raw.version!==1)return s;
s.referenceUsed=!!raw.referenceUsed;
const copyFields=(target,from,keys)=>{
for(const key of keys)if(typeof from?.[key]==="string")target[key]=cap(from[key]);
};
if(Array.isArray(raw.requirements))s.requirements.forEach((r,i)=>{const x=raw.requirements.find(x=>x?.id===r.id)||raw.requirements[i];copyFields(r,x,["text","criterion"])});
if(Array.isArray(raw.usecases))s.usecases.forEach((u,i)=>{
const x=raw.usecases.find(x=>x?.id===u.id)||raw.usecases[i];
copyFields(u,x,["actor","trigger","precondition","postcondition","alternate"]);
if(Array.isArray(x?.normal))u.normal=u.normal.map((_,j)=>cap(x.normal[j]));
if(Array.isArray(x?.reqIds))u.reqIds=[...new Set(x.reqIds.filter(z=>s.requirements.some(r=>r.id===z)))].slice(0,6);
});
if(Array.isArray(raw.classes))s.classes.forEach((c,i)=>{const x=raw.classes.find(x=>x?.name===c.name)||raw.classes[i];copyFields(c,x,["attributes","operations","responsibility"])});
if(Array.isArray(raw.associations))s.associations.forEach((a,i)=>copyFields(a,raw.associations[i],["leftMultiplicity","rightMultiplicity","meaning"]));
if(Array.isArray(raw.messages))s.messages.forEach((m,i)=>{
const x=raw.messages[i];copyFields(m,x,["message"]);
if(data.participants.includes(x?.from))m.from=x.from;
if(data.participants.includes(x?.to))m.to=x.to;
if(["call","return"].includes(x?.kind))m.kind=x.kind;
});
if(Array.isArray(raw.transitions))s.transitions.forEach((t,i)=>copyFields(t,raw.transitions[i],["from","to","event"]));
if(Array.isArray(raw.crude))s.crude.forEach((c,i)=>{const x=raw.crude.find(x=>x?.usecase===c.usecase&&x?.target===c.target)||raw.crude[i];if(Array.isArray(x?.ops))c.ops=[...new Set(x.ops.filter(o=>["C","R","U","D","E"].includes(o)))]});
if(Array.isArray(raw.manual))s.manual=s.manual.map((_,i)=>raw.manual[i]===true);
return s;
}
function issue(stage,code,message,severity="fix"){
return {stage,code,message,severity};
}
function inspect(raw){
const s=normalize(raw),checks=[];
const add=(stage,code,msg,severity)=>checks.push(issue(stage,code,msg,severity));
s.requirements.forEach(r=>{
if(plain(r.text).length<15)add("requirements",r.id+"-text",r.id+" 需求敘述過短，請清楚寫出角色、動作及規則。");
if(plain(r.criterion).length<10)add("requirements",r.id+"-criterion",r.id+" 缺少具體的驗收條件，請描述可觀察或可測試的結果。");
if(r.kind==="performance"&&!/\d/.test(r.text+" "+r.criterion))add("requirements",r.id+"-measure","效能需求必須包含可量測的數字或門檻。");
if(/很快|方便|好用|美觀|穩定/.test(r.text)&&!/(\d|秒|ms|%)/i.test(r.text+" "+r.criterion))add("requirements",r.id+"-vague","需求包含模糊形容詞；建議加入可檢驗條件。","review");
});
s.usecases.forEach((u,i)=>{
const expect=data.useCasePrompts[i];
if(u.actor!==expect.actor)add("functional",u.id+"-actor",u.id+" 的主要 Actor 應依本案例選擇 "+expect.actor+"。");
for(const f of ["trigger","precondition","postcondition","alternate"])if(plain(u[f]).length<10)add("functional",u.id+"-"+f,u.id+" 的 "+({trigger:"Trigger",precondition:"Precondition",postcondition:"Postcondition",alternate:"Alternate Flow"}[f])+" 尚未完整說明。");
u.normal.forEach((t,j)=>{if(plain(t).length<10)add("functional",u.id+"-normal-"+j,u.id+" 正常流程步驟 "+(j+1)+" 尚未寫清楚。")});
expect.req.forEach(r=>{if(!u.reqIds.includes(r))add("functional",u.id+"-"+r,u.id+" 尚未連結需求 "+r+"。請明確建立 Traceability。")});
});
s.classes.forEach((c,i)=>{
for(const field of ["attributes","operations","responsibility"])if(plain(c[field]).length<3)add("structural",c.name+"-"+field,c.name+" 缺少 "+({attributes:"Attribute",operations:"Operation",responsibility:"Responsibility"}[field])+"。");
const required={Borrower:[],Equipment:["checkAvailability","markOnLoan","markAvailable"],Loan:["create","close"]}[c.name]||[];
const ops=c.operations.split(/[,\n;]/).map(x=>words(x).replace(/\(.*$/,"").trim());
required.forEach(op=>{if(!ops.includes(op.toLowerCase()))add("structural",c.name+"-"+op,c.name+" 缺少本題協作流程所需的操作 "+op+"()。")});
});
s.associations.forEach((a,i)=>{
const expect=data.associations[i];
if(a.leftMultiplicity!==expect.leftMultiplicity||a.rightMultiplicity!==expect.rightMultiplicity)
add("structural","association-"+i,expect.left+"–"+expect.right+" 的 Multiplicity 應為 "+expect.leftMultiplicity+" — "+expect.rightMultiplicity+"（代表歷史借用紀錄）。");
if(plain(a.meaning).length<8)add("structural","meaning-"+i,expect.left+"–"+expect.right+" 尚未說明關係的業務意義。");
});
s.messages.forEach((m,i)=>{
const expect=data.sequencePrompts[i];
if(!m.from||!m.to||plain(m.message).length<3)add("behavioral","message-"+i,"Sequence 第 "+(i+1)+" 則訊息尚未填完整。");
else{
if(m.from!==expect.from||m.to!==expect.to)add("behavioral","message-direction-"+i,"Sequence 第 "+(i+1)+" 則訊息方向與本教學案例的參與者互動不一致：預期 "+expect.from+" → "+expect.to+"。");
if(m.kind!==expect.kind)add("behavioral","message-type-"+i,"Sequence 第 "+(i+1)+" 則訊息應使用 "+(expect.kind==="return"?"return 虛線":"call 實線")+" 表示。");
const expName=words(expect.message).split("(")[0];
if(!words(m.message).includes(expName))add("behavioral","message-operation-"+i,"Sequence 第 "+(i+1)+" 則訊息尚未表達 "+expect.message+" 的行為。","review");
}
});
s.transitions.forEach((t,i)=>{
const expect=data.statePrompts[i];
if(!plain(t.from)||!plain(t.to)||!plain(t.event))add("behavioral","transition-"+i,"State Machine 轉移 "+(i+1)+" 尚未完整填寫。");
else if(t.from!==expect.from||t.to!==expect.to)add("behavioral","transition-direction-"+i,"Equipment 在此案例應由 "+expect.from+" 轉成 "+expect.to+"。");
});
s.crude.forEach((row,i)=>{
const need=data.crudePrompts[i].ops;
need.forEach(op=>{if(!row.ops.includes(op))add("behavioral","crude-"+i+"-"+op,row.usecase+" × "+row.target+" 缺少 CRUDE 操作 "+op+"。")});
});
const byId=Object.fromEntries(s.usecases.map(x=>[x.id,x]));
for(const r of s.requirements){
if(r.kind==="functional"&&!s.usecases.some(u=>u.reqIds.includes(r.id)))add("review","uncovered-"+r.id,r.id+" 尚未連結到任何 Use Case。");
}
const equipped=s.classes.find(c=>c.name==="Equipment"),loan=s.classes.find(c=>c.name==="Loan");
const ops=(c)=>new Set((c?.operations||"").split(/[,\n;]/).map(x=>words(x).replace(/\(.*$/,"").trim()));
s.messages.forEach((m,i)=>{
if(m.kind!=="call"||!["Equipment","Loan"].includes(m.to)||!m.message.trim())return;
const op=words(m.message).match(/^[a-z_][\w]*/)?.[0];
if(op&&!ops(m.to==="Equipment"?equipped:loan).has(op))add("review","unmatched-operation-"+i,
"Sequence 第 "+(i+1)+" 則訊息呼叫 "+m.to+"."+op+"()，但 Class 的 Operations 中找不到同名操作。");
});
if(byId["UC-02"]?.reqIds.includes("FR-04")&&
 !s.transitions.some(t=>t.from==="OnLoan"&&t.to==="Available"))add("review","return-state","FR-04 已連結 UC-02，但 Equipment 的 OnLoan → Available 歸還轉移不存在。");
if(byId["UC-01"]?.reqIds.includes("FR-02")&&
 !s.crude.some(x=>x.usecase==="UC-01"&&x.target==="Loan"&&x.ops.includes("C")))add("review","create-loan","FR-02 的借用建立流程缺少 UC-01 × Loan 的 Create 操作。");
if(byId["UC-02"]?.reqIds.includes("FR-04")&&
 !s.crude.some(x=>x.usecase==="UC-02"&&x.target==="Loan"&&x.ops.includes("U")))add("review","close-loan","FR-04 歸還流程需要更新 Loan，但 CRUDE 尚未標記 Update。");
s.manual.forEach((done,i)=>{if(!done)add("review","manual-"+i,"人工走查待確認："+data.manualPrompts[i],"review")});
return {
checks,
counts:{fix:checks.filter(x=>x.severity==="fix").length,review:checks.filter(x=>x.severity==="review").length},
stages:Object.fromEntries(data.steps.map(step=>[step.id,{
fix:checks.filter(x=>x.stage===step.id&&x.severity==="fix").length,
review:checks.filter(x=>x.stage===step.id&&x.severity==="review").length
}]))
};
}
const safeToken=x=>plain(x).replace(/[\r\n"<>;{}]/g," ").replace(/[#:]/g," ").slice(0,75)||"?";
function usecasePlantUml(s){
const lines=["@startuml","left to right direction",'actor "Borrower" as Borrower','actor "Staff" as Staff',
'rectangle "Campus Equipment Loan System" {',
'  usecase "Borrow Equipment" as UC01',
'  usecase "Return Equipment" as UC02',
"}","Borrower --> UC01","Staff --> UC02","@enduml"];
return lines.join("\n");
}
function classMermaid(raw){
const s=normalize(raw),out=["classDiagram"];
s.classes.forEach(c=>{
out.push("  class "+c.name+" {");
c.attributes.split(/[,\n;]/).map(plain).filter(Boolean).forEach(x=>out.push("    +"+safeToken(x)));
c.operations.split(/[,\n;]/).map(plain).filter(Boolean).forEach(x=>out.push("    +"+safeToken(x).replace(/\(\)/g,"")+"()"));
out.push("  }");
});
s.associations.forEach(a=>out.push('  '+a.left+' "'+safeToken(a.leftMultiplicity)+'" -- "'+safeToken(a.rightMultiplicity)+'" '+a.right));
return out.join("\n");
}
function sequenceMermaid(raw){
const s=normalize(raw),out=["sequenceDiagram","  actor Borrower","  participant LoanUI","  participant LoanController","  participant Equipment","  participant Loan"];
s.messages.forEach(m=>{if(!m.from||!m.to||!plain(m.message))return;
out.push("  "+m.from+(m.kind==="return"?"-->>":"->>")+m.to+": "+safeToken(m.message))
});
return out.join("\n");
}
function stateMermaid(raw){
const s=normalize(raw),out=["stateDiagram-v2","  [*] --> Available"];
s.transitions.forEach(t=>{if(t.from&&t.to)out.push("  "+safeToken(t.from)+" --> "+safeToken(t.to)+(t.event?" : "+safeToken(t.event):""))});
return out.join("\n");
}
function markdown(raw){
const s=normalize(raw),v=inspect(s),escapeTable=x=>plain(x).replace(/\|/g,"\\|").replace(/\n/g," ");
const fences="\x60\x60\x60";
const out=[
"# SAD Capstone · "+data.title,
"",
"> 本作品為「校園器材借用系統」原創教學案例，非正式教師解答；自動檢查是固定範圍的結構／追蹤規則，不取代業務語意與 UML 人工走查。",
"",
"## 情境",
data.brief,
"",
"## 1. Requirements Definition",
"| ID | Type | Requirement | Acceptance Criterion |",
"|---|---|---|---|"
];
s.requirements.forEach(r=>out.push("| "+r.id+" | "+r.kind+" | "+escapeTable(r.text)+" | "+escapeTable(r.criterion)+" |"));
out.push("","## 2. Use-Case Descriptions","");
s.usecases.forEach(u=>{
out.push("### "+u.id+" "+u.name);
out.push("- Primary Actor: "+u.actor);
out.push("- Related Requirements: "+u.reqIds.join(", "));
out.push("- Trigger: "+u.trigger,"- Preconditions: "+u.precondition);
out.push("- Normal Flow:");
u.normal.forEach((n,i)=>out.push("  "+(i+1)+". "+n));
out.push("- Alternate / Exception Flow: "+u.alternate);
out.push("- Postconditions: "+u.postcondition,"");
});
out.push("### Use-Case Diagram（PlantUML 原始碼）",fences+"plantuml",usecasePlantUml(s),fences,"");
out.push("## 3. Structural Model");
out.push("| Class | Attributes | Operations | Responsibilities |","|---|---|---|---|");
s.classes.forEach(c=>out.push("| "+c.name+" | "+escapeTable(c.attributes)+" | "+escapeTable(c.operations)+" | "+escapeTable(c.responsibility)+" |"));
s.associations.forEach(a=>out.push("- "+a.left+" "+a.leftMultiplicity+" -- "+a.rightMultiplicity+" "+a.right+": "+a.meaning));
out.push("",fences+"mermaid",classMermaid(s),fences,"");
out.push("## 4. Behavioral Model","");
out.push("### Instance Sequence Diagram · UC-01 Borrow Equipment",fences+"mermaid",sequenceMermaid(s),fences,"");
out.push("### Equipment State Machine",fences+"mermaid",stateMermaid(s),fences,"");
out.push("### CRUDE Matrix","| Use Case | Class | Operations |","|---|---|---|");
s.crude.forEach(r=>out.push("| "+r.usecase+" | "+r.target+" | "+r.ops.join(", ")+" |"));
out.push("","## 5. Cross-Model Verification & Validation");
out.push("- Rule-based missing / inconsistent items: "+v.counts.fix);
out.push("- Reminders and manual review items: "+v.counts.review);
v.checks.forEach(x=>out.push("- ["+x.severity.toUpperCase()+"] "+x.message));
out.push("","### Manual Walkthrough");
data.manualPrompts.forEach((x,i)=>out.push("- ["+(s.manual[i]?"x":" ")+"] "+x));
out.push("","**Notice:** 全部自動規則通過仍不表示模型完全正確；需持續核對情境、老師講義、圖形語意與跨模型一致性。");
if(s.referenceUsed)out.push("**Reference note:** 本專題使用過示範答案；不應作為獨立作答成績。");
out.push("");
return out.join("\n");
}
window.SAD_CAPSTONE_ENGINE={makeBlank,sample,normalize,inspect,usecasePlantUml,classMermaid,sequenceMermaid,stateMermaid,markdown};
})();

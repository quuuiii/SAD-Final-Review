/* Capstone scenario and teaching rubric.
   The campus equipment loan system and solution are original teaching adaptations,
   derived from the learning goals of the 2026 Ch2–Ch5 course slides.
   They are not an official assignment or instructor answer key. */
window.SAD_CAPSTONE={
version:1,
title:"校園器材借用系統",
englishTitle:"Campus Equipment Loan System",
brief:"學校提供學生借用相機、投影機與麥克風。學生希望先查看器材是否可借，再送出借用申請；系統只能在器材可借時建立借用紀錄。管理員在學生歸還器材後，應能完成歸還登記。系統也須有可測量的查詢回應時間目標。",
actors:["Borrower","Staff"],
classes:["Borrower","Equipment","Loan"],
participants:["Borrower","LoanUI","LoanController","Equipment","Loan"],
steps:[
{id:"requirements",title:"1. Requirements Definition",zh:"需求定義",goal:"寫出五條明確、可驗收且可追溯的需求。",hint:"Functional 說明系統要提供的功能；Performance 類型的 NFR 需有可量測的指標。",source:"2026 Ch02 Requirements Determination：Functional / Nonfunctional Requirements、Requirements Definition"},
{id:"functional",title:"2. Functional Model",zh:"功能模型",goal:"為借用與歸還各寫一份 Use-Case Description，連結需求。",hint:"Use Case 應描述使用者目標，並寫出 Actor、Trigger、Precondition、Normal Flow、Alternate Flow、Postcondition。",source:"2026 Ch3 Functional Modeling：Use-Case Diagram、Activity Diagram、UCD、V&V"},
{id:"structural",title:"3. Structural Model",zh:"結構模型",goal:"識別類別、屬性、操作與 Multiplicity。",hint:"類別對應問題領域的物件與責任。Loan 可保存借用紀錄，Equipment 可判定是否可借。",source:"2026 Ch4 Structural Modeling：CRC Cards、Class Diagram、Multiplicity、V&V"},
{id:"behavioral",title:"4. Behavioral Model",zh:"行為模型",goal:"寫出借用成功的 Sequence 與器材狀態轉移，填寫 CRUDE 矩陣。",hint:"Sequence 表示訊息順序；State Machine 描述單一物件的狀態；CRUDE 檢查物件操作。",source:"2026 Ch5 Behavioral Modeling：Instance Sequence Diagram、State Machine、CRUDE"},
{id:"review",title:"5. Cross-Model V&V",zh:"跨模型驗證與成果匯出",goal:"檢查 Requirements、Use Case、Class 與 Behavior 之間的對應，修正衝突後輸出作品。",hint:"確認各模型是否互相支援。自動檢查僅涵蓋欄位完整度與已定義的跨模型連結；真實業務語意仍需人工走查。",source:"2026 Ch3–Ch5 各章：Verification & Validation／模型一致性"}
],
requirementPrompts:[
{id:"FR-01",kind:"functional",prompt:"學生查詢器材是否可借",sample:"系統應允許 Borrower 查詢各器材目前是否可借。",criterion:"選取任一器材時，顯示其可借狀態。"},
{id:"FR-02",kind:"functional",prompt:"可借時建立借用",sample:"當選定器材為 Available 時，系統應允許 Borrower 送出借用並建立一筆 Loan。",criterion:"器材 Available 時提交借用，產生 Loan，並顯示成功結果。"},
{id:"FR-03",kind:"functional",prompt:"不可借時拒絕借用",sample:"當器材不是 Available 時，系統不得建立新的借用紀錄，並應顯示拒絕原因。",criterion:"器材已借出時提交借用，不新增 Loan 且顯示不可借訊息。"},
{id:"FR-04",kind:"functional",prompt:"管理員登記歸還",sample:"系統應允許 Staff 登記器材歸還，結束對應的 Loan，並將 Equipment 狀態更新為 Available。",criterion:"管理員登記歸還後，Loan 關閉，Equipment 顯示 Available。"},
{id:"NFR-01",kind:"performance",prompt:"查詢效能目標",sample:"在正常預期負載下，95% 的器材狀態查詢應於 2 秒內完成。",criterion:"以代表性測試負載執行查詢，量測結果顯示至少 95% 在 2 秒內完成。"}
],
useCasePrompts:[
{id:"UC-01",name:"Borrow Equipment",actor:"Borrower",req:["FR-01","FR-02","FR-03"],normal:[
"Borrower selects an equipment item.",
"System checks Equipment availability.",
"If available, System creates Loan and marks Equipment OnLoan.",
"System shows confirmation to Borrower."],alternate:"If unavailable, System refuses the request, creates no Loan, and shows a reason.",trigger:"Borrower submits a borrow request.",precondition:"Borrower is authenticated; an Equipment item exists.",postcondition:"A Loan exists and Equipment is OnLoan after success."},
{id:"UC-02",name:"Return Equipment",actor:"Staff",req:["FR-04"],normal:[
"Staff selects an active Loan.",
"System closes Loan and updates Equipment to Available.",
"System shows return confirmation."],alternate:"If the selected Loan is not active, the system shows a validation message.",trigger:"Staff registers a return.",precondition:"A matching active Loan exists.",postcondition:"Loan is closed and Equipment is Available."}
],
classPrompts:[
{name:"Borrower",attributes:"borrowerId, name",operations:"viewAvailability, requestBorrow",responsibility:"查詢器材與提出借用要求"},
{name:"Equipment",attributes:"equipmentId, status",operations:"checkAvailability, markOnLoan, markAvailable",responsibility:"保存器材資料，判斷並更新可借狀態"},
{name:"Loan",attributes:"loanId, borrowerId, equipmentId, status",operations:"create, close",responsibility:"記錄借用資訊與歸還完成狀態"}
],
associations:[
{left:"Borrower",right:"Loan",leftMultiplicity:"1",rightMultiplicity:"0..*",meaning:"每筆 Loan 對應一位 Borrower，一位 Borrower 可有多筆歷史 Loan"},
{left:"Equipment",right:"Loan",leftMultiplicity:"1",rightMultiplicity:"0..*",meaning:"每筆 Loan 對應一件 Equipment，一件 Equipment 可有多筆歷史 Loan"}
],
sequencePrompts:[
{from:"Borrower",to:"LoanUI",kind:"call",message:"requestBorrow(equipmentId)",hint:"由外部 Actor 對畫面提出要求"},
{from:"LoanUI",to:"LoanController",kind:"call",message:"submitBorrow()",hint:"畫面把要求送給控制物件"},
{from:"LoanController",to:"Equipment",kind:"call",message:"checkAvailability()",hint:"控制物件檢查器材的可借狀態"},
{from:"Equipment",to:"LoanController",kind:"return",message:"available",hint:"器材回傳名額／可借狀態"},
{from:"LoanController",to:"Loan",kind:"call",message:"create()",hint:"可借時建立借用紀錄"},
{from:"LoanController",to:"LoanUI",kind:"return",message:"confirmed",hint:"將完成結果回傳 UI"}
],
statePrompts:[
{object:"Equipment",from:"Available",to:"OnLoan",event:"borrowApproved",hint:"借用成功後器材由可借變已借出"},
{object:"Equipment",from:"OnLoan",to:"Available",event:"returned",hint:"歸還後器材再次可借"}
],
crudePrompts:[
{usecase:"UC-01",target:"Equipment",ops:["R","U"]},
{usecase:"UC-01",target:"Loan",ops:["C"]},
{usecase:"UC-02",target:"Equipment",ops:["U"]},
{usecase:"UC-02",target:"Loan",ops:["U"]}
],
manualPrompts:[
"需求內容與驗收條件已向真實利害關係人確認（或標示為教學假設）。",
"Use Cases 的正常流程與例外流程能涵蓋預期業務情境。",
"Class Diagram 的多重性已根據業務事實逐端確認，而非猜測。",
"Sequence、狀態機、CRUDE 描述的責任與操作彼此一致。"
]
};
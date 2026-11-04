# SAD Integrated Review · 2026 Lecture & 113 Final Exam

> **Reading rule**：English terminology first；繁體中文解釋。**Source** 標示講義、考卷與教學推導的界線。
>
> **Scope**：Ch1–Ch5 依 2026 課堂投影片編排；Ch6–Ch8 是依 113 年期末考延伸的設計主題，**不宣稱是 2026 課程正式章次**。

<!-- SAD:CH1 -->

# Ch1 · Systems Analysis & Design / Object-Oriented Foundations

## Core Definition
- **Systems Analysis and Design (SAD)**：分析企業需要什麼系統，再決定如何以可維護的方式實現。
- **Systems Development Life Cycle (SDLC)**：依 **Planning → Analysis → Design → Implementation** 逐步將業務需求轉成可運作的資訊系統。
- **Inheritance**：**Subclass** 可取得 **Superclass** 已定義且允許繼承的 attributes 與 operations，不必為了使用它們而重新宣告。

## Why & How · 為什麼要這樣設計？
- **Analysis vs Design**：**Analysis** 回答 What/Who/When/Where，建立需求與分析模型；**Design** 回答 How，落實介面、物件協作、資料與技術規格。兩者能反覆修正，但責任不同。
- **Encapsulation / Information Hiding**：將資料和操作收在物件內，隱藏實作細節，其他物件透過公開操作合作。改變內部演算法時，較不容易波及呼叫端。
- **Superclass / Subclass**：把共通規則上移至父類別，可減少重複程式與不同版本的規則。子類別擁有繼承的操作，不等於必須重複列出或實作它。
- **Method Overriding**：若不同子類別需要不同業務實作，才在子類別提供覆寫版本。圖中子類別出現同名操作，可用來討論特化，但**不能推論「繼承操作一定要重新宣告」**。
- **Unified Process (UP)**：時間軸是 **Inception / Elaboration / Construction / Transition / Production**，工作軸是各種 **Engineering / Supporting Workflows**。工作量會隨階段變化，流程不是完全不重疊的直線。
- **UML**：以一致符號跨越 **Functional / Structural / Behavioral** 模型。模型描述同一系統的不同面向，畫完一張圖仍須跨圖核對。

## Concrete Example · Student 類別階層
| Class | Operations | 設計判斷 |
|---|---|---|
| **Student (Superclass)** | **addCourse()**, **dropCourse()**, **payTuition()** | 共通學生能力集中在父類別 |
| **GradStudent (Subclass)** | **writeThesis()**；必要時覆寫 **payTuition()** | 選課、退選可以直接繼承 |
| **UnderGradStudent (Subclass)** | 必要時覆寫 **payTuition()** | 不需重複宣告 **addCourse()**、**dropCourse()** |
| **Object** | **s001:Student** | 實例不等於另一個子類別 |

- **Lecture Annotation**：Ch1 p.24 原圖在兩個子類別都列出 **payTuition()**，並提問「Why define three methods here?」這是討論繼承與不同實作的切入點；不是要求全部方法重複書寫。

## Exam Traps & Checkpoints
- **Trap 1 · Inherited ≠ Redeclared**：題目說「Subclass 必須重新宣告每個父類別方法才能使用」，應判錯。
- **Trap 2 · Generalization ≠ Instance-of**：**GradStudent is a Student** 是泛化；**John is a Student** 是實例關係。
- **Checkpoint**：說出 **SDLC 四階段**、分析／設計交付成果，以及 **Superclass** 與 **Override** 的分界。

**Source**：Ch01 2026 學員版 pp.6–7、22–24、29–33；繼承圖提問為投影片原文；覆寫判斷為教學推導。

<!-- SAD:CH2 -->

# Ch2 · Requirements Determination & System Proposal

## Core Definition
- **Requirement**：對系統必須提供的功能或運作條件所作的可檢查敘述。
- **Functional Requirement**：描述系統執行哪些業務功能；**Non-functional Requirement**：描述功能必須在何種效能、安全、作業或文化條件下執行。
- **System Proposal**：整合 **Planning** 與 **Analysis** 成果，讓主管可評估效益、風險與下一階段決策。

## Why & How · 需求為何要先驗證品質？
- **Operational / Performance / Security / Political & Cultural**：非功能需求影響實際可行性。若只寫「可以選課」，卻漏掉同時上線人數、權限或校規，系統仍可能無法使用。
- **VT4C**：將一句需求逐項檢查 **Clear / Verifiable / Consistent / Complete / Concise / Traceable**。六項各有用途，不能以「有寫需求」視為品質已合格。
- **Clear** 問是否只有一種合理解讀；**Verifiable** 問能否測試是否達標；**Consistent** 問是否與其他規則衝突。
- **Complete** 問正常、例外與邊界情境是否涵蓋；**Concise** 問是否有多餘重複語句；**Traceable** 問能否連回來源及後續 Use Cases、設計與測試。
- **Problem / Root-Cause / Duration Analysis**：先確認真正問題與原因，再選解法。**Fishbone Diagram** 用於追查 root causes；**Duration Analysis** 以每步作業時間找出等待、重複與可並行的程序。

## Key Elements · System Proposal 完整對照
| 2026 講義列出的主要內容（Ch2 p.42） | 作用 |
|---|---|
| **Executive Summary** | 濃縮決策所需的關鍵資訊 |
| **System Request** | 修訂後的需求、發起者與商業價值 |
| **Workplan** | 工作、資源、時間與分工 |
| **Feasibility Analysis** | 技術、經濟與組織可行性 |
| **Requirements Definition** | 功能與非功能需求 |
| **To-Be Models** | **Functional / Structural / Behavioral Models** |

- **Textbook Proposal Template（課本更細的呈現方式）**：**Table of Contents → Executive Summary → System Request → Workplan → Feasibility Analysis → Requirements Definition → Functional Models → Structural Models → Behavioral Models → Appendices**。這是完整報告排版模板，與投影片 p.42 的**概括六項內容**屬不同層次，不可誤認老師在 p.42 逐字列出十章。
- **Executive Summary: Read first, write last**：放在前面方便忙碌主管先掌握決策結論；撰寫時通常待需求、成本、可行性與模型完成後再統整，以免摘要與正文矛盾。**最後撰寫為實務建議**，非 p.42 逐字規定。

## Concrete Example · 選課需求從模糊到可驗收
| Before | After | 檢查結果 |
|---|---|---|
| 選課系統應該很快 | **95% of searches finish within 2s under 200 concurrent users.** | **Clear + Verifiable**（數字僅示範） |
| 所有學生最多 18 學分；另一條寫 21 學分 | 一般 18；核准特殊身分 21，明列例外 | **Consistent + Complete** |
| 已列需求編號 R-12 | R-12 連到利害關係人、**UCD** 與驗收測試 | **Traceable** |
| 選課失敗就顯示錯誤 | 區分額滿、衝堂、先修不足與系統逾時 | **Complete** |

## Exam Traps & Checkpoints
- **Trap 1 · Clear ≠ Verifiable**：「快速」既模糊又難測；單選題依最明顯缺陷作答。
- **Trap 2 · Traceable ≠ Numbered**：只有 Requirement ID，沒有來源／測試連結，仍不足以追溯。
- **Checkpoint**：完整說出 System Proposal **六項主要內容**與 **Executive Summary** 的讀者、用途、建議撰寫順序。

**Source**：2026 Ch2 pp.3、10–11、36、42；課本 Requirements Determination 的 System Proposal 模板；VT4C 填空與中文細節按投影片語意整理。

<!-- SAD:CH3 -->

# Ch3 · Functional Modeling & Use-Case Descriptions

## Core Definition
- **Functional Model**：以使用者目標與業務活動呈現系統「做什麼」，而非先規定程式如何編寫。
- **Use-Case Diagram**：描述 **Actors**、**Use Cases**、**System Boundary** 及互動關係。
- **Use-Case Description (UCD)**：用結構化文字描述某個 Use Case 的觸發條件、正常流程與替代／例外流程。

## Why & How · 從 Why 推到可驗證的 How
- **User Story** 常用 **As a… / I want… / So that…** 表達角色與商業價值（Why）；**Use Case** 則補足 Actor 與系統的互動步驟（Interaction How），以供後續 Activity、Sequence 和測試設計使用。
- **Story to Use Cases**：一個廣義 Story 可能拆成多個可獨立完成的 Use Cases，但 **1:N 不是 UML 強制基數**；也可能由多個 Stories 描述同一 Use Case 的需求面向。
- **Actor Generalization**：若「會員」具備「訪客」的共同互動能力，且增加特定權限，可由特化 Actor 指向一般 Actor。**Actor 是外部角色，不等於人名，也不等於每個員工職稱都必須獨立畫。**
- **«include»** 表示基本流程**必定使用**可重複的共同行為，箭頭由 **Base → Included**；**«extend»** 表示在特定條件下額外發生的行為，箭頭由 **Extension → Base**。先判斷必要性／條件性，再畫線。
- **Activity Diagram** 強調活動控制流、分支及平行；**Sequence Diagram** 強調物件訊息先後。不能只因兩者都含箭頭就混用。

## Key Elements · UCD 欄位與關係
| Term | 用途 |
|---|---|
| **Name / ID / UC Type** | 識別與類型 |
| **Primary Actor / Stakeholders** | 主要角色與利害關係人 |
| **Brief Description / Importance Level** | 目標與優先度 |
| **Trigger** | 啟動事件（外部或時間觸發，依情境） |
| **Relationships** | Interaction / Inclusion / Extension / Generalization |
| **Normal Flow / Sub-flows** | 主流程及分解流程 |
| **Alternate / Exception Flows** | 例外與其他情況 |

## Concrete Example · Online Course Registration
- **User Story**：As a student, I want to manage my enrollments so that I can build a valid schedule.
- **Use Cases**：**Search Courses**、**Enroll in Course**、**Drop Course**；分解依獨立業務目標，而非僅依每一個按鈕。
- **«include» Example**：**Enroll in Course → Check Eligibility**，若系統要求每次加選都先檢查先修條件。
- **«extend» Example**：**Join Waiting List → Enroll in Course**，只有額滿且選擇候補時擴充。
- **Actor Generalization**：**Registered Student** 可能具備 **Visitor** 的公開查詢能力，再增加加退選權限；須依系統邊界與授權規則判定。

## Exam Traps & Checkpoints
- **Trap 1 · «include» ≠ «extend»**：不只是箭頭不同，而是執行時機不同。
- **Trap 2 · Actor inheritance**：只有真正具有共享角色行為與特化關係時才用，不是因為兩個人都能點登入。
- **Checkpoint**：說明 **User Story 的 Value** 與 **UCD 的 Event Flow** 如何串起需求、模型及測試。

**Source**：2026 Ch3 pp.4、7、12、22；User Story 與細分模式的限制為教學推導。

<!-- SAD:CH4 -->

# Ch4 · Structural Modeling, CRC & Class Implementation

## Core Definition
- **Structural Modeling**：從業務過程涉及的 **People, Places, Things** 辨識物件及資料，將其抽象為 **Classes**，並描述 classes 之間的結構關係。
- **Class Diagram (CD)**：以類別名稱、attributes、operations 及 relationships 呈現靜態設計。
- **CRC Cards**：以 **Class / Responsibilities / Collaborators** 討論物件知道什麼、做什麼、與誰合作。

## Why & How · 類別關係怎麼導向程式？
- **People / Places / Things** 是候選物件的起點：**People**（Student、Customer）、**Places**（Department、Room）、**Things**（Course、Order、Checkout）。它們是候選項，不表示每個名詞都必須成為 Class。
- **Attribute vs Class**：若資訊只描述物件特徵，通常是 Attribute；若有獨立身份、行為、生命週期或關聯，才考慮抽成 Class。
- **Responsibility-driven design**：把資料和執行行為放在適當負責的類別，不因某個 Actor 觸發 Use Case，就把全部操作塞進 Actor 對應類別。
- **Generalization** 是 is-a；**Aggregation / Composition** 是 whole-part；**Association** 是一般互動／交易關係。看業務語意而非單看動詞。
- **Multiplicity** 影響程式實作：**1** 通常可存 object reference；**0..*** 或 **1..*** 可用 collection，例如 **ArrayList**。這是**實作選擇**，不是 UML 規定一條關聯必然產生一個 ArrayList。
- **Entity / Boundary / Control**：**Entity** 持有業務資料、**Boundary** 接外部介面、**Control** 協調 Use Case。分清責任有助降低 UI 與資料操作相互糾纏。

## Concrete Example · Library Checkout Records
| Model Layer | 內容 | 為什麼 |
|---|---|---|
| **Class Diagram** | **Book 1 → 0..* Checkout**（示意） | 一冊書可能有多筆歷史借閱紀錄 |
| **Checkout Class** | **checkoutDate / returnDate / studentId** | 借閱事件本身需要資料 |
| **Java Implementation** | **ArrayList<Checkout>** | 以集合保留多筆紀錄 |
| **Persistence** | Repository / Database | 若需跨執行期間保存及多人同步 |

- **Teacher Handwriting**：Ch5 p.28 在「Where would the check-out info be stored? How?」旁註有 **Book class may contain an ArrayList to store all check-out records.**
- **Coding Example**：`class Book { List<Checkout> records = new ArrayList<>(); }`。這是便於理解的 **Java 示範**，實際系統可改用資料庫或 Repository 管理。
- **Cross-model Revision**：Ch5 p.30–32 在完成 Sequence Diagram 後把 **Checkout** 納入修訂的 Class Diagram，說明 Structural Model 會因 Behavioral Analysis 而補強。

## Exam Traps & Checkpoints
- **Trap 1 · Association ≠ Composition**：Student borrows Book 是互動，不表示 Book 的生命週期被 Student 擁有。
- **Trap 2 · Multiplicity ≠ Container Type**：可以用 List、Set、ORM association 或資料庫實作，一對多不限定 ArrayList。
- **Checkpoint**：用 **People, Places, Things → Class / Attribute → CRC → Relationships → Implementation** 說明完整推導路徑。

**Source**：2026 Ch4 pp.6–8、17–19、23、27–30、37；Ch5 pp.28、30–32 的 ArrayList 手寫與修訂圖。

<!-- SAD:CH5 -->

# Ch5 · Behavioral Modeling, Sequence & CRUDE

## Core Definition
- **Behavioral Modeling**：解釋物件如何在某個 Use Case 中透過 **Messages** 合作，以及重要物件如何因事件而改變狀態。
- **Sequence Diagram (SD)**：以 lifelines 和由上到下的訊息順序呈現物件之間的互動。
- **CRUDE Matrix**：以 **Create / Read / Update / Delete / Execute** 檢查物件間合作與職責是否合理。

## Why & How · 從櫃檯搬到線上，模型為何會變？
- **Set Context First**：先確認 System Boundary、Use Case、Main Event Flow。課程強調 **Instance Sequence Diagram**，通常畫一條具體的正常情境，不必一次將所有例外硬塞進單張圖。
- **Actor depends on System Boundary**：傳統櫃檯借書由 **Librarian** 操作館方系統；改為線上自助後，**Student** 可能成為直接觸發系統的主要 Actor。業務中仍有館員，不代表他永遠是該線上 Use Case 的 Primary Actor。
- **Boundary / Interface Class**：負責輸入、提示與回應；**Control Class**：協調驗證、借閱、罰款等流程；**Entity Class**：保存 Student、Book、Checkout 等業務狀態。將三類責任分開，可讓畫面改版不必直接修改資料規則。
- **Message & Operation Consistency**：Sequence Diagram 中若向 Book 發送 **checkOut()**，應檢查 Class Diagram 中 Book 或適當的 Control Class 是否真的有對應 Operation。
- **CRUDE**：用矩陣檢查哪些類別被建立、讀取、更新、刪除或執行。若有類別既不被使用、也不與其他物件合作，可能是模型多餘或責任分配不完整。
- **State Machine**：關注 **State / Event / Guard / Transition / Action**，例如訂單由 Pending 經付款事件成為 Paid；「點擊按鈕」通常是事件，不是持續狀態。

## Concrete Example · Borrow Book: As-Is → To-Be
| As-Is（櫃檯） | To-Be（線上自助） |
|---|---|
| **Student** 請求館員協助 | **Student** 直接與 **BorrowBookUI** 互動 |
| **Librarian** 操作系統 | **Boundary Class** 接收學生操作 |
| 館員查閱借閱資格 | **CheckoutController** 協調檢核 |
| 系統更新館藏、回覆館員 | **Book / Checkout** 更新狀態，UI 回覆學生 |

- **Sequence Outline**：**Student → BorrowBookUI → CheckoutController → Student / Book / Checkout → BorrowBookUI**。這是依 Ch5 p.27 課堂提問推導的**線上版示例**，不是原投影片提供的完成版標準答案。
- **Checkout Records**：從 Sequence Diagram 發現每次借閱都需保存日期與借閱人，因此回頭補上 **Checkout Class**，並視 **Multiplicity** 決定集合或持久化方式。

## Exam Traps & Checkpoints
- **Trap 1 · Sequence vs Communication**：前者強調訊息時間順序，後者強調訊息流與物件連結。
- **Trap 2 · Actor ≠ Employee in the story**：Actor 以當前系統邊界判定，而非照抄線下流程的人物清單。
- **Checkpoint**：依 **Main Flow → Lifelines → Messages → Operations → Class Diagram Revision / CRUDE** 完成核對。

**Source**：2026 Ch5 pp.6–8、19、23–28、30–35；Ch4 p.23 的三種 class stereotypes；線上案例之類別命名屬教學推導。

<!-- SAD:CH6 -->

# Final Extension · Architecture, Contracts & Connascence

## Core Definition
- **Software Architecture**：將系統邏輯拆分成有明確責任及依賴關係的 layers、modules 和 packages。
- **Package Dependency**：一個 package 依賴另一個 package 的介面或服務。
- **Connascence**：兩部分程式或設計元素必須協調一致才能正常運作的相依現象；原卷採 **Code / Method / Class** 三層次作答。

## Why & How · 為何分層與降低耦合？
- **Five Logical Layers（依 113 原卷 Q34 手寫）**：**Foundation**（底層共用服務）、**Problem Domain / Business Logic**（業務規則）、**Data Management**（資料管理）、**User Interface / HCI**（人機互動）、**Physical Architecture**（部署／平台）。這是**考卷採用的五項**，不是所有設計書共用的固定排序。
- **Package Dependency: Development Sequence / Change Impact**：先規劃被依賴元件的介面，以降低整合風險；元件修改也會向依賴者傳遞影響。這不代表絕對不能平行開發。
- **High Cohesion / Low Coupling**：同一模組集中處理相近責任（High Cohesion），跨模組只透過必要且穩定的介面合作（Low Coupling）。兩者不是同義字。
- **Contracts**：**Precondition**（執行前）、**Postcondition**（完成後）、**Invariant**（合法狀態須維持）建立方法呼叫的共同預期。
- **Connascence Refactoring**：把散落且需同步修改的邏輯提取為一個 Method，再將相關 operations 集中成 Class，可降低重複與變更範圍；**Code → Method → Class 是原卷的作答分層，非所有文獻唯一通用的 Connascence 分級法**。

## Concrete Example · E-commerce Order
| Before | After | 主要改善 |
|---|---|---|
| **OrderPage** 直接寫 SQL、扣庫存與付款 | **OrderUI → OrderService → Payment / Inventory / DAM** | **Cohesion / Coupling** |
| 同一折扣規則散落五個畫面 | 提取 **calculateDiscount()** | **Method-level reuse** |
| 訂單元件直接讀付款內部欄位 | 透過 **Payment API / Contract** | **Change Impact** |
| 每次提款都能讓餘額小於零 | **Precondition** 餘額足夠；**Invariant** 餘額不得為負 | **Contracts** |

## Exam Traps & Checkpoints
- **Trap 1 · Package Dependency**：Q22 的兩項為 **Development Sequence**、**Change Impact**，不是 cost + security。
- **Trap 2 · Cohesion / Coupling**：Q16、Q21 用語需留意「模組內相關性」與「跨模組相依」。Q21 原卷手寫 F 與一般定義語意有歧義，**不可機械背成 Cohesion = False**。
- **Trap 3 · Connascence Levels**：Q37 手寫是 **Level 0 Code / Level 1 Method / Level 2 Class**，作答先遵守老師此卷分類。

**Source**：113 年期末考 pp.1–2，Q6–7、Q10、Q14–16、Q21–23、Q34、Q37；五層與 Connascence 依原卷手寫，案例為教學推導。

<!-- SAD:CH7 -->

# Final Extension · UI Design, Navigation, Evaluation & VR

## Core Definition
- **User Interface (UI) Design**：設計使用者如何導覽、輸入、取得結果並理解系統。
- **Window Navigation Diagram (WND)**：描述畫面、forms、reports 之間的連結及使用者移動路徑。
- **Real Use-Case Description (Real UCD)**：在原先業務互動上，加入具體 UI 畫面、控制元件與操作步驟。

## Why & How · UI 為何不能只看好不好看？
- **Three GUI Mechanisms**：**Navigation**（畫面移動）、**Input**（資料擷取）、**Output**（資訊呈現）。Q25–26 明確要求此三項。
- **Essential UCD vs Real UCD**：**Essential** 先定義任務意圖與系統責任、不依賴具體畫面；**Real** 才把「按下 Enroll、顯示確認視窗」等操作寫出。需求穩定後再決定畫面，可避免 UI 細節反過來扭曲業務目標。
- **Six UI Aspects**：**Layout / Content Awareness / Aesthetics / User Experience / Consistency / Minimal User Effort**；分別是自然動線、位置脈絡、視覺、操作感受、一致性、降低不必要負擔。
- **Five Evaluation Approaches**：113 原卷 Q33 列 **Heuristic Evaluation / Interactive Evaluation / Walkthrough / A/B Testing / Formal Usability Testing**。Dennis 教材對應的公開 UI 投影片列前述其中四種（不含 A/B）；**A/B Testing** 以這份考卷的第五項補入，避免混淆兩份資料的分類。
- **VR Dimensions**：原卷 Q30 手寫 **Sensory**（感官與空間感知）及 **Affective**（情感與體驗反應），後者不等於 Effectiveness（效率）。

## Key Elements · 五種 UI 評估法
| Approach | 特徵（教學補充） | 113 原卷 Q33 線索 |
|---|---|---|
| **Heuristic Evaluation** | 依已知 **UI principles / rules of thumb** 檢查畫面設計，無須先完成使用者實測 | 手寫 **Least Costly = (1)** |
| **Interactive Evaluation** | **Users** 實際操作 prototype，並有 **project team member** 共同觀察、協助與收集回饋 | 原卷列為 (2) |
| **Walkthrough Evaluation** | **Design team** 向使用者呈現 prototype，逐步說明畫面與流程如何運作 | 手寫 **Designer Operates UI = (3)** |
| **A/B Testing** | 比較版本 A／B 的預設任務指標（例如完成率、錯誤率），而非只看偏好 | 原卷加入的第五種方法 |
| **Formal Usability Testing** | 由代表性使用者在測試環境／實驗室操作 prototype，記錄完成情形；設計師不代替使用者點擊 | 手寫 **Without Designer Participation = (5)** |

## Concrete Example · Online Course Registration UI
| Essential UCD（不綁定技術） | Real UCD（具體畫面） |
|---|---|
| Student searches for a course. | Student enters course ID in Search Form. |
| System shows eligible courses. | Results table shows available seats and prerequisites. |
| Student enrolls. | Student selects **Enroll** and confirms in dialog. |
| System returns enrollment outcome. | Success page shows course code and transaction ID. |

- **WND**：**Search → Results → Course Detail → Confirm Enrollment → Receipt**，標示使用者如何跨頁面移動。
- **A/B Test**：A 為每次都跳確認頁，B 為同頁展開確認；比較「完成率、錯誤率、時間」，而非只問使用者覺得哪個好看。
- **VR Precision**：若 3D 圖很難讀到確切數值，可讓使用者點選某位置，顯示對應 x/y/z 數值（113 原卷 Q24 手寫提示）。

## Exam Traps & Checkpoints
- **Trap 1 · Input ≠ Navigation**：蒐集資料是 Input；畫面間移動是 Navigation。
- **Trap 2 · Content Awareness ≠ Aesthetics**：知道自己在哪裡、看到什麼，屬 Content Awareness，不等於視覺美感。
- **Trap 3 · Q27 / Q33**：Q27 手寫末項存在紅筆更正；Q33 的配對按**原卷手寫**保留，但仍應與老師正式投影片核對。
- **Checkpoint**：背出 **3 mechanisms / 6 aspects / 5 evaluation approaches / 2 VR dimensions / WND + Real UCD**，並能用同一情境各舉一例。

**Source**：113 年期末考 p.1 Q24–27、p.2 Q28–33（Q27 有批改痕跡）；UI 評估四種方法的操作特徵另核對 Dennis / Wixom / Tegarden 5th Edition Chapter 10 *Human–Computer Interaction Layer Design* 公開投影片。此公開教材不是本課教師的 2026 投影片，A/B Testing 則依 113 考卷及一般實驗設計補充。

<!-- SAD:CH8 -->

# Final Extension · Data Stores & Normalization

## Core Definition
- **Normalization**：根據 functional dependencies 將資料組織為較合理的 relations，減少冗餘及更新異常，維護資料一致性。
- **Data Store**：依資料模型與儲存需求選用 File、Relational、Object-Relational、Object-Oriented 或 NoSQL 等型態。

## Why & How · 為什麼不是「為了查詢更快」？
- **Update Anomaly**：若學生姓名重複寫在所有選課資料中，改姓名卻漏改一列就會矛盾；正規化把 Student、Course、Enrollment 拆分，降低重複維護風險。
- **1NF**：欄位應具原子性，不能把多個電話或課程代碼混成不可分的 repeating group。
- **2NF**：在 1NF 上排除非主屬性只依賴候選鍵其中一部分的 **Partial Dependency**，常在複合鍵例子中觀察。
- **3NF**：在 2NF 上排除不當的 **Transitive Dependency**。嚴格定義涉及 Superkey 與 Prime Attributes 的例外；課堂填空可先掌握三種特徵。
- **Performance Trade-off**：拆表通常減少資料異常，但讀取時可能增加 JOIN，所以不能把 **Normalization** 的主要目的寫成 **Increase Data Access Efficiency**。

## Key Elements · 113 原卷對照
| Question / Form | 典型特徵 | 要避開的誤判 |
|---|---|---|
| **Q5 Normalization** | **Reduce Redundancy / Anomalies** | 並非主要提升 Access Efficiency |
| **Q36 · 1NF** | **No Multi-valued Attributes**（課堂表述） | 不等於 2NF |
| **Q36 · 2NF** | **No Partial Dependencies** | 不等於 Transitive |
| **Q36 · 3NF** | **No Transitive Dependencies**（課堂速記） | 先須符合 2NF |
| **Q35 · File** | Sequential / Random Access | 不是所有資料都需要 SQL |
| **Q35 · RDB** | Relational / ACID（原卷分類） | ACID 不是所有系統的專利 |
| **Q35 · ORDB** | Object features + SQL | 不等於純 OODB |
| **Q35 · OODB** | Objects / Multi-valued features（原卷分類） | 依老師分類作答 |
| **Q35 · NoSQL** | 包含 Columnar 等其他模型 | NoSQL 不等於不支援查詢語言 |

## Concrete Example · Enrollment Decomposition
| Before | After |
|---|---|
| **Enrollment**(studentId, studentName, courseId, courseName, grade) | **Student**(studentId, studentName) |
| 每次選課都重複 studentName / courseName | **Course**(courseId, courseName) |
| 改名稱需修改多列，容易漏改 | **Enrollment**(studentId, courseId, grade) |

- **Partial Dependency**：如果 Enrollment 的候選鍵是 (studentId, courseId)，studentName 只取決於 studentId，就應分拆至 Student。
- **Transitive Dependency**：假設 Student(studentId, deptId, deptName)，deptName 取決於 deptId 而非直接由 studentId 決定，應考慮 Department 表。
- **Query Cost**：需要完整成績報表時，可能 JOIN Student、Enrollment、Course；正規化維護資料一致性與查詢速度的取捨要分開討論。

## Exam Traps & Checkpoints
- **Trap 1 · 1NF / 2NF / 3NF**：分別對應 **Multi-valued / Partial / Transitive**，不要交換。
- **Trap 2 · Normalization ≠ Speed**：是非題若說正規化目的在增加存取效率，應判 **False**（對照 Q5）。
- **Trap 3 · DB Model ≠ Single Feature**：使用 SQL 或具有 ACID 不一定足以獨立判定全部儲存類型；但考古題請先理解課堂給的分類映射。

**Source**：113 年期末考 p.1 Q5、p.2 Q35–36；例子及嚴格依賴關係為教學補充。

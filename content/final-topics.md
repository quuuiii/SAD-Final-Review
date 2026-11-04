# Final Focus · Architecture, UI & Database Design

> **Exam basis:** 使用者提供的 113 年 Systems Analysis & Design EXAM 2，主要為 Q19–38。印刷題目、可辨識的手寫與紅筆批改分開看待；本頁解析**不是教授官方答案**。

## Five Logical Layers (Q34)

| Layer | Main responsibility | Example |
|---|---|---|
| **Foundation** | 系統共通基礎及平台能力 | 基礎服務與共用技術 |
| **Problem Domain / Business Logic** | 領域概念及業務規則 | 選課資格、學分上限 |
| **Data Management** | 資料存取、維護及交易 | DAM、SQL、Repository |
| **User Interface / HCI** | 輸入、導覽、結果呈現 | Form、Button、Navigation |
| **Physical Architecture** | 實體部署與運行環境 | Server、Network |

**Why:** 將 UI、業務邏輯和資料存取分開，可降低介面修改時波及 SQL 的機率。

**Exam trap Q10:** **DAM** 是資料存取責任，不是 **Problem Domain**。

## UI Mechanisms, WND & UCD (Q25–29, Q32)

| Concept | Definition | Example |
|---|---|---|
| **Navigation** | 使用者如何在畫面或任務間移動 | Course List → Details |
| **Input** | 系統如何收集使用者資料 | Search Form、Course ID |
| **Output** | 系統如何顯示處理結果 | Enrollment Confirmation |
| **Window Navigation Diagram (WND)** | 表示 Screens、Forms、Reports 的連結與移動路徑 | Login → Search → Enroll |
| **Real UCD** | 具體介面操作情境與畫面回應 | 按下 Enroll 後顯示確認視窗 |

### Essential vs Real UCD

| | **Essential UCD** | **Real UCD** |
|---|---|---|
| Focus | 業務目的和系統責任 | 具體畫面、欄位和操作 |
| UI detail | Technology-independent | 會涉及 Form、Button、Dialog |
| Example | Student requests enrollment | Student clicks Enroll and confirms |

**Why:** 先確認 What，再設計 How 的畫面細節，避免既有 UI 限制需求探索。

## Six UI Design Aspects (Q27)

| Aspect | Decision cue |
|---|---|
| **Layout** | 畫面安排有自然直覺的流向 |
| **Content Awareness** | 使用者知道自己在哪裡、正在看什麼 |
| **Aesthetics** | 視覺舒適、具可讀性 |
| **User Experience** | 整體完成任務的體驗 |
| **Consistency** | 相同功能有一致的操作與標示 |
| **Minimal User Effort** | 不必重複輸入或走多餘步驟 |

**Source caution:** Q27 最後兩小題的手寫選項有紅筆修訂，應依六項定義判讀，不把模糊數字當成確定官方答案。

## Five UI Evaluation Approaches (Q33)

| Approach | Who / How | Distinction |
|---|---|---|
| **Heuristic Evaluation** | 專家以設計準則檢查 | 通常成本較低；可不找使用者 |
| **Interactive Evaluation** | 設計者與使用者互動收集回饋 | 強調討論或互動 |
| **Walkthrough** | 依任務步驟導覽或由設計者示範 | 逐步展示 |
| **A/B Testing** | 比較不同介面版本的成果指標 | 需要定義指標、比較 A 和 B |
| **Formal Usability Testing** | 代表性使用者獨立執行任務 | 不應由設計者代替操作 |

**Exam handwriting:** Q33 的三個選項答案寫成 **(5) Formal Usability Testing、(3) Walkthrough、(1) Heuristic Evaluation**；這是原卷手寫，仍應依老師授課定義核對。

## VR: Two Major Dimensions (Q30)

- **Sensory Dimension**：感官呈現、空間與位置知覺。
- **Affective Dimension**：沉浸、情緒與感受。
- **Trap:** **Affective ≠ Effectiveness**；談情感，不是效率。

## Package Design & Contracts (Q22–23)

| Concept | Meaning |
|---|---|
| **Package Dependency: Development Sequence** | 依賴影響介面協作與整合順序 |
| **Package Dependency: Change Impact** | 被依賴套件改動可能影響使用者 |
| **Precondition** | 方法執行前須成立 |
| **Postcondition** | 方法正常完成後保證成立 |
| **Invariant** | 物件有效狀態應維持的條件 |
| **High Cohesion / Low Coupling** | 內部職責集中、跨模組不必要依賴減少 |

**Exam trap:** A 依賴 B 不代表 A 一定要等 B 所有程式完成才能開工；可透過穩定介面平行開發。

## Connascence: Three Exam Levels (Q37)

| Level | 113 考卷的手寫分類 | Example |
|---|---|---|
| **Level 0 · Code** | 重複程式碼散布 | 多處複製列印迴圈 |
| **Level 1 · Method** | 封裝共同動作 | printReport() |
| **Level 2 · Class** | 將相關方法與狀態集合 | ReportPrinter |

**Source caution:** 這是**113 考古題手寫答案的分級**，不能視為所有 Connascence 文獻通用的正式分類。

## Normalization: 1NF, 2NF, 3NF (Q5, Q36)

| Form | Key property | Error to recognize |
|---|---|---|
| **1NF** | 每個欄位為 Atomic Value；無多值及 Repeating Groups | 一格存多個電話 |
| **2NF** | 1NF + 非主屬性不部分依賴 Candidate Key | 複合鍵中欄位只依賴其中一部分 |
| **3NF** | 2NF + 消除不當 Transitive Dependency | Student ID → Dept ID → Dept Name |

**Concrete Example**

- **Before:** Enrollment(studentId, studentName, courseId, courseName, grade) 含重複學生與課程資料。
- **After:** Student(studentId, studentName)、Course(courseId, courseName)、Enrollment(studentId, courseId, grade)。
- **Why:** 避免 Update、Insert、Delete Anomalies，改善資料一致性。
- **Trap Q5:** **Normalization ≠ Improving Query Speed**；分表後 Join 可能增加。

## Data Storage Categories (Q35)

| Store | Typical focus |
|---|---|
| **File** | Sequential / Random Access |
| **RDB** | Relations；通常支援 ACID Transactions |
| **ORDB** | Relational + Object Features |
| **OODB** | Object-oriented data storage |
| **NoSQL** | Document、Key-value、Column-family、Graph 等 |

**Exam trap:** 支援 SQL 或 ACID 不代表只能歸在唯一一類；Q35 是依老師當時的典型分類作答。

## Final Checkpoints

- **Q28–29:** **WND** 是畫面關係圖，**Real UCD** 是實際 UI 互動描述。
- **Q31:** **Outsourcing** 是外包開發，不等於購買無客製套裝軟體。
- **Q33:** **A/B Testing** 需要比較版本並觀察指標。
- **Q36:** No Multi-valued → **1NF**；No Partial → **2NF**；No Transitive → **3NF**。
- **Q38:** **Structured English** 和 **Activity Diagram** 都可作為方法演算法規格表示方式。

**Source boundary:** 本頁參考 113 原卷手寫與課堂術語，模糊與有爭議的手寫答案已分開標註；詳細作答可進入原卷 38 題刷題專區。
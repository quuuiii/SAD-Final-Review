/* Source user-uploaded Structural Modeling textbook Ch5 pp.198–201, course Ch4.
 * Some cross-references in the printed book are self-referential; kept exactly as printed.
 * Diagrams require human review. */
window.SAD_TEXTBOOK_CH4={
 "chapter": 4,
 "textbookChapter": 5,
 "title": "Structural Modeling",
 "source": "Textbook Chapter 5, pp. 198–201 (corresponds to course Ch4)",
 "entries": [
  {
   "id": "Q1",
   "num": "1",
   "type": "Questions",
   "prompt": "Describe to a businessperson the multiplicity of a relationship between two classes.",
   "criteria": [
    [
     "multiplicity",
     "多重性"
    ],
    [
     "relationship",
     "關係"
    ],
    [
     "one",
     "many",
     "1",
     "0..*",
     "一",
     "多"
    ],
    [
     "cardinality",
     "instance",
     "數量",
     "實例"
    ]
   ],
   "manual": false,
   "sourcePage": 198
  },
  {
   "id": "Q2",
   "num": "2",
   "type": "Questions",
   "prompt": "Why are assumptions important to a structural model?",
   "criteria": [
    [
     "assumption",
     "假設"
    ],
    [
     "ambiguity",
     "uncertain",
     "不確定",
     "模糊"
    ],
    [
     "relationship",
     "multiplicity",
     "關係",
     "多重性"
    ],
    [
     "validate",
     "verify",
     "確認",
     "驗證"
    ]
   ],
   "manual": false,
   "sourcePage": 198
  },
  {
   "id": "Q3",
   "num": "3",
   "type": "Questions",
   "prompt": "What is an association class?",
   "criteria": [
    [
     "association class",
     "關聯類別"
    ],
    [
     "relationship",
     "關係"
    ],
    [
     "attribute",
     "data",
     "屬性",
     "資料"
    ],
    [
     "class",
     "類別"
    ]
   ],
   "manual": false,
   "sourcePage": 198
  },
  {
   "id": "Q4",
   "num": "4",
   "type": "Questions",
   "prompt": "Contrast the following sets of terms: object, class, method, attribute, superclass, subclass, concrete class, abstract class.",
   "criteria": [
    [
     "object",
     "物件"
    ],
    [
     "class",
     "類別"
    ],
    [
     "method",
     "方法"
    ],
    [
     "attribute",
     "屬性"
    ],
    [
     "superclass",
     "subclass",
     "父類",
     "子類"
    ],
    [
     "concrete",
     "abstract",
     "具體",
     "抽象"
    ]
   ],
   "manual": false,
   "sourcePage": 198
  },
  {
   "id": "Q5",
   "num": "5",
   "type": "Questions",
   "prompt": "Give three examples of derived attributes that may exist on a class diagram. How would they be denoted on the class diagram?",
   "criteria": [
    [
     "derived attribute",
     "衍生屬性"
    ],
    [
     "slash",
     "/",
     "斜線"
    ],
    [
     "age",
     "年齡"
    ],
    [
     "total",
     "sum",
     "總計",
     "總額"
    ],
    [
     "duration",
     "期間"
    ]
   ],
   "manual": false,
   "sourcePage": 198
  },
  {
   "id": "Q6",
   "num": "6",
   "type": "Questions",
   "prompt": "What are the different types of visibility? How would they be denoted on a class diagram?",
   "criteria": [
    [
     "public",
     "公開",
     "+"
    ],
    [
     "private",
     "私有",
     "-"
    ],
    [
     "protected",
     "保護",
     "#"
    ],
    [
     "package",
     "~",
     "套件"
    ]
   ],
   "manual": false,
   "sourcePage": 199
  },
  {
   "id": "Q7",
   "num": "7",
   "type": "Questions",
   "prompt": "Draw the relationships that are described by the following business rules. Include the multiplicities for each relationship.\nA patient must be assigned to only one doctor, and a doctor can have one or many patients.\nAn employee has one phone extension, and a unique phone extension is assigned to an employee.\nA movie theater shows at least one movie, and a movie can be shown at up to four other movie theaters around town.\nA movie either has one star, two costars, or more than ten people starring together. A star must be in at least one movie.",
   "criteria": [
    [
     "patient",
     "doctor",
     "病患",
     "醫師"
    ],
    [
     "employee",
     "extension",
     "員工",
     "分機"
    ],
    [
     "movie",
     "theater",
     "電影",
     "戲院"
    ],
    [
     "star",
     "actor",
     "演員",
     "明星"
    ],
    [
     "multiplicity",
     "0..",
     "1..",
     "多重性"
    ]
   ],
   "manual": true,
   "sourcePage": 199
  },
  {
   "id": "Q8",
   "num": "8",
   "type": "Questions",
   "prompt": "How do you designate the reading direction of a relationship on a class diagram?",
   "criteria": [
    [
     "direction",
     "reading",
     "閱讀方向"
    ],
    [
     "association",
     "關聯"
    ],
    [
     "arrow",
     "triangle",
     "箭頭"
    ],
    [
     "label",
     "name",
     "標籤",
     "名稱"
    ]
   ],
   "manual": false,
   "sourcePage": 199
  },
  {
   "id": "Q9",
   "num": "9",
   "type": "Questions",
   "prompt": "For what is an association class used in a class diagram? Give an example of an association class that may be found in a class diagram that captures students and the courses that they have taken.",
   "criteria": [
    [
     "association class",
     "關聯類別"
    ],
    [
     "student",
     "學生"
    ],
    [
     "course",
     "課程"
    ],
    [
     "enrollment",
     "registration",
     "選課",
     "修課"
    ],
    [
     "grade",
     "semester",
     "成績",
     "學期"
    ]
   ],
   "manual": false,
   "sourcePage": 199
  },
  {
   "id": "Q10",
   "num": "10",
   "type": "Questions",
   "prompt": "Give two examples of aggregation, generalization, and association relationships. How is each type of association depicted on a class diagram?",
   "criteria": [
    [
     "aggregation",
     "聚合"
    ],
    [
     "generalization",
     "泛化",
     "繼承"
    ],
    [
     "association",
     "關聯"
    ],
    [
     "diamond",
     "菱形"
    ],
    [
     "triangle",
     "三角形"
    ],
    [
     "line",
     "直線",
     "連線"
    ]
   ],
   "manual": true,
   "sourcePage": 199
  },
  {
   "id": "Q11",
   "num": "11",
   "type": "Questions",
   "prompt": "Identify the following operations as constructor, query, or update. Which operations would not need to be shown in the class rectangle?\nCalculate employee raise (raise percent)\nCalculate sick days ( )\nIncrement number of employee vacation days ( )\nLocate employee name ( )\nPlace request for vacation (vacation day)\nFind employee address ( )\nInsert employee ( )\nChange employee address ( )\nInsert spouse ( )",
   "criteria": [
    [
     "constructor",
     "建構"
    ],
    [
     "query",
     "查詢"
    ],
    [
     "update",
     "更新"
    ],
    [
     "operation",
     "方法",
     "操作"
    ],
    [
     "get",
     "set",
     "accessor",
     "存取"
    ]
   ],
   "manual": true,
   "sourcePage": 199
  },
  {
   "id": "Q12",
   "num": "12",
   "type": "Questions",
   "prompt": "How are the different structural models related, and how does this affect verification and validation of the model?",
   "criteria": [
    [
     "crc",
     "class-responsibility-collaboration",
     "責任"
    ],
    [
     "class diagram",
     "類別圖"
    ],
    [
     "object diagram",
     "物件圖"
    ],
    [
     "consisten",
     "一致性"
    ],
    [
     "verification",
     "validation",
     "驗證",
     "確認"
    ]
   ],
   "manual": false,
   "sourcePage": 199
  },
  {
   "id": "EA",
   "num": "A",
   "type": "Exercises",
   "prompt": "Create a CRC card for each of the following classes:\nMovie (title, producer, length, director, genre)\nTicket (price, adult or child, showtime, movie)\nPatron (name, adult or child, age)",
   "criteria": [
    [
     "crc",
     "responsibility",
     "責任"
    ],
    [
     "movie",
     "電影"
    ],
    [
     "ticket",
     "票"
    ],
    [
     "patron",
     "顧客"
    ],
    [
     "collaborat",
     "合作"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 199
  },
  {
   "id": "EB",
   "num": "B",
   "type": "Exercises",
   "prompt": "Create a class diagram based on the CRC cards you created for exercise A.",
   "criteria": [
    [
     "class",
     "類別"
    ],
    [
     "movie",
     "電影"
    ],
    [
     "ticket",
     "票"
    ],
    [
     "patron",
     "顧客"
    ],
    [
     "association",
     "multiplicity",
     "關聯",
     "多重性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 199
  },
  {
   "id": "EC",
   "num": "C",
   "type": "Exercises",
   "prompt": "Create a CRC card for each of the following classes. Consider that the entities represent a system for a patient billing system. Include only the attributes that would be appropriate for this context.\nPatient (age, name, hobbies, blood type, occupation, insurance carrier, address, phone)\nInsurance carrier (name, number of patients on plan, address, contact name, phone)\nDoctor (specialty, provider identification number, golf handicap, age, phone, name)",
   "criteria": [
    [
     "crc",
     "responsibility",
     "責任"
    ],
    [
     "patient",
     "病患"
    ],
    [
     "insurance carrier",
     "保險"
    ],
    [
     "doctor",
     "醫師"
    ],
    [
     "attribute",
     "屬性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 199
  },
  {
   "id": "ED",
   "num": "D",
   "type": "Exercises",
   "prompt": "Create a class diagram based on the CRC cards you created for exercise C.",
   "criteria": [
    [
     "class diagram",
     "類別圖"
    ],
    [
     "patient",
     "病患"
    ],
    [
     "doctor",
     "醫師"
    ],
    [
     "insurance",
     "保險"
    ],
    [
     "association",
     "multiplicity",
     "關聯",
     "多重性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 199
  },
  {
   "id": "EE",
   "num": "E",
   "type": "Exercises",
   "prompt": "Draw a class diagram for each of the following situations:\n1. Whenever new patients are seen for the first time, they complete a patient information form that asks their name, address, phone number, and insurance carrier, which are stored in the patient information file. Patients can be signed up with only one carrier, but they must be signed up to be seen by the doctor. Each time a patient visits the doctor, an insurance claim is sent to the carrier for payment. The claim must contain information about the visit, such as the date, purpose, and cost. It would be possible for a patient to submit two claims on the same day.\n2. The state of Georgia is interested in designing a system that will track its researchers. Information of interest include researcher name, title, position, researcher’s university name, university location, university enrollment, and researcher’s research interests. Researchers are associated with one institution, and each researcher has several research interests.\n3. A department store has a wedding registry. This registry keeps information about the customer (usually the bride), the products that the store carries, and the products for which each customer registers. Customers typically register for a large number of products, and many customers register for the same products.\n4. Jim Smith’s dealership sells Fords, Hondas, and Toyotas. In order to get in touch with these manufacturers easily, the dealership keeps information about each of them. The dealership keeps information about the models of cars from each manufacturer, including dealer price, model name, and series (e.g., Honda, Civic, LX). Additionally, the dealership also keeps all sales information, including buyer’s name, address and phone number, car purchased, and amount paid.",
   "criteria": [
    [
     "class diagram",
     "類別圖"
    ],
    [
     "patient",
     "insurance claim",
     "病患",
     "理賠"
    ],
    [
     "researcher",
     "university",
     "研究員",
     "大學"
    ],
    [
     "registry",
     "product",
     "婚禮",
     "商品"
    ],
    [
     "dealer",
     "manufacturer",
     "sales",
     "經銷",
     "製造商",
     "銷售"
    ],
    [
     "multiplicity",
     "多重性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 199
  },
  {
   "id": "EF",
   "num": "F",
   "type": "Exercises",
   "prompt": "Create object diagrams based on the class diagrams you drew for exercise F.",
   "criteria": [
    [
     "object diagram",
     "物件圖"
    ],
    [
     "instance",
     "實例"
    ],
    [
     "class diagram",
     "類別圖"
    ],
    [
     "link",
     "relationship",
     "連結",
     "關係"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EG",
   "num": "G",
   "type": "Exercises",
   "prompt": "Examine the class diagrams that you created for exercise F. How would the models change (if at all) based on these new assumptions?\n1. Two patients have the same first and last names.\n2. Researchers can be associated with more than one institution.\n3. The store would like to keep track of purchase items.\n4. Many buyers have purchased multiple cars from Jim over time because he is such a good dealer.",
   "criteria": [
    [
     "patient",
     "identity",
     "病患",
     "識別"
    ],
    [
     "researcher",
     "institution",
     "研究員",
     "機構"
    ],
    [
     "purchase",
     "item",
     "購買",
     "項目"
    ],
    [
     "buyer",
     "car",
     "買方",
     "車"
    ],
    [
     "multiplicity",
     "多重性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EH",
   "num": "H",
   "type": "Exercises",
   "prompt": "Visit a website that allows customers to order a product over the Web (e.g., Amazon.com). Create a structural model (CRC cards and class diagram) that the site must need to support its business process. Include classes to show what they need information about. Be sure to include the attributes and operations to represent the type of information they use and create. Finally, draw relationships, making assumptions about how the classes are related.",
   "criteria": [
    [
     "website",
     "amazon",
     "網站"
    ],
    [
     "crc",
     "責任"
    ],
    [
     "class diagram",
     "類別圖"
    ],
    [
     "attribute",
     "operation",
     "屬性",
     "操作"
    ],
    [
     "relationship",
     "assumption",
     "關係",
     "假設"
    ]
   ],
   "manual": true,
   "external": true,
   "sourcePage": 200
  },
  {
   "id": "EI",
   "num": "I",
   "type": "Exercises",
   "prompt": "Using the seven-step process described in this chapter, create a structural model (CRC cards and class diagram) for exercise C in Chapter 4.",
   "criteria": [
    [
     "seven-step",
     "七步"
    ],
    [
     "crc",
     "責任"
    ],
    [
     "class diagram",
     "類別圖"
    ],
    [
     "glasses",
     "optical",
     "眼鏡",
     "配鏡"
    ],
    [
     "relationship",
     "multiplicity",
     "關係",
     "多重性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EJ",
   "num": "J",
   "type": "Exercises",
   "prompt": "Perform a verification and validation walkthrough for the structural model created for exercise J.",
   "criteria": [
    [
     "verification",
     "驗證"
    ],
    [
     "validation",
     "確認"
    ],
    [
     "walkthrough",
     "走查"
    ],
    [
     "structural",
     "結構"
    ],
    [
     "consistency",
     "一致性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EK",
   "num": "K",
   "type": "Exercises",
   "prompt": "Using the seven-step process described in this chapter, create a structural model for exercise E in Chapter 4.",
   "criteria": [
    [
     "seven-step",
     "七步"
    ],
    [
     "crc",
     "責任"
    ],
    [
     "class diagram",
     "類別圖"
    ],
    [
     "patient",
     "appointment",
     "病患",
     "預約"
    ],
    [
     "relationship",
     "多重性",
     "關係"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EL",
   "num": "L",
   "type": "Exercises",
   "prompt": "Perform a verification and validation walkthrough for the structural model created for exercise L.",
   "criteria": [
    [
     "verification",
     "驗證"
    ],
    [
     "validation",
     "確認"
    ],
    [
     "walkthrough",
     "走查"
    ],
    [
     "structural",
     "結構"
    ],
    [
     "consistency",
     "一致性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EM",
   "num": "M",
   "type": "Exercises",
   "prompt": "Using the seven-step process described in this chapter, create a structural model for exercise G in Chapter 4.",
   "criteria": [
    [
     "seven-step",
     "七步"
    ],
    [
     "crc",
     "責任"
    ],
    [
     "class diagram",
     "類別圖"
    ],
    [
     "registration",
     "course",
     "選課",
     "課程"
    ],
    [
     "multiplicity",
     "關係",
     "多重性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EN",
   "num": "N",
   "type": "Exercises",
   "prompt": "Perform a verification and validation walkthrough for the structural model created for exercise N.",
   "criteria": [
    [
     "verification",
     "驗證"
    ],
    [
     "validation",
     "確認"
    ],
    [
     "walkthrough",
     "走查"
    ],
    [
     "structural",
     "結構"
    ],
    [
     "consistency",
     "一致性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EO",
   "num": "O",
   "type": "Exercises",
   "prompt": "Using the seven-step process described in this chapter, create a structural model for exercise I in Chapter 4.",
   "criteria": [
    [
     "seven-step",
     "七步"
    ],
    [
     "crc",
     "責任"
    ],
    [
     "class diagram",
     "類別圖"
    ],
    [
     "real estate",
     "house",
     "房仲",
     "房屋"
    ],
    [
     "multiplicity",
     "多重性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EP",
   "num": "P",
   "type": "Exercises",
   "prompt": "Perform a verification and validation walkthrough for the structural model created for exercise P.",
   "criteria": [
    [
     "verification",
     "驗證"
    ],
    [
     "validation",
     "確認"
    ],
    [
     "walkthrough",
     "走查"
    ],
    [
     "structural",
     "結構"
    ],
    [
     "consistency",
     "一致性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EQ",
   "num": "Q",
   "type": "Exercises",
   "prompt": "Using the seven-step process described in this chapter, create a structural model for exercise L in Chapter 4.",
   "criteria": [
    [
     "seven-step",
     "七步"
    ],
    [
     "crc",
     "責任"
    ],
    [
     "class diagram",
     "類別圖"
    ],
    [
     "video",
     "rental",
     "影片",
     "租借"
    ],
    [
     "multiplicity",
     "多重性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "ER",
   "num": "R",
   "type": "Exercises",
   "prompt": "Perform a verification and validation walkthrough for the structural model created for exercise R.",
   "criteria": [
    [
     "verification",
     "驗證"
    ],
    [
     "validation",
     "確認"
    ],
    [
     "walkthrough",
     "走查"
    ],
    [
     "structural",
     "結構"
    ],
    [
     "consistency",
     "一致性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "ES",
   "num": "S",
   "type": "Exercises",
   "prompt": "Using the seven-step process described in this chapter, create a structural model for exercise O in Chapter 4.",
   "criteria": [
    [
     "seven-step",
     "七步"
    ],
    [
     "crc",
     "責任"
    ],
    [
     "class diagram",
     "類別圖"
    ],
    [
     "gym",
     "membership",
     "健身",
     "會員"
    ],
    [
     "multiplicity",
     "多重性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "ET",
   "num": "T",
   "type": "Exercises",
   "prompt": "Perform a verification and validation walkthrough for the structural model created for exercise T.",
   "criteria": [
    [
     "verification",
     "驗證"
    ],
    [
     "validation",
     "確認"
    ],
    [
     "walkthrough",
     "走查"
    ],
    [
     "structural",
     "結構"
    ],
    [
     "consistency",
     "一致性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EU",
   "num": "U",
   "type": "Exercises",
   "prompt": "Using the seven-step process described in this chapter, create a structural model for exercise R in Chapter 4.",
   "criteria": [
    [
     "seven-step",
     "七步"
    ],
    [
     "crc",
     "責任"
    ],
    [
     "class diagram",
     "類別圖"
    ],
    [
     "catering",
     "picnic",
     "外燴",
     "野餐"
    ],
    [
     "multiplicity",
     "多重性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EV",
   "num": "V",
   "type": "Exercises",
   "prompt": "Perform a verification and validation walkthrough for the structural model created for exercise V.",
   "criteria": [
    [
     "verification",
     "驗證"
    ],
    [
     "validation",
     "確認"
    ],
    [
     "walkthrough",
     "走查"
    ],
    [
     "structural",
     "結構"
    ],
    [
     "consistency",
     "一致性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EW",
   "num": "W",
   "type": "Exercises",
   "prompt": "Using the seven-step process described in this chapter, create a structural model for exercise U in Chapter 4.",
   "criteria": [
    [
     "seven-step",
     "七步"
    ],
    [
     "crc",
     "責任"
    ],
    [
     "class diagram",
     "類別圖"
    ],
    [
     "subscription",
     "membership",
     "訂閱",
     "會員"
    ],
    [
     "multiplicity",
     "多重性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  },
  {
   "id": "EX",
   "num": "X",
   "type": "Exercises",
   "prompt": "Perform a verification and validation walkthrough for the structural model created for exercise X.",
   "criteria": [
    [
     "verification",
     "驗證"
    ],
    [
     "validation",
     "確認"
    ],
    [
     "walkthrough",
     "走查"
    ],
    [
     "structural",
     "結構"
    ],
    [
     "consistency",
     "一致性"
    ]
   ],
   "manual": true,
   "external": false,
   "sourcePage": 200
  }
 ]
};
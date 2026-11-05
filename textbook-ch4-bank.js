/* Source user uploaded textbook Chapter 5 Structural Modeling pp.198–201 (course Ch4).
  Responses receive only provisional keyword-concept coverage, not official grading. */
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
  }
 ]
};
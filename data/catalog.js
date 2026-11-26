/*
 * 중랑평교 도서관 — 소장 자료 목록
 * ------------------------------------------------------------
 * 새 자료를 추가하려면 아래 배열에 항목 하나를 추가하세요.
 * (자세한 규칙은 저장소 루트의 CLAUDE.md 참고)
 *
 *  id        : 영문 소문자-하이픈 고유값 (주소창 #/book/<id> 에 사용)
 *  callNo    : 청구기호  [유형코드]-[발행연도]-[일련번호]
 *  type      : "연구논문" | "주요 운영자료" | "발표자료" 등
 *  pages     : 쪽수(숫자) / pagesLabel: 쪽수 대신 보여 줄 말(선택, 예: "슬라이드 23장")
 *  cover     : { theme: 색상테마, motif: 표지 그림 }  (theme=표지 띠 색, motif=첫 페이지 이미지가 없을 때 그리는 표지)
 *              theme  → navy | forest | crimson | amber | plum | teal | slate
 *              motif  → basketball | chart | puppy | sprout | book | heart | puzzle | music
 *  coverRatio: (선택) 원본 표지 비율(가로 / 세로). 기본은 세로형 3 / 4.2 — 서가에서는 높이를 다른 표지와 같게 두고 너비만 비율대로 넓힘
 *  coverBg   : (선택) 세로형이 아닌 표지(정사각형 그림책 등)를 잘리지 않게 세로 틀 안에 넣고, 남는 위·아래를 이 색으로 채움
 *  firstPage : 원문 첫 페이지 이미지 (assets/firstpages/<id>.jpg) — 사이트 표지와 요약 PDF 첫 장에 사용
 *  original  : 원문 파일 경로 (files/originals/<id>.<확장자>) — 상세 페이지의 ‘원문 내려받기’
 *              (원문을 공개하지 않는 자료는 이 줄을 빼고 원문 파일도 올리지 않음)
 *  external  : (선택) 원문 대신 외부 사이트로 안내 { url, label, note } — 버튼과 그 아래 안내 문구로 표시
 *  format    : 원문 형식 ("PDF" | "HWP" …)
 *  summary   : 상세 페이지 첫머리에 보이는 요약
 *     oneLine   한 줄 요약
 *     easy      쉬운 말 요약 (문장 배열, 짧고 쉬운 표현)
 *     stats     핵심 수치 카드 [{ label, value }]
 *  상세 요약 본문(상세 페이지에 모두 표시)은 data/reports.js 에 같은 id 로 작성합니다.
 */
window.CATALOG = [
  {
    id: "self-perception-independence-2026",
    original: "files/originals/self-perception-independence-2026.pdf",
    format: "PDF",
    firstPage: "assets/firstpages/self-perception-independence-2026.jpg",
    callNo: "논문-2026-01",
    type: "연구논문",
    title: "성인발달장애인이 지각한 자신에 관한 생각이 자립의지에 미치는 영향",
    subtitle: "미래계획의 매개효과와 일상생활능력 및 인지능력의 조절효과를 중심으로",
    authors: ["박종두", "남영란"],
    publisher: "미래설계복지실천연구 제1권 제1호, pp.7–31",
    year: 2026,
    pages: 25,
    keywords: ["성인발달장애인", "자신에 관한 생각", "자립의지", "미래설계", "일상생활능력", "인지능력"],
    cover: { theme: "forest", motif: "sprout" },
    summary: {
      oneLine:
        "2024년 발달장애인 일과 삶 실태조사 패널의 성인발달장애인 894명을 분석해, 자신을 긍정적으로 생각할수록 자립의지가 높고(β=.167), 미래계획이 그 관계를 부분매개하며, 일상생활능력과 인지능력이 그 관계를 조절함을 밝힌 연구입니다.",
      easy: [
        "나를 좋게 생각할수록 혼자 살아 보고 싶은 마음(자립의지)이 커져요.",
        "돈, 집, 법 같은 미래 계획을 세우면 그 마음이 더 커져요.",
        "옷 입기, 장보기 같은 생활 기술과 읽기·셈하기 같은 능력이 좋을수록 효과가 더 커요.",
        "그래서 칭찬과 성공 경험, 미래 계획 돕기, 생활 연습을 함께 해야 해요."
      ],
      stats: [
        { label: "분석 대상", value: "894명" },
        { label: "자신에 관한 생각 → 자립의지", value: "β = .167" },
        { label: "미래계획 → 자립의지", value: "β = .245" },
        { label: "간접효과(부분매개)", value: ".070" }
      ]
    }
  },
  {
    id: "social-worker-job-satisfaction-2026",
    external: {
      url: "https://www.kafw.co.kr/",
      label: "한국미래설계복지실천학회로 이동하기",
      note: "원문은 한국미래설계복지실천학회 사이트에서 내려받거나 요청해 주세요."
    },
    format: "PDF",
    firstPage: "assets/firstpages/social-worker-job-satisfaction-2026.jpg",
    callNo: "논문-2026-02",
    type: "연구논문",
    title: "사회복지사의 역량지원과 처우 및 심리안녕이 업무만족에 미치는 영향",
    subtitle: "2023년 한국사회복지관협회 조사자료 3,568명 분석",
    authors: ["이광용", "임재택", "황주찬", "박종두"],
    publisher: "미래설계복지실천연구 제1권 제1호, pp.33–59",
    year: 2026,
    pages: 26,
    keywords: ["사회복지사", "역량지원", "처우", "심리안녕", "업무만족", "슈퍼비전"],
    cover: { theme: "navy", motif: "chart" },
    summary: {
      oneLine:
        "전국 사회복지사 3,568명의 2023년 조사자료를 위계적 회귀분석한 결과, 업무만족은 연령·경력보다 보수(β=.328)·스트레스(β=-.300)·경력개발지원(β=.253) 같은 처우·심리안녕·역량지원의 영향을 크게 받았으며(설명력 60.0%), 보수·건강·스트레스 관리와 슈퍼비전·자문·경력개발 지원 강화를 제언한 연구입니다.",
      easy: [
        "전국 사회복지사 3,568명이 일에 얼마나 만족하는지 살펴봤어요.",
        "배우고 성장하도록 돕는 지원(경력개발, 슈퍼비전, 자문)도 큰 도움이 돼요.",
        "그래서 일하는 사람의 몸과 마음을 챙기고, 성장을 도와야 해요."
      ],
      stats: [
        { label: "분석 대상", value: "3,568명" },
        { label: "업무만족 설명력", value: "60.0%" },
        { label: "보수의 영향", value: "β = .328" },
        { label: "스트레스의 영향", value: "β = −.300" }
      ]
    }
  },
  {
    id: "christian-welfare-practitioner-2026",
    format: "PPTX",
    firstPage: "assets/firstpages/christian-welfare-practitioner-2026.jpg",
    callNo: "발표-2026-02",
    type: "발표자료",
    title: "기독교사회복지실천가의 역할정립을 통한 기독교사회복지의 본질적 가치와 전문성 모색",
    subtitle: "2026 한국기독교사회복지실천학회 추계학술대회 발표자료",
    authors: ["박종두"],
    publisher: "2026 한국기독교사회복지실천학회 추계학술대회 (한국기독교사회복지학회·교회사회사업학회 통합 10주년 기념)",
    year: 2026,
    pages: 27,
    pagesLabel: "슬라이드 27장",
    keywords: ["기독교사회복지", "실천가", "본질적 가치", "전문성", "슈퍼비전", "강점관점"],
    cover: { theme: "teal", motif: "heart" },
    summary: {
      oneLine:
        "기독교사회복지의 정체성을 ‘본질적 가치 + 전문성 + 실천가’로 보고, 사회복지법인 성민의 욕구조사 8회(2014~2024)·만족도 조사·사례관리·슈퍼비전 경험을 분석해 기독교사회복지실천가의 6가지 역할과 4가지 과제를 제시한 2026년 추계학술대회 발표자료입니다.",
      easy: [
        "교회가 하는 복지가 어떤 마음과 실력으로 이루어져야 하는지 이야기하는 발표예요.",
        "모든 사람은 장애가 있든 없든, 나이가 많든 적든 소중해요.",
        "복지 일을 하는 사람은 따뜻한 마음과 전문 실력을 함께 가져야 해요.",
        "도움을 받기만 하는 사람이 아니라, 함께 살아가는 동료가 되도록 돕자고 해요."
      ],
      stats: [
        { label: "분석한 욕구조사", value: "8회" },
        { label: "실천가의 역할", value: "6가지" },
        { label: "제언 과제", value: "4가지" },
        { label: "학술대회", value: "2026. 10. 31." }
      ]
    }
  },
  {
    id: "operation-plan-2026",
    format: "PDF",
    firstPage: "assets/firstpages/operation-plan-2026.jpg",
    callNo: "운영자료-2026-02",
    type: "주요 운영자료",
    title: "2026년 기관운영계획서",
    subtitle: "중랑구발달장애인평생교육센터 2026년 기관 운영계획과 세부사업계획",
    authors: ["중랑구발달장애인평생교육센터"],
    publisher: "중랑구발달장애인평생교육센터",
    year: 2026,
    pages: 180,
    keywords: ["기관운영계획", "세부사업계획", "개인별지원계획", "자립생활", "평생교육", "발달장애인"],
    cover: { theme: "slate", motif: "book" },
    summary: {
      oneLine:
        "교육생 29명·종사자 14명이 함께하는 중랑구발달장애인평생교육센터의 2026년 기관 운영 방향(사명·비전·조직·이용자)과 7개 사업 영역 53개 사업의 세부계획(목적·산출목표·일정·평가)을 담은 180쪽 운영계획서입니다.",
      easy: [
        "센터가 2026년 한 해 동안 무엇을 할지 적어 둔 계획서예요.",
        "밥 먹기, 건강, 취미, 공부, 일 연습 등 반마다 하는 활동이 정리되어 있어요.",
        "혼자 사는 연습, 미래 준비 수업, 자치회의 같은 활동도 있어요.",
        "가족 상담, 홍보, 선생님 공부, 새로운 사업 계획도 들어 있어요."
      ],
      stats: [
        { label: "사업 수", value: "53개" },
        { label: "교육생(2026.1.1.)", value: "29명" },
        { label: "종사자", value: "14명" },
        { label: "총 예산", value: "954,000천 원" }
      ]
    }
  },
  {
    id: "needs-survey-report-2026",
    original: "files/originals/needs-survey-report-2026.pdf",
    format: "PDF",
    firstPage: "assets/firstpages/needs-survey-report-2026.jpg",
    callNo: "운영자료-2026-01",
    type: "주요 운영자료",
    title: "성인발달장애인의 평생교육 실천을 위한 욕구조사 보고서",
    subtitle: "평생과정 8개 영역의 중요도·희망·스스로 할 수 있음",
    authors: ["중랑구발달장애인평생교육센터"],
    publisher: "중랑구발달장애인평생교육센터",
    year: 2026,
    pages: 94,
    keywords: ["욕구조사", "평생과정설계", "IPA", "자기결정", "자립생활", "발달장애인"],
    cover: { theme: "slate", motif: "chart" },
    summary: {
      oneLine:
        "센터 교육생 26명에게 평생과정 8개 영역 24개 항목의 ‘중요도·희망·스스로 할 수 있음’을 물어 대응표본 t검정과 IPA로 분석하고, 결혼·법률·주거·직업을 핵심 우선지원 영역으로 하는 8가지 운영 방향을 제언한 2026년 욕구조사 보고서입니다.",
      easy: [
        "센터 친구 26명에게 무엇이 중요하고, 무엇을 배우고 싶고, 무엇을 혼자 할 수 있는지 물어봤어요.",
        "건강, 문화, 가족, 공부, 돈, 일, 집, 법 8가지를 물어봤어요.",
        "가족, 법, 집, 일은 모두 중요하고 배우고 싶다고 했어요.",
        "요리와 돈 관리는 특히 배우고 싶어 했어요. 센터는 이 결과로 수업을 더 알맞게 만들 거예요."
      ],
      stats: [
        { label: "조사 참여(회수율 100%)", value: "26명" },
        { label: "평생과정 영역·항목", value: "8개 · 24개" },
        { label: "희망≠중요 유의미한 항목", value: "4개" },
        { label: "운영 제언", value: "8가지" }
      ]
    }
  },
  {
    id: "future-design-academy-2026",
    format: "PPTX",
    firstPage: "assets/firstpages/future-design-academy-2026.jpg",
    callNo: "발표-2026-01",
    type: "발표자료",
    title: "미래설계 아카데미 개발 배경 및 과정",
    subtitle: "2026년 공동세미나 「미래를 그리는 배움의 힘」 발표자료",
    authors: ["박종두"],
    publisher: "한국미래설계복지실천학회 · 동대문구·중랑구발달장애인평생교육센터 공동세미나",
    year: 2026,
    pages: 23,
    pagesLabel: "슬라이드 23장",
    keywords: ["미래설계", "평생과정설계", "자기결정", "자립", "IPA", "발달장애인"],
    cover: { theme: "teal", motif: "puzzle" },
    summary: {
      oneLine:
        "발달장애인이 보건의료·문화여가·결혼·교육·소득재정·직업·주거·법 8개 영역의 미래를 스스로 설계하도록 만든 12회기 ‘미래설계(PPP) 아카데미’의 개발 배경과 회기별 과정, IPA 영역 탐색과 사전–사후 검사 결과를 소개한 2026년 공동세미나 발표자료입니다.",
      easy: [
        "미래설계 아카데미는 내 꿈과 행복한 미래를 준비하는 수업이에요.",
        "12번 만나서 건강, 돈, 일, 집, 가족, 법 같은 것을 하나씩 배웠어요.",
        "AI로 미래 가족을 그려 보고, 지원주택에도 직접 가 봤어요.",
        "배우고 나서 내 미래를 더 잘 알게 되고, 스스로 해 보고 싶은 마음이 커졌어요."
      ],
      stats: [
        { label: "프로그램", value: "12회기" },
        { label: "미래설계 영역", value: "8개" },
        { label: "이해도 유의미한 향상", value: "8개 중 7개 영역" },
        { label: "세미나", value: "2026. 8. 13." }
      ]
    }
  },
  {
    id: "strength-curriculum-seminar-2023",
    format: "PDF",
    firstPage: "assets/firstpages/strength-curriculum-seminar-2023.jpg",
    callNo: "발표-2023-01",
    type: "발표자료",
    title: "최중증발달장애인의 강점 발굴과 교육과정 운영",
    subtitle: "“어떻게 실천할 것인가?” — 사회복지법인 성민 창립 20주년 기념 세미나 「평범한 일상, 평범한 미래」",
    authors: ["강진숙"],
    publisher: "사회복지법인 성민 창립 20주년 · 성민복지관 개관 14주년 기념 세미나",
    year: 2023,
    pages: 47,
    pagesLabel: "슬라이드 47장",
    keywords: ["최중증발달장애인", "강점관점", "교육과정", "사람중심계획", "도전적 행동", "발달장애인"],
    cover: { theme: "teal", motif: "heart" },
    summary: {
      oneLine:
        "발달장애인평생교육센터의 설립 배경과 운영 현황을 소개하고, 최중증발달장애인을 ‘문제’가 아닌 ‘강점’으로 바라보며 교육과정을 운영하는 방법과 실제 변화 사례를 담은 2023년 세미나 발표자료입니다.",
      easy: [
        "발달장애인 친구들의 ‘못하는 점’보다 ‘잘하는 점’을 먼저 찾자는 이야기예요.",
        "센터는 처음 상담부터 마지막 평가까지 9단계로 한 사람 한 사람을 도와요.",
        "그림 일정표처럼 눈으로 볼 수 있게 알려 주면 더 쉽게 알 수 있어요.",
        "조금씩 연습해서 소리 내어 말하고, 웃는 날이 많아진 친구들도 있어요."
      ],
      stats: [
        { label: "운영 과정", value: "9단계" },
        { label: "동대문·중랑 교육생(2023.7)", value: "55명" },
        { label: "변화 사례", value: "3명" },
        { label: "세미나", value: "2023. 8. 10." }
      ]
    }
  },
  {
    id: "red-puppy-picturebook-2022",
    format: "PDF",
    firstPage: "assets/firstpages/red-puppy-picturebook-2022.jpg",
    coverRatio: "1040 / 1055",
    callNo: "운영자료-2022-02",
    type: "주요 운영자료",
    title: "빨강 강아지, 뭐 어때?",
    subtitle: "모습도 색깔도 다양한 우리들, 뭐 어때?",
    authors: ["중랑구발달장애인평생교육센터 교육생"],
    publisher: "중랑구발달장애인평생교육센터",
    year: 2022,
    pages: 24,
    keywords: ["그림책", "다양성", "편견 없는 사회", "문화예술교육", "자기표현"],
    cover: { theme: "plum", motif: "puppy" },
    summary: {
      oneLine:
        "센터 교육생 29명이 직접 글을 쓰고 그림을 그린 그림책입니다. 빨강 강아지가 거북이, 고래, 노란 비둘기, 뿔 난 말, “멍멍” 우는 사자 같은 개성 있는 친구들을 소개하며 ‘모습도 색깔도 다양하지만 뭐 어때?’라는 메시지를 전합니다.",
      easy: [
        "센터 친구들이 직접 글을 쓰고 그림을 그린 그림책이에요.",
        "빨강 강아지가 자기 친구들을 한 명씩 소개해요.",
        "노란 비둘기, 멍멍 우는 사자처럼 모두 조금씩 달라요.",
        "“우리는 여러 가지 색깔, 다양한 모습이에요. 뭐 어때?”"
      ],
      stats: [
        { label: "글·그림 참여", value: "29명" },
        { label: "분량", value: "24쪽" },
        { label: "등장하는 친구", value: "10여 동물" },
        { label: "발행", value: "2022년 12월" }
      ]
    }
  },
  {
    id: "red-puppy-interview-2023",
    original: "files/originals/red-puppy-interview-2023.pdf",
    format: "PDF",
    firstPage: "assets/firstpages/red-puppy-interview-2023.jpg",
    callNo: "논문-2023-02",
    type: "연구논문",
    title: "문화예술교육이 성인발달장애인의 삶의 질에 미치는 영향",
    subtitle: "‘빨간 강아지, 뭐 어때?’ 작가 심층인터뷰를 중심으로",
    authors: ["서지윤", "박종두", "홍성원", "정은희", "이동민"],
    publisher: "사회심리발달연구 제4권 1호, pp.111–126",
    year: 2023,
    pages: 16,
    keywords: ["성인발달장애인", "문화예술교육", "삶의 질", "그림책", "질적연구"],
    cover: { theme: "crimson", motif: "puppy" },
    summary: {
      oneLine:
        "그림책 ‘빨간 강아지, 뭐 어때?’를 직접 만든 성인발달장애인 작가 4명을 인터뷰해, 문화예술교육이 즐거움·자신감·자기효능감을 높여 삶의 질에 도움이 된다는 것을 확인한 질적연구입니다.",
      easy: [
        "센터 친구 4명이 그림책을 직접 만들었어요.",
        "그림을 그리고 글을 쓰면서 즐겁고 뿌듯했대요.",
        "칭찬을 받으니 자신감이 생기고, 더 많은 것을 해보고 싶어졌어요.",
        "모두가 쉽게 참여할 수 있게 작은 활동부터 도와주는 것이 중요해요."
      ],
      stats: [
        { label: "연구 참여자", value: "4명" },
        { label: "교육 기간", value: "2022.8 ~ 12" },
        { label: "인터뷰", value: "1인 45분" }
      ]
    }
  },
  {
    id: "jayutu-basketball-2023",
    original: "files/originals/jayutu-basketball-2023.pdf",
    format: "PDF",
    firstPage: "assets/firstpages/jayutu-basketball-2023.jpg",
    callNo: "논문-2023-01",
    type: "연구논문",
    title: "최중증성인발달장애인의 문화예술교육 효과성 검증에 관한 연구",
    subtitle: "중랑구발달장애인평생교육센터 「자유투」 프로그램을 중심으로",
    authors: ["서지윤", "박종두", "김영수", "이민정", "정은희"],
    publisher: "중랑구발달장애인평생교육센터",
    year: 2023,
    pages: 10,
    keywords: ["최중증성인발달장애인", "문화예술교육", "삶의 만족", "농구", "효과성 검증"],
    cover: { theme: "amber", motif: "basketball" },
    summary: {
      oneLine:
        "농구를 매개로 한 36회기 「자유투」 프로그램이 최중증성인발달장애인 7명의 삶의 만족(p=.046)과 농구 이해도(p=.023)를 통계적으로 유의미하게 높였음을 검증한 연구입니다.",
      easy: [
        "센터 친구 7명이 8개월 동안 농구를 배웠어요.",
        "드리블, 패스, 슛을 하나씩 연습하고 마지막엔 팀 경기를 했어요.",
        "농구를 하고 나서 생활이 더 즐겁고 만족스러워졌어요.",
        "농구 규칙과 방법도 더 잘 알게 되었어요."
      ],
      stats: [
        { label: "참여자", value: "7명" },
        { label: "프로그램", value: "36회기" },
        { label: "삶의 만족", value: "p = .046" },
        { label: "농구 이해도", value: "p = .023" }
      ]
    }
  },
  {
    id: "happy-growth-activity-book-2022",
    format: "PDF",
    firstPage: "assets/firstpages/happy-growth-activity-book-2022.jpg",
    callNo: "운영자료-2022-01",
    type: "주요 운영자료",
    title: "우리들의 행복성장교실",
    subtitle: "평생과정설계 아카데미 활동북 쉬운버전 1탄",
    authors: ["중랑구발달장애인평생교육센터"],
    publisher: "중랑구발달장애인평생교육센터",
    year: 2022,
    pages: 78,
    keywords: ["평생과정설계", "쉬운자료", "자립생활", "자기결정", "직업설계"],
    cover: { theme: "forest", motif: "sprout" },
    summary: {
      oneLine:
        "발달장애인이 스스로 행복한 미래를 준비하도록 ‘미래·교육·보건의료·직업’ 네 가지 설계를 그림과 쉬운 말로 배우는 78쪽 활동북입니다.",
      easy: [
        "평생과정설계는 행복한 미래를 준비하는 거예요.",
        "자립은 혼자 다 하는 게 아니라, 내가 고르고 필요한 도움을 받으며 사는 거예요.",
        "몸 튼튼, 마음 튼튼, 함께 튼튼 — 건강을 지키는 방법을 배워요.",
        "내가 좋아하고 잘하는 일을 찾아 당당한 사회인이 되어요."
      ],
      stats: [
        { label: "분량", value: "78쪽" },
        { label: "설계 영역", value: "4가지" },
        { label: "발간", value: "2022년 7월" }
      ]
    }
  },
  {
    id: "center-curriculum-study-2020",
    original: "files/originals/center-curriculum-study-2020.pdf",
    format: "PDF",
    firstPage: "assets/firstpages/center-curriculum-study-2020.jpg",
    callNo: "논문-2020-01",
    type: "연구논문",
    title: "발달장애인 평생교육센터의 교육과정에 관한 고찰",
    subtitle: "서울시 발달장애인 평생교육센터 운영 현황과 종사자 인식",
    authors: ["강진숙", "심향은", "김성동", "이은혜"],
    publisher: "발달장애연구 제24권 제1호",
    year: 2020,
    pages: 27,
    keywords: ["발달장애인 평생교육센터", "교육과정", "평생교육", "혼합연구"],
    cover: { theme: "navy", motif: "chart" },
    summary: {
      oneLine:
        "서울시 발달장애인 평생교육센터 16곳을 전수조사하고 센터장 4명을 인터뷰해 교육과정 운영 현황과 종사자 인식을 살피고, 매뉴얼 개발·자립생활 중심 교육과정·인력 전문성 지원을 제언한 연구입니다.",
      easy: [
        "서울에 있는 평생교육센터 16곳에 질문을 했어요.",
        "선생님들은 일상생활 힘 기르기와 동네 활동 참여가 가장 중요하다고 했어요.",
        "친구마다 특성이 달라서, 한 명 한 명에게 맞는 수업이 필요해요.",
        "선생님들이 더 배우고 성장할 수 있도록 도와야 해요."
      ],
      stats: [
        { label: "조사 센터", value: "16곳" },
        { label: "센터당 이용자", value: "평균 28.5명" },
        { label: "센터당 인력", value: "평균 11.1명" },
        { label: "45분 수업", value: "68.8%" }
      ]
    }
  }
];

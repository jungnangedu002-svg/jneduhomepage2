/*
 * 중랑평교 도서관 — 소장 자료 목록
 * ------------------------------------------------------------
 * 새 자료를 추가하려면 아래 배열에 항목 하나를 추가하세요.
 * (자세한 규칙은 저장소 루트의 CLAUDE.md 참고)
 *
 *  id        : 영문 소문자-하이픈 고유값 (주소창 #/book/<id> 에 사용)
 *  callNo    : 청구기호  [유형코드]-[발행연도]-[일련번호]
 *  type      : "연구논문" | "교육자료" | "보고서" | "활동북" 등
 *  cover     : { theme: 색상테마, motif: 표지 그림 }  (theme=표지 띠 색, motif=첫 페이지 이미지가 없을 때 그리는 표지)
 *              theme  → navy | forest | crimson | amber | plum | teal | slate
 *              motif  → basketball | chart | puppy | sprout | book | heart | puzzle | music
 *  firstPage : 원문 첫 페이지 이미지 (assets/firstpages/<id>.jpg) — 사이트 표지와 요약 PDF 첫 장에 사용
 *  original  : 원문 파일 경로 (files/originals/<id>.<확장자>) — 상세 페이지의 ‘원문 내려받기’
 *              (원문을 공개하지 않는 자료는 이 줄을 빼고 원문 파일도 올리지 않음)
 *  format    : 원문 형식 ("PDF" | "HWP" …)
 *  summary   : 상세 페이지 첫머리에 보이는 요약
 *     oneLine   한 줄 요약
 *     easy      쉬운 말 요약 (문장 배열, 짧고 쉬운 표현)
 *     stats     핵심 수치 카드 [{ label, value }]
 *  상세 요약 본문(상세 페이지에 모두 표시)은 data/reports.js 에 같은 id 로 작성합니다.
 */
window.CATALOG = [
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
    callNo: "활동북-2022-01",
    type: "활동북",
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

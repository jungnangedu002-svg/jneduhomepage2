# 중랑평교 도서관 — 작업 규칙

중랑구발달장애인평생교육센터의 자료를 모아 보는 정적 온라인 도서관입니다.
빌드 과정 없이 `index.html`을 열면 동작합니다(GitHub Pages·Vercel 호환).
사이트에는 **표지와 서지정보, 짧은 요약만** 보여 주고, 내용은 **자료별 요약본 PDF**로 내려받게 합니다.
**원문 파일은 저장소에 올리지 않습니다.**

## 구조
- `index.html` — 화면 뼈대 / `assets/style.css` — 사이트 디자인 / `assets/app.js` — 화면 렌더링
- `assets/cover.js` — 표지 그림(사이트와 PDF 공용), `assets/print.css` — 요약본 PDF 디자인
- `data/catalog.js` — 소장 자료 목록(서지정보, 한눈에 보기, 쉬운 말 요약, 핵심 숫자)
- `data/reports.js` — 자료별 상세 요약 본문(요약 PDF 내용)
- `files/summaries/<id>.pdf` — 생성된 요약본 PDF / `docs/process/` — 작업 과정 그림
- `tools/hwp2txt.py` — HWP 본문 추출, `tools/build-summaries.js` — 요약 PDF 생성, `tools/screenshot.js` — 화면 캡처

## 새 자료가 올라오면 (항상 같은 방식으로)
1. 원문 읽기 (원문은 저장소에 복사하지 않음): PDF는 `pdftotext -layout`, HWP는 `pip install olefile && python3 -I tools/hwp2txt.py <파일>`
2. `data/catalog.js` 배열에 항목 추가 (필드 설명은 파일 상단 주석)
   - `summaryPdf`: `files/summaries/<id>.pdf`
   - `callNo`: `논문-YYYY-NN` / `활동북-YYYY-NN` / `보고서-YYYY-NN` … 같은 유형·연도 안에서 일련번호 증가
   - `cover.theme`: 기존 자료와 겹치지 않게 (navy·forest·crimson·amber·plum·teal·slate)
   - `cover.motif`: 내용에 맞는 그림 (basketball·chart·puppy·sprout·book·heart·puzzle·music). 맞는 게 없으면 `assets/cover.js`의 `MOTIFS`에 단순한 선 그림 SVG(viewBox 0 0 100 100, stroke=currentColor)를 추가
   - `summary`: `oneLine`(대상·방법·핵심 결과), `easy`(쉬운 말 3~4문장, “~해요” 체), `stats`(핵심 숫자 2~4개)
3. `data/reports.js`에 같은 id로 상세 요약 작성 — 자세하게
   - 논문: 연구 배경과 필요성 / (이론적 배경) / 연구 방법(대상·절차·도구, 표) / 연구 결과(표·수치·인터뷰 인용) / 결론과 제언 / 의의와 한계
   - 활동북·자료집: 이 책은?(목적·구성 표) / 단원별 내용과 활동 / 배운 내용 / 만든 사람들
   - 원문에 있는 사실·수치·인용만 사용 (추측 금지)
4. `node tools/build-summaries.js <id>` 로 PDF 생성 → `pdftoppm`으로 페이지를 이미지로 바꿔 깨짐·잘린 표가 없는지 확인
5. `node tools/screenshot.js docs/process` 로 사이트 캡처 확인 (오류·가로 스크롤 없을 것)
6. 커밋 & 푸시

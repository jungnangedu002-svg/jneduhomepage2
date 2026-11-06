# 중랑평교 도서관 — 작업 규칙

중랑구발달장애인평생교육센터의 자료를 모아 보는 정적 온라인 도서관입니다.
빌드 과정 없이 `index.html`을 열면 동작합니다(GitHub Pages·Vercel 호환).
- 표지 = **원문 첫 페이지 이미지**
- 표지를 누르면 상세 페이지에 **서지정보 + 한눈에 보기·쉬운 말 요약·핵심 숫자 + 자세한 요약 전체**가 한 화면에 보임
- **‘원문 내려받기’** 버튼으로 처음 받은 원문 파일을 그대로 내려받음

## 구조
- `index.html` — 화면 뼈대 / `assets/style.css` — 사이트 디자인 / `assets/app.js` — 화면 렌더링
- `assets/cover.js` — 표지(첫 페이지 이미지, 없으면 그린 표지)
- `data/catalog.js` — 소장 자료 목록(서지정보, 원문 경로, 한눈에 보기, 쉬운 말 요약, 핵심 숫자)
- `data/reports.js` — 자료별 자세한 요약 본문(상세 페이지에 모두 표시)
- `files/originals/<id>.<확장자>` — 원문 파일(내려받기용)
- `assets/firstpages/<id>.jpg` — 원문 첫 페이지 이미지(표지)
- `assets/og-image.png` — 공유 미리보기 이미지(글자만, `tools/og-image.html` → `node tools/build-og-image.js`), 공유 문구는 `index.html`의 og:/twitter: 태그
- `docs/process/` — 작업 과정 그림
- `tools/hwp2txt.py` — HWP 본문 추출, `tools/hwp-render/render-first-page.js` — HWP 첫 페이지 이미지, `tools/screenshot.js` — 화면 캡처
- (선택) `tools/build-summaries.js` + `assets/print.css` — 요약을 PDF로 따로 만들 때만 사용(사이트에는 연결하지 않음)

## 새 자료가 올라오면 (항상 같은 방식으로)
1. 원문을 `files/originals/<id>.<확장자>` 로 복사 (id: `영문-요약명-발행연도`, 내용은 바꾸지 않음)
   - 원문 공개를 원하지 않는 자료는 복사하지 않고 catalog에서 `original`을 뺌 → 상세 페이지에 “원문을 내려받을 수 없어요” 표시 (현재: 우리들의 행복성장교실, 미래설계 아카데미 개발 배경 및 과정)
2. 원문 읽기: PDF는 `pdftotext -layout`, HWP는 `pip install olefile && python3 -I tools/hwp2txt.py <파일>`
   - PPT(PPTX): 글자는 `python-pptx`로 슬라이드별 추출, 그래프·표 사진은 `soffice --headless --convert-to pdf` 후 `pdftoppm`으로 그림으로 보고 읽음. 사진으로 된 표처럼 숫자를 확실히 읽을 수 없는 내용은 요약에 넣지 않고 그렇게 밝힘
3. 원문 첫 페이지를 이미지로 저장 → `assets/firstpages/<id>.jpg` (표지용 PDF를 따로 받으면 그 PDF 1쪽을 사용 — 예: 미래설계 아카데미 발표자료)
   - PDF: `pdftoppm -f 1 -l 1 -r 110 -jpeg -jpegopt quality=85 -singlefile <원문.pdf> assets/firstpages/<id>`
   - HWP: `node tools/hwp-render/render-first-page.js <원문.hwp> assets/firstpages/<id>.jpg`
4. `data/catalog.js` 배열에 항목 추가 (필드 설명은 파일 상단 주석)
   - `original`: `files/originals/<id>.<확장자>`, `format`: `"PDF"`/`"HWP"`/`"PPTX"`, `firstPage`: `assets/firstpages/<id>.jpg`
   - 슬라이드 자료는 `pagesLabel: "슬라이드 N장"`
   - `callNo`: `논문-YYYY-NN` / `활동북-YYYY-NN` / `발표-YYYY-NN` / `보고서-YYYY-NN` … 같은 유형·연도 안에서 일련번호 증가
   - `cover.theme`: 표지 유형 띠 색 — 기존 자료와 겹치지 않게 (navy·forest·crimson·amber·plum·teal·slate)
   - `cover.motif`: 첫 페이지 이미지가 없을 때 대신 그리는 표지 그림
   - `summary`: `oneLine`(대상·방법·핵심 결과), `easy`(쉬운 말 3~4문장, “~해요” 체), `stats`(핵심 숫자 2~4개)
5. `data/reports.js`에 같은 id로 자세한 요약 작성
   - 논문: 연구 배경과 필요성 / (이론적 배경) / 연구 방법(대상·절차·도구, 표) / 연구 결과(표·수치·인터뷰 인용) / 결론과 제언 / 의의와 한계
   - 활동북·자료집: 이 책은?(목적·구성 표) / 단원별 내용과 활동 / 배운 내용 / 만든 사람들
   - 발표자료: 이 자료는?(행사 정보·발표 구성 표) / 배경 / 과정(회기별 표) / 결과(표·그래프 해석) / 효과·발표 메모
   - 원문에 있는 사실·수치·인용만 사용 (추측 금지)
6. `node tools/screenshot.js docs/process` 로 캡처 확인 (오류·가로 스크롤 없을 것), 상세 페이지의 ‘원문 내려받기’가 원문과 같은 파일인지 확인
7. 커밋 & 푸시

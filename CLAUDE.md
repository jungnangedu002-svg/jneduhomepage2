# 중랑평교 도서관 — 작업 규칙

중랑구발달장애인평생교육센터의 자료를 모아 보는 정적 온라인 도서관입니다.
빌드 과정 없이 `index.html`을 열면 동작합니다(GitHub Pages·Vercel 호환).
- 표지 = **원문 첫 페이지 이미지**
- 표지를 누르면 상세 페이지에 **서지정보 + 한눈에 보기·쉬운 말 요약·핵심 숫자 + 자세한 요약 전체**가 한 화면에 보임
- **‘원문 내려받기’** 버튼으로 처음 받은 원문 파일을 그대로 내려받음

## 구조
- `index.html` — 화면 뼈대 / `assets/style.css` — 사이트 디자인 / `assets/app.js` — 화면 렌더링
- `assets/cover.js` — 표지(첫 페이지 이미지, 없으면 그린 표지)
- `assets/tts.js` — 음성 안내(‘소리로 듣기’ 버튼, 브라우저 내장 음성 합성). 상세 요약에 새 블록 종류를 추가하면 `tts.js`의 SELECTOR에도 넣어 읽히게 할 것
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
   - 원문 공개를 원하지 않는 자료는 복사하지 않고 catalog에서 `original`을 뺌 → 상세 페이지에 “원문을 내려받을 수 없어요” 표시 (현재: 우리들의 행복성장교실, 미래설계 아카데미 개발 배경 및 과정, 빨강 강아지 뭐 어때?, 최중증발달장애인의 강점 발굴과 교육과정 운영, 기독교사회복지실천가의 역할정립 발표, 2026년 기관운영계획서)
   - 원문을 외부 사이트(학회 등)에서 받게 할 자료는 `original` 대신 `external: { url, label, note }` — 상세 페이지에 ‘○○로 이동하기’ 버튼(새 창)과 안내 문구 표시 (현재: 미래설계복지실천연구 제1권 제1호 논문 2편 — 사회복지사의 역량지원과 처우 및 심리안녕이 업무만족에 미치는 영향, 성인발달장애인이 지각한 자신에 관한 생각이 자립의지에 미치는 영향 → 한국미래설계복지실천학회 / 문화예술교육이 성인발달장애인의 삶의 질에 미치는 영향 → 영곡사회심리발달학회)
   - 여러 파일로 나뉜 원문은 쪽 번호 순서로 하나로 합쳐 요약·표지를 만든다(예: 2026년 기관운영계획서 1·2부 → 180쪽). 원문 속 담당자 이름은 요약에 넣지 않음
   - 원문에 사진·그림이 많아도 사이트에는 저장하지 않음(표지 이미지만). 사례 속 실명은 요약에서 A·B·C로 바꿈
2. 원문 읽기: PDF는 `pdftotext -layout`, HWP는 `pip install olefile && python3 -I tools/hwp2txt.py <파일>`
   - PPT(PPTX): 글자는 `python-pptx`로 슬라이드별 추출, 그래프·표 사진은 `soffice --headless --convert-to pdf` 후 `pdftoppm`으로 그림으로 보고 읽음. 사진으로 된 표처럼 숫자를 확실히 읽을 수 없는 내용은 요약에 넣지 않고 그렇게 밝힘
3. 원문 첫 페이지를 이미지로 저장 → `assets/firstpages/<id>.jpg` (표지용 PDF를 따로 받으면 그 PDF 1쪽을 사용 — 예: 미래설계 아카데미 발표자료. 앞·뒤표지가 펼쳐진 표지는 책등을 피해 앞표지(오른쪽)만 잘라 사용 — 예: 빨강 강아지 그림책)
   - PDF: `pdftoppm -f 1 -l 1 -r 110 -jpeg -jpegopt quality=85 -singlefile <원문.pdf> assets/firstpages/<id>`
   - HWP: `node tools/hwp-render/render-first-page.js <원문.hwp> assets/firstpages/<id>.jpg`
4. `data/catalog.js` 배열에 항목 추가 (필드 설명은 파일 상단 주석)
   - `original`: `files/originals/<id>.<확장자>`, `format`: `"PDF"`/`"HWP"`/`"PPTX"`, `firstPage`: `assets/firstpages/<id>.jpg`
   - 슬라이드 자료는 `pagesLabel: "슬라이드 N장"`, 정사각형에 가까운 표지(그림책 등)는 `coverRatio: "가로 / 세로"`(원본 비율) — 서가에서는 높이를 다른 표지와 같게 두고 너비만 넓어짐
   - `type`(분류): `연구논문` / `주요 운영자료`(욕구조사·운영 보고서, 활동북, 그림책 등 센터가 만든 자료) / `발표자료`
   - `callNo`: `논문-YYYY-NN` / `발표-YYYY-NN` / `운영자료-YYYY-NN` … 같은 유형·연도 안에서 발행 순서대로 일련번호 증가
   - `cover.theme`: 표지 유형 띠 색 — 기존 자료와 겹치지 않게 (navy·forest·crimson·amber·plum·teal·slate)
   - `cover.motif`: 첫 페이지 이미지가 없을 때 대신 그리는 표지 그림
   - `summary`: `oneLine`(대상·방법·핵심 결과), `easy`(쉬운 말 3~4문장, “~해요” 체), `stats`(핵심 숫자 2~4개)
5. `data/reports.js`에 같은 id로 자세한 요약 작성
   - 논문: 연구 배경과 필요성 / (이론적 배경) / 연구 방법(대상·절차·도구, 표) / 연구 결과(표·수치·인터뷰 인용) / 결론과 제언 / 의의와 한계
   - 활동북·자료집: 이 책은?(목적·구성 표) / 단원별 내용과 활동 / 배운 내용 / 만든 사람들
   - 그림책: 이 책은?(판권 정보 표) / 장면별 책 속 글(원문 그대로) / 이야기가 전하는 말. 글자가 그림 속에 있는 PDF는 페이지를 그림으로 보고 옮겨 적음
   - 발표자료: 이 자료는?(행사 정보·발표 구성 표) / 배경 / 과정(회기별 표) / 결과(표·그래프 해석) / 효과·발표 메모
   - 원문에 있는 사실·수치·인용만 사용 (추측 금지)
6. `node tools/screenshot.js docs/process` 로 캡처 확인 (오류·가로 스크롤 없을 것), 상세 페이지의 ‘원문 내려받기’가 원문과 같은 파일인지 확인
7. 커밋 & 푸시

# 중랑평교 도서관 — 작업 규칙

중랑구발달장애인평생교육센터의 자료를 모아 보는 정적 온라인 도서관입니다.
빌드 과정 없이 `index.html`을 열면 동작합니다(GitHub Pages 호환).

## 구조
- `index.html` — 화면 뼈대 / `assets/style.css` — 디자인 / `assets/app.js` — 화면 렌더링·표지 생성
- `data/catalog.js` — **소장 자료 목록 (새 자료는 여기에만 추가)**
- `files/` — 원문 파일 / `docs/process/` — 작업 과정 스크린샷
- `tools/hwp2txt.py` — HWP 본문 추출, `tools/screenshot.js` — 화면 캡처

## 새 자료가 올라오면 (항상 같은 방식으로)
1. 원문을 `files/<발행연도>-<영문-요약명>.<확장자>` 로 복사
2. 본문 읽기: PDF는 `pdftotext -layout`, HWP는 `pip install olefile && python3 -I tools/hwp2txt.py <파일>`
3. `data/catalog.js` 배열에 항목 추가 (필드 설명은 파일 상단 주석)
   - `callNo`: `논문-YYYY-NN` / `활동북-YYYY-NN` / `보고서-YYYY-NN` … 같은 유형·연도 안에서 일련번호 증가
   - `cover.theme`: 기존 자료와 겹치지 않게 (navy·forest·crimson·amber·plum·teal·slate)
   - `cover.motif`: 내용에 맞는 그림 (basketball·chart·puppy·sprout·book·heart·puzzle·music). 맞는 게 없으면 `assets/app.js`의 `MOTIFS`에 단순한 선 그림 SVG(viewBox 0 0 100 100, stroke=currentColor)를 추가
   - `summary`는 반드시 네 가지를 채움:
     - `oneLine` 한 줄 요약(대상·방법·핵심 결과 포함)
     - `easy` 쉬운 말 요약 3~4문장(짧은 문장, 어려운 한자어·통계 용어 없이, “~해요” 체)
     - `stats` 핵심 숫자 2~4개
     - `sections` 연구 목적 / 방법 / 주요 결과 / 제언 (활동북·자료집은 ‘이 책은?’ + 단원별 내용)
   - 원문에 있는 사실·수치만 사용 (추측 금지)
4. 확인: `node tools/screenshot.js docs/process` 로 캡처 후 표지·상세 페이지가 깨지지 않는지 확인 (오류·가로 스크롤 없을 것)
5. 커밋 & 푸시

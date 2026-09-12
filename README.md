# 어떡하집? 🏠

> 처음 집을 구하는 하루를 미리 살아보는 교육용 텍스트 어드벤처.
> 사회초년생이 전월세 계약에서 흔히 겪는 함정을 게임으로 체험하고, 전세사기 없이 첫 독립을 시작할 수 있도록 돕습니다.

뉴비톤 출품작 · 팀원: 최민준 · 김보원 · 이다연 · 정재선

---

## 목차

1. [서비스 소개](#서비스-소개)
2. [게임 흐름](#게임-흐름)
3. [주요 기능](#주요-기능)
4. [기술 스택](#기술-스택)
5. [프로젝트 구조](#프로젝트-구조)
6. [시작하기](#시작하기)
7. [환경 변수](#환경-변수)
8. [백엔드 API](#백엔드-api)
9. [테스트와 품질 관리](#테스트와-품질-관리)
10. [배포](#배포)
11. [문서](#문서)

---

## 서비스 소개

방을 보여주는 앱은 많지만 **계약을 알려주는 곳은 없습니다.**
어떡하집?은 매물 탐색부터 잔금·입주까지, 첫 임대차 계약의 하루를 선택형 스토리로 풀어낸 웹 게임입니다.

- 플레이어는 **계약 형태(월세 / 전세 + 대출)** 와 **집 유형(원룸 · 오피스텔 · 빌라 · 옥탑방 · 반지하 · 고시원)** 을 고릅니다.
- 각 장면에서 중개사의 말, 문자 메시지, 계약서, 등기부 같은 실제 상황과 마주치고 선택을 내립니다.
- 위험한 선택은 즉시 경고와 함께 근거·조언을 보여주며, 올바른 선택을 해야 다음 장면으로 넘어갑니다.
- 엔딩에서는 전체 선택을 되돌아보는 **리뷰 카드**, AI가 정리한 **주의 요소 요약**, SNS로 보낼 수 있는 **결과 공유 카드**를 받습니다.

모든 대사와 조언은 시나리오 설계서를 기준으로 작성되었으며, 등기부 날짜·금액 등은 연습용 가상 사례입니다.

## 게임 흐름

```
소개 모달 → 프롤로그 → 계약 형태 선택 → 집 유형 선택 → 6단계 플레이 → 엔딩 → 리뷰 / 요약 / 공유
```

| 단계 | 제목 | 주요 장면 |
| :-: | --- | --- |
| 1 | 매물 탐색 | 광고와 다른 방(미끼 매물), 집 유형별 탐색 분기 |
| 2 | 임장 | 방 사진 위 확인 지점 클릭, 공통 10곳 + 유형별 3~4곳 전부 확인해야 통과 |
| 3 | 가계약금 | 예금주와 등기부 소유자 불일치, 대리인 권한 확인 |
| 4 | 계약서 | 유형별 계약서 확인, 필수 특약(월세 3개 · 전세 4개), 서명 전 체크리스트 |
| 5 | 잔금·입주 | 계좌 변경 문자, 잔금 시점, 전입신고·확정일자, 보증보험, 하자 대응, 입주 체크리스트 |
| 6 | 엔딩 | 위험 선택 횟수 집계, 단계별 리뷰, AI 요약, 결과 공유 |

- 전세 + 고시원 조합은 시나리오상 존재하지 않아 선택할 수 없습니다. 총 **11개 조합**을 플레이할 수 있습니다.
- 오답을 고르면 해당 선택지가 비활성화되고 다시 선택해야 합니다. 첫 오답 기록은 리뷰의 위험 횟수에 남습니다.
- 진행 상태는 브라우저에 저장하지 않습니다. 새로고침하면 항상 처음 화면에서 시작합니다.

## 주요 기능

### 플레이 화면
- **TalkView** — 대사 중심 장면. 배경 사진, 화자, 선택지를 순서대로 보여줍니다. 숫자 키 1~9로 선택지를 고를 수 있습니다.
- **ExploreView** — 임장 장면. 방 사진 위의 지점을 눌러 *확인 이유 · 확인 방법 · 양호한 상태 · 주의 신호*를 읽고 체크합니다.
- **DocumentView** — 계약서·체크리스트 장면. 특약, 서명 전 확인, 입주 체크리스트를 문서 형태로 다룹니다.
- **StageBar** — 현재 단계와 다섯 단계 진행 상황을 상단에 표시합니다.
- **용어 사전** — 전세가율, 근저당, 확정일자 등 37개 용어를 검색할 수 있습니다.

### AI 기능 (Gemini)
- **AI 추천 시작** — "월급 220만 원, 역세권 원룸 희망" 같은 문장을 입력하면 계약 형태와 집 유형을 추천받아 바로 시작합니다.
- **주의 요소 요약** — 엔딩에서 플레이어가 놓쳤던 항목을 200자 이내로 요약해 줍니다.

### 결과 공유
- 엔딩의 공유 버튼은 계약 형태·집 유형·위험 횟수를 Base64로 인코딩한 링크를 만듭니다.
- 링크를 열면 백엔드가 **Open Graph 메타태그**와 **동적 PNG 성적표 카드**(1200×630)를 제공한 뒤 앱의 엔딩 화면으로 리다이렉트합니다. 카카오톡·트위터 등에서 미리보기 카드가 뜹니다.
- Web Share API를 지원하는 기기에서는 공유 시트가, 그 외에는 클립보드 복사가 동작합니다.

### 성능·접근성
- 22장의 장면 사진을 WebP 1600px / 800px 두 벌로 최적화해 원본 대비 93~98% 용량을 줄였습니다.
- 현재 장면과 다음 장면의 사진을 우선순위를 나눠 미리 디코딩해 빈 프레임을 줄입니다.
- 라이트·다크 테마, 키보드 조작, 모바일(393px) 레이아웃을 지원합니다.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | React 19, TypeScript 6, Vite 8, Tailwind CSS 4, daisyUI 5 |
| Backend | Node.js, Express 5, TypeScript, tsx |
| AI | Google Gemini (`@google/genai`, `gemini-3.5-flash-lite`) |
| 이미지 렌더링 | `@napi-rs/canvas` (OG 카드 PNG 생성) |
| 테스트 | Node.js 내장 `node:test` |
| 린트 | ESLint 10, typescript-eslint, react-hooks, react-refresh |
| 배포 | Vercel (프론트·백엔드 각각) |
| 이미지 최적화 | Python + Pillow 스크립트 |

## 프로젝트 구조

```
ottokha-zip/
├── frontend/                    # Vite + React 앱
│   ├── src/
│   │   ├── App.tsx              # 페이지 라우팅, 게임 상태, 키보드 단축키, AI 추천 호출
│   │   ├── data.ts              # 시나리오 전체 데이터: 집 유형, 대사, 선택지, 체크리스트, 리뷰 생성
│   │   ├── choiceFlow.ts        # 선택·재시도·체크 제출·다음 단계 진행 규칙 (순수 함수)
│   │   ├── types.ts             # GameState, Step, Choice 등 타입과 STAGES 정의
│   │   ├── inspectionGuide.ts   # 임장 지점별 확인 이유·양호 상태 설명
│   │   ├── scenePhotos.ts       # 배경 키 → 최적화 이미지·srcSet 매핑
│   │   ├── utils/share.ts       # 공유 URL 생성
│   │   ├── views/               # Home · Choose · Talk · Explore · Document · EndingScene
│   │   ├── components/          # Header · StageBar · Journal · StoryModal · Onboarding · Icon · modals
│   │   ├── assets/
│   │   │   ├── scenes/          # 원본 장면 사진 (JPG, 번들 미포함)
│   │   │   └── optimized/       # WebP 1600px / 800px 사본 (실제 서비스용)
│   │   └── index.css            # Tailwind 테마 토큰 (라이트/다크)
│   ├── scenario.test.mjs        # 시나리오 회귀 테스트
│   ├── scripts/optimize-images.py
│   ├── image-optimization.json  # 이미지별 원본·최적화 크기 기록
│   └── .env                     # VITE_API_BASE_URL
├── backend/
│   ├── server.ts                # Express 서버: AI 추천, 요약, 공유 페이지, OG 이미지
│   └── vercel.json              # Vercel 서버리스 설정
└── docs/
    ├── scenario-qa.md           # 시나리오 대조 QA 기록
    └── ui-loading-qa.md         # 사진 로딩·화면 흐름 개선 기록
```

### 상태 모델 요약

게임 상태는 하나의 `GameState` 객체로 관리합니다.

- `page` — home · prologue · contract · house · play · ending
- `contract`, `house` — 선택한 계약 형태와 집 유형. 이 둘로 `getSteps()`가 전체 장면 목록을 생성합니다.
- `cursor` — 현재 장면 id
- `answers` — 장면별 확정 답변. `drafts`는 체크리스트 임시 선택, `attempts`는 오답 시도 이력
- `getCheckpoints()` / `getReviewCheckpoints()` — 답변으로부터 리뷰 카드와 위험 횟수를 파생합니다.

모든 진행 규칙은 `choiceFlow.ts`의 순수 함수로 구현되어 있어 UI 없이 테스트할 수 있습니다.

## 시작하기

### 요구 사항
- Node.js 20 이상 (프론트엔드는 `AbortSignal.any` 등 최신 API 사용)
- Gemini API 키 (AI 추천·요약·공유 기능에 필요)

### 프론트엔드

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 |
| `npm run build` | `tsc -b` 타입 검사 후 프로덕션 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint |
| `npm test` | 시나리오 테스트 |

백엔드 없이도 게임 본편은 전부 플레이할 수 있습니다. AI 추천, 요약, 공유 링크만 백엔드가 필요합니다.

### 백엔드

```bash
cd backend
npm install
echo "GEMINI_API_KEY=your_key" > .env
npm run dev        # http://localhost:8000
```

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | `tsx watch`로 실행, 파일 변경 시 재시작 |
| `npm start` | `tsx server.ts` 단일 실행 |

로컬에서 프론트와 함께 쓰려면 `frontend/.env`의 `VITE_API_BASE_URL`을 `http://localhost:8000`으로 바꿉니다.

### 이미지 다시 생성

장면 사진을 교체했을 때 실행합니다. Python과 Pillow가 필요합니다.

```bash
cd frontend
python scripts/optimize-images.py
```

`src/assets/optimized/`에 WebP 사본을 만들고 `image-optimization.json`을 갱신합니다.

## 환경 변수

### frontend/.env

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 백엔드 주소. 끝의 `/`는 자동으로 제거됩니다. | `https://ottokha-zip-backend.vercel.app` |

### backend/.env (git에 포함되지 않음)

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `GEMINI_API_KEY` | Google Gemini API 키 | 필수 |
| `CLIENT_URL` | 공유 페이지에서 리다이렉트할 프론트엔드 주소 | `http://localhost:5173` |
| `PORT` | 로컬 실행 포트 | `8000` |
| `NODE_ENV` | `production`이면 `app.listen`을 건너뛰고 Vercel 핸들러로만 동작 | – |

## 백엔드 API

모든 엔드포인트는 GET이며 CORS가 열려 있습니다.

| 경로 | 파라미터 | 응답 | 설명 |
| --- | --- | --- | --- |
| `/api` | `text` | `{ first, second }` | 사용자 상황 문장을 받아 Gemini가 `월세 or 전세 + 대출` / `집 유형`을 추천 |
| `/api/summarize` | `text` | `{ summary }` | 위험 선택 목록을 200자 이내 줄글로 요약 |
| `/api/share` | `d` (Base64 JSON) | HTML | OG 메타태그 + `#ending`으로 리다이렉트하는 공유 진입 페이지 |
| `/api/og` | `d` (Base64 JSON) | `image/png` | 1200×630 성적표 카드. 하루 캐시 |

공유 페이로드 형식:

```json
{ "c": "monthly | jeonse", "h": "oneroom | officetel | villa | rooftop | basement | goshiwon", "r": 위험횟수, "t": 타임스탬프 }
```

프론트엔드의 `parseRecommendation()`이 AI 응답 문자열을 시나리오 id로 변환하며, 불완전하거나 불가능한 조합(전세 + 고시원)은 오류로 처리해 직접 선택을 안내합니다.

## 테스트와 품질 관리

```bash
cd frontend
npm test
```

`scenario.test.mjs`는 UI 없이 데이터와 진행 규칙만으로 시나리오를 검증합니다.

- 11개 계약·집 조합 × 정답 / 오답 수정 / 혼합 경로 33개가 모두 엔딩에 도달하는지
- 임장 공통·유형별 지점을 전부 확인해야 통과하는지, 해제 시 다시 차단되는지
- 오답 선택지 비활성화, 재시도 이력 유지, 정답 후 리뷰·위험 횟수 중복 없음
- 특약 개수, 튜토리얼 문구, 서명 경고 범위(전세 미납 세금만), 보험 사진 조건
- 모든 임장 지점에 확인 이유·방법·양호 상태·주의 신호가 있는지
- AI 추천 응답 파싱과 불가능 조합 거부

빌드와 린트도 CI 없이 로컬에서 함께 돌립니다.

```bash
npm run lint && npm run build
```

## 배포

- **프론트엔드** — `frontend/`를 Vite 정적 사이트로 Vercel에 배포합니다. `dist/`가 저장소에 포함되어 있습니다.
- **백엔드** — `backend/vercel.json`이 모든 경로를 `server.ts` 서버리스 함수로 보냅니다. 현재 주소: `https://ottokha-zip-backend.vercel.app`
- 백엔드 배포 시 Vercel 환경 변수에 `GEMINI_API_KEY`와 실제 프론트 주소인 `CLIENT_URL`을 등록해야 공유 리다이렉트가 올바르게 동작합니다.

## 문서

- [docs/scenario-qa.md](docs/scenario-qa.md) — 시나리오 설계서 대조 QA. 불일치 9건 수정 내역, 정답 확인 후 진행 규칙, 저장 제거 결정
- [docs/ui-loading-qa.md](docs/ui-loading-qa.md) — 이미지 최적화 수치, 사전 로딩 방식, 화면 흐름 변경 기록
- [frontend/image-optimization.json](frontend/image-optimization.json) — 이미지별 원본·WebP 크기와 치수

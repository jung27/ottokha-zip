import type {
  Background,
  StoryBeat,
  CheckItem,
  Checkpoint,
  Choice,
  Contract,
  Ending,
  Feedback,
  GameState,
  Home,
  HouseId,
  Stage,
  Step,
} from "./types.ts";

// 금액 단위: 만 원. 원룸 관리비 8은 사용자 최종 확인 값.
// 전세 가격은 빌라를 제외하고 기존 시안의 학습용 예시를 사용한다.
export const homes: Home[] = [
  {
    id: "oneroom",
    name: "원룸",
    sub: "다가구주택",
    icon: "home",
    description: "여러 가구가 사는 건물에서 독립된 방 하나를 빌려 산다.",
    area: "20㎡ · 2층",
    deposit: 1000,
    rent: 55,
    maintenance: 8,
    jeonse: 8000,
    turningPoint: "내 방보다 먼저 들어온 보증금은 얼마일까?",
  },
  {
    id: "officetel",
    name: "오피스텔",
    sub: "도심의 작은 공간",
    icon: "building",
    description: "한 공간에 방과 주방·욕실을 갖추고, 건물의 공용시설을 함께 이용한다.",
    area: "24㎡ · 7층",
    deposit: 1000,
    rent: 65,
    maintenance: 12,
    jeonse: 12000,
    turningPoint: "월세를 깎아주는 대신 전입신고를 못 한다면?",
  },
  {
    id: "villa",
    name: "빌라",
    sub: "다세대주택",
    icon: "building",
    description: "낮은 층수의 공동주택에서 한 세대를 빌려 산다.",
    area: "32㎡ · 3층",
    deposit: 1000,
    rent: 55,
    maintenance: 5,
    jeonse: 15000,
    turningPoint: "거래 이력이 없는 새집의 가격을 믿어도 될까?",
  },
  {
    id: "rooftop",
    name: "옥탑방",
    sub: "옥상 위의 방",
    icon: "roof",
    description: "건물 맨 위, 옥상에 자리한 방에서 산다.",
    area: "18㎡ · 옥상층",
    deposit: 500,
    rent: 45,
    maintenance: 5,
    jeonse: 5000,
    turningPoint: "계약서에 내 방의 정확한 주소가 없다면?",
  },
  {
    id: "basement",
    name: "반지하",
    sub: "낮은 창이 있는 집",
    icon: "stairs",
    description: "방의 일부가 지면 아래에 있는 공간에서 산다.",
    area: "23㎡ · 반지하",
    deposit: 500,
    rent: 40,
    maintenance: 5,
    jeonse: 5500,
    turningPoint: "새 벽지 아래에 침수 흔적이 남아 있다면?",
  },
  {
    id: "goshiwon",
    name: "고시원",
    sub: "함께 쓰는 생활 공간",
    icon: "people",
    description: "작은 개인실에서 지내며 주방 등 일부 시설을 함께 쓴다.",
    area: "10㎡ · 3층",
    deposit: 10,
    rent: 38,
    maintenance: 0,
    jeonse: null,
    turningPoint: "내 계약 상대가 건물주가 아닌 운영업체라면?",
  },
];
export const money = (value: number) => value.toLocaleString("ko-KR") + "만 원";
export const contractLabel = (contract: Contract) =>
  contract === "monthly" ? "월세" : "전세 + 대출";
export const priceLabel = (home: Home, contract: Contract) =>
  contract === "monthly"
    ? "보증금 " +
      money(home.deposit) +
      " · 월세 " +
      money(home.rent) +
      " · 관리비 " +
      money(home.maintenance)
    : "전세보증금 " +
      money(home.jeonse ?? 0) +
      " · 관리비 " +
      money(home.maintenance) +
      " · 대출이자 별도";

export const tutorials: Record<Contract, string[]> = {
  monthly: [
    "보증금 1,000만 원을 올리면 월세가 4~5만 원 내려가는 게 보통이다. 이 비율보다 불리하면 협상 여지가 있다.",
    "월세 45만 원짜리 방의 실제 지출은 45만 원이 아니다. 관리비 + 가스 + 전기 + 수도 + 인터넷을 합쳐서 비교해야 한다.",
    "보증금 500만 원도 소중한 내 돈이다. 금액이 작아도 집주인과 권리관계를 확인하는 절차는 생략하지 않는다.",
  ],
  jeonse: [
    "‘전세보증금 ÷ 매매 시세 × 100’로 전세가율을 계산할 수 있고 이를 통해 위험성을 알 수 있다.",
    "반환보증 가입이 안 된다면 계약을 서두르지 않고 거절 사유를 꼭 확인한다. 신청 시기나 서류 등도 가입에 영향을 줄 수 있다.",
    "전세 계약은 대출로 인해 생기는 이자를 감당할 수 있는지와 계약이 끝나고 보증금을 안전하게 돌려받을 수 있는지의 여부를 중요하게 고려해야 한다.",
  ],
};
export const sources = {
  law: "https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?csmSeq=629&ccfNo=2&cciNo=3&cnpClsNo=1",
  guarantee: "https://m.khug.or.kr/hug/web/ig/dr/igdr000001.jsp?tabMenu=Y",
  claim: "https://m.khug.or.kr/hug/web/ge/er/geer000900.jsp",
  registry: "https://www.iros.go.kr/",
  government: "https://www.gov.kr/",
  tax: "https://www.nts.go.kr/",
  help: "https://www.klac.or.kr/",
};
export const dictionary: { term: string; meaning: string; aliases?: string[] }[] = [
  { term: "보증금", meaning: "집을 빌릴 때 맡기는 돈. 계약이 끝나면 미납금이나 정당한 공제액 등을 정산하고 돌려받는다." },
  { term: "월세", meaning: "집을 사용하는 대가로 매달 내는 돈. 보증금과 관리비는 별도로 확인한다." },
  { term: "전세", meaning: "큰 보증금을 맡기고 정해진 기간 동안 사는 계약 방식. 대출을 받았다면 매달 이자가 나갈 수 있다." },
  { term: "관리비", meaning: "청소·공용 전기 등 건물 관리에 드는 비용. 수도·난방 등이 포함되는지는 집마다 다르다." },
  { term: "임대인", meaning: "집을 빌려주는 계약 상대. 실제 소유자와 계약할 권한이 있는지 확인한다.", aliases: ["집주인", "건물주"] },
  { term: "임차인", meaning: "집을 빌려서 사는 사람. 이 이야기에서는 나를 뜻한다.", aliases: ["세입자"] },
  { term: "전세대출", meaning: "전세보증금을 마련하기 위해 빌리는 돈. 대출 가능 여부와 보증금 반환보증은 따로 확인한다." },
  { term: "전세가율", meaning: "매매 시세에 비해 전세보증금이 얼마나 큰지 나타낸 비율. 전세보증금 ÷ 매매 시세 × 100으로 계산한다." },
  { term: "전용면적", meaning: "방·주방·욕실처럼 해당 세대가 독립적으로 사용하는 면적." },
  { term: "공급면적", meaning: "전용면적에 복도·계단 등 함께 사용하는 공간의 일부를 더한 면적." },
  { term: "가계약금", meaning: "정식 계약서 작성 전에 미리 보내는 돈을 흔히 부르는 말. 이미 합의한 내용에 따라 돌려받기 어려울 수 있다." },
  { term: "잔금", meaning: "계약금 등을 제외하고 마지막에 지급하는 나머지 돈." },
  { term: "등기부등본", meaning: "집의 소유자와 근저당 등 권리관계를 확인하는 서류. 정식 명칭은 등기사항증명서다.", aliases: ["등기부", "등기사항"] },
  { term: "갑구", meaning: "등기부에서 소유권에 관한 내용을 보는 부분. 소유자, 압류, 신탁 등의 기록을 확인한다." },
  { term: "을구", meaning: "등기부에서 근저당권 등 소유권 이외의 권리를 보는 부분." },
  { term: "예금주", meaning: "돈을 받을 은행 계좌의 명의자. 계약 상대와 이름이 일치하는지 대조한다." },
  { term: "근저당", meaning: "돈을 빌려준 사람이 집을 담보로 잡아둔 권리. 보증금보다 먼저 변제받는 권리인지 확인해야 한다." },
  { term: "채권최고액", meaning: "근저당권으로 담보하는 채무의 최대 한도. 실제로 빌린 돈의 잔액과 같지는 않다." },
  { term: "선순위 보증금", meaning: "경매 등에서 내 보증금보다 먼저 돌려받을 순위에 있는 다른 임차인의 보증금." },
  { term: "위임장", meaning: "다른 사람에게 어떤 일을 맡겼는지 적은 서류. 계약 체결과 돈 수령이 위임 범위에 있는지 확인한다." },
  { term: "인감증명서", meaning: "등록된 인감도장을 증명하는 서류. 위임장에 찍힌 도장과 대조할 때 쓰인다." },
  { term: "대리권", meaning: "다른 사람을 대신해 계약 등을 할 수 있는 권한. 가족이라는 사실만으로 생기지는 않는다.", aliases: ["무권대리"] },
  { term: "신탁", meaning: "재산을 신탁회사 등에 맡겨 관리하는 구조. 등기부와 신탁원부로 임대차 계약 권한을 확인한다." },
  { term: "전대차", meaning: "집을 빌린 사람이 그 집을 다시 다른 사람에게 빌려주는 계약.", aliases: ["전대", "운영업체"] },
  { term: "건축물대장", meaning: "건물의 용도·구조·면적·층수와 위반건축물 표시 등을 확인하는 서류." },
  { term: "특약", meaning: "기본 계약 내용 외에 당사자들이 따로 합의해 적는 약속. 수리 책임이나 계약 해제 조건 등을 남긴다." },
  { term: "전입신고", meaning: "이사한 주소를 주민등록에 반영하는 신고. 주택 인도와 함께 대항력 요건에 관련된다." },
  { term: "확정일자", meaning: "그 날짜에 임대차계약서가 존재했다는 것을 확인받는 날짜. 보증금의 우선변제 요건 중 하나다." },
  { term: "대항력", meaning: "집주인이 바뀌어도 임대차 관계를 주장할 수 있는 힘. 주택 인도와 주민등록 등 필요한 요건을 갖춰야 한다." },
  { term: "체납", meaning: "내야 할 세금 등을 기한 안에 내지 않은 상태. 보증금 반환에 영향을 줄 수 있다.", aliases: ["국세", "지방세", "미납"] },
  { term: "반환보증", meaning: "임대인이 보증금을 돌려주지 않을 때 보증기관에 이행을 청구할 수 있는 보증 상품. 가입·청구 조건과 기한이 있다.", aliases: ["보증보험"] },
  { term: "묵시적 갱신", meaning: "정해진 기간 안에 종료 통지 등이 없어 계약이 법에서 정한 방식으로 이어지는 것." },
  { term: "내용증명", meaning: "어떤 내용의 문서를 언제 보냈는지 우체국이 증명하는 우편 제도. 상대에게 도달했는지도 별도로 확인한다." },
  { term: "임차권등기명령", meaning: "계약이 끝나도 보증금을 받지 못했을 때 법원에 신청하는 절차. 이사 전 등기 완료 여부를 확인해야 한다." },
  { term: "결로", meaning: "따뜻하고 습한 공기가 차가운 창이나 벽에 닿아 물방울이 생기는 현상." },
  { term: "하자", meaning: "누수나 고장처럼 집이나 시설에 생긴 결함. 발견 시점과 상태를 사진·문자로 남긴다." },
  { term: "공시가격", meaning: "행정기관이 조사해 공시하는 부동산 가격. 실제 거래 시세와는 다를 수 있다." },
];
// 장면 데이터는 이 파일에, 진행 상태는 기존 App에 둔다. 별도 라우터나 상태 라이브러리는 사용하지 않는다.
const check = (
  id: string,
  title: string,
  description: string,
  signal: string,
  consequence: string,
  advice = description,
): CheckItem => ({ id, title, description, signal, consequence, advice });

export const commonInspections: CheckItem[] = [
  check(
    "water",
    "욕실 샤워기",
    "세면대와 동시에 틀어본다. 변기 물 내리며 물줄기 변화 확인",
    "동시에 쓰자 샤워기 물줄기가 확 줄어든다.",
    "출근 준비 시간마다 수압이 약해져 아침이 늦어진다.",
    "동시 사용 수압과 온수를 확인하고 수리 가능 여부를 기록한다.",
  ),
  check(
    "drain",
    "세면대 배수구",
    "물을 가득 받았다가 한 번에 내려본다. 냄새도 맡아본다",
    "물이 천천히 빠지고 하수구 냄새가 난다.",
    "여름이 되자 배수구에서 냄새가 올라온다.",
  ),
  check(
    "ceiling",
    "천장 모서리",
    "얼룩과 들뜬 벽지 확인",
    "갈색 원형 얼룩과 부풀어 오른 벽지가 보인다.",
    "장마철 천장에서 물이 샌다. 임대인은 관리 문제라고 말한다.",
    "누수 이력과 보수 내역을 묻고 사진과 수선 약속을 남긴다.",
  ),
  check(
    "mold",
    "붙박이장 안쪽·뒤편",
    "숨은 곰팡이 확인",
    "옷장 뒤편에 검은 점과 축축한 냄새가 숨어 있다.",
    "옷과 이불에 곰팡이가 피었다.",
  ),
  check(
    "silicone",
    "창틀 실리콘",
    "실리콘 색과 창문 아래 벽면",
    "실리콘이 검게 변해 있다. 결로가 반복됐을 수 있다.",
    "겨울 내내 창문 아래의 물을 닦는다.",
  ),
  check(
    "window",
    "창문 (이중창 여부)",
    "유리가 2겹인지. 닫고 손을 대본다",
    "홑창 틈으로 찬 기운이 느껴진다.",
    "이듬해 1월, 난방비 18만 원 고지서를 받았다.",
    "창호와 단열 상태, 이전 난방비를 함께 확인한다.",
  ),
  check(
    "wall",
    "벽 두드리기",
    "옆방 쪽 벽을 주먹으로 두드려본다",
    "통통 울리는 소리. 칸막이 구조인지 더 확인해야겠다.",
    "옆방의 아침 6시 알람 때문에 매일 잠을 설친다.",
    "두드리는 소리만으로 단정하지 말고 저녁에 다시 방문해 소음을 확인한다.",
  ),
  check(
    "sink",
    "싱크대 하부장",
    "문을 열어 안쪽 확인",
    "구석에 오래된 끈끈이와 벌레 약이 있다.",
    "늦은 밤 싱크대 아래에서 벌레가 나온다.",
  ),
  check(
    "lock",
    "현관 도어락",
    "교체 가능한지 묻는다",
    "이전 세입자가 쓰던 번호가 그대로다.",
    "누가 비밀번호를 알고 있을지 몰라 불안하다.",
    "입주 즉시 번호를 바꾸고 잠금장치가 정상 작동하는지 확인한다.",
  ),
  check(
    "socket",
    "콘센트 위치·개수",
    "침대·책상 놓을 자리에 있는지",
    "한쪽 벽에 두 개뿐이다.",
    "책상까지 멀티탭을 이어야 해 배선이 불편하다.",
  ),
];
const extraInspections: Record<HouseId, CheckItem[]> = {
  oneroom: [
    check(
      "mailbox",
      "건물 밖 · 우편함",
      "이름표가 붙은 칸 수와 방치된 우편물을 살핀다.",
      "광고보다 많은 이름표와 오래된 우편물이 보인다.",
      "실제 세대 수와 관리 상태를 모르고 입주했다.",
    ),
    check(
      "meter-box",
      "건물 밖 · 계량기함",
      "세대별 전기·수도 계량기가 따로 있는지 묻는다.",
      "수도 계량기를 여러 세대가 함께 쓴다.",
      "관리비 배분 기준을 두고 이웃과 다툰다.",
    ),
    check(
      "parking",
      "건물 밖 · 주차장",
      "방 수와 주차 가능 대수, 배정 방식을 확인한다.",
      "방은 12개인데 주차 공간은 두 자리다.",
      "퇴근 뒤 주차 자리를 찾아 동네를 돈다.",
    ),
  ],
  officetel: [
    check(
      "ventilation",
      "창문 개폐",
      "창문을 직접 열어 환기 가능 범위를 확인한다.",
      "통유리의 작은 틈만 열린다.",
      "요리 냄새가 방 안에 오래 남는다.",
    ),
    check(
      "bill",
      "관리비 고지서",
      "항목별 금액과 난방·수도 포함 여부를 본다.",
      "기본 관리비 외에 별도 요금이 있다.",
      "예상보다 높은 관리비 고지서를 받는다.",
    ),
    check(
      "shops",
      "1층 상가 간판",
      "식당·술집의 환기구와 영업시간을 살핀다.",
      "늦게까지 영업하는 가게의 환기구가 아래에 있다.",
      "밤마다 소음과 음식 냄새가 올라온다.",
    ),
  ],
  villa: [
    check(
      "crack",
      "외벽 균열",
      "균열과 보수 흔적, 관리 책임자를 확인한다.",
      "외벽에 균열이 있는데 보수 담당자가 불분명하다.",
      "공용 부분 수리를 두고 책임을 미룬다.",
    ),
    check(
      "vacancy",
      "밤에 불 켜진 창",
      "시간대를 바꿔 방문해 공실과 실제 입주 상황을 묻는다.",
      "신축인데 불 켜진 방이 적다. 사유를 확인할 필요가 있다.",
      "비어 있는 집이 많아 건물 관리가 불안정하다.",
    ),
    check(
      "finish",
      "신축 마감",
      "문틀 수평과 타일 들뜸, 창호 개폐를 살핀다.",
      "문이 걸리고 욕실 타일이 들떠 있다.",
      "새집인데도 입주 직후 마감 수리가 필요하다.",
    ),
  ],
  rooftop: [
    check(
      "roof-floor",
      "옥상 바닥",
      "우레탄 방수가 벗겨졌는지 확인한다.",
      "바닥 방수층이 벗겨져 있다.",
      "비가 오자 옥상 바닥에서 누수가 시작된다.",
    ),
    check(
      "insulation",
      "천장 단열",
      "단열 시공 여부와 여름·겨울 실내 환경을 묻는다.",
      "단열 시공 기록이 없다.",
      "한여름 방 안이 뜨거워 냉방비가 늘어난다.",
    ),
    check(
      "stair",
      "외부 계단",
      "난간, 조명과 미끄럼 방지를 확인한다.",
      "계단이 어둡고 난간이 흔들린다.",
      "겨울에 얼어붙은 계단으로 출근해야 한다.",
    ),
    check(
      "roof-window",
      "옥상 쪽 창문",
      "옥상에서 창문에 쉽게 접근할 수 있는지 본다.",
      "밖에서 손이 닿는 높이에 창문이 있다.",
      "창문을 열고 자기가 불안하다.",
    ),
  ],
  basement: [
    check(
      "flood-line",
      "벽 하단 수평 얼룩선",
      "벽 아래를 따라 같은 높이의 얼룩이 있는지 본다.",
      "벽 하단에 수평 얼룩이 있다. 침수 흔적인지 물어봐야겠다.",
      "큰비가 내리자 과거 침수 흔적이 다시 떠오른다.",
    ),
    check(
      "high-socket",
      "콘센트 높이",
      "콘센트가 높은 곳에 설치된 이유를 묻는다.",
      "콘센트가 비정상적으로 높다.",
      "침수에 대비한 설비였다는 사실을 나중에 알았다.",
    ),
    check(
      "road",
      "현관과 도로 높이차",
      "도로보다 얼마나 낮은지, 물막이와 배수 시설을 본다.",
      "현관이 도로보다 낮고 물막이가 없다.",
      "폭우 때 현관으로 물이 몰려든다.",
    ),
    check(
      "low-window",
      "창문 높이",
      "보행자 눈높이와 환기·방범 상태를 확인한다.",
      "길을 걷는 사람과 눈이 마주친다.",
      "사생활 때문에 종일 블라인드를 내린다.",
    ),
  ],
  goshiwon: [
    check(
      "shared",
      "공용 주방·욕실",
      "청결 상태와 시설당 이용 인원을 묻는다.",
      "여러 사람이 욕실 하나를 함께 쓴다.",
      "출근 시간마다 공용 욕실 앞에서 기다린다.",
    ),
    check(
      "exit",
      "복도 비상구",
      "대피로와 비상구가 막히지 않았는지 확인한다.",
      "비상구 앞에 짐이 쌓여 있다.",
      "대피해야 할 때 통로가 막혀 있다.",
    ),
    check(
      "room-lock",
      "방문 잠금장치",
      "개인실의 문이 안팎에서 안전하게 잠기는지 본다.",
      "잠금장치가 헐겁다.",
      "개인 공간을 안전하게 잠그기 어렵다.",
    ),
    check(
      "room-window",
      "개인실 창문",
      "외기에 면한 창문과 피난·환기 시설을 확인한다.",
      "방에 외부로 열린 창문이 없다.",
      "환기와 화재 시 대피 경로가 걱정된다.",
    ),
  ],
};
export const inspectionItems = (house: HouseId) => [
  ...commonInspections,
  ...extraInspections[house].map((item) => ({ ...item, extra: true })),
];

export const warnings: Record<string, Feedback> = {
  area: {
    title: "광고 면적과 실제 공간",
    text: "공급면적에는 공용 공간이 포함된다. 광고의 7평이 공급면적이고 전용률이 50%라면 실제 쓰는 공간은 3.5평일 수 있다.",
    advice: "전용면적을 서류로 확인하고 가구를 놓을 실제 공간도 직접 재본다.",
  },
  address: {
    title: "계약서와 실제 집의 주소 불일치",
    text: "문 앞의 호수와 등기부의 동·호수가 다를 수 있다. 확인 없이 계약·전입하면 임차한 공간을 정확히 표시하지 못할 수 있다.",
    advice:
      "실제 방, 건축물대장, 등기부와 계약서의 주소·동·호수를 대조하고 정확한 주소로 전입신고한다.",
  },
  bait: {
    title: "미끼매물",
    text: "좋은 조건으로 방문을 유도하고 현장에서 다른 방을 권할 수 있다. ‘여기까지 왔는데’라는 마음에 달라진 조건을 놓치기 쉽다.",
    advice: "다른 방은 새로운 매물이다. 주소·가격·관리비·면적을 다시 확인한다.",
    detail:
      "실제로 계약되어 매물이 소진될 수도 있다. 다른 방을 권했다는 이유만으로 허위매물이라고 단정하지 않는다.",
  },
  cost: {
    title: "월세와 관리비 쪼개기",
    text: "실제 임대료를 관리비로 옮겨 쓰면 비용의 성격이 흐려진다. 월세 세액공제나 지원금 산정에도 영향을 줄 수 있다.",
    advice:
      "관리비 세부 항목을 서면으로 받고 실제 월세와 관리비를 구분해 계약서에 쓴다.",
  },
  loan: {
    title: "대출 확인 전 선입금",
    text: "집을 잡으려고 돈부터 보냈는데 대출이 거절되면 반환을 다투게 될 수 있다.",
    advice:
      "대출 한도·물건 조건과 반환보증 가능 여부를 먼저 확인하고, 부결 시 반환 조건도 합의한다.",
    detail:
      "가계약금 반환 여부는 이름이 아니라 합의 내용과 계약 성립 여부에 따라 달라진다.",
  },
  deposit: {
    title: "이중임대 / 선입금 요구",
    text: "같은 방을 여러 사람에게 계약하거나 권한 없는 사람이 먼저 돈을 받는 수법이다. 계약서를 쓰더라도 상대가 누구인지 확인은 남아 있다.",
    advice:
      "등기부상 소유자와 계약 권한을 확인한 뒤 소유자 명의 계좌로 송금한다. 전대·신탁은 해당 권한까지 별도로 확인한다.",
  },
  proxy: {
    title: "무권대리",
    text: "가족이라는 말만으로 계약 권한이 생기지 않는다. 권한 없는 대리인의 계약을 소유자가 인정하지 않으면 소유자에게 효력을 주장하기 어렵다.",
    advice:
      "위임장·인감증명서와 위임 범위를 확인하고 소유자에게 직접 확인한다. 송금은 소유자 명의 계좌로 한다.",
    detail:
      "계약 체결과 금전 수령 권한은 다를 수 있다. 각서나 중개사의 말만으로 대리권 확인을 대신할 수 없다.",
  },
  priority: {
    title: "선순위 보증금",
    text: "다가구는 건물 전체를 함께 봐야 한다. 선순위 담보와 다른 임차인의 보증금이 크면 내 보증금까지 배당이 돌아오지 않을 수 있다.",
    advice:
      "확정일자 부여현황과 선순위 보증금 총액을 확인하고 근저당 채권최고액·내 보증금과 함께 건물 가치에 비교한다.",
  },
  registration: {
    title: "전입신고 포기",
    text: "월세 할인과 전입신고를 바꾸면 대항력과 우선변제권 확보에 문제가 생긴다.",
    advice:
      "실제 주거 용도와 전입신고 가능 여부를 확인하고 협조 의무·위반 시 해제와 반환을 계약에 적는다.",
    detail:
      "전입신고 하나로 모든 요건이 끝나는 것은 아니다. 주택 인도, 주민등록, 확정일자 등 각각의 요건을 확인한다.",
    source: sources.law,
  },
  price: {
    title: "깡통전세 / 시세 부풀리기",
    text: "분양가 1억 6천만 원에 전세 1억 5천만 원이면 전세가율은 약 94%다. 분양가가 실제 매매 시세라는 보장도 없다.",
    advice:
      "인근 기존 빌라 실거래가와 공시가격, 다른 중개사 의견을 교차 확인한다. 특정 비율 아래라도 안전이 보장되지는 않는다.",
  },
  rooftop: {
    title: "무허가 증축",
    text: "옥상 창고 등을 방으로 바꿨다면 서류상 용도·주소가 실제와 다를 수 있다. 대출·보증 가입과 거주 지속에 문제가 생길 수 있다.",
    advice:
      "건축물대장, 위반건축물 여부와 정확한 주소를 확인하고 전입신고·대출·보증 가능 여부를 각각 문의한다.",
  },
  flood: {
    title: "하자 은닉",
    text: "침수나 곰팡이 흔적을 새 벽지로 가린 방일 수 있다. 기록이 없으면 입주 뒤 책임을 놓고 다투기 쉽다.",
    advice:
      "침수 이력을 확인·설명서에 적도록 요청하고, 비 온 뒤 재방문과 입주 당일 사진을 남긴다.",
  },
  sublet: {
    title: "무단 전대차",
    text: "운영업체가 건물을 빌려 다시 빌려주는 구조에서는 원계약과 전대 권한이 중요하다. 동의 없는 전대나 원계약 종료로 거주가 불안정해질 수 있다.",
    advice:
      "건물주의 서면 전대 동의, 원임대차 기간, 운영업체의 계약 권한과 환불 규정을 확인한다.",
  },
  tax: {
    title: "국세·지방세 체납",
    text: "등기부만으로 임대인의 모든 체납을 알 수는 없다. 세금의 법정기일과 세목에 따라 보증금 배당에 영향을 줄 수 있다.",
    advice:
      "임대인의 미납 국세·지방세 열람을 요청한다. 계약 시점과 보증금 등 열람 요건을 기관에서 확인한다.",
    source: sources.tax,
  },
  timing: {
    title: "잔금일 근저당",
    text: "잔금을 보내기 전에 권리가 바뀌었는지 확인해야 한다. 주택 인도와 주민등록을 마쳐도 대항력은 다음 날 0시부터 발생한다.",
    advice:
      "잔금 직전 등기부를 다시 열람하고 입주·전입신고·확정일자를 챙긴다. 대항력 발생 때까지 새 권리를 설정하지 않는 약정도 확인한다.",
    detail:
      "온라인 신고 자체가 잘못은 아니다. 이 선택에서는 등기부 재확인과 확정일자·신고 처리 확인을 빠뜨렸다. 접수만 하고 완료됐다고 생각하지 않는다.",
    source: sources.law,
  },
  account: {
    title: "계좌 변경 사칭",
    text: "문자나 메신저로 예금주가 다른 계좌를 보내는 사칭 수법이 있다. 같은 통로로 재확인하거나 소액을 보내도 본인 확인은 되지 않는다.",
    advice:
      "기존에 확인한 연락처로 임대인에게 직접 전화하고 계약서에 적힌 명의 계좌로만 송금한다.",
  },
  settlement: {
    title: "기준 없는 정산",
    text: "입주 시점의 계량기 수치와 사진이 없으면 이전 사용분과 기존 하자를 구분하기 어렵다. 이전 세입자의 도어락 번호도 남아 있다.",
    advice:
      "도어락 번호를 바꾸고 전기·수도·가스 수치와 집 전체 상태를 날짜가 남게 촬영한다.",
  },
  guarantee: {
    title: "반환보증 신청 기한",
    text: "전세대출이 승인됐다고 보증금 반환까지 보장되는 것은 아니다. 반환보증에는 별도의 가입 조건과 신청 기한이 있다.",
    advice:
      "지금 가입 가능 여부를 확인해 신청하고 심사 결과·보증서 발급까지 확인한다. 거절되면 사유와 계약의 반환 조건을 검토한다.",
    source: sources.guarantee,
  },
  defect: {
    title: "시점을 놓친 하자",
    text: "입주 직후 하자를 기록하지 않으면 발생 시점과 원인을 다투기 쉽다. 협의 없이 먼저 수리하면 비용 상환도 분쟁이 될 수 있다.",
    advice:
      "오늘 날짜가 남게 사진을 찍고 문자로 하자를 통보한 뒤 수리 범위와 비용 부담을 합의한다.",
  },
};
const good = (id: string, label: string, advice: string): Choice => ({
  id,
  label,
  status: "checked",
  feedback: {
    title: "확인",
    text: advice,
    advice,
  },
});
const bad = (
  id: string,
  label: string,
  key: string,
  extra?: string,
): Choice => ({
  id,
  label,
  status: "risk",
  feedback: {
    ...warnings[key],
    text: (extra ? extra + " " : "") + warnings[key].text,
  },
});
const beat = (text: string, speaker?: string, background?: Background): StoryBeat => ({ text, speaker, background });
const choiceStep = (
  id: string, stage: Stage, title: string, beats: StoryBeat[], choices: Choice[],
  background: Background = stage <= 4 ? "office" : "room",
): Step => ({ id, stage, kind: "choice", eyebrow: "", title, beats, choices, background });
export const has = (g: GameState, step: string, item: string) =>
  g.answers[step]?.includes(item) ?? false;
export const selectedHome = (g: GameState) =>
  homes.find((h) => h.id === g.house) ?? homes[0];
export const makeNewGame = (): GameState => ({
  version: 2,
  page: "home",
  prologue: 0,
  contract: "monthly",
  house: "oneroom",
  cursor: "listing",
  answers: {},
  drafts: {},
});

const exploration: Record<HouseId, [string, string, string]> = {
  oneroom: [
    "광고에 없는 방",
    "건물 방 개수를 세어본다. 광고에 없는 반지하·옥탑까지 포함해야 진짜 세대 수가 나온다.",
    "반지하·옥탑을 포함한 실제 세대 수를 확인한다",
  ],
  officetel: [
    "7평의 의미",
    "광고의 ‘7평’이 공급면적인지 전용면적인지 확인. 전용률 50%면 실제는 3.5평.",
    "공급면적과 전용면적을 구분해 묻는다",
  ],
  villa: [
    "새집의 가격표",
    "신축이라 실거래가가 없다.",
    "인근 5~10년차 빌라의 실거래가를 찾아본다",
  ],
  rooftop: [
    "호수가 없는 주소",
    "주소가 ‘○○동 3층’으로만 표기되어 있다. 호수가 없다.",
    "건축물대장과 실제 층·주소를 대조한다",
  ],
  basement: [
    "주변보다 싼 이유",
    "가격이 주변보다 20% 싸다.",
    "가격이 낮은 이유와 침수·습기 이력을 묻는다",
  ],
  goshiwon: [
    "운영팀은 누구일까",
    "계약 주체가 ‘○○하우스 운영팀’이다. 집주인 이름이 어디에도 없다.",
    "운영업체와 건물주 관계, 전대 동의를 묻는다",
  ],
};

export function clauseItems(contract: Contract): CheckItem[] {
  return [
    check(
      "rights",
      "잔금일까지 근저당 등 새로운 권리를 설정하지 않는다. 위반 시 계약 해제 및 배액 반환",
      "계약일부터 잔금일 다음 날 대항력 발생 시까지 근저당 등 새 권리를 설정하지 않는다. 위반 시 계약 해제와 지급금 반환·배액배상 범위를 합의한다.",
      "등기부가 달라졌을 때 약정 위반을 주장할 근거를 보관했다.",
      "잔금일 권리 변동에 대응할 특약을 남기지 않았다.",
    ),
    check(
      "defects",
      "입주 전 발견된 하자는 임대인 부담으로 수리한다",
      "입주 전에 발견한 하자는 임대인 부담으로 수리한다. 대상과 수리 기한을 적는다.",
      "입주 전 하자와 수리 책임을 문서에 남겼다.",
      "입주 전 누수·곰팡이 수리 약속을 문서로 남기지 않았다.",
    ),
    check(
      "registration",
      "전입신고와 확정일자 부여에 협조한다. 위반 시 계약 해제 및 보증금 즉시 반환",
      "임대인은 전입신고와 확정일자 부여에 협조한다. 위반 시 계약 해제와 보증금 즉시 반환을 합의한다.",
      "전입신고 협조와 거절 시 대응을 명시했다.",
      "전입신고 협조에 관한 약속이 서면으로 남지 않았다.",
    ),
    check(
      "repair",
      "시설물 노후로 인한 고장은 임대인이 수리한다",
      "시설물 노후로 인한 고장은 임대인이 수리한다. 원인과 비용 부담을 확인한다.",
      "보일러 등 노후 시설 고장 때 제시할 약속을 보관했다.",
      "보일러 고장 때 수리 책임을 놓고 다툰다.",
    ),
    ...(contract === "jeonse"
      ? [
          check(
            "insurance",
            "보증보험 가입이 거절될 경우 계약을 해제하고 보증금을 반환한다",
            "전세보증금반환보증 가입이 거절되면 계약을 해제하고 보증금을 반환한다. 사유·기한·반환일을 구체적으로 합의한다.",
            "보증 거절 시 계약을 재검토할 안전장치를 남겼다.",
            "반환보증 거절 때 계약을 정리할 조건을 마련하지 않았다.",
          ),
        ]
      : []),
  ];
}
export const signingItems = [
  check(
    "identity",
    "신분증과 등기부상 소유자를 대조한다",
    "계약자 본인과 계약 권한을 확인한다.",
    "상대의 신분과 권한을 대조했다.",
    "계약자의 신분을 서명 전에 확인하지 않았다.",
  ),
  check(
    "agent",
    "중개사의 공인중개사 등록증·공제증서를 확인한다",
    "등록된 중개사인지, 공제 기간과 내용을 확인한다.",
    "중개사 등록과 공제 서류를 확인했다.",
    "중개사 등록·공제 내용을 모른 채 서명했다.",
  ),
  check(
    "tax",
    "임대인의 미납 국세·지방세 열람을 요구한다",
    "임대인의 체납과 열람 요건을 확인한다.",
    "등기부 밖의 세금 위험도 확인했다.",
    "체납 세금이 보증금 반환에 미칠 영향을 확인하지 않았다.",
  ),
];
export function movingItems(contract: Contract): CheckItem[] {
  return [
    check(
      "registry",
      "잔금 송금 전 등기부 마지막 열람",
      "계약 때와 달라진 소유자·근저당을 확인한다.",
      "잔금 전 등기부를 다시 확인할 준비를 했다.",
      "잔금 전 권리 변동을 확인하는 절차를 놓쳤다.",
    ),
    check(
      "registration",
      "전입신고 + 확정일자 당일 처리",
      "입주와 신고·확정일자 처리를 함께 챙긴다.",
      "오늘 처리할 신고와 서류를 챙겼다.",
      "전입신고·확정일자 준비를 빠뜨렸다.",
    ),
    ...(contract === "jeonse"
      ? [
          check(
            "insurance",
            "전세보증금반환보증 가입 신청",
            "신청 기한과 조건, 발급 여부까지 확인한다.",
            "반환보증 신청을 오늘 할 일에 넣었다.",
            "반환보증 신청 준비를 미뤘다.",
          ),
        ]
      : []),
    check(
      "photos",
      "집 전체 사진 촬영 — 벽면, 바닥, 창틀, 욕실, 싱크대, 기존 하자, 가전 작동. 촬영 날짜가 기록되게",
      "벽·바닥·창틀·욕실·싱크대·가전 상태를 날짜가 남게 기록한다.",
      "입주 시점의 상태를 남길 준비를 했다.",
      "퇴거 때 기존 하자였음을 비교할 사진을 준비하지 않았다.",
    ),
    check(
      "meter",
      "계량기 초기 수치 촬영 (수도·전기·가스)",
      "사용량 정산의 시작점을 기록한다.",
      "정산 기준을 남길 준비를 했다.",
      "이전 세입자 사용량과 내 사용량의 경계가 모호해졌다.",
    ),
    check(
      "lock",
      "현관 도어락 비밀번호 변경",
      "이전 세입자가 쓰던 번호를 바꾼다.",
      "입주 보안 점검을 챙겼다.",
      "비밀번호를 바꿀 계획을 놓쳤다.",
    ),
  ];
}

function houseContract(g: GameState): Step {
  const configs: Record<HouseId, { title: string; beats: StoryBeat[]; risk: string; key: string; safe: string[] }> = {
    oneroom: {
      title: "선순위 보증금",
      beats: [beat("이 건물에는 방이 12개다. 나는 그중 하나를 계약한다.")],
      risk: "내 방만 계약하는 거니까 상관없다", key: "priority",
      safe: [
        "확정일자 부여현황 열람 동의서를 요구한다",
        "앞선 세입자들의 보증금 합계를 알려달라고 한다",
        "근저당 채권최고액 + 선순위 보증금 + 내 보증금 < 건물 시세인지 계산한다",
      ],
    },
    officetel: {
      title: "전입신고",
      beats: [
        beat("중개사가 말한다."),
        beat(g.contract === "monthly"
          ? "여기 업무용이라 전입신고는 좀… 대신 월세 5만 원 깎아드릴게요."
          : "여기 업무용이라 전입신고는 좀… 대신 보증금을 낮춰드릴게요.", "중개사", "agent"),
      ],
      risk: g.contract === "monthly" ? "5만 원이면 1년에 60만 원이니 좋다" : "보증금을 낮춰준다니 좋다",
      key: "registration",
      safe: ["전입신고 되는 매물만 보겠다고 한다", "건축물대장 용도를 확인한다", "전입신고 협조 특약 + 위반 시 계약 해제 조항을 함께 넣는다"],
    },
    villa: g.contract === "jeonse" ? {
      title: "신축 빌라의 시세",
      beats: [
        beat("이 집 매매가요? 신축이라 아직 거래가 없어서… 분양가는 1억 6천이에요.", "중개사", "agent"),
        beat("전세는 1억 5천이다."),
      ],
      risk: "새 집이니 그 정도 하겠지", key: "price",
      safe: ["인근 5~10년차 빌라 실거래가를 조회한다", "공시가격 대비 배수로 검증한다", "다른 중개사무소 두 곳에 따로 문의한다"],
    } : {
      // 설계서에 없는 월세 빌라의 계약 장면만 보완한다.
      title: "계약서의 주소",
      beats: [beat("계약서에는 301호라고 적혀 있다. 실제 방문한 집과 등기부의 동·호수를 맞춰볼 차례다.")],
      risk: "문 앞에 적힌 호수만 믿고 넘어간다", key: "address",
      safe: ["실제 집·계약서·등기부의 동·호수와 소유자를 대조한다", "건축물대장과 권리관계를 함께 확인한다"],
    },
    rooftop: {
      title: "호수가 없는 주소",
      beats: [beat("계약서에 주소가 ‘○○동 123-4’까지만 적혀 있다. 호수가 없다.")],
      risk: "원래 옥탑은 그런 거라고 한다", key: "rooftop",
      safe: ["건축물대장을 발급받는다", "주민센터에 이 주소로 전입신고가 되는지 문의한다", "계약서 주소와 전입신고 주소를 일치시킬 수 있는지 확인한다"],
    },
    basement: {
      title: "벽 하단의 얼룩선",
      beats: [beat(has(g, "inspection", "flood-line")
        ? "계약서를 쓰려는데, 임장 때 본 벽 하단의 얼룩선이 떠오른다."
        : "계약서를 쓰려는데, 임장 때 벽 하단의 얼룩선을 확인하지 못한 것이 마음에 걸린다.")],
      risk: "그냥 넘어간다", key: "flood",
      safe: ["침수 이력을 중개대상물 확인·설명서에 기재해달라고 한다", "관할 구청에 침수 이력을 문의한다", "이웃이나 인근 상가에 직접 물어본다"],
    },
    goshiwon: {
      title: "시설이용계약서",
      beats: [beat("내민 종이의 제목이 ‘시설이용계약서’다. 집주인 이름은 어디에도 없다.")],
      risk: "그냥 서명한다", key: "sublet",
      safe: ["계약 상대가 건물주인지 운영업체인지 확인한다", "집주인의 서면 전대 동의서를 요구한다", "원임대차 계약의 남은 기간을 확인한다", "중도 퇴실 환불 규정을 문서로 받는다"],
    },
  };
  const c = configs[g.house];
  return {
    ...choiceStep("house-contract", 4, c.title, c.beats, [
      bad("ignore", c.risk, c.key),
      ...c.safe.map((label, i) => good("verify-" + i, label, warnings[c.key].advice)),
    ], "lease"),
    document: "lease",
  };
}

export function getSteps(g: GameState): Step[] {
  const home = selectedHome(g);
  const exp = exploration[g.house];
  const steps: Step[] = [
    choiceStep("listing", 1, "광고와 다른 방", [
      beat("앱에 뜬 방. 주변 지하철 역에서 도보 10분. " + priceLabel(home, g.contract) + ". 사진 속 방은 깨끗하다.", undefined, "app"),
      beat("매물에 문의하자 답장이 온다.", undefined, "app"),
      beat("오늘 두 팀 더 보러 오세요. 마음 있으시면 빨리 오셔야 해요.", "중개사 · 문자", "app"),
      beat("방문 약속을 잡고 부동산에 도착했다. 그런데 안내자가 다른 방 사진을 보여준다."),
      beat("보셨던 방은 방금 나갔어요. 대신 비슷한 방이 하나 있어요. 오신 김에 보고 가시죠.", "중개사"),
    ], [
      bad("follow", "비슷하다는 말만 듣고 따라나선다. 새 방의 가격과 위치는 아직 확인하지 않았다.", "bait"),
      good("compare", "광고와 다른 방이라면, 무엇이 달라지는지 먼저 확인한다.", warnings.bait.advice),
    ]),
    g.contract === "monthly"
      ? choiceStep("cost", 1, "관리비 쪼개기", [
          beat("월세 45로 올리지 마시고, 월세 35에 관리비 10으로 하시죠. 서로 좋아요.", "중개사", "agent"),
        ], [
          bad("accept", "좋다고 한다", "cost"),
          good("breakdown", "관리비에 뭐가 포함되는지 서면으로 달라고 한다", warnings.cost.advice),
          good("actual", "계약서에는 실제 금액대로 써달라고 한다", warnings.cost.advice),
        ])
      : choiceStep("loan", 1, "가계약금과 대출", [
          beat("마음에 드는 집이 있다."),
          beat("오늘 가계약금 걸면 잡아드린다.", "중개사", "agent"),
        ], [
          bad("pay", "먼저 걸어둔다", "loan"),
          good("bank", "은행에서 대출 한도부터 확인한다", warnings.loan.advice),
          good("guarantee", "보증보험 가입이 되는 물건인지 먼저 조회한다", warnings.guarantee.advice),
          good("ratio", "전세가율을 계산해본다", warnings.price.advice),
        ]),
    choiceStep("house-search", 1, exp[0], [beat(exp[1])], [
      bad("skip", "확인하지 않고 넘어간다", {
        oneroom: "priority", officetel: "area", villa: "price", rooftop: "rooftop", basement: "flood", goshiwon: "sublet",
      }[g.house]),
      good("ask", exp[2], "광고의 설명과 실제 조건을 대조했다."),
    ], "app"),
    {
      id: "inspection", stage: 2, kind: "inspection", eyebrow: "", title: "집 보기",
      background: "room",
      beats: [
        beat("방에 도착했다. 중개사가 문을 열어준다.", undefined, "agent"),
        beat("편하게 보세요.", "중개사", "agent"),
      ],
      items: inspectionItems(g.house),
    },
    {
      ...choiceStep("deposit", 3, "가계약금 송금", [
        beat(g.house === "goshiwon"
          ? "지금 보증금 10만 원만 넣어두시면 다른 사람한테 안 넘어가요. 계좌 보내드릴게요."
          : "지금 100만 원만 넣어두시면 다른 사람한테 안 넘어가요. 계좌 보내드릴게요.", "중개사", "agent"),
        beat("문자로 계좌번호가 왔다. 예금주: 김○○"),
      ], [
        bad("immediate", "계좌를 받았으니 바로 송금한다", "deposit", "계좌번호를 받았다는 것은 상대가 누구인지와 아무 관련이 없습니다."),
        bad("agent", "중개사가 중간에 있으니 중개사 말만 믿고 송금한다", "deposit", "중개사도 상대의 말만 듣고 전달하는 경우가 있습니다."),
        bad("paper", "계약서를 먼저 쓰자고 하고, 그 자리에서 송금한다", "deposit", "계약서를 먼저 쓰는 것 자체는 좋습니다. 다만 상대가 소유자인지 먼저 확인해야 합니다."),
        good("owner", "등기부로 소유자를 확인하고, 그 명의 계좌로만 송금한다", "등기부를 열었다."),
      ]),
      document: "message",
    },
  ];
  if (has(g, "deposit", "owner")) {
    if (["oneroom", "rooftop", "basement"].includes(g.house)) {
      steps.push({
        ...choiceStep("proxy", 3, "예금주가 다르다", [
          beat("등기부상 소유자는 박○○. 그런데 문자로 온 계좌 예금주는 김○○이다."),
          beat("중개사에게 물었다."),
          beat("아드님이세요. 아버지가 편찮으셔서 관리를 맡고 계세요.", "중개사", "agent"),
        ], [
          bad("family", "가족이라니 그럴 수 있다고 넘어간다", "proxy"),
          bad("agent", "중개사가 보증한다고 하니 그대로 보낸다", "proxy"),
          good("authority", "위임장과 인감증명서를 확인하고, 소유자 명의 계좌로만 보낸다", "위임 범위에 계약 체결과 금전 수령이 모두 들어 있는지 확인했다. 위임장과 인감증명서를 대조했다. 송금은 소유자 명의 계좌로 한다."),
          bad("promise", "아들 명의 계좌로 보내되 각서를 받아둔다", "proxy"),
        ]),
        document: "registry",
      });
    } else {
      const beats = g.house === "officetel" ? [
        beat("갑구에 신탁 표기가 있다. 소유자는 개인이 아니라 신탁회사다."),
        beat("임대차 계약을 맺을 권한은 신탁회사에 있다. 건물을 관리하는 사람과 계약해도, 신탁회사의 동의가 없으면 보호받지 못할 수 있다."),
        beat("신탁회사의 임대차 동의서를 확인해야 한다."),
      ] : g.house === "goshiwon" ? [
        beat("등기부상 소유자는 개인인데, 입금하라는 계좌는 법인 명의다."),
        beat("이 건물은 운영업체가 통째로 빌려 방마다 다시 빌려주는 구조다. 내 계약 상대는 건물주가 아니라 그 업체다."),
        beat("건물주가 원계약을 해지하거나 업체가 문을 닫으면, 거주와 보증금 반환에 문제가 생길 수 있다."),
        beat("건물주의 서면 전대 동의서가 있어야 한다."),
      ] : g.contract === "jeonse" ? [
        beat("중개사가 덧붙인다."),
        beat("계약하시면 곧 주인이 바뀌실 거예요, 신축이라.", "중개사", "agent"),
        beat("지은 업자가 분양이 안 되자 세입자를 먼저 받고, 같은 날 집을 다른 사람에게 넘기는 구조일 수 있다. 새 주인에게 돈도 신용도 없으면 만기에 보증금을 돌려줄 사람이 사라진다."),
        beat("잔금 전에 소유자가 바뀌는 계약은 피한다. 바뀔 예정이라면 새 소유자의 자력을 확인해야 한다."),
      ] : [
        beat("등기부상 소유자와 계약자, 예금주가 일치한다. 동·호수와 권리관계도 함께 확인한다."),
      ];
      steps.push({
        id: "authority-info", stage: 3, kind: "info", eyebrow: "", title: "등기부 확인",
        background: "office", beats, document: "registry",
      });
    }
  }
  steps.push(
    houseContract(g),
    {
      id: "clauses", stage: 4, kind: "checklist", eyebrow: "", title: "특약사항",
      background: "lease",
      beats: [
        beat("부동산 사무실. A4 두 장짜리 계약서가 놓여 있다."),
        beat("특약사항 칸은 비어 있다."),
        beat("중개사가 묻는다.", undefined, "agent"),
        beat("넣으실 거 있으세요?", "중개사", "agent"),
      ],
      items: clauseItems(g.contract), document: "lease",
    },
    {
      id: "signing", stage: 4, kind: "checklist", eyebrow: "", title: "서명 전 확인",
      background: "lease",
      beats: [beat("펜을 들었다. 서명하기 전에 확인할 수 있는 것이 있다.")],
      items: signingItems, document: "lease",
    },
    {
      id: "moving", stage: 5, kind: "checklist", eyebrow: "", title: "입주 당일",
      background: "moving",
      beats: [beat("짐을 다 옮겼다. 오늘 안에 해야 할 일이 남아 있다.")],
      items: movingItems(g.contract),
    },
    choiceStep("timing", 5, "금요일 오후 4시 50분", [
      beat("금요일, 잔금일이다. 이삿짐 트럭은 오후 2시에 왔고 짐 정리에 하루가 갈 것 같다."),
      beat("주민센터는 6시에 닫는다. 내일은 토요일, 월요일은 첫 출근이라 오전부터 일정이 잡혀 있다."),
      beat("현재 시각 오후 4시 50분."),
    ], [
      bad("later", "짐부터 정리하고 전입신고는 다음 주에 한다", "timing"),
      good("verify", "잔금을 보내기 전에 등기부를 다시 떼고, 바로 주민센터로 간다", warnings.timing.advice),
      bad("online", "일단 잔금을 보내고 정부24로 온라인 전입신고를 한다", "timing"),
      bad("delegate", "중개사에게 대신 신고를 부탁한다", "timing"),
    ], "moving"),
    {
      ...choiceStep("account", 5, "계좌 변경", [
        beat("잔금을 보내려는 참에 문자가 온다."),
        beat("사정이 있어서 계좌가 바뀌었어요. 아래로 보내주세요.", "중개사 · 문자"),
        beat("예금주 이름이 계약서와 다르다."),
      ], [
        bad("send", "중개사가 보낸 문자니까 그대로 보낸다", "account"),
        bad("small", "소액을 먼저 보내 확인해본다", "account"),
        good("call", "임대인에게 직접 전화해 확인하고, 계약서에 적힌 명의 계좌로만 보낸다", warnings.account.advice),
        bad("text", "문자로 다시 한 번 계좌를 확인받고 보낸다", "account"),
      ], "moving"),
      document: "message",
    },
    choiceStep("settlement", 5, "마지막 정리", [
      beat("이삿짐 정리가 끝났다. 현관 도어락은 이전 세입자가 쓰던 번호 그대로다."),
      beat("관리비 얘기가 나오는데 계량기를 본 적이 없다."),
    ], [
      bad("ignore", "별일 없을 테니 그냥 둔다", "settlement"),
      good("record", "도어락 번호를 바꾸고, 계량기 수치와 집 상태를 날짜가 남게 촬영해둔다", warnings.settlement.advice),
      bad("bill", "관리비는 첫 고지서가 나오면 그때 따진다", "settlement"),
      bad("lock", "도어락만 바꾸고 계량기는 임대인 말을 믿는다", "settlement"),
    ], "moving"),
    g.contract === "jeonse"
      ? choiceStep("insurance", 5, "반환보증 가입", [
          beat(has(g, "timing", "verify")
            ? "전입신고와 확정일자를 마쳤고 대출도 실행됐다."
            : "대출은 실행됐다. 전입신고와 확정일자 처리 여부는 아직 확인해야 한다."),
          beat("보증보험은 나중에 해도 된다는 말을 들었다."),
        ], [
          bad("loan", "대출이 나왔으니 이미 안전하다고 본다", "guarantee"),
          bad("later", "계약 기간 중에 여유 있을 때 신청한다", "guarantee"),
          good("apply", "지금 바로 신청하고, 거절되면 그 사유를 확인한다", warnings.guarantee.advice),
          bad("landlord", "임대인이 알아서 가입해줄 것이라 보고 기다린다", "guarantee"),
        ], "moving")
      : choiceStep("defect", 5, "입주 직후의 하자", [
          beat("짐을 들여놓다 보니 보일러가 돌지 않는다. 도배를 새로 한 자리도 들떠 있다."),
          beat("살다 보면 그럴 수 있다.", "임대인"),
        ], [
          bad("later", "일단 지내보고 나중에 말한다", "defect"),
          good("record", "오늘 날짜가 남게 사진을 찍고 문자로 통보한 뒤 수리를 요구한다",
            has(g, "clauses", "repair")
              ? "계약서의 시설물 수리 특약과 사진을 제시했다. 수리 일정과 비용 부담을 서면으로 확인했다."
              : "그때 시설물 수리 특약을 넣었다면. 지금은 하자 사진과 문자로 발견 시점을 남기고, 수리 책임과 비용을 협의한다."),
          bad("self", "내 돈으로 고치고 나중에 청구한다", "defect"),
          bad("phone", "전화로만 이야기하고 넘어간다", "defect"),
        ], "moving"),
    {
      id: "recap", stage: 6, kind: "recap", eyebrow: "", title: "입주 후의 생활",
      background: "rain",
      beats: [
        beat("4월. 장마가 시작됐다."),
        ...epilogueBeats(g),
      ],
    },
    choiceStep("renewal", 6, "만기 3개월 전", [
      beat("다른 지역 캠퍼스로 옮기게 됐다. 만기 3개월 전이다."),
    ], [
      {
        id: "wait", label: "만기 때 말하면 되겠지", status: "risk",
        feedback: {
          title: "묵시적 갱신",
          text: "계약 종료 통지를 미루면 묵시적 갱신이 문제 될 수 있다. 묵시적으로 갱신된 주택임대차는 해지 통지가 도달한 뒤 3개월이 지나야 종료되는 규정이 있다.",
          advice: "만기·통지 기한을 확인하고 갱신 거절과 보증금 반환 요청을 지금 전달한다. 상대에게 도달한 증거를 남긴다.",
        },
      },
      good("letter", "내용증명으로 갱신 거절과 반환 의사를 통지한다", "갱신 거절과 보증금 반환 의사를 통지했다. 내용과 도달 여부를 보관한다."),
      good("message", "문자로 정리해 보낸다", "갱신 거절과 반환 요청을 문자로 보냈다. 수신 여부와 답신을 확인한다."),
    ]),
    choiceStep("return", 6, "보증금 반환", [
      beat("만기일. 돈이 들어오지 않는다."),
      beat("임대인이 말한다."),
      beat("다음 세입자 들어오면 줄게. 그리고 도배값 40만 원은 빼야지.", "임대인"),
    ], [
      {
        id: "wait", label: "알겠다고 하고 기다린다", status: "risk",
        feedback: {
          title: "끝없이 미뤄지는 반환",
          text: "다음 세입자가 들어오는 것이 당연한 보증금 반환 조건은 아니다. 근거 없는 공제와 반환 지연에 대응할 기록이 필요하다.",
          advice: "반환 기한을 명확히 통지하고 공제 근거를 요구한다. 미반환 상태로 이사해야 한다면 임차권등기 등 권리 보전 절차를 상담한다.",
        },
      },
      {
        ...good("photos", "입주 당일 사진을 꺼내 비교한다", "입주 당일 사진과 현재 상태를 비교했다. 통상적인 사용에 따른 노후와 임차인 과실을 구분해 공제 근거를 요구한다."),
        disabledReason: has(g, "settlement", "record") || has(g, "defect", "record")
          ? undefined : "입주 당일 사진을 남기지 않았다.",
      },
      good("letter", "내용증명을 보낸다", "보증금 반환을 요구하는 내용증명을 보냈다. 반환 요청과 도달 증거를 보관하고 후속 절차를 확인한다."),
      good("registration", "임차권등기명령을 신청하고 등기 완료 후 이사한다", "임대차 종료와 미반환 등 신청 요건을 확인한다. 기존 대항력·우선변제권 보전을 위해 등기 완료 전 이사·전출을 주의한다."),
      ...(g.contract === "jeonse" ? [{
        ...good("claim", "보증보험에 이행을 청구한다", "보증서 발급, 보증사고 요건, 필요 서류와 청구 기한을 확인한다. 신청만으로 가입이나 즉시 지급이 보장되지는 않는다."),
        disabledReason: has(g, "insurance", "apply") ? undefined : "반환보증을 신청하지 않았다.",
      }] : []),
    ]),
  );
  return steps;
}

// 놓친 임장 지점은 설명 목록 대신 이후에 일어나는 장면으로 돌아온다.
function epilogueBeats(g: GameState): StoryBeat[] {
  const events: Record<string, StoryBeat[]> = {
    ceiling: [beat("천장에서 물이 샌다."), beat("관리 부실이에요.", "임대인")],
    mold: [beat("옷장 안 옷에 곰팡이가 폈다.")],
    wall: [beat("옆방 알람이 매일 6시에 들린다.")],
    water: [beat("아침에 샤워를 못 해 1교시를 놓친다.")],
    window: [beat("1월 난방비 고지서가 18만 원이다.", undefined, "room")],
    sink: [beat("밤에 벌레가 나온다.", undefined, "room")],
  };
  return inspectionItems(g.house).filter((item) => !has(g, "inspection", item.id))
    .flatMap((item) => [
      ...(events[item.id] ?? [beat(item.consequence)]),
      beat("임장 때 " + item.title + "을 확인하지 않았다."),
      ...(item.id === "ceiling" || item.id === "mold" ? [
        beat(has(g, "clauses", "defects")
          ? "입주 전 발견된 하자는 임대인 부담으로 수리한다. 계약서에 적어둔 특약을 제시하고, 하자 기록과 함께 수리를 요구했다."
          : "그때 하자 수리 특약을 넣었다면. 발견 시점과 하자 사진을 남기고 수리 책임을 협의해야 한다."),
      ] : []),
    ]);
}

// 경고 기록은 선택에서 매번 계산한다. 다시 선택할 때 예전 경고가 중복되거나 남지 않는다.
export function getCheckpoints(g: GameState): Checkpoint[] {
  return getSteps(g).flatMap<Checkpoint>((step) => {
    const selected = g.answers[step.id];
    if (!selected) return [];
    if (step.choices) {
      const choice = step.choices.find((c) => selected.includes(c.id));
      return choice
        ? [
            {
              id: step.id,
              stepId: step.id,
              stage: step.stage,
              status: choice.status,
              title: choice.feedback.title,
              choice: choice.label,
              consequence: choice.feedback.text,
              advice: choice.feedback.advice,
              category: "decision" as const,
            },
          ]
        : [];
    }
    return (step.items ?? []).map((item) => {
      const special =
        step.id === "signing" && item.id === "tax" && g.contract === "jeonse"
          ? warnings.tax
          : step.id === "clauses" &&
              item.id === "registration" &&
              g.house === "officetel"
            ? warnings.registration
            : undefined;
      return {
        id: step.id + ":" + item.id,
        stepId: step.id,
        stage: step.stage,
        status: selected.includes(item.id)
          ? ("checked" as const)
          : ("risk" as const),
        title:
          !selected.includes(item.id) && special ? special.title : item.title,
        choice: selected.includes(item.id)
          ? "확인했다 · " + item.title
          : "확인하지 않고 넘어갔다 · " + item.title,
        consequence: selected.includes(item.id)
          ? item.signal
          : (special?.text ?? item.consequence),
        advice: special?.advice ?? item.advice,
        category:
          step.id === "inspection"
            ? ("inspection" as const)
            : step.id === "clauses"
              ? ("clause" as const)
              : ("check" as const),
      };
    });
  });
}

export function getEnding(g: GameState): Ending {
  const risks = getCheckpoints(g).filter((c) => c.status === "risk");
  return {
    id: "complete",
    symbol: "🔑",
    title: "첫 임대계약의 이야기가 끝났다.",
    subtitle: "끝",
    text: "집을 알아보던 날부터 계약이 끝나는 날까지, 나의 선택을 돌아본다.",
    reasons: risks.length
      ? [
          "경고가 떴던 " +
            risks.length +
            "개 항목이 남아 있다.",
        ]
      : [
          "경고가 발생한 항목은 없다.",
        ],
  };
}

export function rewindGame(g: GameState, stepId: string): GameState {
  const steps = getSteps(g);
  const index = steps.findIndex((s) => s.id === stepId);
  if (index < 0) return g;
  const before = new Set(steps.slice(0, index).map((s) => s.id));
  // 뒤의 선택은 앞선 선택에 의존한다. 다시 고른 장면부터 이어서 플레이한다.
  return {
    ...g,
    page: "play",
    cursor: stepId,
    answers: Object.fromEntries(
      Object.entries(g.answers).filter(([id]) => before.has(id)),
    ),
    drafts: { [stepId]: g.answers[stepId] ?? g.drafts[stepId] ?? [] },
  };
}

export function restoreGame(raw: string | null): GameState {
  const fresh = makeNewGame();
  try {
    const saved = JSON.parse(raw ?? "null");
    if (
      !saved ||
      saved.version !== 2 ||
      !["monthly", "jeonse"].includes(saved.contract) ||
      !homes.some((h) => h.id === saved.house)
    )
      return fresh;
    if (saved.contract === "jeonse" && saved.house === "goshiwon") return fresh;
    const isRecord = (v: unknown): v is Record<string, string[]> =>
      !!v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      Object.values(v).every(
        (a) => Array.isArray(a) && a.every((s) => typeof s === "string"),
      );
    if (!isRecord(saved.answers) || !isRecord(saved.drafts)) return fresh;
    const game: GameState = {
      ...fresh,
      ...saved,
      prologue: Number.isInteger(saved.prologue)
        ? Math.max(0, Math.min(2, saved.prologue))
        : 0,
    };
    if (
      ![
        "home",
        "prologue",
        "contract",
        "tutorial",
        "house",
        "play",
        "ending",
      ].includes(game.page)
    )
      return fresh;
    const steps = getSteps(game);
    if (!steps.some((s) => s.id === game.cursor)) game.cursor = steps[0].id;
    if (game.page === "ending" && !game.answers.return) game.page = "play";
    return game;
  } catch {
    return fresh;
  }
}

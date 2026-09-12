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
  IconName,
  Stage,
  Step,
} from "./types.ts";

// 기존 Home 구조를 유지하면서 추가 설명을 보관한다.
type HomeWithDetails = Home & {
  managementFee: string;
  hint: string;
  inspect: string;
};

// 현재 types.ts에는 Inspection이 없으므로 이 파일에서 정의한다.
type Inspection = "window" | "sink" | "door";

// 1차 분기: 계약 형태별 튜토리얼 팁
export const contractTutorials: Record<
  Contract,
  {
    title: string;
    subtitle: string;
    tips: string[];
  }
> = {
  monthly: {
    title: "월세 계약의 핵심",
    subtitle: "보증금 500~2,000만 원 + 월세 + 관리비",
    tips: [
      "보증금 1,000만 원을 올리면 월세가 4~5만 원 내려가는 게 보통이다. 이 비율보다 불리하면 협상 여지가 있다.",
      "월세 45만 원짜리 방의 실제 지출은 45만 원이 아니다. 관리비 + 가스 + 전기 + 수도 + 인터넷을 합쳐서 비교해야 한다.",
      "보증금 500만 원도 소중한 내 돈이다. 금액이 작아도 집주인과 권리관계를 확인하는 절차는 생략하지 않는다.",
    ],
  },
  jeonse: {
    title: "전세 + 대출 계약의 핵심",
    subtitle: "목돈 보증금 마련과 안전한 반환 따져보기",
    tips: [
      "‘전세보증금 ÷ 매매 시세 × 100’로 전세가율을 계산할 수 있고 이를 통해 위험성을 알 수 있다.",
      "반환보증 가입이 안 된다면 계약을 서두르지 않고 거절 사유를 꼭 확인한다. 신청 시기나 서류 등도 가입에 영향을 줄 수 있다.",
      "전세 계약은 대출로 인해 생기는 이자를 감당할 수 있는지와 계약이 끝나고 보증금을 안전하게 돌려받을 수 있는지의 여부를 중요하게 고려해야 한다.",
    ],
  },
};

// 2차 분기: 주택 유형
// 금액 단위: 만 원.
// deposit은 월세 보증금, jeonse는 전세보증금이다.
// 전세 조건은 기존 시나리오와 일치하도록 유지한다.
export const homes: HomeWithDetails[] = [
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
    managementFee: "관리비 8만원",
    jeonse: 8000,
    turningPoint: "내 방보다 먼저 들어온 보증금은 얼마일까?",
    hint: "단독주택으로 분류되어 건물 전체의 선순위 보증금 총액을 꼭 확인해야 합니다.",
    inspect: "창틀 아래에 물이 흘렀던 자국이 희미하게 남아 있다.",
  },
  {
    id: "officetel",
    name: "오피스텔",
    sub: "주거용 공간",
    icon: "building",
    description:
      "한 공간에 방과 주방·욕실을 갖추고, 건물의 공용시설을 함께 이용한다.",
    area: "24㎡ · 7층",
    deposit: 1000,
    rent: 65,
    maintenance: 12,
    managementFee: "관리비 12만원",
    jeonse: 12000,
    turningPoint: "월세를 깎아주는 대신 전입신고를 못 한다면?",
    hint: "편리한 공용 시설만큼 일반 주택보다 관리비 단위가 높을 수 있습니다.",
    inspect: "창문은 조금만 열린다. 환기가 잘 되는지 직접 확인해 보고 싶다.",
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
    managementFee: "관리비 5만원",
    jeonse: 15000,
    turningPoint: "거래 이력이 없는 새집의 가격을 믿어도 될까?",
    hint: "호수별로 개별 등기가 되어 있어 호수 일치 여부를 서류에서 필히 확인해야 합니다.",
    inspect: "창틀 모서리 벽지에 얼룩이 보인다. 언제 생겼는지 물어봐야겠다.",
  },
  {
    id: "rooftop",
    name: "옥탑방",
    sub: "건물 맨 위",
    icon: "roof",
    description: "건물 맨 위, 옥상에 자리한 방에서 산다.",
    area: "18㎡ · 옥상층",
    deposit: 500,
    rent: 45,
    maintenance: 5,
    managementFee: "관리비 5만원",
    jeonse: 5000,
    turningPoint: "계약서에 내 방의 정확한 주소가 없다면?",
    hint: "건축물대장에 등재되지 않은 무허가 옥탑 증축인지 사전 조회가 필수입니다.",
    inspect:
      "창가에 서자 지붕 쪽에서 열기가 느껴진다. 단열 상태도 물어봐야겠다.",
  },
  {
    id: "basement",
    name: "반지하",
    sub: "지면 아래",
    icon: "stairs",
    description: "방의 일부가 지면 아래에 있는 공간에서 산다.",
    area: "23㎡ · 반지하",
    deposit: 500,
    rent: 40,
    maintenance: 5,
    managementFee: "관리비 5만원",
    jeonse: 5500,
    turningPoint: "새 벽지 아래에 침수 흔적이 남아 있다면?",
    hint: "폭우 시 역류 위험과 습기·환기 상태를 현장에서 중점 체크해야 합니다.",
    inspect: "창문 바깥 바닥이 방보다 높다. 비가 많이 오면 물이 어디로 흐를까?",
  },
  {
    id: "goshiwon",
    name: "고시원",
    sub: "쉐어/개인실",
    icon: "people",
    description: "작은 개인실에서 지내며 주방 등 일부 시설을 함께 쓴다.",
    area: "10㎡ · 3층",
    deposit: 10,
    rent: 38,
    maintenance: 0,
    managementFee: "관리비 없음",
    jeonse: null,
    turningPoint: "내 계약 상대가 건물주가 아닌 운영업체라면?",
    hint: "임대차보호법 적용 여부와 전입신고 가능 여부를 먼저 점검해야 합니다.",
    inspect: "창가 너머 복도 소음이 들린다. 방음 수준을 확인해 보자.",
  },
];

export const money = (value: number) =>
  value.toLocaleString("ko-KR") + "만 원";

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

// 기존 ChooseView에서 사용하는 tutorials도 같은 내용을 참조한다.
export const tutorials: Record<Contract, string[]> = {
  monthly: contractTutorials.monthly.tips,
  jeonse: contractTutorials.jeonse.tips,
};

// 추가 임장 설명 데이터.
// 기존 시나리오의 commonInspections와 inspectionItems는 그대로 유지한다.
export const inspections: Record<
  Inspection,
  {
    title: string;
    icon: IconName;
    narrative: (home: Home) => string;
    learning: string;
    note: string;
  }
> = {
  window: {
    title: "창문 주변",
    icon: "window",
    narrative: (home) =>
      homes.find((item) => item.id === home.id)?.inspect ?? home.description,
    learning:
      "흔적이 보인다면 언제 생겼는지, 어떻게 보수했는지 물어보고 사진으로 남겨 두자.",
    note: "창문 주변의 상태를 기록했다. 원인과 보수 이력을 중개사에게 물어볼 예정.",
  },
  sink: {
    title: "싱크대",
    icon: "water",
    narrative: () =>
      "수도꼭지를 틀어 본다. 물줄기는 일정하고 배수도 원활하다.",
    learning: "수압뿐만 아니라 온수와 배수 속도도 직접 확인해 보자.",
    note: "수압과 배수 상태를 확인했다. 이번 방문에서는 이상을 발견하지 못했다.",
  },
  door: {
    title: "현관과 도어락",
    icon: "door",
    narrative: () =>
      "문을 닫고 손잡이를 당겨 본다. 잠금장치가 견고하게 작동한다.",
    learning: "도어락 작동 여부와 문을 닫았을 때 외부 소음 차단력을 점검하자.",
    note: "현관 도어락 잠금 상태와 복도 소음 차폐를 확인했다.",
  },
};

export const talkItems = [
  {
    id: "cost",
    label: "“관리비에는 어떤 항목이 포함되나요?”",
    title: "매달 나가는 비용",
    reply: (contract: Contract) =>
      contract === "monthly"
        ? "“관리비는 공용 청소와 인터넷 포함이며, 수도/가스/전기는 별도 고지서로 나와요.”"
        : "“관리비는 항목별로 정산되며, 대출 승인 여부는 서류를 지참해 은행에 확인하셔야 합니다.”",
    note: (contract: Contract) =>
      contract === "monthly"
        ? "관리비 실비 항목(가스, 전기, 수도 별도 여부) 명확히 정리 필요."
        : "대출 가능 여부는 은행 서류 심사 전까지 확답 불가. 사전 확인 필수.",
  },
  {
    id: "condition",
    label: "“보수 흔적이 보이는데 언제 수리하셨나요?”",
    title: "확답을 받지 못한 보수 이력",
    reply: () =>
      "“임대인분께 최근 수리 내역과 보수 영수증 증빙이 있는지 확인해 드릴게요.”",
    note: () =>
      "하자 발생 시 임대인 수리 의무 조항을 특약에 넣을 수 있는지 검토.",
  },
  {
    id: "papers",
    label: "“계약 전 등기사항증명서와 계좌를 먼저 확인하고 싶어요.”",
    title: "서류 및 계좌 확인 요청",
    reply: () =>
      "“등기부등본 열람본과 계약금 입금 계좌 정보를 준비해 두었습니다.”",
    note: () => "등기부 소유자와 입금 계좌의 예금주 일치 여부 필수 확인.",
  },
];

export const sources = {
  law: "https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?csmSeq=629&ccfNo=2&cciNo=3&cnpClsNo=1",
  guarantee: "https://m.khug.or.kr/hug/web/ig/dr/igdr000001.jsp?tabMenu=Y",
  claim: "https://m.khug.or.kr/hug/web/ge/er/geer000900.jsp",
  registry: "https://www.iros.go.kr/",
  government: "https://www.gov.kr/",
  tax: "https://www.nts.go.kr/",
  help: "https://www.klac.or.kr/",
};
export const dictionary: {
  term: string;
  meaning: string;
  aliases?: string[];
}[] = [
  {
    term: "보증금",
    meaning:
      "집을 빌릴 때 맡기는 돈. 계약이 끝나면 미납금이나 정당한 공제액 등을 정산하고 돌려받는다.",
  },
  {
    term: "월세",
    meaning:
      "집을 사용하는 대가로 매달 내는 돈. 보증금과 관리비는 별도로 확인한다.",
  },
  {
    term: "전세",
    meaning:
      "큰 보증금을 맡기고 정해진 기간 동안 사는 계약 방식. 대출을 받았다면 매달 이자가 나갈 수 있다.",
  },
  {
    term: "관리비",
    meaning:
      "청소·공용 전기 등 건물 관리에 드는 비용. 수도·난방 등이 포함되는지는 집마다 다르다.",
  },
  {
    term: "임대인",
    meaning:
      "집을 빌려주는 계약 상대. 실제 소유자와 계약할 권한이 있는지 확인한다.",
    aliases: ["집주인", "건물주"],
  },
  {
    term: "임차인",
    meaning: "집을 빌려서 사는 사람. 이 이야기에서는 나를 뜻한다.",
    aliases: ["세입자"],
  },
  {
    term: "전세대출",
    meaning:
      "전세보증금을 마련하기 위해 빌리는 돈. 대출 가능 여부와 보증금 반환보증은 따로 확인한다.",
  },
  {
    term: "전세가율",
    meaning:
      "매매 시세에 비해 전세보증금이 얼마나 큰지 나타낸 비율. 전세보증금 ÷ 매매 시세 × 100으로 계산한다.",
  },
  {
    term: "전용면적",
    meaning: "방·주방·욕실처럼 해당 세대가 독립적으로 사용하는 면적.",
  },
  {
    term: "공급면적",
    meaning: "전용면적에 복도·계단 등 함께 사용하는 공간의 일부를 더한 면적.",
  },
  {
    term: "가계약금",
    meaning:
      "정식 계약서 작성 전에 미리 보내는 돈을 흔히 부르는 말. 이미 합의한 내용에 따라 돌려받기 어려울 수 있다.",
  },
  {
    term: "잔금",
    meaning: "계약금 등을 제외하고 마지막에 지급하는 나머지 돈.",
  },
  {
    term: "등기부등본",
    meaning:
      "집의 소유자와 근저당 등 권리관계를 확인하는 서류. 정식 명칭은 등기사항증명서다.",
    aliases: ["등기부", "등기사항"],
  },
  {
    term: "갑구",
    meaning:
      "등기부에서 소유권에 관한 내용을 보는 부분. 소유자, 압류, 신탁 등의 기록을 확인한다.",
  },
  {
    term: "을구",
    meaning: "등기부에서 근저당권 등 소유권 이외의 권리를 보는 부분.",
  },
  {
    term: "예금주",
    meaning:
      "돈을 받을 은행 계좌의 명의자. 계약 상대와 이름이 일치하는지 대조한다.",
  },
  {
    term: "근저당",
    meaning:
      "돈을 빌려준 사람이 집을 담보로 잡아둔 권리. 보증금보다 먼저 변제받는 권리인지 확인해야 한다.",
  },
  {
    term: "채권최고액",
    meaning:
      "근저당권으로 담보하는 채무의 최대 한도. 실제로 빌린 돈의 잔액과 같지는 않다.",
  },
  {
    term: "선순위 보증금",
    meaning:
      "경매 등에서 내 보증금보다 먼저 돌려받을 순위에 있는 다른 임차인의 보증금.",
  },
  {
    term: "위임장",
    meaning:
      "다른 사람에게 어떤 일을 맡겼는지 적은 서류. 계약 체결과 돈 수령이 위임 범위에 있는지 확인한다.",
  },
  {
    term: "인감증명서",
    meaning:
      "등록된 인감도장을 증명하는 서류. 위임장에 찍힌 도장과 대조할 때 쓰인다.",
  },
  {
    term: "대리권",
    meaning:
      "다른 사람을 대신해 계약 등을 할 수 있는 권한. 가족이라는 사실만으로 생기지는 않는다.",
    aliases: ["무권대리"],
  },
  {
    term: "신탁",
    meaning:
      "재산을 신탁회사 등에 맡겨 관리하는 구조. 등기부와 신탁원부로 임대차 계약 권한을 확인한다.",
  },
  {
    term: "전대차",
    meaning: "집을 빌린 사람이 그 집을 다시 다른 사람에게 빌려주는 계약.",
    aliases: ["전대", "운영업체"],
  },
  {
    term: "건축물대장",
    meaning: "건물의 용도·구조·면적·층수와 위반건축물 표시 등을 확인하는 서류.",
  },
  {
    term: "특약",
    meaning:
      "기본 계약 내용 외에 당사자들이 따로 합의해 적는 약속. 수리 책임이나 계약 해제 조건 등을 남긴다.",
  },
  {
    term: "전입신고",
    meaning:
      "이사한 주소를 주민등록에 반영하는 신고. 주택 인도와 함께 대항력 요건에 관련된다.",
  },
  {
    term: "확정일자",
    meaning:
      "그 날짜에 임대차계약서가 존재했다는 것을 확인받는 날짜. 보증금의 우선변제 요건 중 하나다.",
  },
  {
    term: "대항력",
    meaning:
      "집주인이 바뀌어도 임대차 관계를 주장할 수 있는 힘. 주택 인도와 주민등록 등 필요한 요건을 갖춰야 한다.",
  },
  {
    term: "체납",
    meaning:
      "내야 할 세금 등을 기한 안에 내지 않은 상태. 보증금 반환에 영향을 줄 수 있다.",
    aliases: ["국세", "지방세", "미납"],
  },
  {
    term: "반환보증",
    meaning:
      "임대인이 보증금을 돌려주지 않을 때 보증기관에 이행을 청구할 수 있는 보증 상품. 가입·청구 조건과 기한이 있다.",
    aliases: ["보증보험"],
  },
  {
    term: "묵시적 갱신",
    meaning:
      "정해진 기간 안에 종료 통지 등이 없어 계약이 법에서 정한 방식으로 이어지는 것.",
  },
  {
    term: "내용증명",
    meaning:
      "어떤 내용의 문서를 언제 보냈는지 우체국이 증명하는 우편 제도. 상대에게 도달했는지도 별도로 확인한다.",
  },
  {
    term: "임차권등기명령",
    meaning:
      "계약이 끝나도 보증금을 받지 못했을 때 법원에 신청하는 절차. 이사 전 등기 완료 여부를 확인해야 한다.",
  },
  {
    term: "결로",
    meaning:
      "따뜻하고 습한 공기가 차가운 창이나 벽에 닿아 물방울이 생기는 현상.",
  },
  {
    term: "하자",
    meaning:
      "누수나 고장처럼 집이나 시설에 생긴 결함. 발견 시점과 상태를 사진·문자로 남긴다.",
  },
  {
    term: "공시가격",
    meaning:
      "행정기관이 조사해 공시하는 부동산 가격. 실제 거래 시세와는 다를 수 있다.",
  },
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
    "동시 사용 시 물줄기가 확 줄어듦",
    "출근 준비 시간마다 수압이 약해져 아침이 늦어진다.",
    "동시 사용 수압과 온수를 확인하고 수리 가능 여부를 기록한다.",
  ),
  check(
    "drain",
    "세면대 배수구",
    "물을 가득 받았다가 한 번에 내려본다. 냄새도 맡아본다",
    "물이 고여 있음, 하수구 냄새",
    "여름이 되자 배수구에서 냄새가 올라온다.",
  ),
  check(
    "ceiling",
    "천장 모서리",
    "얼룩과 들뜬 벽지 확인",
    "갈색 원형 얼룩, 벽지 부풀음",
    "장마철 천장에서 물이 샌다. 임대인은 관리 문제라고 말한다.",
    "누수 이력과 보수 내역을 묻고 사진과 수선 약속을 남긴다.",
  ),
  check(
    "mold",
    "붙박이장 안쪽·뒤편",
    "숨은 곰팡이 확인",
    "검은 점, 축축함, 곰팡이 냄새",
    "옷과 이불에 곰팡이가 피었다.",
  ),
  check(
    "silicone",
    "창틀 실리콘",
    "실리콘 색과 창문 아래 벽면",
    "실리콘이 검게 변함 = 결로 반복",
    "겨울 내내 창문 아래의 물을 닦는다.",
  ),
  check(
    "window",
    "창문 (이중창 여부)",
    "유리가 2겹인지. 닫고 손을 대본다",
    "홑창이면 난방비 급증",
    "이듬해 1월, 난방비 18만 원 고지서를 받았다.",
    "창호와 단열 상태, 이전 난방비를 함께 확인한다.",
  ),
  check(
    "wall",
    "벽 두드리기",
    "옆방 쪽 벽을 주먹으로 두드려본다",
    "통통 울림 = 석고보드 칸막이",
    "옆방의 아침 6시 알람 때문에 매일 잠을 설친다.",
    "두드리는 소리만으로 단정하지 말고 저녁에 다시 방문해 소음을 확인한다.",
  ),
  check(
    "sink",
    "싱크대 하부장",
    "문을 열어 안쪽 확인",
    "끈끈이·약 흔적 = 이미 벌레가 있었음",
    "늦은 밤 싱크대 아래에서 벌레가 나온다.",
  ),
  check(
    "lock",
    "현관 도어락",
    "교체 가능한지 묻는다",
    "이전 세입자가 번호를 안다",
    "누가 비밀번호를 알고 있을지 몰라 불안하다.",
    "입주 즉시 번호를 바꾸고 잠금장치가 정상 작동하는지 확인한다.",
  ),
  check(
    "socket",
    "콘센트 위치·개수",
    "침대·책상 놓을 자리에 있는지",
    "한쪽 벽에 2개뿐",
    "책상까지 멀티탭을 이어야 해 배선이 불편하다.",
  ),
];
const extraInspections: Record<HouseId, CheckItem[]> = {
  oneroom: [
    check(
      "mailbox",
      "건물 밖 · 우편함",
      "이름표가 붙은 칸 수로 실제 세대 수를 센다.",
      "방치된 우편물은 공실·관리 부실 신호",
      "실제 세대 수와 관리 상태를 모르고 입주했다.",
    ),
    check(
      "meter-box",
      "건물 밖 · 계량기함",
      "세대별 전기·수도 계량기가 따로 있는지 묻는다.",
      "세대별 계량기가 없으면 관리비 분배 분쟁이 생긴다.",
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
      "통유리로 환기가 불가능한 구조면 요리 냄새가 안 빠진다.",
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
      "식당·술집이 있으면 냄새와 소음이 올라온다.",
      "밤마다 소음과 음식 냄새가 올라온다.",
    ),
  ],
  villa: [
    check(
      "crack",
      "외벽 균열",
      "균열과 보수 흔적, 관리 책임자를 확인한다.",
      "소규모 건물은 관리 주체가 없다. 외벽 균열의 보수 담당자를 확인한다.",
      "공용 부분 수리를 두고 책임을 미룬다.",
    ),
    check(
      "vacancy",
      "밤에 불 켜진 창 세기",
      "밤에 불 켜진 창을 세어본다.",
      "신축인데 공실이 많으면 분양이 안 된 것. 위험 신호",
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
      "우레탄 방수가 벗겨지면 아래로 샌다.",
      "비가 오자 옥상 바닥에서 누수가 시작된다.",
    ),
    check(
      "insulation",
      "천장 단열재",
      "천장에 단열재가 있는지 확인한다.",
      "없으면 여름 실내가 40도까지 오른다.",
      "한여름 방 안이 뜨거워 냉방비가 늘어난다.",
    ),
    check(
      "stair",
      "외부 계단",
      "난간, 조명과 미끄럼 방지를 확인한다.",
      "난간과 조명을 확인한다. 겨울에 얼면 위험하다.",
      "겨울에 얼어붙은 계단으로 출근해야 한다.",
    ),
    check(
      "roof-window",
      "옥상 쪽 창문",
      "옥상에서 창문에 쉽게 접근할 수 있는지 본다.",
      "옥상에서 손이 닿는 구조면 방범창 필수",
      "창문을 열고 자기가 불안하다.",
    ),
  ],
  basement: [
    check(
      "flood-line",
      "벽 하단 수평 얼룩선",
      "벽 아래를 따라 같은 높이의 얼룩이 있는지 본다.",
      "물이 찼던 높이다. 가장 중요한 단서",
      "큰비가 내리자 과거 침수 흔적이 다시 떠오른다.",
    ),
    check(
      "high-socket",
      "콘센트 높이",
      "콘센트가 높은 곳에 설치된 이유를 묻는다.",
      "비정상적으로 높으면 침수 대비 흔적",
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
      "보행자 눈높이면 종일 블라인드를 쳐야 한다.",
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
      "창문 없는 방은 화재 시 매우 위험",
      "환기와 화재 시 대피 경로가 걱정된다.",
    ),
  ],
};
export const inspectionItems = (house: HouseId) => [
  ...commonInspections,
  ...extraInspections[house].map((item) => ({ ...item, extra: true })),
];

type HousingScript = {
  text: string;
  choices: { label: string; status: "checked" | "risk" }[];
  warning: Feedback;
};
// 설계서의 문장·선택지·경고를 이 데이터에서 그대로 수정할 수 있다.
export const explorationScripts: Record<HouseId, HousingScript> = {
  oneroom: {
    text: '광고에는 "5세대 소규모"라고 적혀 있다. 그런데 사진 속 건물은 그보다 커 보인다.',
    choices: [
      {
        label: "광고에 적힌 대로 5세대라고 본다",
        status: "risk",
      },
      {
        label: "중개사에게 물어보고 답을 그대로 믿는다",
        status: "risk",
      },
      {
        label:
          "건물 사진과 로드뷰로 층수와 창문 수를 세어보고, 반지하·옥탑까지 포함해 다시 센다",
        status: "checked",
      },
      {
        label: "세대 수는 계약하고 나서 알아도 된다고 본다",
        status: "risk",
      },
    ],
    warning: {
      title:
        "선순위 보증금 — 나보다 먼저 들어온 세대의 보증금이 전부 내 앞에 섭니다.",
      text: "세대가 많을수록 나보다 앞선 보증금이 쌓입니다. 다가구는 건물 전체가 등기 하나라 그 총액이 내 순위를 결정합니다. 광고의 세대 수는 반지하와 옥탑을 빼고 적는 경우가 많습니다.",
      advice:
        "건물 사진과 로드뷰로 층수와 창문 수를 세어보고, 반지하·옥탑까지 포함해 다시 센다",
    },
  },
  officetel: {
    text: '광고에 "7평"이라고 적혀 있다. 사진 속 방은 생각보다 좁아 보인다.',
    choices: [
      {
        label: "7평이면 충분하다고 보고 넘어간다",
        status: "risk",
      },
      {
        label: "사진으로 대충 가늠해본다",
        status: "risk",
      },
      {
        label:
          "공급면적인지 전용면적인지 확인하고, 전용면적 기준으로 다시 본다",
        status: "checked",
      },
      {
        label: "직접 가서 보면 알 테니 지금은 넘어간다",
        status: "risk",
      },
    ],
    warning: {
      title:
        "면적 표기 — 광고의 평수는 복도와 공용부까지 포함한 숫자일 수 있습니다.",
      text: "오피스텔은 복도와 공용부가 넓어 전용률이 50% 안팎인 경우가 있습니다. 공급 7평이면 실제 생활 공간은 3.5평입니다. 같은 평수로 적힌 원룸과 비교하면 체감이 완전히 달라집니다.",
      advice: "공급면적인지 전용면적인지 확인하고, 전용면적 기준으로 다시 본다",
    },
  },
  villa: {
    text: "신축이라 이 집의 거래 기록이 없다. 중개사는 분양가를 시세처럼 말한다.",
    choices: [
      {
        label: "분양가가 곧 시세라고 본다",
        status: "risk",
      },
      {
        label: "신축이니 더 비싼 게 당연하다고 본다",
        status: "risk",
      },
      {
        label: "인근 5~10년차 빌라의 실거래가를 찾아 비교한다",
        status: "checked",
      },
      {
        label: "다른 신축 빌라 분양가와 비교한다",
        status: "risk",
      },
    ],
    warning: {
      title:
        "시세 부풀리기 — 거래된 적 없는 집의 매매가는 파는 쪽이 정한 숫자입니다.",
      text: '거래 이력이 없는 집의 "매매가"는 파는 쪽이 정한 숫자입니다. 다른 신축 분양가와 비교하면 부풀려진 값끼리 비교하는 셈입니다. 실제로 거래된 기록이 있는 물건과 맞춰봐야 합니다.',
      advice: "인근 5~10년차 빌라의 실거래가를 찾아 비교한다",
    },
  },
  rooftop: {
    text: '주소가 "○○동 3층"으로만 적혀 있다. 호수가 없다.',
    choices: [
      {
        label: "옥탑은 원래 그렇다고 보고 넘어간다",
        status: "risk",
      },
      {
        label: "계약할 때 중개사가 알아서 적어줄 거라고 본다",
        status: "risk",
      },
      {
        label: "건축물대장에 이 집이 등재돼 있는지 먼저 확인한다",
        status: "checked",
      },
      {
        label: "전입신고는 살면서 하면 된다고 본다",
        status: "risk",
      },
    ],
    warning: {
      title: "주소에 호수가 없다 — 대장에 없는 집이면 전입신고부터 막힙니다.",
      text: "주소에 호수가 없다는 건 대장에 독립된 집으로 올라 있지 않을 수 있다는 뜻입니다. 대장에 없으면 전입신고가 막히고, 전입신고가 막히면 보증금을 지킬 방법이 사라집니다.",
      advice: "건축물대장에 이 집이 등재돼 있는지 먼저 확인한다",
    },
  },
  basement: {
    text: "같은 동네 비슷한 크기의 방보다 20% 싸다.",
    choices: [
      {
        label: "싸게 나온 매물이라 운이 좋다고 본다",
        status: "risk",
      },
      {
        label: "반지하니까 원래 싼 거라고 본다",
        status: "risk",
      },
      {
        label: "왜 싼지 묻고, 침수 이력이 있는 지역인지 확인한다",
        status: "checked",
      },
      {
        label: "가격이 싸니 하자가 있어도 감수한다고 본다",
        status: "risk",
      },
    ],
    warning: {
      title:
        "이유 있는 가격 — 반지하 할인폭보다 더 싸다면 다른 이유가 있습니다.",
      text: "반지하라는 이유만으로 붙는 할인폭은 대체로 정해져 있습니다. 그보다 더 싸다면 다른 이유가 있습니다. 침수 이력은 한 번 겪은 집이 다시 겪는 경우가 많습니다.",
      advice: "왜 싼지 묻고, 침수 이력이 있는 지역인지 확인한다",
    },
  },
  goshiwon: {
    text: '계약 주체가 "○○하우스 운영팀"이다. 집주인 이름이 어디에도 없다.',
    choices: [
      {
        label: "업체가 관리하니 더 안전하다고 본다",
        status: "risk",
      },
      {
        label: "고시원은 원래 그렇다고 보고 넘어간다",
        status: "risk",
      },
      {
        label: "등기부로 건물 소유자를 확인하고, 업체와 소유자의 관계를 묻는다",
        status: "checked",
      },
      {
        label: "보증금이 적으니 따질 것 없다고 본다",
        status: "risk",
      },
    ],
    warning: {
      title:
        "계약 상대 — 계약서에 집주인 이름이 없다면 상대는 건물주가 아닙니다.",
      text: "운영업체가 건물을 빌려 다시 빌려주는 구조라면, 내 계약 상대는 건물주가 아닙니다. 건물주가 원계약을 해지하면 나는 나가야 합니다. 금액이 작아도 절차는 같습니다.",
      advice: "등기부로 건물 소유자를 확인하고, 업체와 소유자의 관계를 묻는다",
    },
  },
};
export const contractScripts: Record<HouseId, HousingScript> = {
  oneroom: {
    text: "이 건물에는 방이 12개다. 나는 그중 하나를 계약한다.",
    choices: [
      {
        label: "내 방만 계약하는 거니까 상관없다",
        status: "risk",
      },
      {
        label: "앞선 세입자들의 보증금 합계를 중개사에게 물어본다",
        status: "risk",
      },
      {
        label:
          "확정일자 부여현황 열람 동의서를 요구해 선순위 보증금 총액을 확인한다",
        status: "checked",
      },
      {
        label: "등기부에 근저당이 없으니 괜찮다고 본다",
        status: "risk",
      },
    ],
    warning: {
      title:
        "선순위 보증금 — 앞선 세입자들의 보증금 합계가 건물 값을 넘으면 내 순서는 오지 않습니다.",
      text: "다가구는 건물 전체가 등기 하나입니다. 나보다 먼저 들어온 11명의 보증금이 전부 내 앞입니다. 그 합계가 이미 건물 가치를 넘으면, 경매가 되어도 내 순서는 오지 않습니다. 근저당이 없어도 마찬가지이고, 구두로 들은 숫자는 낮춰 불러도 확인할 방법이 없습니다.",
      advice:
        "확정일자 부여현황을 열람해 총액을 확인하세요. 임대인이 협조하지 않으면 그게 계약을 접을 이유입니다.",
    },
  },
  officetel: {
    text: '중개사가 말한다. "여기 업무용이라 전입신고는 좀… 대신 월세 5만 원 깎아드릴게요."',
    choices: [
      {
        label: "5만 원이면 1년에 60만 원이니 좋다",
        status: "risk",
      },
      {
        label: "전입신고는 나중에 몰래 하면 된다고 본다",
        status: "risk",
      },
      {
        label:
          "건축물대장 용도를 확인하고, 전입신고가 되는 집이 아니면 계약하지 않는다",
        status: "checked",
      },
      {
        label: "계약서에 주거용이라고 적어달라고만 한다",
        status: "risk",
      },
    ],
    warning: {
      title:
        "전입신고 포기 — 전입신고를 못 하면 보증금 전액을 담보 없이 빌려주는 것과 같습니다.",
      text: "전입신고를 못 하면 주택임대차보호법의 보호를 전혀 받지 못합니다. 월세 5만 원과 바꿀 수 있는 게 아닙니다. 몰래 하려 해도 임대인이 협조하지 않으면 막히고, 계약서에 용도를 적는다고 건축물대장이 바뀌지도 않습니다.",
      advice: "임대인이 전입신고를 꺼린다는 건 그 집에 문제가 있다는 뜻입니다.",
    },
  },
  villa: {
    text: '"이 집 매매가요? 신축이라 아직 거래가 없어서… 분양가는 1억 6천이에요." 전세는 1억 5천이다.',
    choices: [
      {
        label: "새 집이니 그 정도 하겠지",
        status: "risk",
      },
      {
        label: "같은 단지 다른 호실 분양가와 비교해본다",
        status: "risk",
      },
      {
        label: "인근 5~10년차 빌라의 실거래가를 조회해 전세가율을 계산한다",
        status: "checked",
      },
      {
        label: "중개사에게 시세가 맞는지 한 번 더 물어본다",
        status: "risk",
      },
    ],
    warning: {
      title:
        "깡통전세 — 전세가율이 90%를 넘으면 집값이 조금만 떨어져도 회수가 불가능합니다.",
      text: '신축 빌라는 거래 이력이 없어 "매매가"가 분양사가 정한 숫자일 뿐입니다. 다른 호실 분양가와 비교하는 것은 부풀려진 값끼리 맞춰보는 셈이고, 같은 중개사에게 다시 묻는 것도 확인이 아닙니다.',
      advice:
        "실제로 거래된 기록이라는 독립된 근거로 교차검증하세요. 전세가율 80%를 상한으로 잡습니다.",
    },
  },
  rooftop: {
    text: '계약서에 주소가 "○○동 123-4"까지만 적혀 있다. 호수가 없다.',
    choices: [
      {
        label: "원래 옥탑은 그런 거라니 넘어간다",
        status: "risk",
      },
      {
        label: '계약서에 "옥탑"이라고만 덧붙여 적는다',
        status: "risk",
      },
      {
        label: "건축물대장을 발급받아 등재 여부와 위반건축물 표기를 확인한다",
        status: "checked",
      },
      {
        label: "전입신고는 살면서 주민센터에서 해결하면 된다고 본다",
        status: "risk",
      },
    ],
    warning: {
      title:
        "무허가 증축 — 대장에 없는 집은 대출·보증보험·전입신고가 전부 막힙니다.",
      text: '상당수 옥탑방은 옥상 창고나 물탱크실을 개조한 무허가 증축물입니다. 대장에 없거나 "위반건축물"이면 전세대출·보증보험·주거급여가 전부 막힙니다. 계약서에 뭐라고 적든 대장이 바뀌지 않고, 대장에 없는 주소로는 전입신고 자체가 되지 않습니다. 임대인에게 이행강제금이 부과되면 계약 기간 중에도 철거·퇴거 통보를 받을 수 있습니다.',
      advice: "계약 전에 건축물대장과 전입신고 가능 여부를 확인하세요.",
    },
  },
  basement: {
    text: "계약서를 쓰려는데, 임장 때 본 벽 하단의 얼룩선이 떠오른다.",
    choices: [
      {
        label: "그냥 넘어간다",
        status: "risk",
      },
      {
        label: "중개사에게 물어보고 괜찮다는 답을 듣는다",
        status: "risk",
      },
      {
        label: "침수 이력을 중개대상물 확인·설명서에 기재해달라고 요구한다",
        status: "checked",
      },
      {
        label: "입주하면 제습기를 들이면 된다고 본다",
        status: "risk",
      },
    ],
    warning: {
      title:
        "하자 은닉 — 새 벽지 아래의 곰팡이는 퇴거할 때 내 책임으로 돌아옵니다.",
      text: '곰팡이와 누수를 새 벽지·장판으로 덮고 임대하는 경우가 많습니다. 퇴거할 때는 그 곰팡이를 "관리 부실"이라며 보증금에서 공제합니다. 구두로 들은 답은 나중에 다툴 근거가 되지 않고, 제습기로 해결되는 것은 습기지 침수가 아닙니다.',
      advice:
        "확인·설명서에 기재하게 하면 중개사의 설명 의무를 다툴 근거가 남습니다.",
    },
  },
  goshiwon: {
    text: '내민 종이의 제목이 "시설이용계약서"다. 집주인 이름은 어디에도 없다.',
    choices: [
      {
        label: "그냥 서명한다",
        status: "risk",
      },
      {
        label: "업체가 관리하니 오히려 안전하다고 본다",
        status: "risk",
      },
      {
        label:
          "집주인의 서면 전대 동의서와 원계약 잔여 기간, 환불 규정을 문서로 요구한다",
        status: "checked",
      },
      {
        label: "보증금이 적으니 잃어도 감수하기로 한다",
        status: "risk",
      },
    ],
    warning: {
      title:
        "무단 전대차 — 집주인의 동의가 없으면 집주인이 계약을 해지할 때 나는 나가야 합니다.",
      text: "운영업체가 건물을 빌려 다시 빌려주는 구조입니다. 집주인의 동의가 없으면 집주인이 계약을 해지할 때 나는 명도 대상이 됩니다. 원계약이 내 계약보다 먼저 끝나도 그 시점에 나가야 하고, 업체가 문을 닫으면 보증금을 받을 곳이 사라집니다.",
      advice:
        "서면 전대 동의서를 요구하고, 원계약 기간과 환불 규정을 함께 문서로 받으세요.",
    },
  },
};
export const warnings: Record<string, Feedback> = {
  bait: {
    title:
      "미끼매물 — 보러 온 방 대신 다른 방을 권한다면, 그건 새로운 매물입니다.",
    text: "좋은 조건의 매물로 방문을 유도한 뒤, 현장에서 다른 방을 권하는 수법이 있습니다. “여기까지 왔는데”라는 마음에 따라가면 달라진 조건을 놓치기 쉽습니다. 단, 실제 계약으로 매물이 소진될 수도 있으므로, 다른 방을 권했다는 사실만으로 허위매물이라고 단정하지는 않습니다.",
    advice:
      "다른 방은 새로운 매물입니다. “비슷하다”는 말만 믿지 말고, 주소와 가격·관리비·면적을 다시 확인하세요.",
  },
  deposit: {
    title:
      "이중임대 / 선입금 요구 — 상대가 누구인지 모른 채 보낸 돈은 되돌릴 방법이 없습니다.",
    text: '같은 방을 여러 명과 계약하고 보증금만 챙겨 잠적하는 수법입니다. "해외 체류 중이라 못 만난다"며 계좌부터 요구하는 경우도 같은 구조입니다.',
    advice:
      "등기부상 소유자 명의 계좌로만 송금하세요. 예금주가 다르면 그 자리에서 멈춥니다.",
  },
  proxy: {
    title:
      "무권대리 — 대리권 없는 사람과 맺은 계약은 소유자가 인정하지 않으면 효력이 없습니다.",
    text: "대리권 없는 사람과 맺은 계약은, 소유자가 인정하지 않으면 소유자에게 효력이 없습니다.\n돈은 대리인에게 갔는데 계약은 남지 않고, 돌려받으려면 그 사람을 상대로 따로 다퉈야 합니다.\n가족 관계는 대리권과 별개이고, 중개사에게는 보증할 권한이 없으며, 각서는 각서를 쓴 사람만 묶습니다.",
    advice:
      "위임장과 인감증명서로 대리권을 확인하세요. 위임장에 찍힌 인감이 인감증명서의 것과 같은지, 위임 범위에 금전 수령이 들어 있는지 봅니다.\n송금은 등기부상 소유자 명의 계좌로만 합니다.",
  },
  oral: {
    title: "구두 약속 — 특약이 없으면 들었던 모든 약속이 말로만 남습니다.",
    text: '계약서에 적히지 않은 약속은 나중에 다툴 근거가 되지 않습니다. "수리해 드릴게요", "그건 걱정 마세요" 같은 말은 계약서에 없으면 없던 일이 됩니다. 특약은 임대인을 의심해서 넣는 것이 아니라, 문제가 생겼을 때 서로 무엇을 약속했는지 확인하기 위한 것입니다.',
    advice:
      '넣고 싶은 조항은 그 자리에서 요구하세요. 중개사가 "보통 안 넣는다"고 해도 요구하면 대부분 수용됩니다. 거절당한다면 그 거절 자체가 정보입니다.',
  },
  registration: {
    title:
      "전입신고 특약 누락 — 오피스텔에서 이 특약이 없으면 전입신고를 막아도 다툴 근거가 없습니다.",
    text: "오피스텔은 업무시설로 지어진 건물이라 임대인이 전입신고를 꺼리는 일이 있습니다. 전입신고를 못 하면 주택임대차보호법의 보호를 받지 못하고, 보증금 전액을 담보 없이 맡기는 것과 같아집니다. 특약이 없으면 임대인이 협조하지 않아도 계약을 해제할 방법이 없습니다.",
    advice:
      "전입신고와 확정일자 협조, 그리고 위반 시 계약 해제와 보증금 반환 조항을 함께 넣으세요.",
  },
  insurance: {
    title:
      "보증보험 안전장치 없음 — 가입이 거절되면 계약에 묶인 채 빠져나올 수 없습니다.",
    text: "반환보증은 집의 상태에 따라 가입이 거절될 수 있습니다. 그런데 계약은 이미 체결된 뒤라, 이 특약이 없으면 위험하다고 판정된 집에 그대로 들어가야 합니다. 보증금은 대출까지 끼고 마련한 돈입니다.",
    advice:
      "가입이 거절될 경우 계약을 해제하고 보증금을 반환한다는 조항을 넣으세요.",
  },
  tax: {
    title: "국세 체납 — 임대인의 밀린 세금은 내 확정일자보다 먼저 배당됩니다.",
    text: "임대인이 세금을 안 냈으면, 그 체납액이 내 확정일자보다 먼저 배당됩니다. 경매가 돼도 내 순서가 오지 않을 수 있습니다.",
    advice:
      "계약 전후로 미납 국세·지방세 열람을 요구하세요. 임차인에게 열람권이 있습니다.",
  },
  account: {
    title:
      "계좌 변경 사칭 — 문자로 온 계좌 변경 요구를 문자로 확인하는 것은 확인이 아닙니다.",
    text: "문자나 메신저로 오는 계좌 변경 요구는 전형적인 수법입니다. 같은 통로로 재확인하는 것은 확인이 아닙니다.",
    advice:
      "반드시 통화로 본인을 확인하고, 계약서에 적힌 명의 계좌로만 보냅니다.",
  },
  timing: {
    title:
      "잔금일의 빈틈 — 등기부는 잔금일에 한 번 더 봐야 하고, 대항력은 전입신고 다음 날 0시부터 생깁니다.",
    text: "계약일과 잔금일 사이에 임대인이 그 집을 담보로 대출을 받는 경우가 있습니다. 등기 순서상 그 근저당이 나보다 앞서기 때문에, 돈이 나간 뒤에 발견하면 되돌릴 방법이 거의 없습니다. 전입신고도 마찬가지입니다. 돈은 나갔는데 권리는 아직 없는 구간이 생기고, 주말과 출근이 겹치면 며칠이 빕니다. 온라인 신고는 담당자 승인 전까지 신고일로 인정되지 않고, 대리 신고는 본인 확인 문제로 지연됩니다.",
    advice:
      "송금 직전에 등기부를 한 번 더 떼고, 잔금을 보낸 그날 안에 전입신고와 확정일자를 마치세요. 확정일자는 주민센터에서 같이 받을 수 있습니다.",
  },
  settlement: {
    title:
      "기준 없는 정산 — 입주 시점 수치와 사진이 없으면 남의 사용분도 내 몫이 됩니다.",
    text: "입주 시점 수치와 사진이 없으면 이전 세입자의 사용분이나 원래 있던 하자를 내 책임으로 넘겨도 다툴 근거가 없습니다. 도어락 번호는 이전 세입자와 그 지인이 알고 있습니다.",
    advice: "",
  },
  guarantee: {
    title: "보증 가입 기한 — 반환보증은 시기를 놓치면 아예 가입할 수 없습니다.",
    text: "반환보증은 신청 시기가 지나면 아예 가입이 막힙니다. 대출 승인은 안전 인증이 아닙니다. 은행은 집이 아니라 보증기관의 보증을 보고 빌려줍니다.",
    advice: "",
  },
  defect: {
    title:
      "시점을 놓친 하자 — 입주 직후에 알리지 않은 하자는 원인이 내 쪽으로 넘어갑니다.",
    text: "입주 직후에 알리지 않으면 원인이 내 쪽으로 넘어가고, 퇴거할 때 보증금에서 공제됩니다. 동의 없이 먼저 고친 수리비는 받기 어렵습니다. 구두는 기록이 남지 않습니다.",
    advice: "",
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
const result = (id: string, label: string, title: string, text: string): Choice => ({
  id,
  label,
  status: "checked",
  resultCard: true,
  feedback: { title, text, advice: "" },
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
const beat = (
  text: string,
  speaker?: string,
  background?: Background,
): StoryBeat => ({ text, speaker, background });
const choiceStep = (
  id: string,
  stage: Stage,
  title: string,
  beats: StoryBeat[],
  choices: Choice[],
  background: Background = stage <= 4 ? "office" : "room",
): Step => ({
  id,
  stage,
  kind: "choice",
  eyebrow: "",
  title,
  beats,
  choices,
  background,
});
export const has = (g: GameState, step: string, item: string) =>
  g.answers[step]?.includes(item) ?? false;
export const selectedHome = (g: GameState) =>
  homes.find((h) => h.id === g.house) ?? homes[0];
export const makeNewGame = (): GameState => ({
  version: 3,
  page: "home",
  prologue: 0,
  contract: "monthly",
  house: "oneroom",
  cursor: "listing",
  answers: {},
  drafts: {},
  attempts: {},
});

export function clauseItems(contract: Contract): CheckItem[] {
  return [
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
export const movingItems: CheckItem[] = [
  ["lock", "현관 도어락 비밀번호 바꾸기"],
  ["meter", "계량기 수치 촬영 (수도·전기·가스, 날짜 남게)"],
  ["photos", "기존 하자 촬영 (벽지·바닥·창틀·욕실)"],
  ["appliances", "보일러·가전 작동 확인"],
  ["contact", "임대인 연락처 받아두기"],
  ["utilities", "인터넷·전기·가스 명의 변경"],
].map(([id, title]) =>
  check(
    id,
    title,
    title,
    title + " — 확인했다.",
    title + " — 아직 확인하지 않았다.",
  ),
);

function housingChoices(script: HousingScript, ids: string[]): Choice[] {
  return script.choices.map((choice, index) => ({
    id: ids[index],
    ...choice,
    feedback:
      choice.status === "risk"
        ? script.warning
        : {
            title: "확인",
            text: choice.label + ".",
            advice: script.warning.advice,
          },
  }));
}
function houseContract(g: GameState): Step {
  const script = contractScripts[g.house];
  let beats = [beat(script.text)];
  let choices = housingChoices(script, [
    "ignore",
    "trust",
    "verify-0",
    "later",
  ]);
  if (g.house === "officetel") {
    beats = [
      beat("중개사가 말한다."),
      beat(
        g.contract === "monthly"
          ? "여기 업무용이라 전입신고는 좀… 대신 월세 5만 원 깎아드릴게요."
          : "여기 업무용이라 전입신고는 좀… 대신 보증금을 낮춰드릴게요.",
        "중개사",
        "agent",
      ),
    ];
    if (g.contract === "jeonse")
      choices = choices.map((choice, index) =>
        index === 0 ? { ...choice, label: "보증금을 낮춰준다니 좋다" } : choice,
      );
  }
  if (g.house === "villa")
    beats =
      g.contract === "jeonse"
        ? [
            beat(
              "이 집 매매가요? 신축이라 아직 거래가 없어서… 분양가는 1억 6천이에요.",
              "중개사",
              "agent",
            ),
            beat("전세는 1억 5천이다."),
          ]
        : [
            beat(
              "신축이라 이 집의 거래 기록이 없다. 중개사는 분양가를 시세처럼 말한다.",
            ),
          ];
  if (g.house === "villa" && g.contract === "monthly")
    choices = housingChoices(explorationScripts.villa, [
      "ignore",
      "trust",
      "verify-0",
      "later",
    ]);
  if (g.house === "basement" && !has(g, "inspection", "flood-line"))
    beats = [
      beat(
        "계약서를 쓰려는데, 임장 때 벽 하단의 얼룩선을 확인하지 못한 것이 마음에 걸린다.",
      ),
    ];
  return {
    ...choiceStep("house-contract", 4, "계약서 확인", beats, choices, "lease"),
    document: "lease",
    explanation:
      g.house === "villa" && g.contract === "monthly"
        ? explorationScripts.villa.warning
        : script.warning,
  };
}

export function getSteps(g: GameState): Step[] {
  const home = selectedHome(g);
  const search = explorationScripts[g.house];
  const steps: Step[] = [
    {
      ...choiceStep(
        "listing",
        1,
        "광고와 다른 방",
        [
          beat(
            "앱에 뜬 방. 주변 지하철 역에서 도보 10분. " +
              priceLabel(home, g.contract) +
              ". 사진 속 방은 깨끗하다.",
            undefined,
            "app",
          ),
          beat("매물에 문의하자 답장이 온다.", undefined, "message"),
          beat(
            "오늘 두 팀 더 보러 오세요. 마음 있으시면 빨리 오셔야 해요.",
            "중개사 · 문자",
            "message",
          ),
          beat(
            "방문 약속을 잡고 부동산에 도착했다.",
            undefined,
            "office",
          ),
          beat("그런데 안내자가 다른 방 사진을 보여준다.", undefined, "agent"),
          beat(
            "보셨던 방은 방금 나갔어요. 대신 비슷한 방이 하나 있어요. 오신 김에 보고 가시죠.",
            "중개사",
            "agent",
          ),
        ],
        [
          bad(
            "follow",
            "“비슷하다”는 말만 듣고 따라나선다. 새 방의 가격과 위치는 아직 확인하지 않았다.",
            "bait",
          ),
          good(
            "compare",
            "광고와 다른 방이라면, 무엇이 달라지는지 먼저 확인한다.",
            warnings.bait.advice,
          ),
        ],
      ),
      explanation: warnings.bait,
    },
    {
      ...choiceStep(
        "house-search",
        1,
        home.name + " 매물 탐색",
        [beat(search.text)],
        housingChoices(search, ["skip", "trust", "ask", "later"]),
        g.house,
      ),
      explanation: search.warning,
    },
    {
      id: "inspection",
      stage: 2,
      kind: "inspection",
      eyebrow: "",
      title: "집 보기",
      background: "room",
      beats: [
        beat("방에 도착했다. 중개사가 문을 열어준다.", undefined, "room-entry"),
        beat("편하게 보세요.", "중개사", "room-entry"),
        beat("방 안을 둘러본다. 어디부터 확인할까?", undefined, "room"),
      ],
      items: inspectionItems(g.house),
      requireAll: true,
      notice: {
        title: "임장 팁",
        text: "같은 집을 시간대를 바꿔 두 번 본다. 낮에는 채광과 곰팡이, 밤에는 소음과 귀갓길. 비 온 다음 날 가면 누수와 습기를 가장 정확히 알 수 있다.",
        advice: "",
      },
    },
    {
      ...choiceStep(
        "deposit",
        3,
        "가계약금 송금",
        [
          beat(
            g.house === "goshiwon"
              ? "지금 보증금 10만 원만 넣어두시면 다른 사람한테 안 넘어가요. 계좌 보내드릴게요."
              : "지금 100만 원만 넣어두시면 다른 사람한테 안 넘어가요. 계좌 보내드릴게요.",
            "중개사 · 문자",
            g.house === "goshiwon" ? "agent" : "deposit-message",
          ),
          beat(
            "문자로 계좌번호가 왔다. 예금주: 김○○",
            undefined,
            g.house === "goshiwon" ? "agent" : "deposit-message",
          ),
        ],
        [
          bad(
            "immediate",
            "계좌를 받았으니 바로 송금한다",
            "deposit",
            "계좌번호를 받았다는 것은 상대가 누구인지와 아무 관련이 없습니다.",
          ),
          bad(
            "agent",
            "중개사가 중간에 있으니 중개사 말만 믿고 송금한다",
            "deposit",
            "중개사에게는 보증할 권한이 없습니다. 중개사도 상대의 말만 듣고 전달하는 경우가 있습니다.",
          ),
          bad(
            "paper",
            "계약서를 먼저 쓰자고 하고, 그 자리에서 송금한다",
            "deposit",
            "계약서를 먼저 쓰는 것 자체는 좋습니다. 다만 상대가 소유자인지 모르는 상태에서는 그 계약서도 힘이 없습니다.",
          ),
          good(
            "owner",
            "등기부로 소유자를 확인하고, 그 명의 계좌로만 송금한다",
            "등기부를 열었다.",
          ),
        ],
      ),
      document: "message",
      explanation: warnings.deposit,
    },
  ];
  if (has(g, "deposit", "owner")) {
    if (["oneroom", "rooftop", "basement"].includes(g.house)) {
      steps.push({
        ...choiceStep(
          "proxy",
          3,
          "예금주가 다르다",
          [
            beat(
              "등기부상 소유자는 박○○. 그런데 문자로 온 계좌 예금주는 김○○이다.",
              undefined,
              "owner-account",
            ),
            beat("중개사에게 물었다.", undefined, "owner-account"),
            beat(
              "아드님이세요. 아버지가 편찮으셔서 관리를 맡고 계세요.",
              "중개사",
              "agent",
            ),
          ],
          [
            bad("family", "가족이라니 그럴 수 있다고 넘어간다", "proxy"),
            bad("agent", "중개사가 보증한다고 하니 그대로 보낸다", "proxy"),
            result(
              "authority",
              "위임장과 인감증명서를 확인하고, 소유자 명의 계좌로만 보낸다",
              "대리권 확인 완료",
              "위임 범위에 계약 체결과 금전 수령이 모두 들어 있는지 확인했다. 계약만 위임하고 수령은 위임하지 않은 경우가 있다.\n인감증명서 발급일이 최근인지 확인했다. 오래된 것은 이미 철회됐을 수 있다.\n송금은 소유자 명의 계좌로 한다. 대리인 계좌로 보내면 소유자에게 돈이 갔다는 증명이 어려워진다.",
            ),
            bad("promise", "아들 명의 계좌로 보내되 각서를 받아둔다", "proxy"),
          ],
        ),
        document: "registry",
        explanation: warnings.proxy,
      });
    } else {
      const beats =
        g.house === "officetel"
          ? [
              beat(
                "갑구에 신탁 표기가 있다. 소유자는 개인이 아니라 신탁회사다.",
              ),
              beat(
                "임대차 계약을 맺을 권한은 신탁회사에 있다. 건물을 관리하는 사람과 계약해도, 신탁회사의 동의가 없으면 보호받지 못한다. 신탁회사가 집을 처분하면 그냥 나가야 한다.",
              ),
              beat("신탁회사의 임대차 동의서를 확인해야 한다."),
            ]
          : g.house === "goshiwon"
            ? [
                beat(
                  "등기부상 소유자는 개인인데, 입금하라는 계좌는 법인 명의다.",
                ),
                beat(
                  "이 건물은 운영업체가 통째로 빌려 방마다 다시 빌려주는 구조다. 내 계약 상대는 건물주가 아니라 그 업체다. 건물주가 원계약을 해지하면 나는 나가야 하고, 업체가 문을 닫으면 보증금을 받을 곳이 없다.",
                ),
                beat("건물주의 서면 전대 동의서가 있어야 한다."),
              ]
            : g.contract === "jeonse"
              ? [
                  beat("중개사가 덧붙인다."),
                  beat(
                    "계약하시면 곧 주인이 바뀌실 거예요, 신축이라.",
                    "중개사",
                    "agent",
                  ),
                  beat(
                    "지은 업자가 분양이 안 되자 세입자를 먼저 받고, 같은 날 집을 다른 사람에게 넘기는 구조일 수 있다. 새 주인에게 돈도 신용도 없으면 만기에 보증금을 돌려줄 사람이 사라진다.",
                  ),
                  beat(
                    "잔금 전에 소유자가 바뀌는 계약은 피한다. 바뀔 예정이라면 새 소유자의 자력을 확인해야 한다.",
                  ),
                ]
              : [
                  beat(
                    "등기부상 소유자와 계약자, 예금주가 일치한다. 동·호수와 권리관계도 함께 확인한다.",
                  ),
                ];
      steps.push({
        id: "authority-info",
        stage: 3,
        kind: "info",
        eyebrow: "",
        title: "등기부 확인",
        background: "lease",
        beats,
        document: "registry",
      });
    }
  }
  steps.push(
    houseContract(g),
    {
      id: "clauses",
      stage: 4,
      kind: "checklist",
      eyebrow: "",
      title: "특약사항",
      background: "lease",
      beats: [
        beat("부동산 사무실. A4 두 장짜리 계약서가 놓여 있다."),
        beat("특약사항 칸은 비어 있다."),
        beat("중개사가 묻는다."),
        beat("넣으실 거 있으세요?", "중개사"),
      ],
      items: clauseItems(g.contract),
      document: "lease",
      notice: {
        title: "특약사항",
        text: '중개사가 "보통 안 넣는다"고 해도 요구하면 대부분 수용된다. 거절당한다면 그 자체가 정보다.',
        advice: "",
      },
    },
    {
      id: "signing",
      stage: 4,
      kind: "checklist",
      eyebrow: "",
      title: "서명 전 확인",
      background: "signing",
      beats: [beat("펜을 들었다. 서명하기 전에 확인할 수 있는 것이 있다.")],
      items: signingItems,
      document: "lease",
    },
    {
      ...choiceStep(
        "account",
        5,
        "계좌가 바뀌었다",
        [
          beat("잔금을 보내려는 참에 문자가 온다.", undefined, "moving"),
          beat(
            "사정이 있어서 계좌가 바뀌었어요. 아래로 보내주세요.",
            "중개사 · 문자",
            "account-change",
          ),
          beat("예금주 이름이 계약서와 다르다."),
        ],
        [
          bad("send", "중개사가 보낸 문자니까 그대로 보낸다", "account"),
          bad("small", "소액을 먼저 보내 확인해본다", "account"),
          good(
            "call",
            "임대인에게 직접 전화해 확인하고, 계약서에 적힌 명의 계좌로만 보낸다",
            warnings.account.advice,
          ),
          bad("text", "문자로 다시 한 번 계좌를 확인받고 보낸다", "account"),
        ],
        "account-change",
      ),
      explanation: warnings.account,
    },
    {
      ...choiceStep(
        "timing",
        5,
        "잔금일 하루",
        [
          beat(
            "금요일, 잔금일이다. 이삿짐 트럭은 오후 2시에 왔고 짐 정리에 하루가 갈 것 같다.\n주민센터는 6시에 닫는다. 내일은 토요일, 월요일은 첫 출근이라 오전부터 일정이 잡혀 있다.",
            undefined,
            "moving",
          ),
          beat("현재 시각 오후 4시 50분."),
          beat("서류는 계약할 때 다 봤으니 잔금만 보내시면 된다.", "중개사"),
        ],
        [
          bad(
            "later",
            "잔금부터 보내고 짐을 정리한 뒤, 전입신고는 다음 주에 한다",
            "timing",
          ),
          bad(
            "online",
            "잔금을 보내고 정부24로 전입신고를 신청해둔다",
            "timing",
          ),
          good(
            "verify",
            "등기부를 다시 떼어 새로 잡힌 권리가 없는지 확인한 뒤 잔금을 보내고, 바로 주민센터로 가서 전입신고와 확정일자를 받는다",
            warnings.timing.advice,
          ),
          bad(
            "delegate",
            "잔금을 보내고 중개사에게 전입신고를 대신 부탁한다",
            "timing",
          ),
        ],
        "balance-day",
      ),
      explanation: warnings.timing,
    },
    {
      ...choiceStep(
        "settlement",
        5,
        "마지막 정리",
        [
          beat(
            "이삿짐 정리가 끝났다. 현관 도어락은 이전 세입자가 쓰던 번호 그대로다.",
          ),
          beat("관리비 얘기가 나오는데 계량기를 본 적이 없다."),
        ],
        [
          bad("ignore", "별일 없을 테니 그냥 둔다", "settlement"),
          good(
            "record",
            "도어락 번호를 바꾸고, 계량기 수치와 집 상태를 날짜가 남게 촬영해둔다",
            "도어락 번호를 바꾸고, 계량기 수치와 집 상태를 날짜가 남게 촬영했다.",
          ),
          bad("bill", "관리비는 첫 고지서가 나오면 그때 따진다", "settlement"),
          bad(
            "lock",
            "도어락만 바꾸고 계량기는 임대인 말을 믿는다",
            "settlement",
          ),
        ],
        "settlement",
      ),
      explanation: warnings.settlement,
    },
    g.contract === "jeonse"
      ? {
          ...choiceStep(
            "insurance",
            5,
            "보증 가입 기한",
            [
              beat(
                has(g, "timing", "verify")
                  ? "전입신고와 확정일자를 마쳤고 대출도 실행됐다."
                  : "대출은 실행됐다. 전입신고와 확정일자 처리 여부는 아직 확인해야 한다.",
              ),
              beat("보증보험은 나중에 해도 된다는 말을 들었다."),
            ],
            [
              bad("loan", "대출이 나왔으니 이미 안전하다고 본다", "guarantee"),
              bad("later", "계약 기간 중에 여유 있을 때 신청한다", "guarantee"),
              good(
                "apply",
                "지금 바로 신청하고, 거절되면 그 사유를 확인한다",
                "보증보험 가입을 신청했다. 거절되면 그 사유를 확인한다.",
              ),
              bad(
                "landlord",
                "임대인이 알아서 가입해줄 것이라 보고 기다린다",
                "guarantee",
              ),
            ],
            "moving",
          ),
          explanation: warnings.guarantee,
        }
      : {
          ...choiceStep(
            "defect",
            5,
            "입주 직후의 하자",
            [
              beat(
                "짐을 들여놓다 보니 보일러가 돌지 않는다. 도배를 새로 한 자리도 들떠 있다.",
              ),
              beat("살다 보면 그럴 수 있다.", "임대인"),
            ],
            [
              bad("later", "일단 지내보고 나중에 말한다", "defect"),
              result(
                "record",
                "오늘 날짜가 남게 사진을 찍고 문자로 통보한 뒤 수리를 요구한다",
                has(g, "clauses", "repair")
                  ? "하자 수리 해결"
                  : "시설물 수리 특약이 없다면",
                has(g, "clauses", "repair")
                  ? "계약서의 시설물 수리 특약과 사진을 제시했다. 수리 일정과 비용 부담을 서면으로 확인했다."
                  : "그때 시설물 수리 특약을 넣었다면. 지금은 하자 사진과 문자로 발견 시점을 남기고, 수리 책임과 비용을 협의한다.",
              ),
              bad("self", "내 돈으로 고치고 나중에 청구한다", "defect"),
              bad("phone", "전화로만 이야기하고 넘어간다", "defect"),
            ],
            "defect",
          ),
          explanation: warnings.defect,
        },
    {
      id: "moving",
      stage: 5,
      kind: "checklist",
      eyebrow: "",
      title: "입주 당일 체크리스트",
      background: "moving",
      beats: [
        beat(
          "짐은 다 들어왔다. 오늘 안에 해두면 나중에 덜 골치 아픈 것들이 있다.",
        ),
      ],
      items: movingItems,
      requireAll: true,
    },
  );
  return steps;
}
export function isRiskCheckpoint(note: Checkpoint): boolean {
  return note.status === "risk" && note.countRisk !== false;
}

export function getCheckpoints(g: GameState): Checkpoint[] {
  return getSteps(g).flatMap<Checkpoint>((step) => {
    const selected = g.answers[step.id];
    if (step.choices) {
      const attempted = [...new Set([...(g.attempts[step.id] ?? []), ...(selected ?? [])])];
      return attempted.flatMap<Checkpoint>((id) => {
        const choice = step.choices?.find((item) => item.id === id);
        if (!choice) return [];
        return [{
          id: choice.status === "risk" ? `${step.id}:attempt:${id}` : step.id,
          stepId: step.id,
          stage: step.stage,
          status: choice.status,
          title: choice.status === "risk" || choice.resultCard ? choice.feedback.title : step.title,
          choice: choice.label,
          consequence: choice.status === "checked" && !choice.resultCard
            ? (step.explanation?.text ?? choice.feedback.text) : choice.feedback.text,
          advice: choice.resultCard ? choice.feedback.advice : (step.explanation?.advice || choice.feedback.advice),
          explanation: choice.resultCard ? step.explanation : undefined,
          showFeedback: choice.status === "risk" && !!selected?.includes(id),
          category: "decision",
        }];
      });
    }
    if (!selected) return [];
    if (step.kind === "info") return [{
      id: step.id, stepId: step.id, stage: step.stage, status: "checked",
      title: step.title, choice: "서류를 확인했다",
      consequence: step.beats.map((beat) => beat.text).join("\n"),
      advice: "", category: "check",
    }];
    const itemCheckpoint = (item: CheckItem, checked: boolean): Checkpoint => {
      const special = step.id === "signing" && item.id === "tax" && g.contract === "jeonse"
        ? warnings.tax
        : step.id === "clauses" && item.id === "registration" && g.house === "officetel"
          ? warnings.registration
          : step.id === "clauses" && item.id === "insurance" ? warnings.insurance : undefined;
      const warning = !checked && (step.id !== "signing" || !!special);
      return {
        id: step.id + ":" + item.id, stepId: step.id, stage: step.stage,
        status: checked ? "checked" : "risk",
        title: !checked && special ? special.title : item.title,
        choice: (checked ? "확인했다 · " : "확인하지 않고 넘어갔다 · ") + item.title,
        consequence: checked ? item.signal : (special?.text ?? item.consequence),
        advice: special?.advice ?? item.advice,
        showFeedback: warning,
        countRisk: warning,
        category: step.id === "inspection" ? "inspection" : step.id === "clauses" ? "clause" : "check",
      };
    };
    const notes: Checkpoint[] = (step.items ?? []).flatMap((item) => {
      const checked = selected.includes(item.id);
      const current = itemCheckpoint(item, checked);
      if (!checked || !g.attempts[step.id]?.includes(item.id)) return [current];
      return [{
        ...itemCheckpoint(item, false),
        id: `${step.id}:attempt:${item.id}`,
        choice: "처음에는 확인하지 않았다 · " + item.title,
        showFeedback: false,
      }, current];
    });
    const addNotice = (id: string, feedback: Feedback, warning = false, showFeedback = true) => {
      notes.push({
        id: step.id + ":" + id, stepId: step.id, stage: step.stage,
        status: warning ? "risk" : "checked", title: feedback.title,
        choice: id === "oral" ? "아무것도 넣지 않는다" : "이 장면에서 확인한 안내",
        consequence: feedback.text, advice: feedback.advice,
        category: "notice", showFeedback, countRisk: false,
      });
    };
    if (step.id === "clauses" && selected.length === 0) addNotice("oral", warnings.oral, true);
    if (step.notice) addNotice("notice", step.notice);
    return notes;
  });
}

export function getEnding(g: GameState): Ending {
  const risks = getCheckpoints(g).filter(isRiskCheckpoint);
  return {
    id: "complete",
    symbol: "key",
    title: "나의 첫 임대계약",
    subtitle: "엔딩",
    text: "당신은 이번 계약에서 위험한 선택 " + risks.length + "번을 했습니다.",
    reasons: [String(risks.length)],
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
    attempts: Object.fromEntries(
      Object.entries(g.attempts).filter(([id]) => before.has(id)),
    ),
  };
}

export function hasRequiredItems(step: Step, selected: string[]): boolean {
  return (
    (step.requiredItems ?? []).every((id) => selected.includes(id)) &&
    (!step.requireAll || Boolean(step.items?.every((item) => selected.includes(item.id))))
  );
}

// main의 AI 추천 응답을 현재 시나리오의 문자열 ID로 연결한다.
export function parseRecommendation(value: unknown): {
  contract: Contract;
  house: HouseId;
} {
  if (!value || typeof value !== "object")
    throw new Error("추천 형식을 확인할 수 없습니다.");
  const { first, second } = value as { first?: unknown; second?: unknown };
  if (typeof first !== "string" || typeof second !== "string")
    throw new Error("추천 조건이 비어 있습니다.");
  const clean = (text: string) => text.replace(/[{}"'\s]/g, "");
  const contractName = clean(first);
  const houseName = clean(second).replace(/\([^)]*\)/g, "");
  const houses: Record<string, HouseId> = {
    원룸: "oneroom",
    오피스텔: "officetel",
    빌라: "villa",
    옥탑방: "rooftop",
    반지하: "basement",
    고시원: "goshiwon",
  };
  const contract =
    contractName === "월세"
      ? "monthly"
      : ["전세", "전세+대출"].includes(contractName)
        ? "jeonse"
        : null;
  const house = houses[houseName];
  if (!contract || !house || (contract === "jeonse" && house === "goshiwon"))
    throw new Error(
      "이 조건으로는 이야기를 시작할 수 없습니다. 직접 조건을 선택해주세요.",
    );
  return { contract, house };
}

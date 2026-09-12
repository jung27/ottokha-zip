import type { Home, Inspection, Contract, IconName, Scene } from "./types";

export const homes: Home[] = [
  {
    name: "원룸",
    sub: "다가구주택",
    icon: "home",
    desc: "골목 안, 햇살이 들어오는 작은 방",
    area: "20㎡ · 2층",
    rent: "500 / 45",
    deposit: "8,000",
    hint: "한 건물 안 여러 가구가 사는 집. 내가 들어갈 방과 건물의 정보를 함께 살펴보자.",
    inspect: "창틀 아래에 물이 흘렀던 자국이 희미하게 남아 있다.",
  },
  {
    name: "오피스텔",
    sub: "주거용 공간",
    icon: "building",
    desc: "역에서 가까운 나만의 공간",
    area: "24㎡ · 7층",
    rent: "1,000 / 65",
    deposit: "12,000",
    hint: "편리한 시설만큼 관리비도 궁금하다. 포함된 항목을 구체적으로 물어보자.",
    inspect: "창문은 조금만 열린다. 환기가 잘 되는지 직접 확인해 보고 싶다.",
  },
  {
    name: "빌라",
    sub: "다세대주택",
    icon: "building",
    desc: "조용한 동네, 조금 더 넓은 방",
    area: "32㎡ · 3층",
    rent: "1,000 / 60",
    deposit: "11,000",
    hint: "내가 본 집의 동·호수와 서류에 적힌 동·호수가 같은지 살펴보자.",
    inspect: "창틀 모서리 벽지에 얼룩이 보인다. 언제 생겼는지 물어봐야겠다.",
  },
  {
    name: "옥탑방",
    sub: "건물의 맨 위",
    icon: "roof",
    desc: "계단 끝에서 만나는 하늘",
    area: "18㎡ · 옥상층",
    rent: "300 / 35",
    deposit: "5,000",
    hint: "풍경 뒤의 생활도 생각해 보자. 여름과 겨울의 실내 환경은 어떨까?",
    inspect:
      "창가에 서자 지붕 쪽에서 열기가 느껴진다. 냉난방 상태도 물어봐야겠다.",
  },
  {
    name: "반지하",
    sub: "지면 아래의 공간",
    icon: "stairs",
    desc: "낮은 창 너머로 보이는 동네",
    area: "23㎡ · 반지하",
    rent: "300 / 30",
    deposit: "5,500",
    hint: "채광과 환기, 비가 많이 왔을 때의 상황을 현장에서 확인해 보자.",
    inspect: "창문 바깥 바닥이 방보다 높다. 비가 많이 오면 물이 어디로 흐를까?",
  },
  {
    name: "고시원",
    sub: "쉐어하우스 포함",
    icon: "people",
    desc: "함께 쓰는 공간, 나만의 작은 방",
    area: "10㎡ · 3층",
    rent: "100 / 38",
    deposit: "3,000",
    hint: "고시원과 쉐어하우스는 계약 성격이 다를 수 있다. 실제 용도와 계약 조건부터 물어보자.",
    inspect:
      "창가 너머 공용공간의 소리가 들린다. 창문을 닫아 소음을 비교해 보자.",
  },
];

export const chapterCards: {
  number: string;
  icon: IconName;
  title: string;
  description: string;
  scene: Scene;
}[] = [
  {
    number: "01",
    icon: "key",
    title: "어떤 집에서 살고 싶어?",
    description: "나의 조건으로 고르는 첫 번째 집",
    scene: "choose",
  },
  {
    number: "02",
    icon: "eye",
    title: "사진에 없던 이야기",
    description: "직접 둘러보고 발견하는 작은 단서",
    scene: "explore",
  },
  {
    number: "03",
    icon: "file",
    title: "사인하기 전에",
    description: "대화와 서류 사이, 나의 선택",
    scene: "document",
  },
];

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
    narrative: (h) => h.inspect,
    learning:
      "흔적이 보인다면 언제 생겼는지, 어떻게 보수했는지 물어보고 사진으로 남겨 두자.",
    note: "창문 주변의 상태를 기록했다. 원인과 보수 이력을 중개사에게 물어볼 예정.",
  },
  sink: {
    title: "싱크대",
    icon: "water",
    narrative: () =>
      "수도꼭지를 틀어 본다. 물줄기는 일정하고, 잠시 뒤 따뜻한 물이 나온다. 물을 받아 내리니 배수도 잘 된다.",
    learning:
      "물을 틀어 보는 것에서 한 걸음 더. 온수와 배수도 직접 확인해 보자.",
    note: "찬물·온수를 틀고 배수 상태를 확인했다. 이번 방문에서는 이상을 발견하지 못했다.",
  },
  door: {
    title: "현관과 도어락",
    icon: "door",
    narrative: () =>
      "문을 닫고 손잡이를 당겨 본다. 잠금장치가 작동한다. 복도에서 올라오던 발소리는 문을 닫자 작아진다.",
    learning:
      "문이 잘 잠기는지 직접 확인하고, 닫았을 때 바깥 소리도 들어 보자.",
    note: "현관의 잠금과 문을 닫았을 때의 소음을 확인했다.",
  },
};

export const talkItems = [
  {
    id: "cost",
    label: "“관리비에는 어떤 항목이 포함되나요?”",
    title: "매달 나가는 비용",
    reply: (c: Contract) =>
      c === "monthly"
        ? "“관리비는 월 5만 원이고, 공용 청소비와 인터넷이 포함돼요. 전기·가스·수도 요금은 별도예요. 항목을 적어서 드릴게요.”"
        : "“관리비는 월 5만 원이에요. 대출 가능 여부는 이 집의 서류를 가지고 은행에 확인해 보셔야 해요. 지금 확답드리기는 어려워요.”",
    note: (c: Contract) =>
      c === "monthly"
        ? "관리비 5만 원. 공용 청소·인터넷 포함, 전기·가스·수도 별도. 계약 조건에도 같은 내용이 있는지 확인하기."
        : "관리비 5만 원. 대출 가능 여부는 아직 확인되지 않았다. 서류를 가지고 금융기관에 확인하기.",
  },
  {
    id: "condition",
    label: "“창문 주변 상태가 궁금해요. 보수한 적 있나요?”",
    title: "확답을 받지 못한 보수 이력",
    reply: () =>
      "“지난번에 손을 봤다고 들었는데, 정확한 시기와 원인은 집주인에게 확인해야겠네요. 사진과 보수 이력이 있는지 요청해 볼게요.”",
    note: () =>
      "중개사도 정확한 보수 시기와 원인은 모른다. 집주인의 설명과 기록을 추가로 확인하기.",
  },
  {
    id: "papers",
    label: "“계약을 정하기 전에 서류를 먼저 보고 싶어요.”",
    title: "서류를 요청했다",
    reply: () =>
      "“네, 등기사항증명서를 보여드릴게요. 그리고 집주인 쪽에서 보내온 입금 계좌도 있어요. 한 번 살펴보세요.”",
    note: () => "등기사항증명서와 전달받은 입금 계좌를 함께 살펴보기.",
  },
];

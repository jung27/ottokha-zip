import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import roomImage from "./assets/room.png";

const iconNodes = {
  home: (
    <>
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
      <path d="M9 21v-8h6v8" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </>
  ),
  back: (
    <>
      <path d="M20 12H4m6-6-6 6 6 6" />
    </>
  ),
  book: (
    <>
      <path d="M4 3h14a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2Zm0 14h16M8 3v14" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Zm6-3v15m6-12v15" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1-1.5 3m0 3h.01" />
    </>
  ),
  pin: (
    <>
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4 4L19 6" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M6 18 18 6" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="5" />
      <path d="m12 12 9 9m-4-4 3-3m-6 0 3-3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H5v20h14V7Zm0 0v6h5M8 12h8m-8 4h6" />
    </>
  ),
  chat: (
    <>
      <path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-7a8 8 0 1 1 17-4Z" />
      <path d="M8 10h8m-8 4h5" />
    </>
  ),
  building: (
    <>
      <path d="M5 21V3h14v18M2 21h20M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3" />
    </>
  ),
  roof: (
    <>
      <path d="m2 11 10-8 10 8M5 9v12h14V9M9 21v-8h6v8m1-16V2h3v5" />
    </>
  ),
  stairs: (
    <>
      <path d="M3 4v17h18M3 15h6v-5h6V5h6" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-4a6 6 0 0 1 12 0v4m1-17a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3" />
    </>
  ),
  window: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M12 3v18M4 12h16" />
    </>
  ),
  water: (
    <>
      <path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z" />
      <path d="M9 15a3 3 0 0 0 3 3" />
    </>
  ),
  door: (
    <>
      <path d="M4 22V2h16v20M8 22V5l9-2v19m-4-9h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10h.01" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />
    </>
  ),
  flag: (
    <>
      <path d="M5 22V3m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0" />
    </>
  ),
  external: (
    <>
      <path d="M14 3h7v7m0-7L10 14m0-11H3v18h18v-7" />
    </>
  ),
  reset: (
    <>
      <path d="M3 10a9 9 0 1 1 2 8M3 3v7h7" />
    </>
  ),
};
type IconName = keyof typeof iconNodes;

function Icon({
  name,
  className = "w-5 h-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={`shrink-0 inline-block stroke-current ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconNodes[name]}
    </svg>
  );
}

type Home = {
  name: string;
  sub: string;
  icon: IconName;
  desc: string;
  area: string;
  rent: string;
  deposit: string;
  hint: string;
  inspect: string;
};
const homes: Home[] = [
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

const routes = ["home", "choose", "explore", "talk", "document"] as const;
type Scene = (typeof routes)[number];
type Contract = "monthly" | "jeonse";
type Inspection = "window" | "sink" | "door";
type DocumentTab = "address" | "owner" | "rights";
type ModalKind =
  | "guide"
  | "journey"
  | "notebook"
  | "document-guide"
  | "new"
  | "explore-warning"
  | "send-warning"
  | "ending"
  | null;
type Note = { id: string; title: string; text: string };
type GameState = {
  started: boolean;
  contract: Contract;
  house: number;
  scene: Scene;
  notes: Note[];
  inspected: Inspection[];
  talked: string[];
  docTab: DocumentTab;
  ownerChecked: boolean;
  completed: boolean;
};

const labels: Record<Scene, string> = {
  home: "홈",
  choose: "집 선택",
  explore: "방 탐색",
  talk: "중개사 대화",
  document: "서류 확인",
};
const STORAGE_KEY = "eotteokhajip-react-v1";
const inspectionKeys: Inspection[] = ["window", "sink", "door"];

const makeNewGame = (): GameState => ({
  started: false,
  contract: "monthly",
  house: 0,
  scene: "choose",
  notes: [],
  inspected: [],
  talked: [],
  docTab: "owner",
  ownerChecked: false,
  completed: false,
});

const isScene = (v: unknown): v is Scene => routes.some((s) => s === v);
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;
const isNote = (v: unknown): v is Note =>
  isRecord(v) &&
  typeof v.id === "string" &&
  typeof v.title === "string" &&
  typeof v.text === "string";

function currentRoute(): Scene {
  const hash = window.location.hash.slice(1);
  return isScene(hash) ? hash : "home";
}

function loadGame(): GameState {
  let game = makeNewGame();
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "null",
    );
    if (
      isRecord(saved) &&
      typeof saved.started === "boolean" &&
      (saved.contract === "monthly" || saved.contract === "jeonse") &&
      typeof saved.house === "number" &&
      Number.isInteger(saved.house) &&
      saved.house >= 0 &&
      saved.house < homes.length &&
      isScene(saved.scene) &&
      Array.isArray(saved.notes) &&
      saved.notes.every(isNote) &&
      Array.isArray(saved.inspected) &&
      saved.inspected.every((item) => inspectionKeys.some((k) => k === item)) &&
      Array.isArray(saved.talked) &&
      saved.talked.every((item) => typeof item === "string") &&
      (saved.docTab === "address" ||
        saved.docTab === "owner" ||
        saved.docTab === "rights") &&
      typeof saved.ownerChecked === "boolean" &&
      typeof saved.completed === "boolean"
    ) {
      game = {
        started: saved.started,
        contract: saved.contract,
        house: saved.house,
        scene: saved.scene,
        notes: saved.notes,
        inspected: saved.inspected as Inspection[],
        talked: saved.talked,
        docTab: saved.docTab,
        ownerChecked: saved.ownerChecked,
        completed: saved.completed,
      };
    }
  } catch {}
  const route = currentRoute();
  return route === "home" ? game : { ...game, started: true, scene: route };
}

const inspections: Record<
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

const talkItems = [
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

const chapterCards: {
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

// const documentTabs: { id: DocumentTab; label: string }[] = [
//   { id: "address", label: "표제부 · 집의 정보" },
//   { id: "owner", label: "갑구 · 소유자" },
//   { id: "rights", label: "을구 · 권리관계" },
// ];

const sourceUrl =
  "https://www.molit.go.kr/portal/common/download/DownloadMltm2.jsp?FileName=%EC%A0%84%EC%84%B8%EA%B3%84%EC%95%BD+%EC%9C%A0%EC%9D%98%EC%82%AC%ED%95%AD+%EB%A6%AC%ED%94%8C%EB%A0%9B.pdf&FilePath=portal%2FDextUpload%2F202301%2F20230113_090421_309.pdf";

function StoryModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="m-auto rounded-xl border border-[#40514f] bg-[#19272e] p-6 text-[#f0f3f2] shadow-2xl backdrop:bg-[#071018]/70 backdrop:blur-sm max-w-lg w-full"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const b = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < b.left ||
          e.clientX > b.right ||
          e.clientY < b.top ||
          e.clientY > b.bottom
        )
          onClose();
      }}
    >
      <div className="flex items-center justify-between mb-5 border-b border-[#2c373e] pb-3">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          className="btn btn-ghost btn-circle btn-sm"
          onClick={onClose}
          aria-label="닫기"
        >
          <Icon name="close" className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export default function App() {
  const [game, setGame] = useState<GameState>(loadGame);
  const [route, setRoute] = useState<Scene>(currentRoute);
  const [detail, setDetail] = useState<Inspection | null>(null);
  const [dialogue, setDialogue] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [toast, setToast] = useState<string | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const home = homes[game.house];
  const price = game.contract === "monthly" ? home.rent : home.deposit;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
    } catch {}
  }, [game]);

  useEffect(() => {
    document.title = `${route === "home" ? "처음 만나는 나의 집" : labels[route]} | 어떡하집`;
    window.scrollTo({ top: 0, behavior: "instant" });
    mainRef.current?.focus({ preventScroll: true });
  }, [route]);

  useEffect(() => {
    const onPopState = () => {
      const next = currentRoute();
      setRoute(next);
      setDetail(null);
      setDialogue(null);
      setModal(null);
      if (next !== "home")
        setGame((prev) => ({ ...prev, started: true, scene: next }));
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onPopState);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        modal ||
        e.repeat ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        !["1", "2", "3"].includes(e.key)
      )
        return;
      if (
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable ||
          e.target.closest("input,textarea,select"))
      )
        return;
      const button = appRef.current?.querySelectorAll<HTMLButtonElement>(
        ".choices-container button",
      )[Number(e.key) - 1];
      if (button) {
        e.preventDefault();
        button.click();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal]);

  function navigate(scene: Scene) {
    setModal(null);
    setDetail(null);
    setDialogue(null);
    setToast(null);
    setRoute(scene);
    if (scene !== "home")
      setGame((prev) => ({ ...prev, started: true, scene }));
    if (window.location.hash !== `#${scene}`)
      window.history.pushState(null, "", `#${scene}`);
  }

  function recordNote(note: Note) {
    if (!game.notes.some((item) => item.id === note.id))
      setToast("수첩에 새로운 발견을 기록했어요.");
    setGame((prev) =>
      prev.notes.some((item) => item.id === note.id)
        ? prev
        : { ...prev, notes: [...prev.notes, note] },
    );
  }

  function inspect(key: Inspection) {
    setDetail(key);
    setGame((prev) =>
      prev.inspected.includes(key)
        ? prev
        : { ...prev, inspected: [...prev.inspected, key] },
    );
    recordNote({
      id: key,
      title: inspections[key].title,
      text: inspections[key].note,
    });
  }

  function askQuestion(index: number) {
    const item = talkItems[index];
    setDialogue(index);
    setGame((prev) =>
      prev.talked.includes(item.id)
        ? prev
        : { ...prev, talked: [...prev.talked, item.id] },
    );
    recordNote({
      id: item.id,
      title: item.title,
      text: item.note(game.contract),
    });
  }

  function checkNames() {
    setGame((prev) => ({ ...prev, ownerChecked: true, docTab: "owner" }));
    recordNote({
      id: "owner",
      title: "서로 다른 두 이름",
      text: "등기상 소유자는 김민수, 전달받은 계좌의 예금주는 박지훈. 관계와 권한을 확인하기 전 송금을 보류하기.",
    });
  }

  function completeVisit() {
    checkNames();
    setGame((prev) => ({ ...prev, completed: true }));
    recordNote({
      id: "pause",
      title: "확인할 때까지 기다리기로 했다",
      text: "이름이 다른 이유와 대리권 관련 자료를 요청했다. 확인 전에는 돈을 보내지 않기로 했다.",
    });
    setModal("ending");
  }

  function chooseHome(index: number) {
    if (index === game.house) return;
    setGame((prev) => ({
      ...makeNewGame(),
      started: true,
      contract: prev.contract,
      house: index,
    }));
  }

  function chooseContract(contract: Contract) {
    if (contract === game.contract) return;
    setGame((prev) => ({
      ...makeNewGame(),
      started: true,
      house: prev.house,
      contract,
    }));
  }

  function stagebar() {
    const step = routes.indexOf(route);
    return (
      <div className="flex items-center justify-between border-b border-[#2c373e] py-5 px-2">
        <button
          className="flex items-center gap-2 text-sm text-[#a1aeb5] hover:text-white"
          onClick={() => navigate(routes[Math.max(0, step - 1)])}
        >
          <Icon name="back" className="w-4 h-4" />
          <span className="hidden sm:inline">이전 장면</span>
        </button>
        <nav aria-label="이야기 진행">
          <ol className="flex gap-4 sm:gap-8">
            {routes.slice(1).map((scene, index) => {
              const isActive = route === scene;
              const isPast = step > index + 1;
              return (
                <li key={scene}>
                  <button
                    onClick={() => navigate(scene)}
                    className={`flex items-center gap-2 text-sm ${isActive ? "text-[#add9b9] font-medium" : isPast ? "text-[#70838e]" : "text-gray-500"}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? "bg-[#add9b9] text-[#163022]" : isPast ? "bg-[#23332e] text-[#add9b9]" : "border border-[#34434c]"}`}
                    >
                      {isPast ? (
                        <Icon name="check" className="w-3 h-3" />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </span>
                    <span className="hidden md:inline">{labels[scene]}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
        <span className="text-xs tracking-wider text-[#83969e]">
          CHAPTER 01
        </span>
      </div>
    );
  }

  function journal() {
    return (
      <aside className="hidden lg:flex flex-col bg-[#161f26] border border-[#2d3a42] rounded-lg p-5 w-72 shrink-0">
        <div className="flex items-center gap-2 pb-3 border-b border-[#2c3c44]">
          <Icon name="book" className="text-[#add9b9]" />
          <h2 className="text-sm font-semibold flex-1">나의 수첩</h2>
          <span className="badge badge-sm bg-[#28372f] text-[#add9b9] border-0">
            {game.notes.length}
          </span>
        </div>
        <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-96">
          {game.notes.length ? (
            game.notes.slice(-4).map((note, index) => (
              <div
                key={note.id}
                className="text-xs border-b border-[#293940] pb-2"
              >
                <span className="text-[#add9b9] font-mono">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-gray-200 mt-1">
                  {note.title}
                </h3>
                <p className="text-[#8da3af] mt-0.5">{note.text}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-xs text-[#8398a2]">
              <Icon name="book" className="mx-auto mb-2 opacity-50 w-8 h-8" />
              아직은 빈 페이지.
              <br />
              작은 발견부터 적어보자.
            </div>
          )}
        </div>
        <button
          className="btn btn-ghost btn-sm text-[#add9b9] justify-between px-0"
          onClick={() => setModal("notebook")}
        >
          수첩 펼치기 <Icon name="arrow" className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  function renderHome() {
    return (
      <div className="space-y-8 pt-4">
        <section className="relative rounded-2xl border border-[#334047] overflow-hidden bg-[#17242b] min-h-[480px] flex items-center p-8 sm:p-12">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${roomImage})` }}
          />
          <div className="relative z-10 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#add9b9]">
              <span className="w-6 h-px bg-[#add9b9]" /> 처음 만나는 나의 집
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              괜찮은 집,
              <br />
              <span className="text-[#add9b9]">찾을 수 있을까?</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              낯선 동네, 처음 보는 계약서.
              <br />
              당신의 선택으로 시작되는 첫 번째 독립 이야기.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                className="btn bg-[#add9b9] hover:bg-[#c5e9ce] text-[#15271d] font-bold border-none"
                onClick={() =>
                  game.started ? setModal("new") : navigate("choose")
                }
              >
                새로운 이야기 시작 <Icon name="arrow" />
              </button>
              <button
                className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-800"
                disabled={!game.started}
                onClick={() => navigate(game.scene)}
              >
                <Icon name="reset" /> 이어서 하기
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chapterCards.map((card) => (
            <button
              key={card.number}
              onClick={() => navigate(card.scene)}
              className="flex items-center gap-4 p-5 rounded-xl border border-[#2c373e] bg-[#151f26] hover:bg-[#1c2931] text-left transition"
            >
              <div className="w-12 h-12 rounded-lg bg-[#1a2a2d] border border-[#394a4c] flex items-center justify-center text-[#add9b9]">
                <Icon name={card.icon} />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono text-gray-400">
                  CHAPTER {card.number}
                </span>
                <h3 className="font-bold text-white text-base">{card.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{card.description}</p>
              </div>
              <Icon name="arrow" className="text-gray-500 w-4 h-4" />
            </button>
          ))}
        </section>
      </div>
    );
  }

  function renderChoose() {
    return (
      <div className="space-y-6 pt-6">
        <div className="border-b border-[#2c373e] pb-4">
          <span className="text-xs text-[#add9b9]">
            첫 번째 장면 · 집을 고르다
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">
            어떤 집에서 시작할까?
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-300 mb-3">
                01. 어떤 계약으로 구할까?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {(["monthly", "jeonse"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => chooseContract(type)}
                    className={`p-4 rounded-lg border text-left flex flex-col justify-between transition ${game.contract === type ? "border-[#add9b9] bg-[#1d2c2b]" : "border-[#2c373e] bg-[#141e25] hover:bg-gray-800"}`}
                  >
                    <span className="font-bold text-white">
                      {type === "monthly" ? "월세" : "전세 + 대출"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      {type === "monthly"
                        ? "보증금과 매달 내는 임대료"
                        : "목돈과 대출 조건을 함께 살펴보기"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-300 mb-3">
                02. 어떤 공간에서 살고 싶어?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {homes.map((item, idx) => (
                  <button
                    key={item.name}
                    onClick={() => chooseHome(idx)}
                    className={`p-4 rounded-lg border text-left transition flex flex-col justify-between min-h-[120px] ${game.house === idx ? "border-[#add9b9] bg-[#1d2c2b]" : "border-[#2c373e] bg-[#141e25] hover:bg-gray-800"}`}
                  >
                    <Icon
                      name={item.icon}
                      className={
                        game.house === idx ? "text-[#add9b9]" : "text-gray-400"
                      }
                    />
                    <div>
                      <div className="font-bold text-white text-sm">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-400">{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-xl border border-[#364249] bg-[#172128] p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="badge badge-sm badge-outline text-[#add9b9] border-[#add9b9]">
                가상 매물
              </span>
              <h2 className="text-xl font-bold text-white">{home.desc}</h2>
              <div className="text-2xl font-bold text-[#add9b9]">
                {price}{" "}
                <span className="text-xs text-gray-400 font-normal">만원</span>
              </div>
              <p className="text-xs text-gray-400 pre-line">
                {game.contract === "jeonse"
                  ? "이 집은 대출이 가능할까? 가능 여부와 조건부터 확인해 보자."
                  : home.hint}
              </p>
            </div>
            <button
              className="btn w-full bg-[#add9b9] hover:bg-[#c5e9ce] text-[#15271d] font-bold border-none"
              onClick={() => navigate("explore")}
            >
              이 집 보러 가기 <Icon name="arrow" />
            </button>
          </aside>
        </div>
      </div>
    );
  }

  function renderExplore() {
    const item = detail ? inspections[detail] : null;
    return (
      <div className="space-y-6 pt-6">
        <div className="border-b border-[#2c373e] pb-4">
          <span className="text-xs text-[#add9b9]">두 번째 장면 · 방 탐색</span>
          <h1 className="text-2xl font-bold text-white mt-1">
            문을 열자, 오후의 빛이 들어왔다.
          </h1>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            <div className="relative h-80 rounded-t-xl overflow-hidden border border-[#435057] bg-black">
              <img
                src={roomImage}
                alt="방 내부"
                className="w-full h-full object-cover opacity-80"
              />
              {inspectionKeys.map((key) => {
                const pos =
                  key === "window"
                    ? "top-1/3 left-1/3"
                    : key === "sink"
                      ? "bottom-1/3 right-1/4"
                      : "bottom-1/4 left-10";
                return (
                  <button
                    key={key}
                    onClick={() => inspect(key)}
                    className={`absolute ${pos} btn btn-xs sm:btn-sm rounded-full gap-2 backdrop-blur-md ${game.inspected.includes(key) ? "bg-[#213b30]/90 text-[#add9b9] border-[#add9b9]" : "bg-black/60 text-white border-white/40"}`}
                  >
                    <Icon
                      name={game.inspected.includes(key) ? "check" : "spark"}
                      className="w-3 h-3"
                    />
                    <span>{inspections[key].title}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-5 rounded-b-xl border border-[#38464e] bg-[#1a252d] space-y-2">
              <div className="text-xs font-semibold text-[#add9b9] flex items-center gap-1">
                <Icon name={item ? item.icon : "book"} className="w-4 h-4" />
                {item ? item.title : "나의 생각"}
              </div>
              <p className="text-sm sm:text-base text-gray-200 pre-line">
                {item
                  ? item.narrative(home)
                  : "사진보다 조금 작지만, 볕이 제법 잘 드는 방이다."}
              </p>
              <p className="text-xs text-gray-400 italic mt-2 pre-line">
                {item ? item.learning : "“어디부터 살펴볼까?”"}
              </p>
            </div>

            <div className="space-y-2 pt-2 choices-container">
              <button
                className="btn w-full justify-between bg-[#17232b] hover:bg-[#21342f] border-[#34434c] text-left text-sm"
                onClick={() =>
                  inspect(
                    inspectionKeys.find((k) => !game.inspected.includes(k)) ??
                      "window",
                  )
                }
              >
                <span className="flex items-center gap-2">
                  <kbd className="kbd kbd-sm bg-black/40">1</kbd>{" "}
                  {game.inspected.length === 3
                    ? "방을 한 번 더 살펴본다"
                    : "아직 보지 않은 곳을 살펴본다"}
                </span>
                <Icon name="eye" />
              </button>
              <button
                className="btn w-full justify-between bg-[#17232b] hover:bg-[#21342f] border-[#34434c] text-left text-sm"
                onClick={() =>
                  game.inspected.length < 3
                    ? setModal("explore-warning")
                    : navigate("talk")
                }
              >
                <span className="flex items-center gap-2">
                  <kbd className="kbd kbd-sm bg-black/40">2</kbd> 중개사에게
                  궁금한 것을 물어본다
                </span>
                <Icon name="arrow" />
              </button>
            </div>
          </div>
          {journal()}
        </div>
      </div>
    );
  }

  function renderTalk() {
    return (
      <div className="space-y-6 pt-6">
        <div className="border-b border-[#2c373e] pb-4">
          <span className="text-xs text-[#add9b9]">
            세 번째 장면 · 중개사와의 대화
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">
            좋은 질문 하나가, 단서가 된다.
          </h1>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            <div className="p-5 rounded-xl border border-[#38464e] bg-[#1a252d] space-y-2">
              <div className="text-xs font-semibold text-[#add9b9]">
                한서진 공인중개사
              </div>
              <p className="text-sm sm:text-base text-gray-200 pre-line">
                {dialogue === null
                  ? "“방은 어떠셨어요? 궁금한 점이 있으면 편하게 물어보세요.”"
                  : talkItems[dialogue].reply(game.contract)}
              </p>
            </div>

            <div className="space-y-2 choices-container">
              {talkItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => askQuestion(idx)}
                  className={`btn w-full justify-between text-left text-sm ${game.talked.includes(item.id) ? "bg-[#1b2b29] border-[#36534a] text-[#add9b9]" : "bg-[#17232b] border-[#34434c] text-gray-300"}`}
                >
                  <span className="flex items-center gap-2">
                    <kbd className="kbd kbd-sm bg-black/40">{idx + 1}</kbd>{" "}
                    {item.label}
                  </span>
                  <Icon
                    name={game.talked.includes(item.id) ? "check" : "chat"}
                  />
                </button>
              ))}
            </div>

            {game.talked.includes("papers") && (
              <button
                className="btn w-full bg-[#add9b9] hover:bg-[#c5e9ce] text-[#15271d] font-bold border-none mt-4"
                onClick={() => navigate("document")}
              >
                건네받은 서류 살펴보기 <Icon name="arrow" />
              </button>
            )}
          </div>
          {journal()}
        </div>
      </div>
    );
  }

  function renderDocument() {
    return (
      <div className="space-y-6 pt-6">
        <div className="border-b border-[#2c373e] pb-4 flex justify-between items-end">
          <div>
            <span className="text-xs text-[#add9b9]">
              네 번째 장면 · 서류 확인
            </span>
            <h1 className="text-2xl font-bold text-white mt-1">
              같은 집, 서로 다른 이름.
            </h1>
          </div>
          <button
            className="btn btn-ghost btn-sm text-[#add9b9]"
            onClick={() => setModal("document-guide")}
          >
            <Icon name="help" /> 서류 읽는 법
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[#33454d] bg-[#edeee7] p-6 text-slate-800 space-y-4">
            <div className="flex justify-between border-b border-slate-300 pb-2 text-xs font-bold text-slate-600">
              <span>등기사항전부증명서 (학습용 가상 서류)</span>
              <span>2026. 09. 12.</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white/60 rounded border border-slate-300">
                <div className="font-bold mb-1">표제부 (건물의 표시)</div>
                <div>
                  서울특별시 은유구 은유동 24-7 {game.house === 2 && "제301호"}
                </div>
              </div>

              <button
                onClick={checkNames}
                className={`w-full text-left p-3 rounded border transition ${game.docTab === "owner" ? "bg-amber-100 border-amber-400" : "bg-white/60 border-slate-300"}`}
              >
                <div className="font-bold flex justify-between">
                  <span>갑구 (소유권에 관한 사항)</span>
                  <span className="text-[#2c4b34] font-bold underline">
                    클릭하여 확인
                  </span>
                </div>
                <div className="mt-2 flex gap-4">
                  <span>
                    소유자:{" "}
                    <mark className="bg-yellow-200 px-1 font-bold">김민수</mark>
                  </span>
                </div>
              </button>
            </div>
          </div>

          <aside className="space-y-4 choices-container">
            <div className="p-5 rounded-xl border border-[#36464e] bg-[#1b2931] space-y-3">
              <div className="text-xs text-gray-400">
                중개사에게 전달받은 입금 계좌
              </div>
              <div className="text-xl font-mono font-bold text-white">
                000-1234-5678
              </div>
              <div className="text-sm text-gray-300 flex justify-between border-t border-gray-700 pt-2">
                <span>예금주</span>
                <span className="font-bold text-amber-300">박지훈</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                className="btn w-full justify-between bg-[#17232b] hover:bg-[#21342f] border-[#34434c] text-sm"
                onClick={checkNames}
              >
                <span className="flex items-center gap-2">
                  <kbd className="kbd kbd-sm bg-black/40">1</kbd> 소유자와
                  예금주를 비교한다
                </span>
                <Icon name={game.ownerChecked ? "check" : "eye"} />
              </button>
              <button
                className="btn w-full justify-between bg-[#17232b] hover:bg-[#21342f] border-[#34434c] text-sm"
                onClick={completeVisit}
              >
                <span className="flex items-center gap-2">
                  <kbd className="kbd kbd-sm bg-black/40">2</kbd> 이름이 다른
                  이유를 묻는다
                </span>
                <Icon name="chat" />
              </button>
              <button
                className="btn w-full justify-between btn-outline border-dashed border-red-900/60 text-gray-400 hover:bg-red-950/20 text-sm"
                onClick={() => setModal("send-warning")}
              >
                <span className="flex items-center gap-2">
                  <kbd className="kbd kbd-sm bg-black/40">3</kbd> 안내받은
                  계좌로 일단 송금한다
                </span>
                <Icon name="arrow" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  function renderModal(): ReactNode {
    if (!modal) return null;
    const close = () => setModal(null);
    let title = "";
    let content: ReactNode;

    switch (modal) {
      case "new":
        title = "새로운 이야기를 시작할까요?";
        content = (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              지금까지 저장된 진행 기록을 비우고 집 선택부터 시작합니다.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button className="btn btn-ghost btn-sm" onClick={close}>
                취소
              </button>
              <button
                className="btn btn-primary btn-sm bg-[#add9b9] text-black border-none"
                onClick={() => {
                  setGame(makeNewGame());
                  navigate("choose");
                }}
              >
                새로 시작
              </button>
            </div>
          </div>
        );
        break;
      case "journey":
        title = "나의 여정";
        content = (
          <div className="flex flex-col gap-2">
            {routes.map((scene, idx) => (
              <button
                key={scene}
                onClick={() => navigate(scene)}
                className={`btn justify-between ${route === scene ? "btn-neutral border-[#add9b9]" : "btn-ghost"}`}
              >
                <span>
                  {String(idx).padStart(2, "0")}. {labels[scene]}
                </span>
                <Icon name="arrow" className="w-4 h-4" />
              </button>
            ))}
          </div>
        );
        break;
      case "notebook":
        title = "나의 수첩";
        content = (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {game.notes.length ? (
              game.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-[#141e25] rounded-lg border border-[#2c373e]"
                >
                  <h3 className="font-bold text-[#add9b9] text-sm">
                    {note.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">{note.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-sm text-gray-500">
                기록된 메모가 없습니다.
              </div>
            )}
          </div>
        );
        break;
      case "guide":
      case "document-guide":
        title = "가이드 및 유의사항";
        content = (
          <div className="space-y-3 text-sm text-gray-300">
            <p>
              등기부등본의 소유자와 실제 계약자 및 입금 계좌의 예금주가
              일치하는지 반드시 대조해야 합니다.
            </p>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline text-[#add9b9] w-full gap-2"
            >
              국토교통부 공식 자료 확인{" "}
              <Icon name="external" className="w-4 h-4" />
            </a>
          </div>
        );
        break;
      case "send-warning":
        title = "잠깐! 확인하셨나요?";
        content = (
          <div className="space-y-4 text-center">
            <div className="text-amber-400 font-bold text-lg">
              등기상 소유자 ≠ 계좌 예금주
            </div>
            <p className="text-xs text-gray-300">
              소유자(김민수)와 예금주(박지훈)가 다릅니다. 확인 없이 먼저
              송금하지 마세요.
            </p>
            <button
              className="btn btn-block bg-[#add9b9] text-black border-none"
              onClick={() => {
                close();
                checkNames();
              }}
            >
              돌아가서 확인하기
            </button>
          </div>
        );
        break;
      case "ending":
        title = "방문 완료";
        content = (
          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-200">
              성공적으로 첫 방문 점검을 마쳤습니다. 서류와 계좌의 불일치를
              확인한 것은 훌륭한 선택입니다.
            </p>
            <button
              className="btn btn-block bg-[#add9b9] text-black border-none"
              onClick={() => navigate("home")}
            >
              홈으로 가기
            </button>
          </div>
        );
        break;
    }
    return (
      <StoryModal title={title} onClose={close}>
        {content}
      </StoryModal>
    );
  }

  return (
    <div
      ref={appRef}
      className="min-h-screen bg-[#11191f] text-[#f0f3f2] flex flex-col"
    >
      <header className="border-b border-[#2c373e] px-4 sm:px-8 h-16 flex items-center justify-between max-w-7xl w-full mx-auto">
        <button
          className="flex items-center gap-2 text-xl font-extrabold text-white"
          onClick={() => navigate("home")}
        >
          <Icon name="door" className="w-6 h-6 text-[#add9b9]" />
          <span>
            어떡하집<span className="text-[#add9b9]">.</span>
          </span>
        </button>
        <nav className="flex items-center gap-4">
          <button
            className="btn btn-ghost btn-sm text-gray-300"
            onClick={() => setModal("journey")}
          >
            <Icon name="map" /> <span className="hidden sm:inline">여정</span>
          </button>
          <button
            className="btn btn-ghost btn-sm text-gray-300"
            onClick={() => setModal("notebook")}
          >
            <Icon name="book" /> <span className="hidden sm:inline">수첩</span>
          </button>
          <button
            className="btn btn-circle btn-ghost btn-sm text-gray-300"
            onClick={() => setModal("guide")}
          >
            <Icon name="help" />
          </button>
        </nav>
      </header>

      <main
        ref={mainRef}
        tabIndex={-1}
        className="flex-1 max-w-5xl w-full mx-auto px-4 pb-12 focus:outline-none"
      >
        {route !== "home" && stagebar()}
        {route === "home" && renderHome()}
        {route === "choose" && renderChoose()}
        {route === "explore" && renderExplore()}
        {route === "talk" && renderTalk()}
        {route === "document" && renderDocument()}
      </main>

      <footer className="border-t border-[#2c373e] py-6 text-center text-xs text-gray-500">
        어떡하집 · 모든 첫 독립에는 연습이 필요하니까
      </footer>

      {renderModal()}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#c3dfc8] text-[#1a3928] px-4 py-2 rounded-lg text-xs font-semibold shadow-lg pointer-events-none z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

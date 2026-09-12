import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { StageBar } from "./components/StageBar";
import { AppModals } from "./components/modals/AppModals";
import { homes, inspections, talkItems } from "./data";
import {
  routes,
  labels,
  STORAGE_KEY,
  type Scene,
  type Contract,
  type Inspection,
  type ModalKind,
  type Note,
  type GameState,
} from "./types";
import { ChooseView } from "./views/ChooseView";
import { DocumentView } from "./views/DocumentView";
import { ExploreView } from "./views/ExploreView";
import { HomeView } from "./views/HomeView";
import { TalkView } from "./views/TalkView";

// 실제 서버 API 기본 주소 (필요에 따라 변경)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost";

// 서버 응답 타입
type ServerRecommendationResponse = {
  first: "월세" | "전세 + 대출" | string;
  second:
    | "원룸"
    | "오피스텔"
    | "빌라"
    | "옥탑방"
    | "반지하"
    | "고시원"
    | string;
};

// 1차 분기 매핑
function mapContract(first: string): Contract {
  if (first.includes("전세")) return "jeonse";
  return "monthly";
}

// 2차 분기 인덱스 1:1 매핑 (homes 배열의 순서와 일치)
const HOUSE_INDEX_MAP: Record<string, number> = {
  원룸: 0, // 원룸(다가구)
  오피스텔: 1, // 오피스텔
  빌라: 2, // 빌라(다세대)
  옥탑방: 3, // 옥탑방
  반지하: 4, // 반지하
  고시원: 5, // 고시원
};

function mapHouseIndex(second: string): number {
  // 정의된 6개 키워드 중 하나면 해당 인덱스 반환, 예외적인 값이면 기본값 0(원룸)
  return HOUSE_INDEX_MAP[second] ?? 0;
}

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
const currentRoute = (): Scene => {
  const hash = window.location.hash.slice(1);
  return isScene(hash) ? hash : "home";
};

export default function App() {
  const [game, setGame] = useState<GameState>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && typeof saved.started === "boolean") return saved;
    } catch {}
    return makeNewGame();
  });

  const [route, setRoute] = useState<Scene>(currentRoute);
  const [detail, setDetail] = useState<Inspection | null>(null);
  const [dialogue, setDialogue] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [toast, setToast] = useState<string | null>(null);
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
    } catch {}
  }, [game]);

  useEffect(() => {
    document.title = `${route === "home" ? "처음 만나는 나의 집" : labels[route]} | 어떡하집`;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [route]);

  useEffect(() => {
    const handlePopState = () => {
      const next = currentRoute();
      setRoute(next);
      setDetail(null);
      setDialogue(null);
      setModal(null);
      if (next !== "home")
        setGame((prev) => ({ ...prev, started: true, scene: next }));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  // 키보드 1, 2, 3 숫자 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modal || e.repeat || !["1", "2", "3"].includes(e.key)) return;
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("input,textarea,select")
      )
        return;
      const btn = appRef.current?.querySelectorAll<HTMLButtonElement>(
        ".choices-container button",
      )[Number(e.key) - 1];
      if (btn) {
        e.preventDefault();
        btn.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

  function navigate(scene: Scene) {
    setModal(null);
    setDetail(null);
    setDialogue(null);
    setRoute(scene);
    if (scene !== "home")
      setGame((prev) => ({ ...prev, started: true, scene }));
    if (window.location.hash !== `#${scene}`)
      window.history.pushState(null, "", `#${scene}`);
  }

  function recordNote(note: Note) {
    if (!game.notes.some((item) => item.id === note.id)) {
      setToast("수첩에 새로운 발견을 기록했어요.");
      setGame((prev) => ({ ...prev, notes: [...prev.notes, note] }));
    }
  }

  // 서버 API 호출 및 결과 자동 적용 핸들러
  async function handleStartWithAI(input: string) {
    try {
      const encodedQuery = encodeURIComponent(input);
      const res = await fetch(`${API_BASE_URL}/api?text=${encodedQuery}`);

      if (!res.ok) {
        throw new Error(`서버 응답 오류: ${res.status}`);
      }

      const data: ServerRecommendationResponse = await res.json();

      const contract = mapContract(data.first);
      const houseIndex = mapHouseIndex(data.second);
      const targetHome = homes[houseIndex];

      // LLM이 골라준 조건으로 세팅하고 목적지를 'choose'로 지정
      setGame({
        ...makeNewGame(),
        started: true,
        contract,
        house: houseIndex,
        scene: "choose", // <-- explore 대신 choose로 이동
        notes: [
          {
            id: "ai-prompt",
            title: "AI 추천 계약 및 집 조건",
            text: `“${input}” 상황을 바탕으로 [${data.first}] / [${targetHome.name}] 조건을 추천받았습니다.`,
          },
        ],
      });

      setToast(
        `AI가 [${data.first}] · [${targetHome.name}]을(를) 골라두었어요!`,
      );
      navigate("choose"); // <-- ChooseView 화면으로 전환
    } catch (error) {
      console.error("AI 추천 호출 실패:", error);
      setToast("서버 연결에 실패하여 기본 선택 화면으로 이동합니다.");

      setGame({
        ...makeNewGame(),
        started: true,
        contract: "monthly",
        house: 0,
        scene: "choose",
      });
      navigate("choose");
    }
  }

  function handleInspect(key: Inspection) {
    setDetail(key);
    if (!game.inspected.includes(key)) {
      setGame((prev) => ({ ...prev, inspected: [...prev.inspected, key] }));
    }
    recordNote({
      id: key,
      title: inspections[key].title,
      text: inspections[key].note,
    });
  }

  function handleAskQuestion(index: number) {
    const item = talkItems[index];
    setDialogue(index);
    if (!game.talked.includes(item.id)) {
      setGame((prev) => ({ ...prev, talked: [...prev.talked, item.id] }));
    }
    recordNote({
      id: item.id,
      title: item.title,
      text: item.note(game.contract),
    });
  }

  function handleCheckNames() {
    setGame((prev) => ({ ...prev, ownerChecked: true, docTab: "owner" }));
    recordNote({
      id: "owner",
      title: "서로 다른 두 이름",
      text: "등기상 소유자는 김민수, 전달받은 계좌의 예금주는 박지훈. 관계와 권한을 확인하기 전 송금을 보류하기.",
    });
  }

  return (
    <div
      ref={appRef}
      className="min-h-screen bg-[#11191f] text-[#f0f3f2] flex flex-col"
    >
      <Header onNavigate={navigate} onOpenModal={setModal} />

      <main
        tabIndex={-1}
        className="flex-1 max-w-5xl w-full mx-auto px-4 pb-12 focus:outline-none"
      >
        {route !== "home" && (
          <StageBar currentScene={route} onNavigate={navigate} />
        )}

        {route === "home" && (
          <HomeView
            onStartWithAI={handleStartWithAI}
            onNavigate={navigate}
            started={game.started}
            lastScene={game.scene}
          />
        )}

        {route === "choose" && (
          <ChooseView
            contract={game.contract}
            currentHouse={game.house}
            onChooseContract={(c: Contract) =>
              setGame((p) => ({
                ...makeNewGame(),
                started: true,
                house: p.house,
                contract: c,
              }))
            }
            onChooseHome={(idx: number) =>
              setGame((p) => ({
                ...makeNewGame(),
                started: true,
                contract: p.contract,
                house: idx,
              }))
            }
            onNext={() => navigate("explore")}
          />
        )}

        {route === "explore" && (
          <ExploreView
            home={homes[game.house]}
            notes={game.notes}
            inspected={game.inspected}
            detail={detail}
            onInspect={handleInspect}
            onNext={() =>
              game.inspected.length < 3
                ? setModal("explore-warning")
                : navigate("talk")
            }
            onOpenNotebook={() => setModal("notebook")}
          />
        )}

        {route === "talk" && (
          <TalkView
            contract={game.contract}
            notes={game.notes}
            talked={game.talked}
            dialogue={dialogue}
            onAskQuestion={handleAskQuestion}
            onNext={() => navigate("document")}
            onOpenNotebook={() => setModal("notebook")}
          />
        )}

        {route === "document" && (
          <DocumentView
            house={game.house}
            docTab={game.docTab}
            ownerChecked={game.ownerChecked}
            onCheckNames={handleCheckNames}
            onComplete={() => {
              handleCheckNames();
              setGame((p) => ({ ...p, completed: true }));
              recordNote({
                id: "pause",
                title: "확인할 때까지 기다리기로 했다",
                text: "이름이 다른 이유와 대리권 관련 자료를 요청했다. 확인 전에는 돈을 보내지 않기로 했다.",
              });
              setModal("ending");
            }}
            onSendWarning={() => setModal("send-warning")}
            onOpenGuide={() => setModal("document-guide")}
          />
        )}
      </main>

      <footer className="border-t border-[#2c373e] py-6 text-center text-xs text-gray-500">
        어떡하집 · 모든 첫 독립에는 연습이 필요하니까
      </footer>

      <AppModals
        modal={modal}
        notes={game.notes}
        currentRoute={route}
        onClose={() => setModal(null)}
        onStartNew={() => {
          setGame(makeNewGame());
          navigate("choose");
        }}
        onNavigate={navigate}
        onConfirmWarning={handleCheckNames}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#c3dfc8] text-[#1a3928] px-4 py-2 rounded-lg text-xs font-semibold shadow-lg pointer-events-none z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

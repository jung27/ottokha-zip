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

  // 키보드 숫자 단축키(1, 2, 3) 지원
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
            started={game.started}
            lastScene={game.scene}
            onStartNew={() =>
              game.started ? setModal("new") : navigate("choose")
            }
            onNavigate={navigate}
          />
        )}

        {route === "choose" && (
          <ChooseView
            home={home}
            contract={game.contract}
            currentHouse={game.house}
            price={price}
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
            home={home}
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

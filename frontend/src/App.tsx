import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { AppModals } from "./components/modals/AppModals";
import {
  getCheckpoints,
  getEnding,
  getSteps,
  makeNewGame,
  restoreGame,
  rewindGame,
  selectedHome,
} from "./data";
import {
  STORAGE_KEY,
  type GameState,
  type ModalKind,
  type PlayViewProps,
} from "./types";
import { ChooseView } from "./views/ChooseView";
import { DocumentView } from "./views/DocumentView";
import { ExploreView } from "./views/ExploreView";
import { HomeView } from "./views/HomeView";
import { TalkView } from "./views/TalkView";

export default function App() {
  const [game, setGame] = useState<GameState>(() => {
    try {
      return restoreGame(localStorage.getItem(STORAGE_KEY));
    } catch {
      return makeNewGame();
    }
  });
  const [showHome, setShowHome] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [storageFailed, setStorageFailed] = useState(false);
  const appRef = useRef<HTMLElement>(null);
  const home = selectedHome(game);
  const steps = getSteps(game);
  const index = Math.max(
    0,
    steps.findIndex((step) => step.id === game.cursor),
  );
  const step = steps[index];
  const notes = getCheckpoints(game);
  const answered = Object.hasOwn(game.answers, step.id);
  const selected = game.answers[step.id] ?? game.drafts[step.id] ?? [];
  const feedback = notes.filter((n) => n.stepId === step.id);
  const isHome = showHome || game.page === "home";
  const ending = game.page === "ending" && !showHome;

  useEffect(() => {
    // 체크박스를 연속으로 누를 때 저장을 합치고, 실패도 화면에 알린다.
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
        setStorageFailed(false);
      } catch {
        setStorageFailed(true);
      }
    }, 100);
    return () => window.clearTimeout(timer);
  }, [game]);

  useEffect(() => {
    const label = isHome
      ? "처음 만나는 나의 집"
      : ending
        ? "이야기의 끝"
        : game.page === "play"
          ? step.title
          : "첫 집을 고르다";
    document.title = label + " | 어떡하집?";
    window.history.replaceState(
      null,
      "",
      "#" + (isHome ? "home" : game.page === "play" ? step.id : game.page),
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    appRef.current?.focus({ preventScroll: true });
  }, [game.page, game.cursor, isHome, ending, step.title, step.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        modal ||
        e.repeat ||
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        !/^[1-9]$/.test(e.key)
      )
        return;
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("input,textarea,select,button,summary,a")
      )
        return;
      const button = appRef.current?.querySelectorAll<HTMLButtonElement>(
        ".choices-container button",
      )[Number(e.key) - 1];
      if (button && !button.disabled) {
        e.preventDefault();
        button.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

  function restart(mode: "start" | "same" | "other" = "start") {
    setModal(null);
    setShowHome(false);
    setGame((previous) => ({
      ...makeNewGame(),
      page:
        mode === "same" ? "play" : mode === "other" ? "contract" : "prologue",
      contract: mode === "start" ? "monthly" : previous.contract,
      house: mode === "start" ? "oneroom" : previous.house,
    }));
  }
  function replay(stepId: string) {
    setGame((previous) => rewindGame(previous, stepId));
    setShowHome(false);
    setModal(null);
  }
  function choose(id: string) {
    if (
      answered ||
      !step.choices?.some(
        (choice) => choice.id === id && !choice.disabledReason,
      )
    )
      return;
    setGame((previous) => ({
      ...previous,
      answers: { ...previous.answers, [step.id]: [id] },
    }));
  }
  function toggle(id: string) {
    if (answered || !step.items?.some((item) => item.id === id)) return;
    setGame((previous) => {
      const current = previous.drafts[step.id] ?? [];
      const item = step.items!.find((item) => item.id === id)!;
      const commonCount = step.items!.filter(
        (item) => !item.extra && current.includes(item.id),
      ).length;
      if (
        step.kind === "inspection" &&
        !item.extra &&
        !current.includes(id) &&
        commonCount >= 5
      )
        return previous;
      return {
        ...previous,
        drafts: {
          ...previous.drafts,
          [step.id]: current.includes(id)
            ? current.filter((key) => key !== id)
            : [...current, id],
        },
      };
    });
  }
  function submit() {
    if (!answered)
      setGame((previous) => ({
        ...previous,
        answers: {
          ...previous.answers,
          [step.id]: previous.drafts[step.id] ?? [],
        },
      }));
  }
  function next() {
    if (step.kind !== "info" && step.kind !== "recap" && !answered) return;
    setGame((previous) => {
      const updated = {
        ...previous,
        answers: {
          ...previous.answers,
          [step.id]: previous.answers[step.id] ?? ["read"],
        },
      };
      const currentSteps = getSteps(updated);
      const nextStep =
        currentSteps[currentSteps.findIndex((item) => item.id === step.id) + 1];
      return {
        ...updated,
        page: nextStep ? "play" : "ending",
        cursor: nextStep?.id ?? step.id,
      };
    });
  }
  function setupNext() {
    setGame((previous) => {
      if (previous.page === "prologue")
        return previous.prologue < 2
          ? { ...previous, prologue: previous.prologue + 1 }
          : { ...previous, page: "contract" };
      if (previous.page === "contract")
        return { ...previous, page: "tutorial" };
      if (previous.page === "tutorial") return { ...previous, page: "house" };
      if (previous.contract === "jeonse" && previous.house === "goshiwon")
        return previous;
      return { ...previous, page: "play", cursor: "listing" };
    });
  }
  const playProps: PlayViewProps = {
    step,
    selected,
    answered,
    notes,
    feedback,
    onChoose: choose,
    onToggle: toggle,
    onSubmit: submit,
    onNext: next,
    onRetry: () => replay(step.id),
  };
  const homeProps = {
    started: game.page !== "home",
    onStartNew: () => (game.page !== "home" ? setModal("new") : restart()),
    onResume: () => setShowHome(false),
    onReplay: replay,
    onSameHome: () => restart("same"),
    onOtherHome: () => restart("other"),
  };

  return (
    <div className="app-shell">
      <Header onHome={() => setShowHome(true)} />
      <main ref={appRef} tabIndex={-1} className="app-main">
        {storageFailed && (
          <div className="storage-notice" role="status">
            브라우저에 진행 기록을 저장할 수 없어요. 이 창에서는 계속 진행할 수
            있지만 새로고침하면 기록이 사라질 수 있어요.
          </div>
        )}
        {isHome ? (
          <HomeView {...homeProps} />
        ) : ending ? (
          <>
            <HomeView {...homeProps} ending={getEnding(game)} notes={notes} />
          </>
        ) : game.page !== "play" ? (
          <ChooseView
            key={game.page + ":" + game.contract}
            page={game.page}
            prologue={game.prologue}
            home={home}
            contract={game.contract}
            onChooseContract={(contract) =>
              setGame((previous) => ({
                ...previous,
                contract,
                house:
                  contract === "jeonse" && previous.house === "goshiwon"
                    ? "oneroom"
                    : previous.house,
              }))
            }
            onChooseHome={(house) =>
              setGame((previous) =>
                previous.contract === "jeonse" && house === "goshiwon"
                  ? previous
                  : { ...previous, house },
              )
            }
            onNext={setupNext}
            onBack={() =>
              setGame((previous) => ({
                ...previous,
                page:
                  previous.page === "house"
                    ? "tutorial"
                    : previous.page === "tutorial"
                      ? "contract"
                      : "prologue",
              }))
            }
          />
        ) : (
          <>
            <div className="play-layout">
              <div
                className="play-main"
                key={step.id + ":" + (answered ? "answered" : "pending")}
              >
                {step.kind === "inspection" ? (
                  <ExploreView {...playProps} />
                ) : step.kind === "checklist" ||
                  step.document === "registry" ||
                  step.document === "lease" ? (
                  <DocumentView
                    {...playProps}
                    home={home}
                    contract={game.contract}
                  />
                ) : (
                  <TalkView {...playProps} />
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <AppModals
        modal={modal}
        onClose={() => setModal(null)}
        onStartNew={() => restart()}
      />
    </div>
  );
}

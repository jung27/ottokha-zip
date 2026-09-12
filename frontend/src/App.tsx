import { useEffect, useRef, useState } from "react";
import { OnboardingModal } from "./components/OnboardingModal";
import { Header } from "./components/Header";
import { AppModals } from "./components/modals/AppModals";
import {
  parseRecommendation,
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

const THEME_KEY = "eotteokhajip-theme";
const INTRO_KEY = "eotteokhajip-onboarding-seen";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost"
).replace(/\/$/, "");

export default function App() {
  const [game, setGame] = useState<GameState>(() => {
    try {
      return restoreGame(localStorage.getItem(STORAGE_KEY));
    } catch {
      return makeNewGame();
    }
  });
  const [showHome, setShowHome] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return localStorage.getItem(INTRO_KEY) !== "true";
    } catch {
      return false;
    }
  });
  const [recommendation, setRecommendation] = useState("");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#ffffff" : "#11191f");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* 화면 전환은 저장 없이도 동작한다. */
    }
  }, [theme]);
  function finishOnboarding() {
    try {
      localStorage.setItem(INTRO_KEY, "true");
    } catch {
      /* 저장을 허용하지 않는 브라우저 */
    }
    setShowOnboarding(false);
  }
  async function handleStartWithAI(input: string, signal: AbortSignal) {
    const timeout = new AbortController();
    const timer = window.setTimeout(() => timeout.abort(), 15000);
    try {
      const response = await fetch(
        API_BASE_URL + "/api?text=" + encodeURIComponent(input),
        { signal: AbortSignal.any([signal, timeout.signal]) },
      );
      if (!response.ok)
        throw new Error(
          "추천 서버에 연결하지 못했습니다. 다시 시도하거나 조건을 직접 선택해주세요.",
        );
      const result = parseRecommendation(await response.json());
      if (signal.aborted) return;
      setGame({ ...makeNewGame(), ...result, page: "contract" });
      setRecommendation(
        "AI가 고른 조건: " +
          (result.contract === "monthly" ? "월세" : "전세 + 대출") +
          " · " +
          selectedHome({ ...makeNewGame(), ...result }).name,
      );
      setShowHome(false);
    } catch (error) {
      if (signal.aborted) return;
      if (timeout.signal.aborted)
        throw new Error(
          "추천 응답이 늦어지고 있습니다. 다시 시도하거나 조건을 직접 선택해주세요.",
          { cause: error },
        );
      throw error instanceof TypeError
        ? new Error(
            "추천 서버에 연결하지 못했습니다. 조건을 직접 선택할 수 있습니다.",
            { cause: error },
          )
        : error;
    } finally {
      window.clearTimeout(timer);
    }
  }
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
        showOnboarding ||
        e.repeat ||
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        !/^[1-9]$/.test(e.key)
      )
        return;
      if (
        e.target instanceof HTMLElement &&
        e.target.closest(
          'input,textarea,select,button,summary,a,[role="dialog"],[role="alertdialog"]',
        )
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
  }, [modal, showOnboarding]);

  function restart(mode: "start" | "same" | "other" = "start") {
    setModal(null);
    setShowHome(false);
    setRecommendation("");
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
    if (
      step.requireAll &&
      !step.items?.every((item) => selected.includes(item.id))
    )
      return;
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
    if (
      step.requireAll &&
      !step.items?.every((item) => selected.includes(item.id))
    )
      return;
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
    onStartWithAI: handleStartWithAI,
    onAppendix: () => setModal("appendix"),
  };

  return (
    <div className="app-shell">
      <Header
        onHome={() => setShowHome(true)}
        onGuide={() => setShowOnboarding(true)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
      />
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
            recommendation={recommendation}
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
      {showOnboarding && <OnboardingModal onFinish={finishOnboarding} />}
      <AppModals
        modal={modal}
        onClose={() => setModal(null)}
        onStartNew={() => restart()}
      />
    </div>
  );
}

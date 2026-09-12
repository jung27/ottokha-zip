import { useEffect, useRef, useState } from "react";
import { OnboardingModal } from "./components/OnboardingModal";
import { Header } from "./components/Header";
import { StageBar } from "./components/StageBar";
import { SceneImagePreloader } from "./components/Journal";
import { AppModals } from "./components/modals/AppModals";
import {
  parseRecommendation,
  getCheckpoints,
  getReviewCheckpoints,
  getEnding,
  getSteps,
  makeNewGame,
  selectedHome,
} from "./data";
import { type GameState, type ModalKind, type PlayViewProps } from "./types";
import { ChooseView } from "./views/ChooseView";
import { DocumentView } from "./views/DocumentView";
import { ExploreView } from "./views/ExploreView";
import { HomeView } from "./views/HomeView";
import { TalkView } from "./views/TalkView";
import { EndingScene } from "./views/EndingScene";
import {
  advanceGame,
  chooseAnswer,
  getSuccessExplanation,
  retryStep,
  submitChecks,
} from "./choiceFlow";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost"
).replace(/\/$/, "");

export default function App() {
  const [game, setGame] = useState<GameState>(makeNewGame);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    if (!recommendation) return;
    const timer = window.setTimeout(() => {
      setRecommendation("");
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [recommendation]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#ffffff" : "#11191f");
  }, [theme]);

  function finishOnboarding() {
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

      const newGame = { ...makeNewGame(), ...result, page: "house" as const };
      const contractLabelText =
        result.contract === "monthly" ? "월세" : "전세 + 대출";
      const homeName = selectedHome(newGame).name;

      setGame(newGame);
      setRecommendation(
        `AI가 '${contractLabelText} · ${homeName}' 조건을 추천했습니다.`,
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
  const appRef = useRef<HTMLElement>(null);
  const home = selectedHome(game);
  const steps = getSteps(game);
  const index = Math.max(
    0,
    steps.findIndex((step) => step.id === game.cursor),
  );
  const step = steps[index];
  const notes = getReviewCheckpoints(game);
  const answered = Object.hasOwn(game.answers, step.id);
  const selected = game.answers[step.id] ?? game.drafts[step.id] ?? [];
  const feedback = getCheckpoints(game).filter((n) => n.stepId === step.id);
  const isHome = showHome || game.page === "home";
  const ending = game.page === "ending" && !showHome;

  useEffect(() => {
    // 브라우저의 뒤로 가기 캐시로 다시 방문해도 새 게임으로 시작한다.
    const startFresh = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", startFresh);
    return () => window.removeEventListener("pageshow", startFresh);
  }, []);

  useEffect(() => {
    const label = isHome
      ? "처음 만나는 나의 집"
      : ending
        ? "이야기의 끝"
        : game.page === "play"
          ? step.title
          : "첫 집을 고르다";
    document.title = label + " | 어떡하집?";

    // 현재 URL에 붙어있던 ?d=... 등의 쿼리 보존
    const queryPart = window.location.hash.includes("?")
      ? "?" + window.location.hash.split("?")[1]
      : "";

    const targetHash = isHome
      ? "home"
      : game.page === "play"
        ? step.id
        : game.page + (game.page === "ending" ? queryPart : "");

    window.history.replaceState(null, "", "#" + targetHash);
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
        "[data-choices] button",
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
    setReviewOpen(false);
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

  function choose(id: string) {
    setGame((previous) => chooseAnswer(previous, step.id, id));
  }

  function toggle(id: string) {
    if (answered || !step.items?.some((item) => item.id === id)) return;
    setGame((previous) => {
      const current = previous.drafts[step.id] ?? [];
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
    setGame((previous) => submitChecks(previous, step.id));
  }

  function next() {
    setGame((previous) => advanceGame(previous, step.id));
  }

  function setupNext() {
    setGame((previous) => {
      if (previous.page === "prologue")
        return previous.prologue < 2
          ? { ...previous, prologue: previous.prologue + 1 }
          : { ...previous, page: "contract" };
      if (previous.page === "contract") return { ...previous, page: "house" };
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
    attempted: game.attempts[step.id] ?? [],
    successText: getSuccessExplanation(game, step),
    onChoose: choose,
    onToggle: toggle,
    onSubmit: submit,
    onNext: next,
    onRetry: () => setGame((previous) => retryStep(previous, step.id)),
  };

  const homeProps = {
    game,
    started: game.page !== "home",
    onStartNew: () => (game.page !== "home" ? setModal("new") : restart()),
    onChooseConditions: () =>
      game.page === "play" || game.page === "ending"
        ? setModal("conditions")
        : restart("other"),
    onResume: () => setShowHome(false),
    onSameHome: () => restart("same"),
    onOtherHome: () => restart("other"),
    onStartWithAI: handleStartWithAI,
    onAppendix: () => setModal("appendix"),
  };

  return (
    <div className="min-h-svh">
      <SceneImagePreloader
        backgrounds={
          game.page === "play" && !isHome
            ? [
                step.background,
                ...step.beats.map((beat) => beat.background ?? step.background),
                ...(steps[index + 1]
                  ? [
                      steps[index + 1].beats[0]?.background ??
                        steps[index + 1].background,
                    ]
                  : []),
              ]
            : ["app", "message", "office"]
        }
      />
      <Header
        onHome={() => setShowHome(true)}
        onGuide={() => setShowOnboarding(true)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
      />
      <main
        ref={appRef}
        tabIndex={-1}
        className={`mx-auto w-[min(1184px,100%)] px-7 pt-2.5 pb-[30px] outline-none has-[[data-scene]]:w-[min(1344px,100%)]
        max-[800px]:px-5 max-[600px]:px-3 max-[600px]:pt-1.5 max-[600px]:pb-5`}
      >
        {!isHome && game.page === "play" && <StageBar stage={step.stage} />}
        {isHome ? (
          <HomeView {...homeProps} />
        ) : ending ? (
          reviewOpen ? (
            <HomeView {...homeProps} ending={getEnding(game)} notes={notes} />
          ) : (
            <EndingScene home={home} onReview={() => setReviewOpen(true)} />
          )
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
                page: previous.page === "house" ? "contract" : "prologue",
              }))
            }
          />
        ) : (
          <>
            <div>
              <div key={step.id}>
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
        onStartNew={() => restart(modal === "conditions" ? "other" : "start")}
      />
    </div>
  );
}

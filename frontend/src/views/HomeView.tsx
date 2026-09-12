import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { isRiskCheckpoint } from "../data";
import { STAGES, type Checkpoint, type Ending, type Stage } from "../types";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost"
).replace(/\/$/, "");

const promptSuggestions = [
  "첫 취업으로 보증금 500에 월세 구하고 있어",
  "대학가 근처에서 1년 동안 잠깐 살 저렴한 방",
  "중기청 대출받아서 깨끗한 전세 빌라 가고 싶어",
  "채광 좋은 옥탑방에서 낭만 있게 독립하기",
];

function ReviewCards({ notes }: { notes: Checkpoint[] }) {
  return (
    <div className="grid gap-3.5">
      {notes.map((note) => (
        <article
          className={`group/review rounded-[14px] border border-line p-[22px] data-[status=risk]:border-risk-line [&>p]:mt-2
          [&>p]:text-[0.79rem] [&>p]:whitespace-pre-line [&>p]:text-muted max-[600px]:rounded-xl max-[600px]:p-4
          max-[600px]:[&>p]:text-[0.73rem] max-[600px]:[&_h3]:text-[0.83rem] `}
          data-status={note.status}
          key={note.id}
        >
          <div className="mb-3.5 flex items-start gap-3 border-b border-line pb-[13px] [&_p]:text-[0.83rem] max-[600px]:gap-[9px] max-[600px]:[&_p]:text-[0.75rem]">
            <span
              className={`rounded-md bg-accent-soft px-2 py-[5px] text-[0.65rem] font-semibold whitespace-nowrap text-accent
              group-data-[status=risk]/review:bg-risk-bg group-data-[status=risk]/review:text-risk`}
            >
              {note.category === "notice" ? "안내" : note.status === "risk" ? "다시 확인" : "확인함"}
            </span>
            <p>{note.choice}</p>
          </div>
          <h3>{note.title}</h3>
          <p>{note.consequence}</p>
          {note.advice && (
            <div className="mt-[15px] rounded-[9px] bg-soft px-[15px] py-3 text-xs leading-[1.85]">
              {note.advice}
            </div>
          )}
          {note.explanation && (
            <div className="mt-4 rounded-lg border border-line bg-soft p-4 text-xs leading-relaxed">
              <h4 className="mb-2 font-semibold">{note.explanation.title}</h4>
              <p className="whitespace-pre-line">{note.explanation.text}</p>
              {note.explanation.advice && <p className="mt-2 whitespace-pre-line">{note.explanation.advice}</p>}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export function HomeView({
  started,
  onStartNew,
  onChooseConditions,
  onResume,
  onStartWithAI,
  ending,
  notes = [],
  onReplay,
  onSameHome,
  onOtherHome,
  onAppendix,
}: {
  started: boolean;
  onStartNew: () => void;
  onChooseConditions: () => void;
  onResume: () => void;
  onStartWithAI: (input: string, signal: AbortSignal) => Promise<void>;
  ending?: Ending;
  notes?: Checkpoint[];
  onReplay: (step: string) => void;
  onSameHome: () => void;
  onOtherHome: () => void;
  onAppendix: () => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<Stage>(1);

  // 요약 기능 관련 상태
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const request = useRef<AbortController | null>(null);
  const summaryRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      request.current?.abort();
      summaryRequest.current?.abort();
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!prompt.trim() || loading) return;
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");
    try {
      await onStartWithAI(prompt.trim(), controller.signal);
    } catch (err) {
      if (!controller.signal.aborted)
        setError(
          err instanceof Error
            ? err.message
            : "추천을 불러오지 못했습니다. 직접 조건을 선택할 수 있습니다.",
        );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  // 위험 선택지 요약 요청 핸들러
  async function handleSummarizeRisks() {
    setShowSummaryModal(true);
    if (summary) return; // 이미 요약된 내용이 있으면 재요청 생략

    const riskNotes = notes.filter(isRiskCheckpoint);
    if (riskNotes.length === 0) {
      setSummary(
        "이번 계약 과정에서 발생한 위험 선택이나 주의 항목이 없습니다! 안전하게 잘 진행하셨습니다.",
      );
      return;
    }

    const aggregatedText = riskNotes
      .map(
        (n, idx) =>
          `[항목 ${idx + 1}] 단계/주제: ${n.title}\n선택 내용: ${n.choice}\n결과: ${n.consequence}${n.advice ? `\n조언: ${n.advice}` : ""}`,
      )
      .join("\n\n");

    const controller = new AbortController();
    summaryRequest.current = controller;
    setSummaryLoading(true);
    setSummaryError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/summarize?text=${encodeURIComponent(aggregatedText)}`,
        { signal: controller.signal },
      );
      if (!res.ok) {
        throw new Error(
          "서버에서 요약을 생성하지 못했습니다. 잠시 후 다시 시도해주세요.",
        );
      }
      const data: { summary: string } = await res.json();
      setSummary(data.summary);
    } catch (err) {
      if (!controller.signal.aborted) {
        setSummaryError(
          err instanceof Error
            ? err.message
            : "요약을 가져오는 중 문제가 발생했습니다.",
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setSummaryLoading(false);
      }
    }
  }

  if (ending) {
    const stageNotes = notes.filter((note) => note.stage === stage);
    const totalRiskCount = notes.filter(isRiskCheckpoint).length;

    return (
      <div className="mx-auto max-w-[1020px] py-8 max-[600px]:px-1 max-[600px]:py-[25px]">
        <div className="mb-9 text-center [&>p]:mt-3.5 [&>p]:text-[0.93rem] [&>p]:text-muted max-[600px]:[&_h1]:text-[1.6rem] max-[600px]:[&_p]:text-[0.83rem]">
          <span className="mb-[9px] block text-[0.72rem] font-[650] text-accent">
            나의 첫 임대계약
          </span>
          <h1>이번 계약을 돌아보며</h1>
          <p>{ending.text}</p>
        </div>

        {/* 주의해야 할 점 요약 버튼 배너 */}
        <div className="mb-8 flex justify-center">
          <button
            type="button"
            onClick={handleSummarizeRisks}
            className={`inline-flex items-center gap-2.5 rounded-full border border-risk-line bg-surface px-5 py-2.5
              text-[0.82rem] font-[650] text-risk shadow-[0_4px_18px_rgba(235,87,87,0.1)] transition-all
              hover:border-risk hover:bg-risk-bg hover:shadow-[0_6px_22px_rgba(235,87,87,0.18)] max-[600px]:px-4 max-[600px]:text-[0.76rem]`}
          >
            <Icon name="spark" />
            <span>주의해야 할 점 요약 보기</span>
            <span className="rounded-full bg-risk-bg px-2 py-0.5 text-[0.68rem] font-bold">
              {totalRiskCount}건
            </span>
          </button>
        </div>

        <div
          className={`mb-[30px] grid grid-cols-5 gap-[9px] [&_button]:flex [&_button]:flex-col [&_button]:items-center
            [&_button]:gap-[7px] [&_button]:rounded-[13px] [&_button]:border [&_button]:border-line [&_button]:bg-soft
            [&_button]:px-2 [&_button]:py-[15px] [&_button]:text-[0.78rem]
            [&_button[aria-selected=true]]:border-accent [&_button[aria-selected=true]]:bg-accent-soft
            [&_button[aria-selected=true]]:text-accent [&_svg]:size-[21px] [&_small]:text-[0.62rem]
            [&_small]:text-muted max-[600px]:gap-[5px] max-[600px]:[&_button]:gap-1.5
            max-[600px]:[&_button]:rounded-[10px] max-[600px]:[&_button]:px-[3px] max-[600px]:[&_button]:py-3
            max-[600px]:[&_button]:text-[0.63rem] max-[600px]:[&_small]:text-[0.53rem] max-[600px]:[&_svg]:size-[18px]`}
          role="tablist"
          aria-label="단계별 계약 리뷰"
        >
          {STAGES.filter((item) => item.id < 6).map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={stage === item.id}
              aria-controls="review-panel"
              id={"review-tab-" + item.id}
              onClick={() => setStage(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.title}</span>
              <small>
                위험{" "}
                {
                  notes.filter(
                    (note) => note.stage === item.id && isRiskCheckpoint(note),
                  ).length
                }
              </small>
            </button>
          ))}
        </div>
        <section
          id="review-panel"
          role="tabpanel"
          aria-labelledby={"review-tab-" + stage}
        >
          <div className="mb-[15px] flex items-center justify-between gap-3.5 [&_h2]:text-[1.13rem] [&_button]:px-3 [&_button]:py-[9px] [&_button]:text-[0.72rem]">
            <h2>{STAGES.find((item) => item.id === stage)?.title}</h2>
            <button
              className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-[18px] py-[11px]
                text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
                duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
                max-[600px]:py-2.5 max-[600px]:text-[0.74rem] border border-line bg-surface text-ink
                enabled:hover:border-accent enabled:hover:bg-accent-soft`}
              onClick={() => onReplay(stageNotes[0]?.stepId ?? "listing")}
            >
              <Icon name="reset" />이 단계 다시 보기
            </button>
          </div>
          <ReviewCards notes={stageNotes} />
        </section>
        <div
          className={`mt-7 flex flex-wrap justify-center gap-2.5 border-t border-line pt-[26px] max-[600px]:gap-2
          max-[600px]:[&>button]:p-2.5 max-[600px]:[&>button]:text-[0.68rem]`}
        >
          <button
            className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-1.5 py-[11px]
            text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
            duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
            max-[600px]:py-2.5 max-[600px]:text-[0.74rem] text-muted hover:text-accent`}
            onClick={onStartNew}
          >
            처음부터
          </button>
          <button
            className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-[18px] py-[11px]
            text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
            duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
            max-[600px]:py-2.5 max-[600px]:text-[0.74rem] border border-line bg-surface text-ink
            enabled:hover:border-accent enabled:hover:bg-accent-soft`}
            onClick={onSameHome}
          >
            같은 집, 다른 선택
          </button>
          <button
            className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-[18px] py-[11px]
            text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
            duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
            max-[600px]:py-2.5 max-[600px]:text-[0.74rem] border border-line bg-surface text-ink
            enabled:hover:border-accent enabled:hover:bg-accent-soft`}
            onClick={onOtherHome}
          >
            다른 조합 해보기
          </button>
          <button
            className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-[18px] py-[11px]
            text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
            duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
            max-[600px]:py-2.5 max-[600px]:text-[0.74rem] border border-mint bg-mint text-[#173d29]
            enabled:hover:border-[#b1dbbf] enabled:hover:bg-[#b1dbbf]`}
            data-button="primary"
            onClick={onAppendix}
          >
            부록
            <Icon name="external" />
          </button>
        </div>

        {/* 요약 모달 */}
        {showSummaryModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="summary-modal-title"
            onClick={() => setShowSummaryModal(false)}
          >
            <div
              className="relative w-full max-w-[620px] rounded-2xl border border-line bg-surface p-7 shadow-2xl max-[600px]:p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between border-b border-line pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-risk-bg text-risk">
                    <Icon name="spark" />
                  </span>
                  <h2
                    id="summary-modal-title"
                    className="text-[1.05rem] font-bold text-ink"
                  >
                    주의해야 할 점 요약
                  </h2>
                </div>
                <button
                  type="button"
                  className="rounded-lg p-1 text-muted hover:bg-soft hover:text-ink"
                  onClick={() => setShowSummaryModal(false)}
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>

              <div className="min-h-[140px] text-[0.88rem] leading-[1.8] text-ink">
                {summaryLoading ? (
                  <div className="flex min-h-[140px] flex-col items-center justify-center gap-3 text-muted">
                    <span className="inline-block size-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                    <p className="text-[0.82rem]">
                      위험했던 선택들을 AI가 분석하고 요약 중입니다…
                    </p>
                  </div>
                ) : summaryError ? (
                  <div className="rounded-xl bg-risk-bg p-4 text-risk">
                    <p className="font-semibold">{summaryError}</p>
                    <button
                      type="button"
                      onClick={handleSummarizeRisks}
                      className="mt-3 text-[0.78rem] underline underline-offset-4"
                    >
                      다시 시도하기
                    </button>
                  </div>
                ) : (
                  <div className="max-h-[60vh] overflow-y-auto pr-1">
                    <p className="whitespace-pre-line text-muted">{summary}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className={`rounded-xl border border-line bg-surface px-5 py-2.5 text-[0.82rem] font-semibold text-ink
                    hover:border-accent hover:bg-accent-soft`}
                  onClick={() => setShowSummaryModal(false)}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section
      className={`flex min-h-[calc(100svh-130px)] flex-col items-center justify-center pt-12 pb-[88px] text-center
      max-[600px]:min-h-[calc(100svh-100px)] max-[600px]:px-1 max-[600px]:pt-[35px] max-[600px]:pb-[65px]`}
    >
      <div
        className={`flex items-center gap-4 [&_h1]:text-[clamp(2.7rem,6vw,4.25rem)] [&_h1]:font-extrabold
        [&_h1]:tracking-[-0.075em] [&_h1>span]:text-accent max-[600px]:gap-2.5`}
      >
        <span
          className={`flex size-[66px] items-center justify-center rounded-[20px] border border-line bg-accent-soft text-accent
          [&_svg]:size-[39px] max-[800px]:size-[57px] max-[800px]:rounded-[17px] max-[800px]:[&_svg]:size-8
          max-[600px]:size-[49px] max-[600px]:rounded-[14px] max-[600px]:[&_svg]:size-7`}
        >
          <Icon name="door" />
        </span>
        <h1>
          어떡하집<span>?</span>
        </h1>
      </div>
      <p className="mt-[22px] mb-8 text-[0.94rem] leading-[1.9] text-muted max-[600px]:mt-5 max-[600px]:mb-[26px] max-[600px]:text-[0.84rem]">
        내 상황에 맞는 조건으로,
        <br />첫 번째 계약을 시작해보세요.
      </p>
      <div className="w-full max-w-[760px]">
        <form
          onSubmit={submit}
          className={`flex items-center gap-2.5 rounded-[18px] border border-line bg-surface p-[9px]
          shadow-[0_8px_38px_#284f3320] focus-within:border-accent [&>svg]:ml-2.5 [&>svg]:size-[19px]
          [&>svg]:shrink-0 [&>svg]:text-accent [&_input]:min-w-0 [&_input]:w-full [&_input]:border-0
          [&_input]:bg-transparent [&_input]:px-[5px] [&_input]:py-[13px] [&_input]:text-[0.85rem]
          [&_input]:text-ink [&_input]:outline-none [&_input::placeholder]:text-muted
          [&_[data-button=primary]]:min-h-[46px] [&_[data-button=primary]]:shrink-0
          [&_[data-button=primary]]:px-[21px] max-[600px]:gap-[5px] max-[600px]:rounded-[14px] max-[600px]:p-[7px]
          max-[600px]:[&>svg]:hidden max-[600px]:[&_input]:px-1.5 max-[600px]:[&_input]:py-[11px]
          max-[600px]:[&_input]:text-[0.73rem] max-[600px]:[&_[data-button=primary]]:min-h-[42px]
          max-[600px]:[&_[data-button=primary]]:gap-1.5 max-[600px]:[&_[data-button=primary]]:px-3
          max-[600px]:[&_[data-button=primary]]:py-2.5 max-[600px]:[&_[data-button=primary]]:text-[0.7rem]`}
        >
          <Icon name="spark" />
          <label className="sr-only" htmlFor="situation">
            나의 상황
          </label>
          <input
            id="situation"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            disabled={loading}
            placeholder="지금 어떤 집을 찾고 있나요? (예: 보증금 500에 회사 근처 월세)"
            maxLength={1000}
          />
          <button
            className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-[18px] py-[11px]
              text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
              duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
              max-[600px]:py-2.5 max-[600px]:text-[0.74rem] border border-mint bg-mint text-[#173d29]
              enabled:hover:border-[#b1dbbf] enabled:hover:bg-[#b1dbbf]`}
            data-button="primary"
            type="submit"
            disabled={!prompt.trim() || loading}
          >
            {loading ? "추천 중…" : "AI 추천"}
            <Icon name="arrow" />
          </button>
        </form>
        {error && (
          <p className="mt-3 text-[0.78rem] text-risk" role="alert">
            {error}
          </p>
        )}
        <div
          className={`mt-[18px] flex flex-wrap justify-center gap-2 [&_button]:rounded-lg [&_button]:border
          [&_button]:border-line [&_button]:bg-soft [&_button]:px-[11px] [&_button]:py-[7px]
          [&_button]:text-[0.66rem] [&_button]:text-muted [&_button:enabled:hover]:border-accent
          [&_button:enabled:hover]:text-accent max-[600px]:mt-3.5 max-[600px]:gap-1.5 max-[600px]:[&_button]:px-2
          max-[600px]:[&_button]:text-[0.6rem]`}
        >
          {promptSuggestions.map((text) => (
            <button
              key={text}
              disabled={loading}
              onClick={() => setPrompt(text)}
            >
              {text}
            </button>
          ))}
        </div>
        <div className="mt-7 max-[600px]:mt-6">
          <button
            className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-[18px] py-[11px]
              text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
              duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
              max-[600px]:py-2.5 max-[600px]:text-[0.74rem] border border-line bg-surface text-ink
              enabled:hover:border-accent enabled:hover:bg-accent-soft`}
            onClick={onChooseConditions}
            disabled={loading}
          >
            조건 직접 선택하기
            <Icon name="arrow" />
          </button>
        </div>
      </div>
      {started && (
        <button
          className="mt-7 inline-flex min-h-10 items-center gap-[7px] text-[0.77rem] text-accent [&_svg]:size-[15px]"
          disabled={loading}
          onClick={onResume}
        >
          <Icon name="reset" />
          이어서 하기
        </button>
      )}
    </section>
  );
}

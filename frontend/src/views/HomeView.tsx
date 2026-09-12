import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { STAGES, type Checkpoint, type Ending, type Stage } from "../types";

const promptSuggestions = [
  "첫 취업으로 보증금 500에 월세 구하고 있어",
  "대학가 근처에서 1년 동안 잠깐 살 저렴한 방",
  "중기청 대출받아서 깨끗한 전세 빌라 가고 싶어",
  "채광 좋은 옥탑방에서 낭만 있게 독립하기",
];

function ReviewCards({ notes }: { notes: Checkpoint[] }) {
  return (
    <div className="review-cards">
      {notes.map((note) => (
        <article className={"review-card " + note.status} key={note.id}>
          <div className="review-card-top">
            <span className="review-status">
              {note.status === "risk" ? "다시 확인" : "확인함"}
            </span>
            <p>{note.choice}</p>
          </div>
          <h3>{note.title}</h3>
          <p>{note.consequence}</p>
          {note.advice && <div className="review-advice">{note.advice}</div>}
        </article>
      ))}
    </div>
  );
}
export function HomeView({
  started,
  onStartNew,
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
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
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
  if (ending) {
    const stageNotes = notes.filter((note) => note.stage === stage);
    return (
      <div className="ending-view">
        <div className="ending-heading">
          <span className="section-kicker">나의 첫 임대계약</span>
          <h1>이번 계약을 돌아보며</h1>
          <p>{ending.text}</p>
        </div>
        <div
          className="review-stage-tabs"
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
                    (note) => note.stage === item.id && note.status === "risk",
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
          <div className="review-heading">
            <h2>{STAGES.find((item) => item.id === stage)?.title}</h2>
            <button
              className="secondary-button"
              onClick={() => onReplay(stageNotes[0]?.stepId ?? "listing")}
            >
              <Icon name="reset" />이 단계 다시 보기
            </button>
          </div>
          <ReviewCards notes={stageNotes} />
        </section>
        <div className="ending-actions">
          <button className="text-button" onClick={onStartNew}>
            처음부터
          </button>
          <button className="secondary-button" onClick={onSameHome}>
            같은 집, 다른 선택
          </button>
          <button className="secondary-button" onClick={onOtherHome}>
            다른 조합 해보기
          </button>
          <button className="primary-button" onClick={onAppendix}>
            부록
            <Icon name="external" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <section className="home-view">
      <div className="home-logo">
        <span className="home-logo-mark">
          <Icon name="door" />
        </span>
        <h1>
          어떡하집<span>?</span>
        </h1>
      </div>
      <p className="home-subtitle">
        내 상황에 맞는 조건으로,
        <br />첫 번째 계약을 시작해보세요.
      </p>
      <div className="home-input-area">
        <form onSubmit={submit} className="recommendation-form">
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
            className="primary-button"
            type="submit"
            disabled={!prompt.trim() || loading}
          >
            {loading ? "추천 중…" : "AI 추천"}
            <Icon name="arrow" />
          </button>
        </form>
        {error && (
          <p className="request-error" role="alert">
            {error}
          </p>
        )}
        <div className="prompt-suggestions">
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
        <div className="home-direct">
          <button
            className="secondary-button"
            onClick={onStartNew}
            disabled={loading}
          >
            조건 직접 선택하기
            <Icon name="arrow" />
          </button>
        </div>
      </div>
      {started && (
        <button className="resume-button" disabled={loading} onClick={onResume}>
          <Icon name="reset" />
          이어서 하기
        </button>
      )}
    </section>
  );
}

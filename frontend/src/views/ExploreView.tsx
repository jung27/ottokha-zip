import { useState } from "react";
import { DialogueBox, NextButton, SceneFrame } from "../components/Journal";
import { FeedbackPanel } from "./TalkView";
import type { PlayViewProps } from "../types";

export function ExploreView({
  step,
  selected,
  answered,
  feedback,
  onToggle,
  onSubmit,
  onNext,
  onRetry,
}: PlayViewProps) {
  const [line, setLine] = useState(0);
  const [detail, setDetail] = useState<string | null>(null);
  const interactive = line >= step.beats.length;
  const current = step.beats[Math.min(line, step.beats.length - 1)];
  const items = step.items ?? [];
  const commonCount = items.filter(
    (item) => !item.extra && selected.includes(item.id),
  ).length;
  const item = items.find((point) => point.id === detail);
  function inspect(id: string) {
    setDetail(id);
    if (!selected.includes(id)) onToggle(id);
  }
  const points = (extra: boolean) =>
    items
      .filter((point) => !!point.extra === extra)
      .map((point) => (
        <button
          key={point.id}
          className={
            "inspection-button " +
            (selected.includes(point.id) ? "selected" : "")
          }
          aria-pressed={selected.includes(point.id)}
          disabled={
            answered ||
            (!point.extra && commonCount >= 5 && !selected.includes(point.id))
          }
          onClick={() => inspect(point.id)}
        >
          <span>{selected.includes(point.id) ? "✓" : "+"}</span>
          {point.title}
        </button>
      ));
  return (
    <SceneFrame
      background={
        interactive || answered
          ? "room"
          : (current.background ?? step.background)
      }
      context={
        item ? item.description + item.signal + item.advice : "결로 하자 관리비"
      }
      overlay={
        answered ? (
          <FeedbackPanel
            feedback={feedback}
            notice={step.notice}
            onNext={onNext}
            onRetry={onRetry}
          />
        ) : undefined
      }
      scene={
        interactive || answered ? (
          <div className="inspection-points">
            <div className="inspection-heading">방 안 · 다섯 곳 선택</div>
            <div className="inspection-grid">{points(false)}</div>
            <div className="inspection-heading">추가로 살펴볼 곳</div>
            <div className="inspection-grid">{points(true)}</div>
          </div>
        ) : undefined
      }
    >
      {
        <DialogueBox
          speaker={interactive ? undefined : current.speaker}
          text={
            interactive
              ? (item?.description ?? "무엇부터 살펴볼까?")
              : current.text
          }
          actions={
            interactive ? (
              <>
                {item && (
                  <button
                    className="text-button"
                    onClick={() => {
                      onToggle(item.id);
                      setDetail(null);
                    }}
                  >
                    선택 해제
                  </button>
                )}
                <NextButton onClick={onSubmit} disabled={answered}>
                  임장 마치기
                </NextButton>
              </>
            ) : (
              <NextButton onClick={() => setLine(line + 1)} />
            )
          }
        >
          {interactive && item && (
            <div className="inspection-findings" aria-live="polite">
              <p>{item.signal}</p>
              {item.advice !== item.description && <p>{item.advice}</p>}
            </div>
          )}
        </DialogueBox>
      }
    </SceneFrame>
  );
}

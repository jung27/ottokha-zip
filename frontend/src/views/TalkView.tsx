import { useState, type ReactNode } from "react";
import { DialogueBox, NextButton, SceneFrame } from "../components/Journal";
import { ScenePopup } from "../components/StoryModal";
import type { Checkpoint, Feedback, PlayViewProps } from "../types";

export function FeedbackPanel({
  feedback,
  notice,
  onNext,
  onRetry,
}: {
  feedback: Checkpoint[];
  notice?: Feedback;
  onNext: () => void;
  onRetry: () => void;
}) {
  const [index, setIndex] = useState(0);
  const cards = [
    ...feedback
      .filter((item) => item.status === "risk")
      .map((item) => ({
        id: item.id,
        title: item.title,
        text: item.consequence,
        advice: item.advice,
        choice: item.choice,
        risk: true,
      })),
    ...(notice ? [{ id: "notice", ...notice, choice: "", risk: false }] : []),
  ];
  const current = cards[index];
  if (!current) return null;
  const proceed = () =>
    index < cards.length - 1 ? setIndex(index + 1) : onNext();
  return (
    <ScenePopup
      key={current.id}
      title={current.title}
      alert={current.risk}
      onClose={proceed}
      actions={
        <>
          <button className="text-button" onClick={onRetry}>
            다시 선택
          </button>
          <NextButton onClick={proceed} />
        </>
      }
    >
      {current.choice && (
        <p className="warning-choice">내 선택 · {current.choice}</p>
      )}
      <p className="warning-text">{current.text}</p>
      {current.advice && (
        <div className="warning-advice">
          <strong>이렇게 확인하세요</strong>
          <p>{current.advice}</p>
        </div>
      )}
    </ScenePopup>
  );
}

export function TalkView({
  step,
  selected,
  answered,
  feedback,
  onChoose,
  onNext,
  onRetry,
  scene,
}: PlayViewProps & { scene?: ReactNode }) {
  const [line, setLine] = useState(0);
  const current = step.beats[answered ? step.beats.length - 1 : line];
  const lastLine = line >= step.beats.length - 1;
  const chosen = step.choices?.find((choice) => selected.includes(choice.id));
  const warning = answered && feedback.some((item) => item.status === "risk");
  const context = [
    current.text,
    ...(lastLine ? (step.choices?.map((choice) => choice.label) ?? []) : []),
  ].join(" ");
  return (
    <SceneFrame
      background={current.background ?? step.background}
      context={context}
      scene={lastLine || answered ? scene : undefined}
      overlay={
        warning ? (
          <FeedbackPanel
            feedback={feedback}
            onNext={onNext}
            onRetry={onRetry}
          />
        ) : undefined
      }
    >
      <DialogueBox
        speaker={answered && !warning ? undefined : current.speaker}
        text={
          answered && !warning
            ? (chosen?.feedback.text ?? current.text)
            : current.text
        }
        actions={
          answered ? (
            <NextButton onClick={onNext} disabled={warning} />
          ) : !lastLine ? (
            <NextButton onClick={() => setLine(line + 1)} />
          ) : !step.choices ? (
            <NextButton onClick={onNext} />
          ) : null
        }
      >
        {lastLine && !answered && step.choices && (
          <div className="choices-container">
            {step.choices.map((choice, index) => (
              <button
                key={choice.id}
                className="choice-button"
                disabled={!!choice.disabledReason}
                onClick={() => onChoose(choice.id)}
              >
                <span className="choice-index">{index + 1}</span>
                <span>
                  {choice.label}
                  {choice.disabledReason && (
                    <small>{choice.disabledReason}</small>
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </DialogueBox>
    </SceneFrame>
  );
}

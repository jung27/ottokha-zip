import { useState, type ReactNode } from "react";
import { DialogueBox, NextButton, SceneFrame } from "../components/Journal";
import type { Checkpoint, Choice, PlayViewProps } from "../types";

export function FeedbackPanel({ feedback, choice, onNext, onRetry }: {
  feedback: Checkpoint[];
  choice?: Choice;
  onNext: () => void;
  onRetry: () => void;
}) {
  const [warning, setWarning] = useState(0);
  const risks = feedback.filter((item) => item.status === "risk");
  const current = risks[warning];
  const nextWarning = () => warning < risks.length - 1 ? setWarning(warning + 1) : onNext();
  return (
    <DialogueBox
      speaker={current ? "경고" : undefined}
      actions={<>
        <button className="text-button" onClick={onRetry}>다시 선택</button>
        <NextButton onClick={current ? nextWarning : onNext} />
      </>}
    >
      {current ? (
        <div className="warning-card view-enter" key={current.id} role="alert">
          <p className="warning-choice">{current.choice}</p>
          <h2>{current.title}</h2>
          <p>{current.consequence}</p>
          <div className="warning-advice"><strong>이렇게 확인하세요</strong><p>{current.advice}</p></div>
          {choice?.feedback.detail && <details>
            <summary>자세히 보기</summary><p>{choice.feedback.detail}</p>
          </details>}
        </div>
      ) : (
        <p className="dialogue-text" role="status">{choice?.feedback.text ?? "확인할 항목을 모두 살펴봤다."}</p>
      )}
    </DialogueBox>
  );
}

export function TalkView({ step, selected, answered, feedback, onChoose, onNext, onRetry, scene }: PlayViewProps & { scene?: ReactNode }) {
  const [line, setLine] = useState(0);
  const current = step.beats[answered ? step.beats.length - 1 : line];
  const lastLine = line >= step.beats.length - 1;
  const chosen = step.choices?.find((choice) => selected.includes(choice.id));
  const context = [current.text, ...(lastLine ? step.choices?.map((choice) => choice.label) ?? [] : []),
    ...(answered ? feedback.map((item) => item.consequence + item.advice) : [])].join(" ");
  return (
    <SceneFrame background={current.background ?? step.background} context={context} scene={lastLine || answered ? scene : undefined}>
      {answered && chosen ? (
        <FeedbackPanel feedback={feedback} choice={chosen} onNext={onNext} onRetry={onRetry} />
      ) : (
        <DialogueBox speaker={current.speaker} text={current.text}
          actions={!lastLine ? <NextButton onClick={() => setLine(line + 1)} />
            : !step.choices ? <NextButton onClick={onNext} /> : null}>
          {lastLine && step.choices && (
            <div className="choices-container">
              {step.choices.map((choice, index) => (
                <button key={choice.id} className="choice-button" disabled={!!choice.disabledReason}
                  onClick={() => onChoose(choice.id)}>
                  <span className="choice-index">{index + 1}</span>
                  <span>{choice.label}{choice.disabledReason && <small>{choice.disabledReason}</small>}</span>
                </button>
              ))}
            </div>
          )}
        </DialogueBox>
      )}
    </SceneFrame>
  );
}

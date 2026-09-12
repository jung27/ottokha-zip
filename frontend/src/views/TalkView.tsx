import { useEffect, useState, type ReactNode } from "react";
import { DialogueBox, NextButton, SceneFrame } from "../components/Journal";
import { ScenePopup } from "../components/StoryModal";
import type { Checkpoint, PlayViewProps } from "../types";

export function FeedbackPanel({
  feedback,
  onNext,
  onRetry,
  retryOnly = false,
}: {
  feedback: Checkpoint[];
  onNext: () => void;
  onRetry: () => void;
  retryOnly?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const cards = [
    ...feedback
      .filter((item) => item.showFeedback)
      .map((item) => ({
        id: item.id,
        title: item.title,
        text: item.consequence,
        advice: item.advice,
        choice: item.choice,
        risk: item.status === "risk",
      })),
  ];
  const current = cards[index];
  if (!current) return null;
  const mustRetry = retryOnly || current.risk;
  const proceed = () =>
    index < cards.length - 1 ? setIndex(index + 1) : onNext();
  return (
    <ScenePopup
      key={current.id}
      title={current.title}
      alert={current.risk}
      onClose={mustRetry ? onRetry : proceed}
      hideClose={mustRetry}
      actions={
        <>
          <button
            className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-1.5 py-[11px]
            text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
            duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
            max-[600px]:py-2.5 max-[600px]:text-[0.74rem] text-muted hover:text-accent`}
            onClick={onRetry}
          >
            다시 선택
          </button>
          {!mustRetry && <NextButton onClick={proceed} />}
        </>
      }
    >
      {current.choice && (
        <p className="mb-[11px] border-l-2 border-risk-line pl-[9px] text-[0.7rem] text-muted max-[600px]:text-[0.63rem]">
          내 선택 · {current.choice}
        </p>
      )}
      <p className="text-[0.81rem] whitespace-pre-line max-[600px]:text-[0.74rem] max-[600px]:leading-[1.85]">
        {current.text}
      </p>
      {current.advice && (
        <div
          className={`mt-[15px] rounded-[9px] bg-accent-soft p-3 text-[0.76rem] [&_strong]:text-[0.72rem] [&_strong]:text-accent
          [&_p]:mt-1 [&_p]:whitespace-pre-line max-[600px]:text-[0.69rem]`}
        >
          <strong>이렇게 확인하세요</strong>
          <p>{current.advice}</p>
        </div>
      )}
      {mustRetry && cards.filter((card) => card.risk && card.id !== current.id).map((card) => (
        <div key={card.id} className="mt-4 border-t border-line pt-4 text-xs leading-relaxed">
          <h3 className="mb-2 font-bold text-risk">{card.title}</h3>
          <p className="whitespace-pre-line">{card.text}</p>
          {card.advice && <p className="mt-2 whitespace-pre-line">{card.advice}</p>}
        </div>
      ))}
    </ScenePopup>
  );
}

export function TalkView({
  step,
  selected,
  answered,
  feedback,
  attempted,
  successText,
  onChoose,
  onNext,
  onRetry,
  scene,
}: PlayViewProps & { scene?: ReactNode }) {
  const [line, setLine] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  useEffect(() => {
    if (!transitioning) return;
    const timer = window.setTimeout(onNext, 1600);
    return () => window.clearTimeout(timer);
  }, [transitioning, onNext]);
  const current = step.beats[answered ? step.beats.length - 1 : line];
  const lastLine = line >= step.beats.length - 1;
  const chosen = step.choices?.find((choice) => selected.includes(choice.id));
  const warning = answered && chosen?.status === "risk";
  const correct = answered && chosen?.status === "checked";
  const context = [
    current.text,
    ...(lastLine ? (step.choices?.map((choice) => choice.label) ?? []) : []),
  ].join(" ");
  const choices = (lastLine || answered) && step.choices && (
    <div
      className={`min-h-0 max-h-full w-[min(680px,100%)] shrink overflow-y-auto rounded-2xl border
      border-[color-mix(in_srgb,var(--color-surface)_70%,var(--color-line))] bg-surface/68 p-3.5
      shadow-[0_8px_28px_#152b2420] backdrop-blur-[12px] [scrollbar-width:thin] [&_[data-choices]]:m-0
      [&_[data-choices]]:grid-cols-[minmax(0,1fr)] [&_[data-choices]]:gap-2 [&_[data-choice]]:items-center
      [&_[data-choice]]:px-3.5 [&_[data-choice]]:py-3
      [&_[data-choice]]:text-[0.85rem] [&_[data-choice]]:leading-[1.75]
      [&_[data-choice]:enabled:hover]:border-accent [&_[data-choice]:enabled:hover]:bg-selected/88
      [&_[data-choice]:focus-visible]:border-accent [&_[data-choice]:focus-visible]:bg-selected/88
      [&_[data-choice-index]]:shrink-0 [&_[data-choice-index]]:bg-surface/60
      [[data-scene-reference]+&]:max-h-[60%] [[data-scene-reference]+&]:shrink-0 max-[600px]:rounded-xl
      max-[600px]:p-[9px] max-[600px]:[&_[data-choice]]:p-2.5 max-[600px]:[&_[data-choice]]:text-[0.76rem]`}
      data-scene-choices
      role="group"
      aria-label="선택지"
    >
      <div
        className="mt-4 grid grid-cols-2 gap-2 max-[600px]:mt-[13px] max-[600px]:grid-cols-1 max-[600px]:gap-[7px]"
        data-choices
      >
        {step.choices.map((choice, index) => {
          const triedWrong = attempted.includes(choice.id) && choice.status === "risk";
          const selectedCorrect = correct && selected.includes(choice.id);
          return (
          <button
            key={choice.id}
            className={`flex items-start gap-[11px] rounded-[10px] border border-line bg-surface/45 px-3.5 py-[11px] text-left
              text-[0.77rem] leading-[1.8] text-ink enabled:hover:border-accent enabled:hover:bg-accent-soft
              [&_small]:mt-[3px] [&_small]:block [&_small]:text-[0.68rem] [&_small]:text-muted max-[600px]:px-[11px]
              max-[600px]:py-[9px] max-[600px]:text-[0.73rem]
              data-[choice-state=wrong]:border-[#aab0b4] data-[choice-state=wrong]:bg-[#e5e7eb]
              data-[choice-state=wrong]:text-[#626b73] data-[choice-state=wrong]:opacity-100
              data-[choice-state=correct]:border-[#2f7d4d] data-[choice-state=correct]:bg-[#d9f0df]
              data-[choice-state=correct]:text-[#185c32] data-[choice-state=correct]:opacity-100`}
            data-choice
            data-choice-state={selectedCorrect ? "correct" : triedWrong ? "wrong" : "available"}
            aria-pressed={selectedCorrect}
            disabled={answered || triedWrong || !!choice.disabledReason}
            onClick={() => onChoose(choice.id)}
          >
            <span
              className="mt-px grid h-[21px] min-w-[19px] place-items-center rounded-[5px] border border-line bg-surface text-[0.64rem] text-muted"
              data-choice-index
            >
              {selectedCorrect ? "✓" : index + 1}
            </span>
            <span>
              {choice.label}
              {choice.disabledReason && <small>{choice.disabledReason}</small>}
            </span>
          </button>
          );
        })}
      </div>
    </div>
  );
  const sceneContent = choices ? (
    <>
      {scene && (
        <div
          className="min-h-0 w-full flex-1 overflow-y-auto [scrollbar-width:thin]"
          data-scene-reference
        >
          {scene}
        </div>
      )}
      {choices}
    </>
  ) : (
    scene
  );
  return (
    <SceneFrame
      background={current.background ?? step.background}
      context={context}
      scene={lastLine || answered ? sceneContent : undefined}
      overlay={
        warning ? (
          <FeedbackPanel
            feedback={feedback}
            onNext={onNext}
            onRetry={onRetry}
            retryOnly
          />
        ) : undefined
      }
    >
      <DialogueBox
        speaker={answered ? undefined : current.speaker}
        text={
          transitioning ? "다음 단계로 넘어갑니다."
            : correct ? undefined : current.text
        }
        actions={
          warning || transitioning ? null : correct ? (
            <NextButton onClick={() => setTransitioning(true)} />
          ) : !lastLine ? (
            <NextButton onClick={() => setLine(line + 1)} />
          ) : !step.choices ? (
            <NextButton onClick={onNext} />
          ) : null
        }
      >
        {correct && !transitioning && (
          <p className="animate-reveal text-[0.97rem] leading-[1.95] whitespace-pre-line max-[600px]:text-[0.88rem]" aria-live="polite" data-success-feedback>
            <strong className="font-bold text-accent">잘 하셨습니다</strong>
            <br /><br />
            {successText}
          </p>
        )}
      </DialogueBox>
    </SceneFrame>
  );
}

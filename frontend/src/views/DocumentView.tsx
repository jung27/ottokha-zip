import { useState, type ReactNode } from "react";
import { DialogueBox, NextButton, SceneFrame } from "../components/Journal";
import { priceLabel } from "../data";
import type { Contract, Home, PlayViewProps, Step } from "../types";
import { FeedbackPanel, TalkView } from "./TalkView";

function Paper({
  step,
  home,
  contract,
  children,
}: {
  step: Step;
  home: Home;
  contract: Contract;
  children?: ReactNode;
}) {
  const registry = step.document === "registry";
  return (
    <section className="mx-auto w-[min(720px,100%)] rounded-[7px] border border-line bg-surface px-[26px] py-5 text-ink shadow-panel max-[600px]:p-[15px]">
      <div
        className={`flex items-center justify-between gap-4 border-b-2 border-line pb-3.5 [&_h2]:text-[0.97rem]
        [&_h2]:tracking-[0.06em] [&>span]:text-[0.6rem] [&>span]:whitespace-nowrap [&>span]:text-muted
        max-[600px]:[&_h2]:text-[0.82rem]`}
      >
        <h2>
          {registry
            ? "등기사항전부증명서"
            : !step.document
              ? "입주 당일"
              : home.id === "goshiwon"
                ? "시설이용계약서"
                : "주택 임대차계약서"}
        </h2>
        {step.document && <span>가상 서류</span>}
      </div>
      {registry ? (
        <dl
          className={`m-0 text-[0.73rem] [&>div]:grid [&>div]:grid-cols-[120px_1fr] [&>div]:gap-3 [&>div]:border-b
          [&>div]:border-line [&>div]:py-[11px] [&_dt]:text-muted [&_dd]:m-0
          max-[600px]:[&>div]:grid-cols-[75px_1fr] max-[600px]:[&>div]:gap-[7px] max-[600px]:[&>div]:py-[9px]
          max-[600px]:[&>div]:text-[0.65rem]`}
        >
          <div>
            <dt>표제부 · 건물</dt>
            <dd>○○동 가상 매물 · {home.name}</dd>
          </div>
          <div>
            <dt>갑구 · 소유자</dt>
            <dd>
              {home.id === "officetel" ? "○○신탁 주식회사 · 신탁" : "박○○"}
            </dd>
          </div>
          <div>
            <dt>전달받은 예금주</dt>
            <dd>
              {home.id === "goshiwon"
                ? "○○하우스 운영법인"
                : home.id === "villa"
                  ? "박○○"
                  : "김○○"}
            </dd>
          </div>
          <div>
            <dt>을구</dt>
            <dd>근저당 등 권리관계 확인</dd>
          </div>
        </dl>
      ) : (
        step.document && (
          <dl
            className={`m-0 text-[0.73rem] [&>div]:grid [&>div]:grid-cols-[120px_1fr] [&>div]:gap-3 [&>div]:border-b
            [&>div]:border-line [&>div]:py-[11px] [&_dt]:text-muted [&_dd]:m-0
            max-[600px]:[&>div]:grid-cols-[75px_1fr] max-[600px]:[&>div]:gap-[7px] max-[600px]:[&>div]:py-[9px]
            max-[600px]:[&>div]:text-[0.65rem]`}
          >
            <div>
              <dt>소재지</dt>
              <dd>
                {home.id === "rooftop"
                  ? "○○동 123-4"
                  : "○○동 가상 매물 · " + home.name}
              </dd>
            </div>
            <div>
              <dt>계약 조건</dt>
              <dd>{priceLabel(home, contract)}</dd>
            </div>
          </dl>
        )
      )}
      {children}
    </section>
  );
}

export function DocumentView(
  props: PlayViewProps & { home: Home; contract: Contract },
) {
  const {
    step,
    selected,
    answered,
    feedback,
    home,
    contract,
    onToggle,
    onSubmit,
    onNext,
    onRetry,
  } = props;
  const [line, setLine] = useState(0);
  const interactive = line >= step.beats.length;
  const current = step.beats[Math.min(line, step.beats.length - 1)];
  if (step.kind !== "checklist")
    return (
      <TalkView
        {...props}
        scene={<Paper step={step} home={home} contract={contract} />}
      />
    );
  const showFeedback = answered && feedback.some((item) => item.showFeedback);
  const allChecked =
    step.items?.every((item) => selected.includes(item.id)) ?? true;
  const context =
    current.text +
    (interactive || answered
      ? step.items?.map((item) => item.title + item.description).join(" ")
      : "");
  return (
    <SceneFrame
      background={
        interactive || answered
          ? step.background
          : (current.background ?? step.background)
      }
      context={context}
      overlay={
        showFeedback ? (
          <FeedbackPanel
            feedback={feedback}
            onNext={onNext}
            onRetry={onRetry}
          />
        ) : undefined
      }
      scene={
        interactive || answered ? (
          <Paper step={step} home={home} contract={contract}>
            <fieldset
              className="mt-[18px] min-w-0 border-0 p-0 [&_legend]:mb-[9px] [&_legend]:text-[0.76rem] [&_legend]:font-[650]"
              disabled={answered}
            >
              <legend>
                {step.id === "clauses" ? "특약사항" : "확인할 항목"}
              </legend>
              {step.items?.map((item) => (
                <label
                  className={`flex cursor-pointer items-start gap-3 border-b border-line py-2.5 text-[0.75rem] leading-[1.8]
                    has-[:checked]:text-accent [&_input]:mt-[3px] [&_input]:size-4 [&_input]:shrink-0 [&_input]:accent-accent
                    max-[600px]:gap-[9px] max-[600px]:text-[0.69rem] `}
                  key={item.id}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => onToggle(item.id)}
                  />
                  <span>{item.title}</span>
                </label>
              ))}
            </fieldset>
          </Paper>
        ) : undefined
      }
    >
      <DialogueBox
        speaker={interactive || answered ? undefined : current.speaker}
        text={
          answered
            ? "확인한 내용으로 다음 장면을 이어간다."
            : interactive
              ? step.id === "clauses"
                ? "넣을 특약을 선택한다."
                : step.beats[0].text
              : current.text
        }
        actions={
          answered ? (
            <NextButton onClick={onNext} disabled={showFeedback} />
          ) : interactive ? (
            <NextButton
              onClick={onSubmit}
              disabled={!!step.requireAll && !allChecked}
            >
              {step.id === "signing"
                ? "서명하기"
                : step.id === "clauses"
                  ? selected.length
                    ? "특약 넣기"
                    : "아무것도 넣지 않는다"
                  : "다음"}
            </NextButton>
          ) : (
            <NextButton onClick={() => setLine(line + 1)} />
          )
        }
      >
        {interactive && !answered && step.requireAll && (
          <p className="text-xs text-muted">
            전부 다 체크하고 다음으로 넘어가기
          </p>
        )}
      </DialogueBox>
    </SceneFrame>
  );
}

import { useState, type ReactNode } from "react";
import { DialogueBox, NextButton, SceneFrame } from "../components/Journal";
import { priceLabel } from "../data";
import type { Contract, Home, PlayViewProps, Step } from "../types";
import { FeedbackPanel, TalkView } from "./TalkView";

function Paper({ step, home, contract, children }: { step: Step; home: Home; contract: Contract; children?: ReactNode }) {
  const registry = step.document === "registry";
  return <section className="paper-document">
    <div className="paper-heading">
      <h2>{registry ? "등기사항전부증명서" : !step.document ? "입주 당일" : home.id === "goshiwon" ? "시설이용계약서" : "주택 임대차계약서"}</h2>
      {step.document && <span>가상 서류</span>}
    </div>
    {registry ? <dl className="paper-fields">
      <div><dt>표제부 · 건물</dt><dd>○○동 가상 매물 · {home.name}</dd></div>
      <div><dt>갑구 · 소유자</dt><dd>{home.id === "officetel" ? "○○신탁 주식회사 · 신탁" : "박○○"}</dd></div>
      <div><dt>전달받은 예금주</dt><dd>{home.id === "goshiwon" ? "○○하우스 운영법인" : home.id === "villa" ? "박○○" : "김○○"}</dd></div>
      <div><dt>을구</dt><dd>근저당 등 권리관계 확인</dd></div>
    </dl> : step.document && <dl className="paper-fields">
      <div><dt>소재지</dt><dd>{home.id === "rooftop" ? "○○동 123-4" : "○○동 가상 매물 · " + home.name}</dd></div>
      <div><dt>계약 조건</dt><dd>{priceLabel(home, contract)}</dd></div>
    </dl>}
    {children}
  </section>;
}

export function DocumentView(props: PlayViewProps & { home: Home; contract: Contract }) {
  const { step, selected, answered, feedback, home, contract, onToggle, onSubmit, onNext, onRetry } = props;
  const [line, setLine] = useState(0);
  const interactive = line >= step.beats.length;
  const current = step.beats[Math.min(line, step.beats.length - 1)];
  if (step.kind !== "checklist") return <TalkView {...props} scene={<Paper step={step} home={home} contract={contract} />} />;
  const context = current.text + (interactive || answered ? step.items?.map((item) => item.title + item.description).join(" ") : "");
  return <SceneFrame background={interactive || answered ? step.background : current.background ?? step.background}
    context={context}
    scene={interactive && !answered ? <Paper step={step} home={home} contract={contract}>
      <fieldset className="checklist">
        <legend>{step.id === "clauses" ? "특약사항" : "확인할 항목"}</legend>
        {step.items?.map((item) => <label className={"checklist-item " + (selected.includes(item.id) ? "selected" : "")} key={item.id}>
          <input type="checkbox" checked={selected.includes(item.id)} onChange={() => onToggle(item.id)} />
          <span>{item.title}</span>
        </label>)}
      </fieldset>
    </Paper> : undefined}>
    {answered ? <FeedbackPanel feedback={feedback} onNext={onNext} onRetry={onRetry} /> :
      <DialogueBox speaker={interactive ? undefined : current.speaker}
        text={interactive ? step.id === "clauses" ? "특약사항 칸은 비어 있다." : step.beats[0].text : current.text}
        actions={interactive ? <NextButton onClick={onSubmit}>
          {step.id === "signing" ? "서명하기" : step.id === "clauses" ? selected.length ? "특약 넣기" : "아무것도 넣지 않는다" : "다음"}
        </NextButton> : <NextButton onClick={() => setLine(line + 1)} />} />}
  </SceneFrame>;
}

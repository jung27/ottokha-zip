import { useState } from "react";
import { DialogueBox, NextButton, SceneFrame } from "../components/Journal";
import { STAGES, type Checkpoint, type Ending } from "../types";

export function RiskReview({ notes, onReplay }: { notes: Checkpoint[]; onReplay?: (step: string) => void }) {
  const risks = notes.filter((note) => note.status === "risk");
  return <div className="risk-review">
    {risks.length === 0 ? <p>경고가 발생한 항목은 없다.</p> : STAGES.map((stage) => {
      const items = risks.filter((note) => note.stage === stage.id);
      return items.length > 0 && <section key={stage.id} className="review-stage">
        <h3>{stage.title}</h3>
        {items.map((note) => <details className="review-item" key={note.id}>
          <summary><span className="risk-dot">!</span><span>{note.title}<small>{note.choice}</small></span></summary>
          <div className="review-content">
            <p>{note.consequence}</p><p className="review-advice">{note.advice}</p>
            {onReplay && <button className="text-button" onClick={() => onReplay(note.stepId)}>이 장면부터 다시 선택</button>}
          </div>
        </details>)}
      </section>;
    })}
  </div>;
}
export function HomeView({ started, onStartNew, onResume, ending, notes = [], onReplay, onSameHome, onOtherHome }: {
  started: boolean; onStartNew: () => void; onResume: () => void; ending?: Ending;
  notes?: Checkpoint[]; onReplay: (step: string) => void; onSameHome: () => void; onOtherHome: () => void;
}) {
  const [review, setReview] = useState(false);
  if (ending) return (
    <SceneFrame background="street" context="보증금 반환 임차인 임대인">
      <DialogueBox text={review ? undefined : ending.title}
        actions={review ? <>
          <button className="text-button" onClick={onStartNew}>처음부터</button>
          <button className="secondary-button" onClick={onOtherHome}>다른 조합 해보기</button>
          <NextButton onClick={onSameHome}>같은 집, 다른 선택</NextButton>
        </> : <NextButton onClick={() => setReview(true)} />}>
        {review && <><h1 className="review-title">당신이 놓친 것들</h1><RiskReview notes={notes} onReplay={onReplay} /></>}
      </DialogueBox>
    </SceneFrame>
  );
  return (
    <SceneFrame background="street" className="home-scene" context="임대인 임차인 보증금 월세 전세">
      <DialogueBox actions={<>
        {started && <button className="secondary-button" onClick={onResume}>이어서 하기</button>}
        <NextButton onClick={onStartNew}>{started ? "처음부터" : "시작하기"}</NextButton>
      </>}>
        <h1 className="game-title">어떡하집<span>?</span></h1>
        <p className="dialogue-text">처음으로 내가 살 집을 직접 구하려 한다.</p>
      </DialogueBox>
    </SceneFrame>
  );
}

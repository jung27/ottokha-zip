import { useState } from "react";
import { DialogueBox, NextButton, SceneFrame } from "../components/Journal";
import { contractLabel, homes, priceLabel, tutorials } from "../data";
import type { Contract, Home, HouseId, Page } from "../types";

const prologueText = [
  "2월.\n처음으로 내가 살 집을 직접 구하려 한다.",
  "보증금과 매달 나갈 돈을 생각하며, 내 생활에 맞는 집을 찾아보기로 했다. 집을 고르는 것도, 계약을 하는 것도 아직은 낯설다.",
  "부동산 앱을 켠다. 수백 개의 매물이 뜬다. 가격과 조건이 제각각이라 혼란스럽다. 어디서부터 살펴봐야 할까?",
];
const descriptions = {
  monthly: "보증금 500~2,000만 원 + 월세 + 관리비. 목돈이 적게 들어가는 대신, 매달 통장에서 돈이 빠져나간다.",
  jeonse: "내 돈에 전세대출을 보태 보증금을 마련한다. 월세는 없지만, 매달 대출이자와 관리비가 나간다. 대출로 마련할 수 있는 금액과 계약이 끝났을 때 보증금을 돌려받을 수 있을지 함께 따져봐야 한다.",
};
export function ChooseView({ page, prologue, home, contract, onChooseContract, onChooseHome, onNext, onBack }: {
  page: Page; prologue: number; home: Home; contract: Contract;
  onChooseContract: (contract: Contract) => void;
  onChooseHome: (id: HouseId) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [line, setLine] = useState(0);
  if (page === "prologue") return (
    <SceneFrame background={prologue < 2 ? "home" : "app"} context={prologueText[prologue]}>
      <DialogueBox text={prologueText[prologue]} actions={<NextButton onClick={onNext} />} />
    </SceneFrame>
  );
  if (page === "tutorial") return (
    <SceneFrame background="app" context={tutorials[contract][line]}>
      <DialogueBox text={tutorials[contract][line]} actions={<>
        <button className="text-button" onClick={() => line ? setLine(line - 1) : onBack()}>이전</button>
        <NextButton onClick={() => line < tutorials[contract].length - 1 ? setLine(line + 1) : onNext()} />
      </>} />
    </SceneFrame>
  );
  return (
    <SceneFrame background="app" context={page === "contract" ? descriptions[contract] : home.description + priceLabel(home, contract) + home.turningPoint}>
      <DialogueBox text={page === "contract" ? "어떤 방식으로 계약할까?" : "어떤 집에서 살까?"}
        actions={<>
          <button className="text-button" onClick={onBack}>이전</button>
          <NextButton onClick={onNext} />
        </>}>
        {page === "contract" ? (
          <div className="contract-choices choices-container">
            {(["monthly", "jeonse"] as Contract[]).map((type) => (
              <button key={type} aria-pressed={contract === type}
                className={"setup-choice " + (contract === type ? "selected" : "")}
                onClick={() => onChooseContract(type)}>
                <strong>{contractLabel(type)}</strong><p>{descriptions[type]}</p>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="house-choices choices-container">
              {homes.map((item) => (
                <button key={item.id} className={"setup-choice " + (home.id === item.id ? "selected" : "")}
                  disabled={contract === "jeonse" && item.jeonse === null}
                  aria-pressed={home.id === item.id} onClick={() => onChooseHome(item.id)}>
                  {item.name}{item.id === "oneroom" ? " (다가구)" : item.id === "villa" ? " (다세대)" : ""}
                  {contract === "jeonse" && item.jeonse === null && <small>월세만 가능</small>}
                </button>
              ))}
            </div>
            <div className="house-description" aria-live="polite">
              <p>{home.description}</p><p className="price-label">{priceLabel(home, contract)}</p>
              <p className="small muted">{home.turningPoint}</p>
            </div>
          </>
        )}
      </DialogueBox>
    </SceneFrame>
  );
}

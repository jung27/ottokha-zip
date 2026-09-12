import { DialogueBox, NextButton, SceneFrame } from "../components/Journal";
import { StoryModal } from "../components/StoryModal";
import { Icon } from "../components/Icon";
import { contractLabel, homes, priceLabel, tutorials } from "../data";
import type { Contract, Home, HouseId, Page } from "../types";

const prologueText = [
  "2월.\n처음으로 내가 살 집을 직접 구하려 한다.",
  "보증금과 매달 나갈 돈을 생각하며, 내 생활에 맞는 집을 찾아보기로 했다. 집을 고르는 것도, 계약을 하는 것도 아직은 낯설다.",
  "부동산 앱을 켠다. 수백 개의 매물이 뜬다. 가격과 조건이 제각각이라 혼란스럽다. 어디서부터 살펴봐야 할까?",
];
const descriptions = {
  monthly:
    "보증금 500~2,000만 원 + 월세 + 관리비. 목돈이 적게 들어가는 대신, 매달 통장에서 돈이 빠져나간다.",
  jeonse:
    "내 돈에 전세대출을 보태 보증금을 마련한다. 월세는 없지만, 매달 대출이자와 관리비가 나간다. 대출로 마련할 수 있는 금액과 계약이 끝났을 때 보증금을 돌려받을 수 있을지 함께 따져봐야 한다.",
};
export function ChooseView({
  page,
  prologue,
  home,
  contract,
  recommendation,
  onChooseContract,
  onChooseHome,
  onNext,
  onBack,
}: {
  page: Page;
  prologue: number;
  home: Home;
  contract: Contract;
  recommendation?: string;
  onChooseContract: (contract: Contract) => void;
  onChooseHome: (id: HouseId) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  if (page === "prologue")
    return (
      <SceneFrame background="app" context={prologueText[prologue]}>
        <DialogueBox
          text={prologueText[prologue]}
          actions={<NextButton onClick={onNext} />}
        />
      </SceneFrame>
    );
  const contractPage = page === "contract";
  return (
    <section className="setup-view">
      <button className="text-button setup-back" onClick={onBack}>
        <Icon name="back" />
        이전
      </button>
      <div className="setup-heading">
        <span className="section-kicker">나의 첫 집 고르기</span>
        <h1>
          {contractPage ? "어떤 방식으로 계약할까?" : "어떤 집에서 살까?"}
        </h1>
      </div>
      {recommendation && (
        <p className="recommendation-note" role="status">
          <Icon name="spark" />
          {recommendation}
        </p>
      )}
      {contractPage ? (
        <div className="contract-choices choices-container">
          {(["monthly", "jeonse"] as Contract[]).map((type) => (
            <button
              key={type}
              className={
                "setup-choice contract-choice " +
                (contract === type ? "selected" : "")
              }
              aria-pressed={contract === type}
              onClick={() => onChooseContract(type)}
            >
              <span className="setup-choice-icon">
                <Icon name={type === "monthly" ? "key" : "building"} />
              </span>
              <strong>{contractLabel(type)}</strong>
              <p>{descriptions[type]}</p>
              <span className="selection-label">
                {contract === type ? "선택됨" : "이 방식으로"}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="house-choices choices-container">
            {homes.map((item) => (
              <button
                key={item.id}
                className={
                  "setup-choice house-choice " +
                  (home.id === item.id ? "selected" : "")
                }
                disabled={contract === "jeonse" && item.jeonse === null}
                aria-pressed={home.id === item.id}
                onClick={() => onChooseHome(item.id)}
              >
                <span className="setup-choice-icon">
                  <Icon name={item.icon} />
                </span>
                <strong>
                  {item.name}
                  {item.id === "oneroom"
                    ? "(다가구)"
                    : item.id === "villa"
                      ? "(다세대)"
                      : ""}
                </strong>
                <p>{item.description}</p>
                <span className="house-price">
                  {contract === "jeonse" && item.jeonse === null
                    ? "월세만 가능"
                    : priceLabel(item, contract)}
                </span>
              </button>
            ))}
          </div>
          <div className="house-summary">
            <div>
              <span>내가 고른 조건</span>
              <h2>
                {contractLabel(contract)} · {home.name}
              </h2>
              <p>{home.turningPoint}</p>
            </div>
            <Icon name={home.icon} />
          </div>
        </>
      )}
      <div className="setup-actions">
        <NextButton onClick={onNext}>
          {contractPage ? "다음" : "이 집 보러 가기"}
        </NextButton>
      </div>
      {page === "tutorial" && (
        <StoryModal title={contractLabel(contract)} onClose={onNext}>
          <div className="tutorial-copy">
            {tutorials[contract].map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <div className="dialogue-actions">
            <NextButton onClick={onNext}>확인하고 집 고르기</NextButton>
          </div>
        </StoryModal>
      )}
    </section>
  );
}

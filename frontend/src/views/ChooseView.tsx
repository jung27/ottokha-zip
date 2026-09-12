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
    <section className="mx-auto max-w-[1020px] pt-3.5 pb-[30px] max-[600px]:px-1 max-[600px]:pt-2.5 max-[600px]:pb-6">
      <button
        className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-1.5 py-[11px]
        text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
        duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
        max-[600px]:py-2.5 max-[600px]:text-[0.74rem] text-muted hover:text-accent mb-[18px]`}
        onClick={onBack}
      >
        <Icon name="back" />
        이전
      </button>
      <div className="mb-7 max-[600px]:mb-[21px] max-[600px]:[&_h1]:text-[1.55rem]">
        <span className="mb-[9px] block text-[0.72rem] font-[650] text-accent">
          나의 첫 집 고르기
        </span>
        <h1>
          {contractPage ? "어떤 방식으로 계약할까?" : "어떤 집에서 살까?"}
        </h1>
      </div>
      {recommendation && (
        <p
          className="mb-[18px] flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-[13px] text-[0.78rem] text-accent [&_svg]:size-4"
          role="status"
        >
          <Icon name="spark" />
          {recommendation}
        </p>
      )}
      {contractPage ? (
        <div
          className="mt-4 grid grid-cols-2 gap-5 max-[600px]:mt-[13px] max-[600px]:grid-cols-1 max-[600px]:gap-3"
          data-choices
        >
          {(["monthly", "jeonse"] as Contract[]).map((type) => (
            <button
              key={type}
              className={`relative flex flex-col items-start rounded-2xl border border-line bg-surface p-6 text-left text-ink
                transition-[border-color,background] duration-150 ease-[ease] enabled:hover:border-accent
                aria-pressed:border-accent aria-pressed:bg-accent-soft
                aria-pressed:shadow-[inset_0_0_0_1px_var(--color-accent)] [&_strong]:text-[1.05rem] [&_strong]:font-bold
                [&_p]:mt-2.5 [&_p]:text-[0.8rem] [&_p]:leading-[1.9] [&_p]:text-muted max-[600px]:rounded-[13px]
                max-[600px]:p-[19px] max-[600px]:[&_strong]:text-[0.93rem] max-[600px]:[&_p]:text-[0.73rem]
                max-[600px]:[&_[data-choice-icon]]:mb-3 `}
              aria-pressed={contract === type}
              onClick={() => onChooseContract(type)}
            >
              <span
                className="mb-[17px] flex size-[39px] items-center justify-center rounded-[11px] border border-line bg-soft text-accent [&_svg]:size-[21px]"
                data-choice-icon
              >
                <Icon name={type === "monthly" ? "key" : "building"} />
              </span>
              <strong>{contractLabel(type)}</strong>
              <p>{descriptions[type]}</p>
              <span className="mt-[25px] text-[0.68rem] font-[650] text-accent max-[600px]:mt-[17px]">
                {contract === type ? "선택됨" : "이 방식으로"}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div
            className="mt-4 grid grid-cols-3 gap-[13px] max-[800px]:grid-cols-2 max-[600px]:mt-[13px] max-[600px]:gap-2.5"
            data-choices
          >
            {homes.map((item) => (
              <button
                key={item.id}
                className={`relative flex flex-col items-start rounded-2xl border border-line bg-surface p-5 text-left text-ink
                  transition-[border-color,background] duration-150 ease-[ease] enabled:hover:border-accent
                  aria-pressed:border-accent aria-pressed:bg-accent-soft
                  aria-pressed:shadow-[inset_0_0_0_1px_var(--color-accent)] [&_strong]:text-[1.05rem] [&_strong]:font-bold
                  [&_p]:mt-2.5 [&_p]:text-[0.8rem] [&_p]:leading-[1.9] [&_p]:text-muted max-[600px]:rounded-[13px]
                  max-[600px]:p-[15px] max-[600px]:[&_strong]:text-[0.8rem] max-[600px]:[&_p]:text-[0.68rem] [&_p]:flex-1
                  max-[600px]:[&_[data-choice-icon]]:size-8 max-[600px]:[&_[data-choice-icon]]:mb-3 `}
                disabled={contract === "jeonse" && item.jeonse === null}
                aria-pressed={home.id === item.id}
                onClick={() => onChooseHome(item.id)}
              >
                <span
                  className="mb-[17px] flex size-[39px] items-center justify-center rounded-[11px] border border-line bg-soft text-accent [&_svg]:size-[21px]"
                  data-choice-icon
                >
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
                <span
                  className={`mt-[18px] block w-full border-t border-line pt-[13px] text-[0.68rem] leading-[1.8] text-accent
                  max-[600px]:mt-3 max-[600px]:pt-2.5 max-[600px]:text-[0.59rem]`}
                >
                  {contract === "jeonse" && item.jeonse === null
                    ? "월세만 가능"
                    : priceLabel(item, contract)}
                </span>
              </button>
            ))}
          </div>
          <div
            className={`mt-5 flex items-center justify-between gap-5 rounded-[14px] border border-line bg-soft px-6 py-5
            [&_span]:text-[0.65rem] [&_span]:text-muted [&_h2]:mt-1 [&_h2]:text-[0.95rem] [&_p]:mt-[5px]
            [&_p]:text-[0.76rem] [&_p]:text-accent [&>svg]:size-[33px] [&>svg]:text-accent max-[600px]:gap-3
            max-[600px]:p-[17px] max-[600px]:[&_p]:text-[0.7rem]`}
          >
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
      <div className="mt-6 flex justify-end">
        <NextButton onClick={onNext}>
          {contractPage ? "다음" : "이 집 보러 가기"}
        </NextButton>
      </div>
      {page === "tutorial" && (
        <StoryModal title={contractLabel(contract)} onClose={onNext}>
          <div className="[&_p]:mt-3 [&_p]:rounded-[11px] [&_p]:border [&_p]:border-line [&_p]:bg-soft [&_p]:p-[15px] [&_p]:text-[0.84rem]">
            {tutorials[contract].map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <div
            className="mt-3 flex shrink-0 flex-wrap items-center justify-end gap-2.5 empty:mt-0 max-[600px]:mt-2.5"
            data-dialogue-actions
          >
            <NextButton onClick={onNext}>확인하고 집 고르기</NextButton>
          </div>
        </StoryModal>
      )}
    </section>
  );
}

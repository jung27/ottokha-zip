import { useState } from "react";
import { StoryModal } from "./StoryModal";
import { Icon } from "./Icon";
const slides = [
  {
    title: "방을 보여주는 곳은 많지만, 계약을 알려주진 않습니다",
    text: "거래 중심 플랫폼에서 빠져 있던 실전 방어법을 다룹니다.",
    icon: "building" as const,
  },
  {
    title: "모든 첫 독립에는 연습이 필요하니까",
    text: "자취가 처음인 청년과 사회초년생을 위한 가상 계약 시뮬레이터입니다.",
    icon: "people" as const,
  },
  {
    title: "내 상황을 적고 가상 계약을 시작하세요",
    text: "AI가 상황에 맞는 방을 매칭해주거나, 직접 조건을 고를 수 있습니다.",
    icon: "spark" as const,
  },
];
export function OnboardingModal({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const current = slides[step];
  return (
    <StoryModal title="어떡하집 소개" onClose={onFinish}>
      <div className="px-1.5 pt-3 pb-5 text-center [&_h3]:mb-3.5 [&_h3]:text-[1.3rem] [&_p]:text-[0.85rem] [&_p]:text-muted">
        <span className="mb-[18px] inline-grid size-[57px] place-items-center rounded-2xl bg-accent-soft text-accent [&_svg]:size-[30px]">
          <Icon name={current.icon} />
        </span>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
      </div>
      <div
        className="mt-3 flex shrink-0 flex-wrap items-center justify-end gap-2.5 empty:mt-0 max-[600px]:mt-2.5"
        data-dialogue-actions
      >
        <button
          className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-1.5 py-[11px]
          text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
          duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
          max-[600px]:py-2.5 max-[600px]:text-[0.74rem] text-muted hover:text-accent`}
          onClick={onFinish}
        >
          건너뛰기
        </button>
        <button
          className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-[18px] py-[11px]
            text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
            duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
            max-[600px]:py-2.5 max-[600px]:text-[0.74rem] border border-mint bg-mint text-[#173d29]
            enabled:hover:border-[#b1dbbf] enabled:hover:bg-[#b1dbbf]`}
          data-button="primary"
          onClick={() =>
            step < slides.length - 1 ? setStep(step + 1) : onFinish()
          }
        >
          {step < slides.length - 1 ? "다음" : "시작하기"}
        </button>
      </div>
    </StoryModal>
  );
}

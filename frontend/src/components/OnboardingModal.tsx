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
      <div className="onboarding-copy">
        <span className="onboarding-icon">
          <Icon name={current.icon} />
        </span>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
      </div>
      <div className="dialogue-actions">
        <button className="text-button" onClick={onFinish}>
          건너뛰기
        </button>
        <button
          className="primary-button"
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

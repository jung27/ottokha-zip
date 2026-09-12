import { useState, useEffect, type JSX } from "react";
import { Icon } from "./Icon";
import type { IconName } from "../types";

const ONBOARDING_SEEN_KEY = "eotteokhajip-onboarding-seen";

interface Slide {
  badge: string;
  title: string;
  sub: string;
  icon: IconName;
  visual: JSX.Element;
}

const slides: Slide[] = [
  {
    badge: "기존 앱과의 차이",
    title: "방을 보여주는 곳은 많지만\n‘계약’을 알려주진 않습니다",
    sub: "거래 중심 플랫폼에서 빠져 있던 실전 방어법을 다룹니다.",
    icon: "building",
    visual: (
      <div className="grid grid-cols-2 gap-2 text-center text-xs py-3">
        <div className="p-3 rounded-xl bg-black/30 border border-gray-700 text-gray-400">
          <div className="line-through mb-1">일반 플랫폼</div>
          매물 홍보 · 빠른 거래
        </div>
        <div className="p-3 rounded-xl bg-[#1f382b] border border-[#add9b9]/40 text-[#add9b9] font-bold">
          <div className="mb-1">어떡하집</div>
          사기 방지 · 실전 연습
        </div>
      </div>
    ),
  },
  {
    badge: "누구를 위한 서비스인가요?",
    title: "모든 첫 독립에는\n연습이 필요하니까",
    sub: "자취가 처음인 청년과 사회초년생을 위한 가상 계약 시뮬레이터입니다.",
    icon: "people",
    visual: (
      <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-black/30 border border-gray-700 text-gray-300">
        <span>🔍 현장 점검</span>
        <span>→</span>
        <span>💬 중개사 대화</span>
        <span>→</span>
        <span className="text-[#add9b9] font-bold">📄 서류 대조</span>
      </div>
    ),
  },
  {
    badge: "시작하는 법",
    title: "내 상황을 적고\n가상 계약을 시작하세요",
    sub: "AI가 상황에 맞는 방을 매칭해주거나, 직접 조건을 고를 수 있습니다.",
    icon: "spark",
    visual: (
      <div className="p-3 rounded-xl bg-[#142322] border border-[#2d4940] text-xs text-left space-y-1.5">
        <div className="text-[#add9b9] font-semibold">
          💡 이렇게 입력해보세요:
        </div>
        <div className="text-gray-300">“보증금 500에 회사 근처 월세”</div>
        <div className="text-gray-300">
          “대출받아서 들어갈 깨끗한 빌라 전세”
        </div>
      </div>
    ),
  },
];

export function OnboardingModal({
  forceOpen = false,
  onFinish,
}: {
  forceOpen?: boolean;
  onFinish?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_SEEN_KEY);
    if (!seen || forceOpen) {
      setIsOpen(true);
      setStep(0);
    }
  }, [forceOpen]);

  const close = () => {
    localStorage.setItem(ONBOARDING_SEEN_KEY, "true");
    setIsOpen(false);
    onFinish?.();
  };

  if (!isOpen) return null;

  const cur = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm rounded-2xl border border-[#34464c] bg-[#162228] p-6 text-center text-gray-100 shadow-2xl">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-xs text-gray-400 hover:text-white"
        >
          건너뛰기
        </button>

        {/* 뱃지 & 아이콘 */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#1d2d27] border border-[#355243] flex items-center justify-center text-[#add9b9]">
          <Icon name={cur.icon} className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-semibold text-[#add9b9]">
          {cur.badge}
        </span>

        {/* 핵심 타이틀 */}
        <h2 className="text-lg font-bold text-white mt-1 whitespace-pre-line leading-tight">
          {cur.title}
        </h2>
        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
          {cur.sub}
        </p>

        {/* 비주얼 미니 박스 */}
        <div className="my-5">{cur.visual}</div>

        {/* 하단 점 & 액션 버튼 */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  step === i ? "w-5 bg-[#add9b9]" : "w-1.5 bg-gray-700"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => (isLast ? close() : setStep(step + 1))}
            className="btn btn-sm bg-[#add9b9] hover:bg-[#c3ecd0] text-[#122419] font-bold border-none px-4 rounded-xl"
          >
            {isLast ? "시작하기" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}

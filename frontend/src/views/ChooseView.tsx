import { useState } from "react";
import { Icon } from "../components/Icon";
import { StoryModal } from "../components/StoryModal";
import { contractTutorials, homes } from "../data";
import type { Contract } from "../types";

export function ChooseView({
  contract,
  currentHouse,
  onChooseContract,
  onChooseHome,
  onNext,
}: {
  contract: Contract;
  currentHouse: number;
  onChooseContract: (c: Contract) => void;
  onChooseHome: (idx: number) => void;
  onNext: () => void;
}) {
  // 튜토리얼 모달 노출 상태
  const [tutorialTarget, setTutorialTarget] = useState<Contract | null>(null);

  const handleSelectContract = (type: Contract) => {
    onChooseContract(type);
    setTutorialTarget(type); // 선택 직후 튜토리얼 팝업 오픈
  };

  const selectedHome = homes[currentHouse];
  const tutorialData = tutorialTarget
    ? contractTutorials[tutorialTarget]
    : null;

  return (
    <div className="space-y-8 pt-6">
      <div className="border-b border-[#2c373e] pb-4">
        <span className="text-xs text-[#add9b9] font-semibold">
          1단계 · 직접 조건 선택
        </span>
        <h1 className="text-2xl font-bold text-white mt-1">
          어떤 조건과 집에서 시작할까요?
        </h1>
      </div>

      {/* 1차 분기: 계약 형태 (2가지) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-200">
            1차 분기 — 계약 형태
          </h2>
          <span className="text-xs text-gray-400">
            선택 시 핵심 가이드 카드가 표시됩니다
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 🅰 월세 */}
          <button
            onClick={() => handleSelectContract("monthly")}
            className={`p-5 rounded-xl border text-left flex flex-col justify-between transition ${
              contract === "monthly"
                ? "border-[#add9b9] bg-[#1a2d27]"
                : "border-[#2c373e] bg-[#141e25] hover:bg-[#19262e]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-bold text-white">🅰 월세</span>
                {contract === "monthly" && (
                  <span className="badge badge-sm bg-[#add9b9] text-[#12261b] font-bold">
                    선택됨
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                보증금 500~2,000만 원 + 월세 + 관리비. 목돈이 적게 들어가는
                대신, 매달 통장에서 돈이 빠져나간다.
              </p>
            </div>
            <span className="text-[11px] text-[#add9b9] mt-3 underline">
              튜토리얼 카드 다시보기
            </span>
          </button>

          {/* 🅱 전세 + 대출 */}
          <button
            onClick={() => handleSelectContract("jeonse")}
            className={`p-5 rounded-xl border text-left flex flex-col justify-between transition ${
              contract === "jeonse"
                ? "border-[#add9b9] bg-[#1a2d27]"
                : "border-[#2c373e] bg-[#141e25] hover:bg-[#19262e]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-bold text-white">
                  🅱 전세 + 대출
                </span>
                {contract === "jeonse" && (
                  <span className="badge badge-sm bg-[#add9b9] text-[#12261b] font-bold">
                    선택됨
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                내 돈에 전세대출을 보태 보증금을 마련한다. 월세는 없지만 매달
                대출이자와 관리비가 나간다.
              </p>
            </div>
            <span className="text-[11px] text-[#add9b9] mt-3 underline">
              튜토리얼 카드 다시보기
            </span>
          </button>
        </div>
      </section>

      {/* 2차 분기: 집 유형 (6종 카드) */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-gray-200">
          2차 분기 — 집 유형 선택 (6종)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {homes.map((item, idx) => {
            const isSelected = currentHouse === idx;
            return (
              <button
                key={item.name}
                onClick={() => onChooseHome(idx)}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between min-h-[140px] ${
                  isSelected
                    ? "border-[#add9b9] bg-[#1d2c2b] shadow-md ring-1 ring-[#add9b9]"
                    : "border-[#2c373e] bg-[#141e25] hover:bg-[#19252c]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-base flex items-center gap-2">
                      <Icon
                        name={item.icon}
                        className={
                          isSelected ? "text-[#add9b9]" : "text-gray-400"
                        }
                      />
                      {item.name}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {item.area}
                    </span>
                  </div>
                  {/* 한 줄 정의 */}
                  <p className="text-xs text-gray-300 mb-3">{item.desc}</p>
                </div>

                {/* 비용 정보 */}
                <div className="pt-2 border-t border-[#26373e] flex justify-between items-center text-xs">
                  <span className="font-mono text-[#add9b9] font-semibold">
                    {contract === "monthly"
                      ? `${item.rent}만`
                      : `전세 ${item.deposit}만`}
                  </span>
                  <span className="text-gray-400">{item.managementFee}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 하단 요약 및 방 탐색 이동 바 */}
      <div className="p-4 rounded-xl border border-[#34464d] bg-[#172228] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <div className="text-xs text-gray-400">선택된 조건</div>
          <div className="text-base font-bold text-white mt-0.5">
            [{contract === "monthly" ? "월세" : "전세+대출"}]{" "}
            {selectedHome.name} · {selectedHome.area}
          </div>
          <div className="text-xs text-[#add9b9] mt-1">{selectedHome.hint}</div>
        </div>

        <button
          onClick={onNext}
          className="btn bg-[#add9b9] hover:bg-[#c5e9ce] text-[#15271d] font-bold border-none w-full sm:w-auto px-6"
        >
          이 방으로 방문 시작 <Icon name="arrow" />
        </button>
      </div>

      {/* 선택 직후 팝업되는 튜토리얼 카드 모달 */}
      {tutorialData && (
        <StoryModal
          title={`튜토리얼 카드: ${tutorialData.title}`}
          onClose={() => setTutorialTarget(null)}
        >
          <div className="space-y-4 text-left">
            <p className="text-xs text-[#add9b9] font-medium">
              {tutorialData.subtitle}
            </p>
            <div className="space-y-3">
              {tutorialData.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[#141e25] border border-[#2c373e]"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#add9b9] text-[#12261b] text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-3">
              <button
                onClick={() => setTutorialTarget(null)}
                className="btn btn-block bg-[#add9b9] text-black border-none"
              >
                확인하고 방 유형 선택하기
              </button>
            </div>
          </div>
        </StoryModal>
      )}
    </div>
  );
}

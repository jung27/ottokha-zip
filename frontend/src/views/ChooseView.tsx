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
  const [tutorialTarget, setTutorialTarget] = useState<Contract | null>(null);

  const handleSelectContract = (type: Contract) => {
    onChooseContract(type);
    setTutorialTarget(type);
  };

  const selectedHome = homes[currentHouse];
  const tutorialData = tutorialTarget
    ? contractTutorials[tutorialTarget]
    : null;

  return (
    <div className="space-y-6 pt-4">
      {/* 1차 분기: 계약 형태 탭 */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#add9b9]">
            01. 계약 형태
          </span>
          <button
            onClick={() => setTutorialTarget(contract)}
            className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1"
          >
            <Icon name="help" className="w-3.5 h-3.5" /> 튜토리얼 팁 보기
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSelectContract("monthly")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
              contract === "monthly"
                ? "border-[#add9b9] bg-[#1a2d27]"
                : "border-[#2c373e] bg-[#141e25] hover:bg-[#19262e]"
            }`}
          >
            <div>
              <div className="text-sm font-bold text-white">월세</div>
              <div className="text-xs text-gray-400 mt-0.5">
                보증금 500~2,000 + 월세 + 관리비
              </div>
            </div>
            {contract === "monthly" && (
              <span className="badge badge-sm bg-[#add9b9] text-[#12261b] font-bold border-none">
                선택
              </span>
            )}
          </button>

          <button
            onClick={() => handleSelectContract("jeonse")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
              contract === "jeonse"
                ? "border-[#add9b9] bg-[#1a2d27]"
                : "border-[#2c373e] bg-[#141e25] hover:bg-[#19262e]"
            }`}
          >
            <div>
              <div className="text-sm font-bold text-white">전세 + 대출</div>
              <div className="text-xs text-gray-400 mt-0.5">
                목돈 보증금 + 대출이자 + 관리비
              </div>
            </div>
            {contract === "jeonse" && (
              <span className="badge badge-sm bg-[#add9b9] text-[#12261b] font-bold border-none">
                선택
              </span>
            )}
          </button>
        </div>
      </section>

      {/* 2차 분기: 집 유형 (6종) */}
      <section className="space-y-2">
        <span className="text-xs font-semibold text-[#add9b9]">
          02. 집 유형 선택
        </span>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {homes.map((item, idx) => {
            const isSelected = currentHouse === idx;
            return (
              <button
                key={item.name}
                onClick={() => onChooseHome(idx)}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between min-h-[128px] ${
                  isSelected
                    ? "border-[#add9b9] bg-[#1d2c2b] ring-1 ring-[#add9b9]"
                    : "border-[#2c373e] bg-[#141e25] hover:bg-[#19252c]"
                }`}
              >
                <div className="w-full">
                  {/* 상단: 큼직한 아이콘과 평수 */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-[#254234] text-[#add9b9]"
                          : "bg-[#1d272d] text-gray-400"
                      }`}
                    >
                      <Icon name={item.icon} className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap">
                      {item.area.split("·")[0].trim()}
                    </span>
                  </div>

                  {/* 방 이름: 한 줄 유지 */}
                  <div className="font-bold text-white text-sm whitespace-nowrap truncate">
                    {item.name}
                  </div>

                  {/* 간략 설명 */}
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {item.desc}
                  </p>
                </div>

                {/* 가격 정보 */}
                <div className="pt-2 mt-2 border-t border-[#26373e] flex items-center justify-between text-xs">
                  <span className="font-mono text-[#add9b9] font-bold whitespace-nowrap">
                    {contract === "monthly"
                      ? `${item.rent}만`
                      : `전세 ${item.deposit}만`}
                  </span>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap">
                    {item.managementFee}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 하단 확정 및 이동 바 */}
      <div className="p-3.5 rounded-xl border border-[#34464d] bg-[#172228] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold text-white truncate">
            [{contract === "monthly" ? "월세" : "전세+대출"}]{" "}
            {selectedHome.name}
          </div>
          <div className="text-[11px] text-gray-400 truncate mt-0.5">
            {selectedHome.hint}
          </div>
        </div>

        <button
          onClick={onNext}
          className="btn btn-sm bg-[#add9b9] hover:bg-[#c5e9ce] text-[#15271d] font-bold border-none px-5 shrink-0"
        >
          방문 시작 <Icon name="arrow" className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1차 분기 튜토리얼 모달 */}
      {tutorialData && (
        <StoryModal
          title={tutorialData.title}
          onClose={() => setTutorialTarget(null)}
        >
          <div className="space-y-3 text-left">
            <p className="text-xs text-[#add9b9] font-medium">
              {tutorialData.subtitle}
            </p>
            <div className="space-y-2">
              {tutorialData.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#141e25] border border-[#2c373e]"
                >
                  <span className="w-4 h-4 rounded-full bg-[#add9b9] text-[#12261b] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setTutorialTarget(null)}
              className="btn btn-sm btn-block bg-[#add9b9] text-black border-none mt-2"
            >
              확인
            </button>
          </div>
        </StoryModal>
      )}
    </div>
  );
}

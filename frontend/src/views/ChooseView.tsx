import { Icon } from "../components/Icon";
import { homes } from "../data";
import type { Contract, Home } from "../types";

export function ChooseView({
  home,
  contract,
  currentHouse,
  price,
  onChooseContract,
  onChooseHome,
  onNext,
}: {
  home: Home;
  contract: Contract;
  currentHouse: number;
  price: string;
  onChooseContract: (c: Contract) => void;
  onChooseHome: (idx: number) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6 pt-6">
      <div className="border-b border-[#2c373e] pb-4">
        <span className="text-xs text-[#add9b9]">
          첫 번째 장면 · 집을 고르다
        </span>
        <h1 className="text-2xl font-bold text-white mt-1">
          어떤 집에서 시작할까?
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-300 mb-3">
              01. 어떤 계약으로 구할까?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(["monthly", "jeonse"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => onChooseContract(type)}
                  className={`p-4 rounded-lg border text-left flex flex-col justify-between transition ${
                    contract === type
                      ? "border-[#add9b9] bg-[#1d2c2b]"
                      : "border-[#2c373e] bg-[#141e25] hover:bg-gray-800"
                  }`}
                >
                  <span className="font-bold text-white">
                    {type === "monthly" ? "월세" : "전세 + 대출"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {type === "monthly"
                      ? "보증금과 매달 내는 임대료"
                      : "목돈과 대출 조건을 함께 살펴보기"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-300 mb-3">
              02. 어떤 공간에서 살고 싶어?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {homes.map((item, idx) => (
                <button
                  key={item.name}
                  onClick={() => onChooseHome(idx)}
                  className={`p-4 rounded-lg border text-left transition flex flex-col justify-between min-h-[120px] ${
                    currentHouse === idx
                      ? "border-[#add9b9] bg-[#1d2c2b]"
                      : "border-[#2c373e] bg-[#141e25] hover:bg-gray-800"
                  }`}
                >
                  <Icon
                    name={item.icon}
                    className={
                      currentHouse === idx ? "text-[#add9b9]" : "text-gray-400"
                    }
                  />
                  <div>
                    <div className="font-bold text-white text-sm">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-400">{item.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-xl border border-[#364249] bg-[#172128] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="badge badge-sm badge-outline text-[#add9b9] border-[#add9b9]">
              가상 매물
            </span>
            <h2 className="text-xl font-bold text-white">{home.desc}</h2>
            <div className="text-2xl font-bold text-[#add9b9]">
              {price}{" "}
              <span className="text-xs text-gray-400 font-normal">만원</span>
            </div>
            <p className="text-xs text-gray-400 pre-line">
              {contract === "jeonse"
                ? "이 집은 대출이 가능할까? 가능 여부와 조건부터 확인해 보자."
                : home.hint}
            </p>
          </div>
          <button
            className="btn w-full bg-[#add9b9] hover:bg-[#c5e9ce] text-[#15271d] font-bold border-none"
            onClick={onNext}
          >
            이 집 보러 가기 <Icon name="arrow" />
          </button>
        </aside>
      </div>
    </div>
  );
}

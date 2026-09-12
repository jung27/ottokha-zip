import { Icon } from "../components/Icon";
import type { DocumentTab } from "../types";

export function DocumentView({
  house,
  docTab,
  ownerChecked,
  onCheckNames,
  onComplete,
  onSendWarning,
  onOpenGuide,
}: {
  house: number;
  docTab: DocumentTab;
  ownerChecked: boolean;
  onCheckNames: () => void;
  onComplete: () => void;
  onSendWarning: () => void;
  onOpenGuide: () => void;
}) {
  return (
    <div className="space-y-6 pt-6">
      <div className="border-b border-[#2c373e] pb-4 flex justify-between items-end">
        <div>
          <span className="text-xs text-[#add9b9]">
            네 번째 장면 · 서류 확인
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">
            같은 집, 서로 다른 이름.
          </h1>
        </div>
        <button
          className="btn btn-ghost btn-sm text-[#add9b9]"
          onClick={onOpenGuide}
        >
          <Icon name="help" /> 서류 읽는 법
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#33454d] bg-[#edeee7] p-6 text-slate-800 space-y-4">
          <div className="flex justify-between border-b border-slate-300 pb-2 text-xs font-bold text-slate-600">
            <span>등기사항전부증명서 (학습용 가상 서류)</span>
            <span>2026. 09. 12.</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/60 rounded border border-slate-300">
              <div className="font-bold mb-1">표제부 (건물의 표시)</div>
              <div>
                서울특별시 은유구 은유동 24-7 {house === 2 && "제301호"}
              </div>
            </div>

            <button
              onClick={onCheckNames}
              className={`w-full text-left p-3 rounded border transition ${
                docTab === "owner"
                  ? "bg-amber-100 border-amber-400"
                  : "bg-white/60 border-slate-300"
              }`}
            >
              <div className="font-bold flex justify-between">
                <span>갑구 (소유권에 관한 사항)</span>
                <span className="text-[#2c4b34] font-bold underline">
                  클릭하여 확인
                </span>
              </div>
              <div className="mt-2 flex gap-4">
                <span>
                  소유자:{" "}
                  <mark className="bg-yellow-200 px-1 font-bold">김민수</mark>
                </span>
              </div>
            </button>
          </div>
        </div>

        <aside className="space-y-4 choices-container">
          <div className="p-5 rounded-xl border border-[#36464e] bg-[#1b2931] space-y-3">
            <div className="text-xs text-gray-400">
              중개사에게 전달받은 입금 계좌
            </div>
            <div className="text-xl font-mono font-bold text-white">
              000-1234-5678
            </div>
            <div className="text-sm text-gray-300 flex justify-between border-t border-gray-700 pt-2">
              <span>예금주</span>
              <span className="font-bold text-amber-300">박지훈</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              className="btn w-full justify-between bg-[#17232b] hover:bg-[#21342f] border-[#34434c] text-sm"
              onClick={onCheckNames}
            >
              <span className="flex items-center gap-2">
                <kbd className="kbd kbd-sm bg-black/40">1</kbd> 소유자와
                예금주를 비교한다
              </span>
              <Icon name={ownerChecked ? "check" : "eye"} />
            </button>
            <button
              className="btn w-full justify-between bg-[#17232b] hover:bg-[#21342f] border-[#34434c] text-sm"
              onClick={onComplete}
            >
              <span className="flex items-center gap-2">
                <kbd className="kbd kbd-sm bg-black/40">2</kbd> 이름이 다른
                이유를 묻는다
              </span>
              <Icon name="chat" />
            </button>
            <button
              className="btn w-full justify-between btn-outline border-dashed border-red-900/60 text-gray-400 hover:bg-red-950/20 text-sm"
              onClick={onSendWarning}
            >
              <span className="flex items-center gap-2">
                <kbd className="kbd kbd-sm bg-black/40">3</kbd> 안내받은 계좌로
                일단 송금한다
              </span>
              <Icon name="arrow" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

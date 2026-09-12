import { Icon } from "../components/Icon";
import { Journal } from "../components/Journal";
import { talkItems } from "../data";
import type { Contract, Note } from "../types";

export function TalkView({
  contract,
  notes,
  talked,
  dialogue,
  onAskQuestion,
  onNext,
  onOpenNotebook,
}: {
  contract: Contract;
  notes: Note[];
  talked: string[];
  dialogue: number | null;
  onAskQuestion: (idx: number) => void;
  onNext: () => void;
  onOpenNotebook: () => void;
}) {
  return (
    <div className="space-y-6 pt-6">
      <div className="border-b border-[#2c373e] pb-4">
        <span className="text-xs text-[#add9b9]">
          세 번째 장면 · 중개사와의 대화
        </span>
        <h1 className="text-2xl font-bold text-white mt-1">
          좋은 질문 하나가, 단서가 된다.
        </h1>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          <div className="p-5 rounded-xl border border-[#38464e] bg-[#1a252d] space-y-2">
            <div className="text-xs font-semibold text-[#add9b9]">
              한서진 공인중개사
            </div>
            <p className="text-sm sm:text-base text-gray-200 pre-line">
              {dialogue === null
                ? "“방은 어떠셨어요? 궁금한 점이 있으면 편하게 물어보세요.”"
                : talkItems[dialogue].reply(contract)}
            </p>
          </div>

          <div className="space-y-2 choices-container">
            {talkItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => onAskQuestion(idx)}
                className={`btn w-full justify-between text-left text-sm ${
                  talked.includes(item.id)
                    ? "bg-[#1b2b29] border-[#36534a] text-[#add9b9]"
                    : "bg-[#17232b] border-[#34434c] text-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <kbd className="kbd kbd-sm bg-black/40">{idx + 1}</kbd>{" "}
                  {item.label}
                </span>
                <Icon name={talked.includes(item.id) ? "check" : "chat"} />
              </button>
            ))}
          </div>

          {talked.includes("papers") && (
            <button
              className="btn w-full bg-[#add9b9] hover:bg-[#c5e9ce] text-[#15271d] font-bold border-none mt-4"
              onClick={onNext}
            >
              건네받은 서류 살펴보기 <Icon name="arrow" />
            </button>
          )}
        </div>
        <Journal notes={notes} onOpenNotebook={onOpenNotebook} />
      </div>
    </div>
  );
}

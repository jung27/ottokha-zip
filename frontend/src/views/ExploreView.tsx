import roomImage from "../assets/room.png";
import { Icon } from "../components/Icon";
import { Journal } from "../components/Journal";
import { inspections } from "../data";
import {
  inspectionKeys,
  type Home,
  type Inspection,
  type Note,
} from "../types";

export function ExploreView({
  home,
  notes,
  inspected,
  detail,
  onInspect,
  onNext,
  onOpenNotebook,
}: {
  home: Home;
  notes: Note[];
  inspected: Inspection[];
  detail: Inspection | null;
  onInspect: (key: Inspection) => void;
  onNext: () => void;
  onOpenNotebook: () => void;
}) {
  const item = detail ? inspections[detail] : null;

  return (
    <div className="space-y-6 pt-6">
      <div className="border-b border-[#2c373e] pb-4">
        <span className="text-xs text-[#add9b9]">두 번째 장면 · 방 탐색</span>
        <h1 className="text-2xl font-bold text-white mt-1">
          문을 열자, 오후의 빛이 들어왔다.
        </h1>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          <div className="relative h-80 rounded-t-xl overflow-hidden border border-[#435057] bg-black">
            <img
              src={roomImage}
              alt="방 내부"
              className="w-full h-full object-cover opacity-80"
            />
            {inspectionKeys.map((key) => {
              const pos =
                key === "window"
                  ? "top-1/3 left-1/3"
                  : key === "sink"
                    ? "bottom-1/3 right-1/4"
                    : "bottom-1/4 left-10";
              const isDone = inspected.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onInspect(key)}
                  className={`absolute ${pos} btn btn-xs sm:btn-sm rounded-full gap-2 backdrop-blur-md ${
                    isDone
                      ? "bg-[#213b30]/90 text-[#add9b9] border-[#add9b9]"
                      : "bg-black/60 text-white border-white/40"
                  }`}
                >
                  <Icon name={isDone ? "check" : "spark"} className="w-3 h-3" />
                  <span>{inspections[key].title}</span>
                </button>
              );
            })}
          </div>

          <div className="p-5 rounded-b-xl border border-[#38464e] bg-[#1a252d] space-y-2">
            <div className="text-xs font-semibold text-[#add9b9] flex items-center gap-1">
              <Icon name={item ? item.icon : "book"} className="w-4 h-4" />
              {item ? item.title : "나의 생각"}
            </div>
            <p className="text-sm sm:text-base text-gray-200 pre-line">
              {item
                ? item.narrative(home)
                : "사진보다 조금 작지만, 볕이 제법 잘 드는 방이다."}
            </p>
            <p className="text-xs text-gray-400 italic mt-2 pre-line">
              {item ? item.learning : "“어디부터 살펴볼까?”"}
            </p>
          </div>

          <div className="space-y-2 pt-2 choices-container">
            <button
              className="btn w-full justify-between bg-[#17232b] hover:bg-[#21342f] border-[#34434c] text-left text-sm"
              onClick={() =>
                onInspect(
                  inspectionKeys.find((k) => !inspected.includes(k)) ??
                    "window",
                )
              }
            >
              <span className="flex items-center gap-2">
                <kbd className="kbd kbd-sm bg-black/40">1</kbd>
                {inspected.length === 3
                  ? "방을 한 번 더 살펴본다"
                  : "아직 보지 않은 곳을 살펴본다"}
              </span>
              <Icon name="eye" />
            </button>
            <button
              className="btn w-full justify-between bg-[#17232b] hover:bg-[#21342f] border-[#34434c] text-left text-sm"
              onClick={onNext}
            >
              <span className="flex items-center gap-2">
                <kbd className="kbd kbd-sm bg-black/40">2</kbd> 중개사에게
                궁금한 것을 물어본다
              </span>
              <Icon name="arrow" />
            </button>
          </div>
        </div>
        <Journal notes={notes} onOpenNotebook={onOpenNotebook} />
      </div>
    </div>
  );
}

import roomImage from "../assets/room.png";
import { Icon } from "../components/Icon";
import { chapterCards } from "../data";
import type { Scene } from "../types";

export function HomeView({
  started,
  lastScene,
  onStartNew,
  onNavigate,
}: {
  started: boolean;
  lastScene: Scene;
  onStartNew: () => void;
  onNavigate: (scene: Scene) => void;
}) {
  return (
    <div className="space-y-8 pt-4">
      <section className="relative rounded-2xl border border-[#334047] overflow-hidden bg-[#17242b] min-h-[480px] flex items-center p-8 sm:p-12">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${roomImage})` }}
        />
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#add9b9]">
            <span className="w-6 h-px bg-[#add9b9]" /> 처음 만나는 나의 집
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            괜찮은 집,
            <br />
            <span className="text-[#add9b9]">찾을 수 있을까?</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            낯선 동네, 처음 보는 계약서.
            <br />
            당신의 선택으로 시작되는 첫 번째 독립 이야기.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              className="btn bg-[#add9b9] hover:bg-[#c5e9ce] text-[#15271d] font-bold border-none"
              onClick={onStartNew}
            >
              새로운 이야기 시작 <Icon name="arrow" />
            </button>
            <button
              className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={!started}
              onClick={() => onNavigate(lastScene)}
            >
              <Icon name="reset" /> 이어서 하기
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chapterCards.map((card) => (
          <button
            key={card.number}
            onClick={() => onNavigate(card.scene)}
            className="flex items-center gap-4 p-5 rounded-xl border border-[#2c373e] bg-[#151f26] hover:bg-[#1c2931] text-left transition"
          >
            <div className="w-12 h-12 rounded-lg bg-[#1a2a2d] border border-[#394a4c] flex items-center justify-center text-[#add9b9]">
              <Icon name={card.icon} />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono text-gray-400">
                CHAPTER {card.number}
              </span>
              <h3 className="font-bold text-white text-base">{card.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{card.description}</p>
            </div>
            <Icon name="arrow" className="text-gray-500 w-4 h-4" />
          </button>
        ))}
      </section>
    </div>
  );
}

import { useState } from "react";
import { Icon } from "../components/Icon";
import type { Scene } from "../types";

const promptSuggestions = [
  "첫 취업으로 보증금 500에 월세 구하고 있어",
  "대학가 근처에서 1년 동안 잠깐 살 저렴한 방",
  "중기청 대출받아서 깨끗한 전세 빌라 가고 싶어",
  "채광 좋은 옥탑방에서 낭만 있게 독립하기",
];

export function HomeView({
  onStartWithAI,
  onNavigate,
  started,
  lastScene,
}: {
  onStartWithAI: (input: string) => Promise<void>;
  onNavigate: (scene: Scene) => void;
  started: boolean;
  lastScene: Scene;
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    await onStartWithAI(prompt);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[78vh] px-4 text-center">
      {/* 1. 로고 */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-3 rounded-2xl bg-[#1d2d27] border border-[#345344] text-[#add9b9]">
          <Icon name="door" className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          어떡하집<span className="text-[#add9b9]">?</span>
        </h1>
      </div>

      <p className="text-gray-400 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
        복잡하고 두려운 첫 독립 계약. <br />
        처해있는 상황을 적으면 맞춤 방을 찾아드립니다.
      </p>

      {/* 2. AI 인풋 */}
      <div className="w-full max-w-2xl space-y-4">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center rounded-2xl border border-[#374843] bg-[#162228] p-2 shadow-2xl focus-within:border-[#add9b9] focus-within:ring-1 focus-within:ring-[#add9b9] transition"
        >
          <Icon name="spark" className="w-5 h-5 text-[#add9b9] ml-3" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="지금 어떤 상황에 처해있나요? (예: 보증금 500에 직장 근처 월세)"
            className="w-full bg-transparent px-4 py-3 text-sm sm:text-base text-gray-100 placeholder-gray-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="btn bg-[#add9b9] hover:bg-[#c4edd0] text-[#12261b] font-bold border-none rounded-xl px-5 h-11 shrink-0 flex items-center gap-2 disabled:bg-[#23352d] disabled:text-gray-500"
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <>
                <span>AI 추천</span>
                <Icon name="arrow" className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 칩 */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-gray-500 mr-1">예시:</span>
          {promptSuggestions.map((text) => (
            <button
              key={text}
              type="button"
              disabled={loading}
              onClick={() => setPrompt(text)}
              className="badge badge-sm py-3 px-3 bg-[#18262a] hover:bg-[#22363b] border-[#2c3d40] text-gray-400 text-xs rounded-lg transition"
            >
              {text}
            </button>
          ))}
        </div>

        {/* 3. 직접 선택하기 분기 버튼 */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => onNavigate("choose")}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-[#add9b9] py-2 px-4 rounded-lg bg-[#141e24] border border-[#2b3a42] hover:border-[#add9b9] transition"
          >
            <span>또는 조건 직접 선택하기 (계약 2종 × 주택 6종)</span>
            <Icon name="arrow" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. 기존 이어하기 */}
      {started && (
        <div className="mt-10 pt-5 border-t border-[#223238] flex items-center gap-4 text-xs text-gray-400">
          <span>이전에 확인하던 방이 있습니다</span>
          <button
            onClick={() => onNavigate(lastScene)}
            className="text-[#add9b9] hover:underline flex items-center gap-1 font-semibold"
          >
            <Icon name="reset" className="w-3.5 h-3.5" /> 이어서 탐색하기
          </button>
        </div>
      )}
    </div>
  );
}

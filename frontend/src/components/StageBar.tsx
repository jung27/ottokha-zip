import { Icon } from "./Icon";
import { routes, labels, type Scene } from "../types";

export function StageBar({
  currentScene,
  onNavigate,
}: {
  currentScene: Scene;
  onNavigate: (scene: Scene) => void;
}) {
  const step = routes.indexOf(currentScene);

  return (
    <div className="flex items-center justify-between border-b border-[#2c373e] py-5 px-2">
      <button
        className="flex items-center gap-2 text-sm text-[#a1aeb5] hover:text-white"
        onClick={() => onNavigate(routes[Math.max(0, step - 1)])}
      >
        <Icon name="back" className="w-4 h-4" />
        <span className="hidden sm:inline">이전 장면</span>
      </button>
      <nav aria-label="이야기 진행">
        <ol className="flex gap-4 sm:gap-8">
          {routes.slice(1).map((scene, index) => {
            const isActive = currentScene === scene;
            const isPast = step > index + 1;
            return (
              <li key={scene}>
                <button
                  onClick={() => onNavigate(scene)}
                  className={`flex items-center gap-2 text-sm ${
                    isActive
                      ? "text-[#add9b9] font-medium"
                      : isPast
                        ? "text-[#70838e]"
                        : "text-gray-500"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-[#add9b9] text-[#163022]"
                        : isPast
                          ? "bg-[#23332e] text-[#add9b9]"
                          : "border border-[#34434c]"
                    }`}
                  >
                    {isPast ? (
                      <Icon name="check" className="w-3 h-3" />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                  <span className="hidden md:inline">{labels[scene]}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      <span className="text-xs tracking-wider text-[#83969e]">CHAPTER 01</span>
    </div>
  );
}

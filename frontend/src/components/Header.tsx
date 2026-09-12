import { Icon } from "./Icon";
export function Header({
  onHome,
  onGuide,
  theme,
  onToggleTheme,
}: {
  onHome: () => void;
  onGuide: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  return (
    <header
      className={`mx-auto flex h-[76px] w-[min(1240px,100%)] items-center justify-between px-7 [&_nav]:flex [&_nav]:gap-4
      max-[800px]:px-5 max-[600px]:h-16 max-[600px]:px-4 max-[600px]:[&_nav]:gap-3`}
    >
      <button
        className="flex items-center gap-2.5 text-[1.2rem] font-extrabold tracking-[-0.055em] max-[600px]:gap-[7px] max-[600px]:text-base"
        onClick={onHome}
        aria-label="어떡하집? 첫 화면으로"
      >
        <span
          className={`flex size-8 items-center justify-center rounded-[10px] border border-line bg-accent-soft text-accent
          [&_svg]:size-5 max-[600px]:size-7 max-[600px]:rounded-[9px]`}
        >
          <Icon name="door" />
        </span>
        <span>
          어떡하집<span className="text-accent">?</span>
        </span>
      </button>
      <nav aria-label="화면 설정">
        <button
          className={`flex min-h-10 items-center gap-1.5 text-[0.73rem] text-muted hover:text-accent [&_svg]:size-[17px]
          max-[600px]:gap-1 max-[600px]:text-[0.65rem] max-[600px]:first:[&>span]:hidden`}
          onClick={onGuide}
          aria-label="서비스 소개"
        >
          <Icon name="help" />
          <span>서비스 소개</span>
        </button>
        <button
          className={`flex min-h-10 items-center gap-1.5 text-[0.73rem] text-muted hover:text-accent [&_svg]:size-[17px]
            max-[600px]:gap-1 max-[600px]:text-[0.65rem] max-[600px]:first:[&>span]:hidden`}
          onClick={onToggleTheme}
          aria-label={
            theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"
          }
        >
          <span aria-hidden="true" className="text-[1.35rem] leading-none">
            {theme === "light" ? "☾" : "☀"}
          </span>
          <span>{theme === "light" ? "다크 모드" : "라이트 모드"}</span>
        </button>
      </nav>
    </header>
  );
}

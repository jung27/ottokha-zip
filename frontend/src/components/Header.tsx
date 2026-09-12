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
    <header className="app-header">
      <button
        className="brand"
        onClick={onHome}
        aria-label="어떡하집? 첫 화면으로"
      >
        <span className="brand-mark">
          <Icon name="door" />
        </span>
        <span>
          어떡하집<span className="brand-accent">?</span>
        </span>
      </button>
      <nav aria-label="화면 설정">
        <button className="header-button" onClick={onGuide}>
          <Icon name="help" />
          <span>서비스 소개</span>
        </button>
        <button
          className="header-button"
          onClick={onToggleTheme}
          aria-label={
            theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"
          }
        >
          <span aria-hidden="true" className="theme-symbol">
            {theme === "light" ? "☾" : "☀"}
          </span>
          <span>{theme === "light" ? "다크 모드" : "라이트 모드"}</span>
        </button>
      </nav>
    </header>
  );
}

import { Icon } from "./Icon";
export function Header({ onHome }: { onHome: () => void }) {
  return <header className="app-header">
    <button className="brand" onClick={onHome} aria-label="어떡하집? 첫 화면으로">
      <Icon name="home" /><span>어떡하집?</span>
    </button>
  </header>;
}

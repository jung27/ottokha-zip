import { Icon } from "./Icon";
import type { ModalKind, Scene } from "../types";

export function Header({
  onNavigate,
  onOpenModal,
}: {
  onNavigate: (scene: Scene) => void;
  onOpenModal: (kind: ModalKind) => void;
}) {
  return (
    <header className="border-b border-[#2c373e] px-4 sm:px-8 h-16 flex items-center justify-between max-w-7xl w-full mx-auto">
      <button
        className="flex items-center gap-2 text-xl font-extrabold text-white"
        onClick={() => onNavigate("home")}
      >
        <Icon name="door" className="w-6 h-6 text-[#add9b9]" />
        <span>
          어떡하집<span className="text-[#add9b9]">.</span>
        </span>
      </button>
      <nav className="flex items-center gap-4">
        <button
          className="btn btn-ghost btn-sm text-gray-300"
          onClick={() => onOpenModal("journey")}
        >
          <Icon name="map" /> <span className="hidden sm:inline">여정</span>
        </button>
        <button
          className="btn btn-ghost btn-sm text-gray-300"
          onClick={() => onOpenModal("notebook")}
        >
          <Icon name="book" /> <span className="hidden sm:inline">수첩</span>
        </button>
        <button
          className="btn btn-circle btn-ghost btn-sm text-gray-300"
          onClick={() => onOpenModal("guide")}
        >
          <Icon name="help" />
        </button>
      </nav>
    </header>
  );
}

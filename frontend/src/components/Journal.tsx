import { Icon } from "./Icon";
import type { Note } from "../types";

export function Journal({
  notes,
  onOpenNotebook,
}: {
  notes: Note[];
  onOpenNotebook: () => void;
}) {
  return (
    <aside className="hidden lg:flex flex-col bg-[#161f26] border border-[#2d3a42] rounded-lg p-5 w-72 shrink-0">
      <div className="flex items-center gap-2 pb-3 border-b border-[#2c3c44]">
        <Icon name="book" className="text-[#add9b9]" />
        <h2 className="text-sm font-semibold flex-1">나의 수첩</h2>
        <span className="badge badge-sm bg-[#28372f] text-[#add9b9] border-0">
          {notes.length}
        </span>
      </div>
      <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-96">
        {notes.length ? (
          notes.slice(-4).map((note, index) => (
            <div
              key={note.id}
              className="text-xs border-b border-[#293940] pb-2"
            >
              <span className="text-[#add9b9] font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold text-gray-200 mt-1">{note.title}</h3>
              <p className="text-[#8da3af] mt-0.5">{note.text}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-xs text-[#8398a2]">
            <Icon name="book" className="mx-auto mb-2 opacity-50 w-8 h-8" />
            아직은 빈 페이지.
            <br />
            작은 발견부터 적어보자.
          </div>
        )}
      </div>
      <button
        className="btn btn-ghost btn-sm text-[#add9b9] justify-between px-0"
        onClick={onOpenNotebook}
      >
        수첩 펼치기 <Icon name="arrow" className="w-4 h-4" />
      </button>
    </aside>
  );
}

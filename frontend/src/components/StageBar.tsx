import { STAGES, type Stage } from "../types";
import { Icon } from "./Icon";

export function StageBar({ stage }: { stage: Stage }) {
  return (
    <nav
      className="mx-auto mb-3 w-full max-w-[1288px] rounded-xl border border-line bg-surface px-3 py-2 max-[600px]:px-2"
      aria-label="이야기 진행"
    >
      <p className="mb-2 text-xs font-semibold text-accent" role="status">현재 {stage} / 5단계 · {STAGES.find((item) => item.id === stage)?.title}</p>
      <ol className="m-0 grid list-none grid-cols-5 gap-1 p-0">
        {STAGES.filter((item) => item.id <= 5).map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-soft px-1 py-2 text-xs text-muted aria-[current=step]:bg-accent aria-[current=step]:font-bold aria-[current=step]:text-accent-ink max-[600px]:gap-1 max-[600px]:text-[0.61rem]"
            aria-current={item.id === stage ? "step" : undefined}
          >
            <span className="inline-block max-[600px]:hidden">
              {item.id < stage ? (
                <Icon name="check" className="w-3 h-3" />
              ) : (
                item.id
              )}
            </span>
            <span className="whitespace-nowrap">{item.title}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

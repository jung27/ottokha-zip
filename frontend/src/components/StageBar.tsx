import { STAGES, type Stage } from "../types";
import { Icon } from "./Icon";

export function StageBar({
  stage,
  progress,
}: {
  stage: Stage;
  progress: number;
}) {
  return (
    <nav
      className="[&_li[aria-current=step]]:text-accent"
      aria-label="이야기 진행"
    >
      <ol>
        {STAGES.map((item) => (
          <li
            key={item.id}
            aria-current={item.id === stage ? "step" : undefined}
          >
            <span className="inline-block">
              {item.id < stage ? (
                <Icon name="check" className="w-3 h-3" />
              ) : (
                item.id
              )}
            </span>
            <span>{item.title}</span>
          </li>
        ))}
      </ol>
      <progress value={progress} max={100} aria-label="전체 여정 진행률" />
    </nav>
  );
}

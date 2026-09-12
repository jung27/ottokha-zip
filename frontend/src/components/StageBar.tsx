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
    <nav className="stage-bar" aria-label="이야기 진행">
      <ol>
        {STAGES.map((item) => (
          <li
            key={item.id}
            aria-current={item.id === stage ? "step" : undefined}
            className={
              item.id === stage ? "active" : item.id < stage ? "past" : ""
            }
          >
            <span className="stage-number">
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

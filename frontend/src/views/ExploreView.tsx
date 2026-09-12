import { useState } from "react";
import { DialogueBox, NextButton, SceneFrame } from "../components/Journal";
import { ScenePopup } from "../components/StoryModal";
import { FeedbackPanel } from "./TalkView";
import { hasRequiredItems } from "../data";
import type { PlayViewProps } from "../types";

// marked 참고본의 좌표를 기본 방 사진의 비율(16:9)에 맞춘다.
// 가까운 창문 두 지점은 버튼을 벌리고 선으로 실제 확인 위치를 가리킨다.
const inspectionSpots = [
  { id: "water", x: 33.2, y: 28.2 },
  { id: "drain", x: 33.1, y: 46.3 },
  { id: "ceiling", x: 16.5, y: 10.9 },
  { id: "mold", x: 21.3, y: 35.3 },
  { id: "silicone", x: 8, y: 34, target: { x: 12.8, y: 37.5 } },
  { id: "window", x: 21, y: 53, target: { x: 12.8, y: 41.1 } },
  { id: "wall", x: 63.8, y: 36.4 },
  { id: "sink", x: 71.2, y: 64.8 },
  { id: "lock", x: 9, y: 64.8 },
  { id: "socket", x: 86.8, y: 46.2 },
];

export function ExploreView({
  step,
  selected,
  answered,
  feedback,
  onToggle,
  onSubmit,
  onNext,
  onRetry,
}: PlayViewProps) {
  const [line, setLine] = useState(0);
  const [detail, setDetail] = useState<string | null>(null);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const interactive = line >= step.beats.length;
  const current = step.beats[Math.min(line, step.beats.length - 1)];
  const items = step.items ?? [];
  const commonItems = items.filter((point) => !point.extra);
  const allChecked = hasRequiredItems(step, selected);
  const remainingCount = items.filter((point) => !selected.includes(point.id)).length;
  const commonCount = items.filter(
    (item) => !item.extra && selected.includes(item.id),
  ).length;
  const item = items.find((point) => point.id === detail);
  const extraItems = items.filter((point) => point.extra);
  const extraCount = extraItems.filter((point) =>
    selected.includes(point.id),
  ).length;
  function inspect(id: string) {
    setDetail(id);
    if (!selected.includes(id)) onToggle(id);
  }
  const extraPoints = extraItems.map((point) => (
    <button
      key={point.id}
      className={`flex min-h-10 items-center gap-2 rounded-[9px] border border-line bg-surface px-3 py-[9px] text-left
            text-[0.73rem] leading-[1.7] [&_span]:text-accent aria-pressed:border-accent aria-pressed:bg-selected
            aria-pressed:text-accent enabled:hover:border-accent max-[600px]:min-h-9 max-[600px]:gap-[5px]
            max-[600px]:p-2 max-[600px]:text-[0.65rem] `}
      aria-pressed={selected.includes(point.id)}
      disabled={answered}
      onClick={() => {
        inspect(point.id);
        setExtrasOpen(false);
      }}
    >
      <span>{selected.includes(point.id) ? "✓" : "+"}</span>
      {point.title}
    </button>
  ));
  return (
    <SceneFrame
      background={
        interactive || answered
          ? "room"
          : (current.background ?? step.background)
      }
      context={
        item ? item.description + item.signal + item.advice : "결로 하자 관리비"
      }
      overlay={
        answered ? (
          <FeedbackPanel
            feedback={feedback}
            notice={step.notice}
            onNext={onNext}
            onRetry={onRetry}
          />
        ) : extrasOpen ? (
          <ScenePopup
            title="추가로 살펴볼 곳"
            onClose={() => setExtrasOpen(false)}
          >
            <div className="grid gap-2">{extraPoints}</div>
          </ScenePopup>
        ) : undefined
      }
      scene={
        interactive || answered ? (
          <div className="absolute inset-0" data-inspection-scene>
            <div
              className="absolute top-1/2 left-0 aspect-video w-full -translate-y-1/2"
              data-inspection-photo-plane
            >
              <svg
                className="pointer-events-none absolute inset-0 size-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {inspectionSpots
                  .filter((spot) => spot.target)
                  .map((spot) => (
                    <line
                      key={spot.id}
                      x1={spot.x}
                      y1={spot.y}
                      x2={spot.target!.x}
                      y2={spot.target!.y}
                      stroke="white"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
              </svg>
              {inspectionSpots.map((spot, index) => {
                const point = items.find((entry) => entry.id === spot.id);
                if (!point) return null;
                const checked = selected.includes(point.id);
                return (
                  <button
                    key={spot.id}
                    className={`group/spot absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full
                      border-2 border-white bg-[#e55a2b] text-sm font-bold text-white shadow-[0_2px_10px_#0006]
                      transition-[background,box-shadow] enabled:hover:bg-[#c3471c] aria-pressed:bg-[#306b4b] focus-visible:z-10
                      focus-visible:outline-white disabled:opacity-65 max-[600px]:size-7 max-[600px]:text-xs`}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    aria-label={`${index + 1}. ${point.title}`}
                    aria-pressed={checked}
                    disabled={answered}
                    onClick={() => inspect(point.id)}
                    data-inspection-spot={spot.id}
                  >
                    <span aria-hidden="true">{checked ? "✓" : index + 1}</span>
                    <span
                      className={`pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap
                      rounded-md bg-[#20382d] px-2 py-1 text-xs font-medium text-white group-hover/spot:block
                      group-focus-visible/spot:block max-[600px]:group-hover/spot:hidden`}
                      aria-hidden="true"
                    >
                      {point.title}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-2 max-[600px]:right-2 max-[600px]:bottom-2 max-[600px]:left-2">
              <span
                className="rounded-lg bg-surface/95 px-3 py-2 text-xs font-semibold text-ink shadow-panel max-[600px]:px-2 max-[600px]:text-[0.65rem]"
                role="status"
              >
                방 안 확인 {commonCount} / {commonItems.length}
              </span>
              <button
                className={`rounded-lg border border-line bg-surface/95 px-3 py-2 text-xs font-semibold text-ink shadow-panel
                enabled:hover:border-accent max-[600px]:px-2 max-[600px]:text-[0.65rem]`}
                onClick={() => setExtrasOpen(true)}
                disabled={answered}
                aria-haspopup="dialog"
              >
                추가 확인 {extraCount} / {extraItems.length}
              </button>
            </div>
          </div>
        ) : undefined
      }
    >
      {
        <DialogueBox
          speaker={interactive ? item?.title : current.speaker}
          text={
            interactive
              ? (item?.description ??
                `사진 속 ${commonItems.length}곳과 추가 확인 ${extraItems.length}곳을 모두 살펴보자.`)
              : current.text
          }
          actions={
            interactive ? (
              <>
                {item && !answered && (
                  <button
                    className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-1.5 py-[11px]
                      text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
                      duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
                      max-[600px]:py-2.5 max-[600px]:text-[0.74rem] text-muted hover:text-accent`}
                    onClick={() => {
                      onToggle(item.id);
                      setDetail(null);
                    }}
                  >
                    선택 해제
                  </button>
                )}
                <NextButton onClick={onSubmit} disabled={answered || !allChecked}>
                  임장 마치기
                </NextButton>
              </>
            ) : (
              <NextButton onClick={() => setLine(line + 1)} />
            )
          }
        >
          {interactive && !answered && (
            <p className="mt-2 text-xs text-muted" role="status">
              {allChecked
                ? `총 ${items.length}곳을 모두 확인했습니다. 임장을 마칠 수 있어요.`
                : `공통 ${commonItems.length}곳과 추가 ${extraItems.length}곳을 모두 확인해야 합니다. ${remainingCount}곳 남았어요.`}
            </p>
          )}
          {interactive && item && (
            <div
              className="mt-2.5 text-[0.8rem] [&_p+p]:mt-[5px] [&_p+p]:text-[0.73rem] [&_p+p]:text-muted max-[600px]:text-[0.75rem]"
              aria-live="polite"
            >
              <p>{item.signal}</p>
              {item.advice !== item.description && <p>{item.advice}</p>}
            </div>
          )}
        </DialogueBox>
      }
    </SceneFrame>
  );
}

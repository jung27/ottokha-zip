import { useRef, useState } from "react";
import { DialogueBox, NextButton, SceneFrame } from "../components/Journal";
import { ScenePopup, StoryModal } from "../components/StoryModal";
import { inspectionGuide } from "../inspectionGuide";
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
  onToggle,
  onSubmit,
  onNext,
}: PlayViewProps) {
  const [line, setLine] = useState(0);
  const [detail, setDetail] = useState<string | null>(null);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const extraButton = useRef<HTMLButtonElement>(null);
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
    setDetailOpen(true);
  }
  function confirmInspection() {
    if (!item) return;
    if (!selected.includes(item.id)) onToggle(item.id);
    setLastChecked(item.title);
    setDetailOpen(false);
    if (extrasOpen) extraButton.current?.focus();
  }
  const guide = item ? inspectionGuide(item) : undefined;
  const detailContent = guide && (
    <div className="mt-4 space-y-4 text-sm leading-relaxed" data-inspection-guide>
      <section><h3 className="mb-1 font-bold text-accent">왜 중요한가요?</h3><p>{guide.reason}</p></section>
      <section><h3 className="mb-1 font-bold">이렇게 확인하세요</h3><p>{guide.method}</p></section>
      <section className="rounded-xl bg-accent-soft p-3"><h3 className="mb-1 font-bold text-accent">양호한 상태</h3><p>{guide.good}</p></section>
      <section className="rounded-xl bg-risk-bg p-3"><h3 className="mb-1 font-bold text-risk">주의할 신호</h3><p>{guide.warning}</p></section>
      {guide.advice !== guide.method && <p>{guide.advice}</p>}
      <div className="flex justify-end"><NextButton onClick={confirmInspection}>확인</NextButton></div>
    </div>
  );
  const extraPoints = extraItems.map((point) => (
    <button
      key={point.id}
      ref={point.id === detail ? extraButton : undefined}
      className={`flex min-h-10 items-center gap-2 rounded-[9px] border border-line bg-surface px-3 py-[9px] text-left
            text-[0.73rem] leading-[1.7] [&_span]:text-accent aria-pressed:border-accent aria-pressed:bg-selected
            aria-pressed:text-accent enabled:hover:border-accent max-[600px]:min-h-9 max-[600px]:gap-[5px]
            max-[600px]:p-2 max-[600px]:text-[0.65rem] `}
      aria-pressed={selected.includes(point.id)}
      disabled={answered}
      onClick={() => {
        inspect(point.id);
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
          <ScenePopup title={step.notice?.title ?? "임장 팁"} onClose={onNext} hideClose actions={<NextButton onClick={onNext} />}>
            <p className="text-sm leading-relaxed">{step.notice?.text}</p>
          </ScenePopup>
        ) : extrasOpen ? (
          <StoryModal
            title="추가로 살펴볼 곳"
            onClose={() => { setExtrasOpen(false); setDetailOpen(false); }}
          >
            <div className="grid gap-2">{extraPoints}</div>
            {detailOpen && item?.extra ? <><h2 className="mt-5 font-bold">{item.title}</h2>{detailContent}</> : <p className="mt-4 text-sm text-muted">{lastChecked ? `${lastChecked} 확인했습니다. ` : ""}다른 항목도 계속 선택할 수 있어요. 추가 확인 {extraCount} / {extraItems.length}</p>}
            <div className="mt-4 flex justify-end"><button className="rounded-lg border border-line px-4 py-2 text-sm" onClick={() => { setExtrasOpen(false); setDetailOpen(false); }}>방으로 돌아가기</button></div>
          </StoryModal>
        ) : detailOpen && item ? (
          <StoryModal title={item.title} onClose={() => setDetailOpen(false)}>{detailContent}</StoryModal>
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
          speaker={interactive || answered ? undefined : current.speaker}
          text={
            answered ? "완료됐습니다." : interactive
              ? (lastChecked ? `${lastChecked} 확인했습니다.` :
                `사진 속 ${commonItems.length}곳과 추가 확인 ${extraItems.length}곳을 모두 살펴보자.`)
              : current.text
          }
          actions={
            answered ? null : interactive ? (
              <>
                {item && selected.includes(item.id) && (
                  <button
                    className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-1.5 py-[11px]
                      text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
                      duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
                      max-[600px]:py-2.5 max-[600px]:text-[0.74rem] text-muted hover:text-accent`}
                    onClick={() => {
                      onToggle(item.id);
                      setLastChecked(null);
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
        </DialogueBox>
      }
    </SceneFrame>
  );
}

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";

export function StoryModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className={`m-auto hidden max-h-[calc(100svh-40px)] w-[min(560px,calc(100%-32px))] overflow-y-auto rounded-[20px]
        border border-line bg-surface p-[26px] text-ink shadow-[0_20px_100px_#10251d2b] open:block
        backdrop:bg-[#12261e66] backdrop:backdrop-blur-[4px] max-[600px]:p-[21px]`}
      aria-labelledby="story-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="mb-5 flex items-center justify-between gap-[15px] border-b border-line pb-[15px] [&_h2]:text-[1.03rem]">
        <h2 id="story-modal-title">{title}</h2>
        <button
          className="grid size-8 shrink-0 place-items-center rounded-[9px] text-muted hover:bg-soft hover:text-ink [&_svg]:size-[17px]"
          onClick={onClose}
          aria-label="닫기"
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

// 장면 안에서 열려도 배경과 대화창의 크기는 그대로 유지한다.
export function ScenePopup({
  title,
  onClose,
  children,
  actions,
  alert = false,
  className = "",
  dictionary = false,
  hideClose = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  alert?: boolean;
  className?: string;
  dictionary?: boolean;
  hideClose?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const first = panel.current?.querySelector<HTMLElement>("input, button");
    (first ?? panel.current)?.focus({ preventScroll: true });
    return () => {
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return (
    <div
      className={`group/popup absolute inset-0 z-10 flex items-center justify-center bg-backdrop p-3 backdrop-blur-[3px]
      data-[dictionary=true]:justify-end data-[dictionary=true]:backdrop-filter-none max-[600px]:p-2`}
      data-warning={alert}
      data-dictionary={dictionary}
    >
      <div
        className={
          `flex min-h-0 max-h-full w-[min(620px,100%)] flex-col rounded-2xl border border-line bg-surface
          shadow-[0_12px_60px_#102d2930] outline-none group-data-[warning=true]/popup:border-risk-line
          group-data-[dictionary=true]/popup:w-[335px] group-data-[dictionary=true]/popup:self-stretch
          max-[600px]:rounded-xl max-[600px]:group-data-[dictionary=true]/popup:w-[min(320px,100%)] ` +
          className
        }
        role={alert ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-label={title}
        ref={panel}
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            onClose();
          }
          if (event.key !== "Tab") return;
          const elements = panel.current?.querySelectorAll<HTMLElement>(
            "button:not(:disabled),input,a[href],summary",
          );
          if (!elements?.length) return;
          const first = elements[0];
          const last = elements[elements.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div
          className={`flex shrink-0 items-start gap-2.5 px-[19px] pt-[17px] pb-3 [&_h2]:flex-1 [&_h2]:pt-0.5
          [&_h2]:text-[0.9rem] [&_h2]:leading-[1.7] [&>button]:-mt-0.5 [&>button]:-mr-[5px]
          group-data-[warning=true]/popup:mb-[13px] group-data-[warning=true]/popup:rounded-t-[15px]
          group-data-[warning=true]/popup:bg-risk-bg group-data-[warning=true]/popup:text-risk
          group-data-[dictionary=true]/popup:pb-[17px] max-[600px]:gap-[7px] max-[600px]:px-[11px]
          max-[600px]:pt-2.5 max-[600px]:pb-2 max-[600px]:[&_h2]:text-[0.74rem] max-[600px]:[&_h2]:leading-[1.65]
          max-[600px]:[&>button]:size-[27px] max-[600px]:group-data-[warning=true]/popup:mb-[9px]
          max-[600px]:group-data-[warning=true]/popup:rounded-t-[11px]
          max-[600px]:group-data-[dictionary=true]/popup:pb-3`}
        >
          <span
            className={`grid h-7 flex-[0_0_28px] place-items-center rounded-[9px] bg-accent-soft text-accent [&_svg]:size-[17px]
            group-data-[warning=true]/popup:bg-risk group-data-[warning=true]/popup:text-surface max-[600px]:h-[23px]
            max-[600px]:basis-[23px] max-[600px]:rounded-[7px] max-[600px]:[&_svg]:size-3.5`}
          >
            <Icon name={alert ? "info" : "book"} />
          </span>
          <h2>{title}</h2>
          {!hideClose && <button
            className="grid size-8 shrink-0 place-items-center rounded-[9px] text-muted hover:bg-soft hover:text-ink [&_svg]:size-[17px]"
            onClick={onClose}
            aria-label="닫기"
          >
            <Icon name="close" />
          </button>}
        </div>
        <div className="min-h-0 overflow-y-auto px-5 pb-4 [scrollbar-width:thin] group-data-[dictionary=true]/popup:pb-5 max-[600px]:px-[13px] max-[600px]:pb-3">
          {children}
        </div>
        {actions && (
          <div
            className={`flex shrink-0 items-center justify-end gap-3 border-t border-line px-[19px] py-2.5 max-[600px]:px-[11px]
          max-[600px]:py-[7px] max-[600px]:[&>button]:min-h-[33px] max-[600px]:[&>button]:px-[13px]
          max-[600px]:[&>button]:py-[7px] max-[600px]:[&>button]:text-[0.68rem]`}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

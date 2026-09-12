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
      className="story-modal"
      aria-labelledby="story-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="modal-heading">
        <h2 id="story-modal-title">{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="닫기">
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
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  alert?: boolean;
  className?: string;
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
    <div className="scene-popup-layer">
      <div
        className={"scene-popup " + (alert ? "warning-popup " : "") + className}
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
        <div className="popup-heading">
          <span className="popup-icon">
            <Icon name={alert ? "info" : "book"} />
          </span>
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="닫기">
            <Icon name="close" />
          </button>
        </div>
        <div className="popup-body">{children}</div>
        {actions && <div className="popup-actions">{actions}</div>}
      </div>
    </div>
  );
}

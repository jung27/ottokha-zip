import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="story-modal m-auto rounded-xl border border-[#40514f] bg-[#19272e] p-6 text-[#f0f3f2] shadow-2xl backdrop:bg-[#071018]/70 backdrop:blur-sm"
      aria-labelledby="story-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const b = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < b.left ||
          e.clientX > b.right ||
          e.clientY < b.top ||
          e.clientY > b.bottom
        )
          onClose();
      }}
    >
      <div className="flex items-center justify-between mb-5 border-b border-[#2c373e] pb-3">
        <h2 id="story-modal-title" className="text-xl font-bold">
          {title}
        </h2>
        <button
          className="btn btn-ghost btn-circle btn-sm"
          onClick={onClose}
          aria-label="닫기"
        >
          <Icon name="close" className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

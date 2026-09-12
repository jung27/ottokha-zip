import { Icon } from "../Icon";
import { StoryModal } from "../StoryModal";
import {
  routes,
  labels,
  sourceUrl,
  type ModalKind,
  type Note,
  type Scene,
} from "../../types";

export function AppModals({
  modal,
  notes,
  currentRoute,
  onClose,
  onStartNew,
  onNavigate,
  onConfirmWarning,
}: {
  modal: ModalKind;
  notes: Note[];
  currentRoute: Scene;
  onClose: () => void;
  onStartNew: () => void;
  onNavigate: (scene: Scene) => void;
  onConfirmWarning: () => void;
}) {
  if (!modal) return null;

  let title = "";
  let content: React.ReactNode = null;

  switch (modal) {
    case "new":
      title = "새로운 이야기를 시작할까요?";
      content = (
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            지금까지 저장된 진행 기록을 비우고 집 선택부터 시작합니다.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              취소
            </button>
            <button
              className="btn btn-primary btn-sm bg-[#add9b9] text-black border-none"
              onClick={() => {
                onStartNew();
                onClose();
              }}
            >
              새로 시작
            </button>
          </div>
        </div>
      );
      break;

    case "journey":
      title = "나의 여정";
      content = (
        <div className="flex flex-col gap-2">
          {routes.map((scene, idx) => (
            <button
              key={scene}
              onClick={() => {
                onNavigate(scene);
                onClose();
              }}
              className={`btn justify-between ${
                currentRoute === scene
                  ? "btn-neutral border-[#add9b9]"
                  : "btn-ghost"
              }`}
            >
              <span>
                {String(idx).padStart(2, "0")}. {labels[scene]}
              </span>
              <Icon name="arrow" className="w-4 h-4" />
            </button>
          ))}
        </div>
      );
      break;

    case "notebook":
      title = "나의 수첩";
      content = (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notes.length ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-[#141e25] rounded-lg border border-[#2c373e]"
              >
                <h3 className="font-bold text-[#add9b9] text-sm">
                  {note.title}
                </h3>
                <p className="text-xs text-gray-300 mt-1">{note.text}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-sm text-gray-500">
              기록된 메모가 없습니다.
            </div>
          )}
        </div>
      );
      break;

    case "guide":
    case "document-guide":
      title = "가이드 및 유의사항";
      content = (
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            등기부등본의 소유자와 실제 계약자 및 입금 계좌의 예금주가 일치하는지
            반드시 대조해야 합니다.
          </p>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline text-[#add9b9] w-full gap-2"
          >
            국토교통부 공식 자료 확인{" "}
            <Icon name="external" className="w-4 h-4" />
          </a>
        </div>
      );
      break;

    case "explore-warning":
      title = "아직 둘러보지 않은 곳이 있어요";
      content = (
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            방 안의 주요 항목들을 모두 확인하면 더 알맞은 질문을 던질 수
            있습니다.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              더 둘러보기
            </button>
            <button
              className="btn btn-primary btn-sm bg-[#add9b9] text-black border-none"
              onClick={() => {
                onClose();
                onNavigate("talk");
              }}
            >
              그냥 넘어가기
            </button>
          </div>
        </div>
      );
      break;

    case "send-warning":
      title = "잠깐! 확인하셨나요?";
      content = (
        <div className="space-y-4 text-center">
          <div className="text-amber-400 font-bold text-lg">
            등기상 소유자 ≠ 계좌 예금주
          </div>
          <p className="text-xs text-gray-300">
            소유자(김민수)와 예금주(박지훈)가 다릅니다. 확인 없이 먼저 송금하지
            마세요.
          </p>
          <button
            className="btn btn-block bg-[#add9b9] text-black border-none"
            onClick={() => {
              onClose();
              onConfirmWarning();
            }}
          >
            돌아가서 확인하기
          </button>
        </div>
      );
      break;

    case "ending":
      title = "방문 완료";
      content = (
        <div className="space-y-4 text-center">
          <p className="text-sm text-gray-200">
            성공적으로 첫 방문 점검을 마쳤습니다. 서류와 계좌의 불일치를 확인한
            것은 훌륭한 선택입니다.
          </p>
          <button
            className="btn btn-block bg-[#add9b9] text-black border-none"
            onClick={() => {
              onClose();
              onNavigate("home");
            }}
          >
            홈으로 가기
          </button>
        </div>
      );
      break;
  }

  return (
    <StoryModal title={title} onClose={onClose}>
      {content}
    </StoryModal>
  );
}

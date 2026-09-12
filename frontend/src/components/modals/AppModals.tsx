import { StoryModal } from "../StoryModal";
import type { ModalKind } from "../../types";
export function AppModals({ modal, onClose, onStartNew }: {
  modal: ModalKind;
  onClose: () => void;
  onStartNew: () => void;
}) {
  if (!modal) return null;
  return <StoryModal title="처음부터 시작할까요?" onClose={onClose}>
    <div className="modal-content">
      <p>지금까지의 선택을 지우고 새로운 이야기를 시작합니다.</p>
      <div className="dialogue-actions">
        <button className="text-button" onClick={onClose}>돌아가기</button>
        <button className="primary-button" onClick={onStartNew}>처음부터 시작</button>
      </div>
    </div>
  </StoryModal>;
}

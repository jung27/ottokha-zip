import { Icon } from "../Icon";
import { StoryModal } from "../StoryModal";
import { sources } from "../../data";
import type { ModalKind } from "../../types";
const links = [
  {
    name: "등기부등본",
    place: "인터넷등기소",
    text: "소유자와 근저당·신탁 등 권리관계. 계약일·잔금일 두 번 열람",
    url: sources.registry,
  },
  {
    name: "건축물대장",
    place: "정부24",
    text: "용도, 층·호수, 위반건축물 표기",
    url: sources.government,
  },
  {
    name: "확정일자 부여현황",
    place: "주민센터",
    text: "다가구 선순위 보증금 총액. 열람에 필요한 동의와 서류 확인",
    url: sources.law,
  },
  {
    name: "미납 국세·지방세 열람",
    place: "세무서·지자체",
    text: "임대인의 체납액과 열람 요건 확인",
    url: sources.tax,
  },
];
export function AppModals({
  modal,
  onClose,
  onStartNew,
}: {
  modal: ModalKind;
  onClose: () => void;
  onStartNew: () => void;
}) {
  if (!modal) return null;
  const choosingConditions = modal === "conditions";
  return (
    <StoryModal
      title={
        choosingConditions
          ? "조건을 다시 선택할까요?"
          : modal === "new"
            ? "처음부터 시작할까요?"
            : "부록"
      }
      onClose={onClose}
    >
      {modal === "new" || choosingConditions ? (
        <div className="[&_p]:text-[0.84rem]">
          <p>
            {choosingConditions
              ? "지금까지의 선택을 지우고 계약 방식과 집을 다시 고릅니다."
              : "지금까지의 선택을 지우고 새로운 이야기를 시작합니다."}
          </p>
          <div
            className="mt-3 flex shrink-0 flex-wrap items-center justify-end gap-2.5 empty:mt-0 max-[600px]:mt-2.5"
            data-dialogue-actions
          >
            <button
              className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-1.5 py-[11px]
              text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
              duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
              max-[600px]:py-2.5 max-[600px]:text-[0.74rem] text-muted hover:text-accent`}
              onClick={onClose}
            >
              돌아가기
            </button>
            <button
              className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-[18px] py-[11px]
              text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
              duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
              max-[600px]:py-2.5 max-[600px]:text-[0.74rem] border border-mint bg-mint text-[#173d29]
              enabled:hover:border-[#b1dbbf] enabled:hover:bg-[#b1dbbf]`}
              data-button="primary"
              onClick={onStartNew}
            >
              {choosingConditions ? "조건 선택하기" : "처음부터 시작"}
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`[&_h3]:mt-5 [&_h3]:mb-2.5 [&_a]:flex [&_a]:items-center [&_a]:justify-between [&_a]:gap-3.5 [&_a]:border-b
          [&_a]:border-line [&_a]:py-[13px] [&_a]:text-[0.8rem] [&_a]:no-underline [&_a:hover]:text-accent
          [&_a_svg]:size-[15px] [&_a_svg]:shrink-0 [&_small]:mt-[5px] [&_small]:block [&_small]:text-[0.7rem]
          [&_small]:leading-[1.8] [&_small]:text-muted`}
        >
          <h3>필수 서류</h3>
          {links.map((link) => (
            <a key={link.name} href={link.url} target="_blank" rel="noreferrer">
              <span>
                <strong>{link.name}</strong>
                <small>
                  {link.place} · {link.text}
                </small>
              </span>
              <Icon name="external" />
            </a>
          ))}
          <h3>문제가 생겼을 때</h3>
          <a href="https://www.khug.or.kr/" target="_blank" rel="noreferrer">
            전세피해지원센터 · 주택도시보증공사(HUG)
            <Icon name="external" />
          </a>
          <a href={sources.help} target="_blank" rel="noreferrer">
            대한법률구조공단
            <Icon name="external" />
          </a>
          <a href="https://www.police.go.kr/" target="_blank" rel="noreferrer">
            경찰 · 사기 혐의 신고
            <Icon name="external" />
          </a>
          <a href="https://www.scourt.go.kr/" target="_blank" rel="noreferrer">
            관할 법원 · 임차권등기명령
            <Icon name="external" />
          </a>
        </div>
      )}
    </StoryModal>
  );
}

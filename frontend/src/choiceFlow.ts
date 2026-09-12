import { getCheckpoints, getSteps, hasRequiredItems } from "./data.ts";
import type { GameState, HouseId, Step } from "./types.ts";

// 답변과 재시도 이력을 분리해 오답을 고쳐도 리뷰에 시도 기록을 남긴다.
export function chooseAnswer(game: GameState, stepId: string, choiceId: string): GameState {
  const step = getSteps(game).find((item) => item.id === stepId);
  const choice = step?.choices?.find((item) => item.id === choiceId);
  if (
    game.page !== "play" || game.cursor !== stepId || game.answers[stepId] ||
    !choice || choice.disabledReason || game.attempts[stepId]?.includes(choiceId)
  ) return game;
  return {
    ...game,
    answers: { ...game.answers, [stepId]: [choiceId] },
    attempts: { ...game.attempts, [stepId]: [...(game.attempts[stepId] ?? []), choiceId] },
  };
}

export function retryChoice(game: GameState, stepId: string): GameState {
  const step = getSteps(game).find((item) => item.id === stepId);
  const selected = game.answers[stepId] ?? [];
  if (
    game.page !== "play" || game.cursor !== stepId ||
    !step?.choices?.some((choice) => selected.includes(choice.id) && choice.status === "risk")
  ) return game;
  return {
    ...game,
    answers: Object.fromEntries(Object.entries(game.answers).filter(([id]) => id !== stepId)),
  };
}

export function submitChecks(game: GameState, stepId: string): GameState {
  const step = getSteps(game).find((item) => item.id === stepId);
  const selected = game.drafts[stepId] ?? [];
  if (
    game.page !== "play" || game.cursor !== stepId || game.answers[stepId] ||
    !step?.items || !hasRequiredItems(step, selected)
  ) return game;
  const updated = { ...game, answers: { ...game.answers, [stepId]: selected } };
  const missed = getCheckpoints(updated).filter((note) =>
    note.stepId === stepId && note.showFeedback && note.countRisk && note.status === "risk",
  ).map((note) => note.id.slice(stepId.length + 1));
  return {
    ...updated,
    attempts: { ...game.attempts, [stepId]: [...new Set([...(game.attempts[stepId] ?? []), ...missed])] },
  };
}

export function retryStep(game: GameState, stepId: string): GameState {
  const step = getSteps(game).find((item) => item.id === stepId);
  if (step?.choices) return retryChoice(game, stepId);
  const selected = game.answers[stepId];
  if (game.page !== "play" || game.cursor !== stepId || !step?.items || !selected) return game;
  return {
    ...game,
    answers: Object.fromEntries(Object.entries(game.answers).filter(([id]) => id !== stepId)),
    drafts: { ...game.drafts, [stepId]: [...selected] },
  };
}

export function canAdvanceStep(game: GameState, step: Step): boolean {
  const selected = game.answers[step.id];
  if (!hasRequiredItems(step, selected ?? [])) return false;
  if (step.choices) {
    return !!step.choices.some((choice) =>
      selected?.includes(choice.id) && choice.status === "checked" && !choice.disabledReason,
    );
  }
  if (step.kind === "info" || step.kind === "recap") return true;
  return !!selected && !getCheckpoints(game).some((note) =>
    note.stepId === step.id && note.showFeedback && note.status === "risk",
  );
}

export function advanceGame(game: GameState, stepId: string): GameState {
  if (game.page !== "play" || game.cursor !== stepId) return game;
  const steps = getSteps(game);
  const index = steps.findIndex((step) => step.id === stepId);
  if (index < 0 || !canAdvanceStep(game, steps[index])) return game;
  const next = steps[index + 1];
  return {
    ...game,
    answers: { ...game.answers, [stepId]: game.answers[stepId] ?? ["read"] },
    page: next ? "play" : "ending",
    cursor: next?.id ?? stepId,
  };
}

const searchPraise: Record<HouseId, string> = {
  oneroom: "광고 문구만 믿지 않고 반지하·옥탑까지 포함해 실제 세대 수를 확인하려는 선택이 좋습니다.",
  officetel: "광고의 넓이보다 실제로 사용할 전용면적을 확인하려는 선택이 좋습니다.",
  villa: "분양가를 시세로 받아들이지 않고 주변 실거래가를 비교하려는 선택이 좋습니다.",
  rooftop: "옥탑방의 분위기에 앞서 건축물대장과 주거 용도를 확인하려는 선택이 좋습니다.",
  basement: "저렴한 가격만 보지 않고 침수 이력을 직접 확인하려는 선택이 좋습니다.",
  goshiwon: "입주 전에 계약 상대와 운영 구조를 확인하려는 선택이 좋습니다.",
};
const contractPraise: Record<HouseId, string> = {
  oneroom: "앞선 세입자의 보증금 총액을 공식 자료로 확인하려는 선택이 좋습니다.",
  officetel: "할인보다 전입신고와 보증금 보호를 우선한 점이 좋습니다.",
  villa: "분양가만 믿지 않고 실제 시세와 반환보증 가능 여부를 확인하려는 선택이 좋습니다.",
  rooftop: "실제 호수와 건축물대장, 전입신고 가능 여부를 대조하려는 선택이 좋습니다.",
  basement: "침수 이력을 말로만 듣지 않고 확인·설명서에 남기려는 선택이 좋습니다.",
  goshiwon: "건물주의 서면 동의와 원계약 기간, 환불 규정을 함께 확인하려는 선택이 좋습니다.",
};
const praise: Record<string, string> = {
  listing: "광고와 다른 방의 주소와 가격·관리비·면적을 먼저 비교하려는 선택이 좋습니다.",
  deposit: "송금보다 소유자와 계좌 명의 확인을 먼저 한 점이 좋습니다.",
  proxy: "가족이라는 설명에 그치지 않고 대리권과 송금 계좌를 확인한 점이 좋습니다.",
  account: "문자와 다른 경로로 임대인에게 직접 확인하고 계약서의 계좌 명의를 기준으로 삼은 점이 좋습니다.",
  timing: "송금 직전 등기부 재확인과 당일 전입신고·확정일자를 함께 챙긴 점이 좋습니다.",
  settlement: "도어락 번호와 입주 시점의 계량기·집 상태를 직접 기록한 점이 좋습니다.",
  insurance: "대출 승인을 안전의 보증으로 단정하지 않고 바로 반환보증을 신청하려는 선택이 좋습니다.",
  defect: "하자 발견 시점을 사진과 문자로 남기고 수리를 요구한 점이 좋습니다.",
};

export function getSuccessExplanation(game: GameState, step: Step): string {
  const choice = step.choices?.find((item) =>
    game.answers[step.id]?.includes(item.id) && item.status === "checked",
  );
  if (!choice) return "";
  const lead = step.id === "house-search" ? searchPraise[game.house]
    : step.id === "house-contract"
      ? game.house === "villa" && game.contract === "monthly"
        ? searchPraise.villa : contractPraise[game.house]
      : praise[step.id];
  return [lead, choice.feedback.text].filter(Boolean).join("\n");
}

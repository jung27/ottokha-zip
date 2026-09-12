import { getCheckpoints, getSteps, hasRequiredItems } from "./data.ts";
import type { GameState, Step } from "./types.ts";

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

export function getSuccessExplanation(game: GameState, step: Step): string {
  const choice = step.choices?.find((item) =>
    game.answers[step.id]?.includes(item.id) && item.status === "checked",
  );
  if (!choice) return "";
  const explanation = step.explanation ?? choice.feedback;
  const normalize = (text: string) => text.replace(/[\p{P}\p{S}\s]/gu, "");
  const selectedAction = normalize(choice.label);
  // 선택지에 남아 있는 행동은 반복하지 않고 시나리오의 이유와 주의사항을 안내한다.
  return [...new Set([explanation.text, explanation.advice]
    .map((text) => text.trim())
    .filter((text) => text && normalize(text) !== selectedAction))].join("\n\n");
}

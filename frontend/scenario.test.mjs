import assert from "node:assert/strict";
import test from "node:test";
import {
  getCheckpoints,
  getEnding,
  getSteps,
  homes,
  inspectionItems,
  makeNewGame,
  priceLabel,
  restoreGame,
  rewindGame,
} from "./src/data.ts";

function finish(contract, house, mode) {
  const game = { ...makeNewGame(), page: "play", contract, house };
  const visited = [];
  for (let guard = 0; guard < 40; guard++) {
    const steps = getSteps(game);
    const step = steps.find((s) => s.id === game.cursor);
    assert.ok(step, "current scene exists");
    assert.equal(
      new Set(steps.map((s) => s.id)).size,
      steps.length,
      "scene ids are unique",
    );
    visited.push(step);
    assert.ok(step.beats.length > 0, "every scene has narration or dialogue");
    assert.ok(step.background, "every scene reserves a background");
    for (const beat of step.beats) {
      assert.ok(beat.text.trim(), "no empty dialogue");
      if (beat.speaker) assert.doesNotMatch(beat.text, /^[“"‘].*[”"’]$/s, "spoken lines have no wrapping quotation marks");
    }
    if (step.choices) {
      const choices = step.choices.filter((c) => !c.disabledReason);
      const desired =
        mode === "risk" || (mode === "mixed" && visited.length % 2 === 0)
          ? "risk"
          : "checked";
      const choice = choices.find((c) => c.status === desired) ?? choices[0];
      game.answers[step.id] = [choice.id];
      const feedback = getCheckpoints(game).filter((c) => c.stepId === step.id);
      assert.equal(feedback.length, 1, "choice produces immediate feedback");
      assert.equal(feedback[0].status, choice.status);
      assert.equal(
        feedback[0].choice,
        choice.label,
        "feedback remembers the actual answer",
      );
    } else if (step.items) {
      const common = step.items.filter((i) => !i.extra);
      game.answers[step.id] =
        mode === "risk"
          ? []
          : step.kind === "inspection"
            ? [...common.slice(0, 5), ...step.items.filter((i) => i.extra)].map(
                (i) => i.id,
              )
            : step.items.map((i) => i.id);
      const missing = step.items.filter(
        (i) => !game.answers[step.id].includes(i.id),
      );
      const warnings = getCheckpoints(game).filter(
        (c) => c.stepId === step.id && c.status === "risk",
      );
      assert.equal(
        warnings.length,
        missing.length,
        "every omitted item immediately becomes red",
      );
    } else game.answers[step.id] = ["read"];
    const refreshed = getSteps(game);
    const next = refreshed[refreshed.findIndex((s) => s.id === step.id) + 1];
    if (!next) {
      game.page = "ending";
      assert.deepEqual(
        [...new Set(visited.map((s) => s.stage))],
        [1, 2, 3, 4, 5, 6],
      );
      assert.equal(
        getEnding(game).id,
        "complete",
        "every route reaches the same ending",
      );
      assert.equal(
        getCheckpoints(game).some(
          (c) => !["checked", "risk"].includes(c.status),
        ),
        false,
        "no yellow state remains",
      );
      assert.deepEqual(
        restoreGame(JSON.stringify(game)),
        game,
        "reload preserves completed story",
      );
      return game;
    }
    game.cursor = next.id;
  }
  assert.fail("route failed to end");
}

for (const contract of ["monthly", "jeonse"]) {
  for (const home of homes.filter(
    (h) => contract === "monthly" || h.jeonse !== null,
  )) {
    for (const mode of ["checked", "risk", "mixed"]) {
      test(`${contract} / ${home.id} / ${mode}: all six stages, immediate warnings, one ending`, () =>
        finish(contract, home.id, mode));
    }
  }
}

test("exact monthly prices and disabled jeonse × goshiwon combination", () => {
  assert.deepEqual(
    homes.map((h) => [h.deposit, h.rent, h.maintenance]),
    [
      [1000, 55, 8],
      [1000, 65, 12],
      [1000, 55, 5],
      [500, 45, 5],
      [500, 40, 5],
      [10, 38, 0],
    ],
  );
  assert.match(priceLabel(homes[0], "monthly"), /관리비 8만 원/);
  assert.equal(homes[0].rent + homes[0].maintenance, 63);
  assert.equal(homes[5].jeonse, null);
  assert.deepEqual(
    restoreGame(
      JSON.stringify({
        ...makeNewGame(),
        contract: "jeonse",
        house: "goshiwon",
      }),
    ),
    makeNewGame(),
  );
});

test("each house has ten common inspection points plus its own additional points", () => {
  for (const home of homes) {
    const items = inspectionItems(home.id);
    assert.equal(items.filter((i) => !i.extra).length, 10);
    assert.ok(items.filter((i) => i.extra).length >= 3);
    assert.equal(new Set(items.map((i) => i.id)).size, items.length);
  }
});

test("ownership choice opens the correct branch; changing it removes future answers", () => {
  const game = finish("monthly", "oneroom", "checked");
  assert.ok(game.answers.proxy);
  const replayed = rewindGame(game, "deposit");
  assert.equal(replayed.cursor, "deposit");
  assert.ok(replayed.answers.inspection, "earlier inspection is preserved");
  assert.equal(replayed.answers.proxy, undefined);
  assert.equal(replayed.answers.return, undefined);
  replayed.answers.deposit = ["immediate"];
  assert.equal(
    getSteps(replayed).some((s) => s.id === "proxy"),
    false,
  );
  assert.equal(
    getCheckpoints(replayed).filter(
      (c) => c.stepId === "deposit" && c.status === "risk",
    ).length,
    1,
  );
});

test("final options depend on photos and guarantee application, not on a generic score", () => {
  const game = finish("jeonse", "villa", "risk");
  const get = (id) =>
    getSteps(game)
      .find((s) => s.id === "return")
      .choices.find((c) => c.id === id);
  assert.ok(get("photos").disabledReason);
  assert.ok(get("claim").disabledReason);
  game.answers.settlement = ["record"];
  game.answers.insurance = ["apply"];
  assert.equal(get("photos").disabledReason, undefined);
  assert.equal(get("claim").disabledReason, undefined);
});

test("single ending and final warning list preserve every flagged checkpoint", () => {
  const game = finish("monthly", "basement", "risk");
  const risks = getCheckpoints(game).filter((c) => c.status === "risk");
  assert.ok(risks.length > 20);
  assert.match(getEnding(game).reasons[0], new RegExp(String(risks.length)));
  assert.equal(
    getEnding(game).title,
    getEnding(finish("monthly", "basement", "checked")).title,
  );
  const replayed = rewindGame(game, "listing");
  assert.equal(
    getCheckpoints(replayed).length,
    0,
    "replaying does not leave stale warnings",
  );
});

test("corrupt and obsolete saves fall back safely; unfinished drafts survive reload", () => {
  for (const raw of [
    "null",
    "{",
    "[]",
    '{"version":1}',
    JSON.stringify({ ...makeNewGame(), answers: [] }),
    JSON.stringify({ ...makeNewGame(), house: "unknown" }),
  ])
    assert.deepEqual(restoreGame(raw), makeNewGame());
  const game = {
    ...makeNewGame(),
    page: "play",
    cursor: "inspection",
    drafts: { inspection: ["water", "mailbox"] },
  };
  assert.deepEqual(restoreGame(JSON.stringify(game)), game);
});

test("listing preserves the scenario and separates messages, narration and speech", () => {
  const listing = getSteps(makeNewGame()).find((step) => step.id === "listing");
  assert.equal(listing.beats.length, 5);
  assert.match(listing.beats[0].text, /관리비 8만 원/);
  assert.equal(listing.beats[1].speaker, undefined);
  assert.equal(listing.beats[2].speaker, "중개사 · 문자");
  assert.equal(listing.beats[2].text, "오늘 두 팀 더 보러 오세요. 마음 있으시면 빨리 오셔야 해요.");
  assert.equal(listing.beats[3].speaker, undefined);
  assert.equal(listing.beats[4].speaker, "중개사");
  assert.equal(listing.beats[4].text, "보셨던 방은 방금 나갔어요. 대신 비슷한 방이 하나 있어요. 오신 김에 보고 가시죠.");
});

test("contract speech and deposit speech have their own beats", () => {
  const game = { ...makeNewGame(), answers: { deposit: ["owner"] } };
  const steps = getSteps(game);
  const deposit = steps.find((step) => step.id === "deposit");
  assert.equal(deposit.beats[0].speaker, "중개사");
  assert.equal(deposit.beats[1].speaker, undefined);
  const proxy = steps.find((step) => step.id === "proxy");
  assert.equal(proxy.beats[2].speaker, "중개사");
  const clauses = steps.find((step) => step.id === "clauses");
  assert.equal(clauses.beats[1].text, "특약사항 칸은 비어 있다.");
  assert.equal(clauses.beats[3].text, "넣으실 거 있으세요?");
  assert.equal(clauses.beats[3].speaker, "중개사");
});

test("epilogue events depend on the actual inspection and repair clause", () => {
  const game = makeNewGame();
  const recap = () => getSteps(game).find((step) => step.id === "recap").beats.map((beat) => beat.text).join(" ");
  assert.match(recap(), /천장에서 물이 샌다/);
  assert.match(recap(), /그때 하자 수리 특약을 넣었다면/);
  game.answers.inspection = ["ceiling"];
  assert.doesNotMatch(recap(), /천장에서 물이 샌다/);
  game.answers.clauses = ["defects"];
  assert.match(recap(), /특약을 제시하고/);
  assert.doesNotMatch(recap(), /그때 하자 수리 특약을 넣었다면/);
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  getCheckpoints,
  getEnding,
  getSteps,
  hasRequiredItems,
  homes,
  inspectionItems,
  makeNewGame,
  movingItems,
  parseRecommendation,
  priceLabel,
  restoreGame,
  rewindGame,
  explorationScripts,
  contractScripts,
} from "./src/data.ts";

function finish(contract, house, mode) {
  const game = { ...makeNewGame(), page: "play", contract, house };
  const visited = [];
  for (let guard = 0; guard < 30; guard++) {
    const steps = getSteps(game);
    const step = steps.find((item) => item.id === game.cursor);
    assert.ok(step);
    assert.equal(new Set(steps.map((item) => item.id)).size, steps.length);
    assert.ok(step.background);
    assert.ok(step.beats.every((beat) => beat.text.trim()));
    for (const beat of step.beats)
      if (beat.speaker) assert.doesNotMatch(beat.text, /^[“"‘].*[”"’]$/s);
    visited.push(step);
    if (step.choices) {
      const desired =
        mode === "risk" || (mode === "mixed" && visited.length % 2 === 0)
          ? "risk"
          : "checked";
      const choice = step.choices.find(
        (item) => item.status === desired && !item.disabledReason,
      );
      assert.ok(choice);
      game.answers[step.id] = [choice.id];
      const feedback = getCheckpoints(game).filter(
        (item) => item.stepId === step.id,
      );
      assert.equal(feedback.length, 1);
      assert.equal(feedback[0].status, choice.status);
      assert.equal(feedback[0].choice, choice.label);
    } else if (step.items) {
      game.answers[step.id] =
        mode === "risk" && !step.requireAll
          ? []
          : step.items.map((item) => item.id);
      assert.equal(hasRequiredItems(step, game.answers[step.id]), true);
      const missing = step.items.filter(
        (item) => !game.answers[step.id].includes(item.id),
      );
      assert.equal(
        getCheckpoints(game).filter(
          (item) => item.stepId === step.id && item.status === "risk",
        ).length,
        missing.length,
      );
    } else game.answers[step.id] = ["read"];
    const updated = getSteps(game);
    const next = updated[updated.findIndex((item) => item.id === step.id) + 1];
    if (!next) {
      game.page = "ending";
      assert.deepEqual(
        [...new Set(visited.map((item) => item.stage))],
        [1, 2, 3, 4, 5],
      );
      assert.equal(getEnding(game).id, "complete");
      assert.equal(visited.at(-1).id, "moving");
      assert.deepEqual(restoreGame(JSON.stringify(game)), game);
      return game;
    }
    game.cursor = next.id;
  }
  assert.fail("Story did not reach its single ending");
}
for (const contract of ["monthly", "jeonse"]) {
  for (const home of homes.filter(
    (item) => contract === "monthly" || item.jeonse !== null,
  )) {
    for (const mode of ["checked", "risk", "mixed"]) {
      test(contract + " / " + home.id + " / " + mode, () =>
        finish(contract, home.id, mode),
      );
    }
  }
}
test("six house prices retain the specified monthly amounts", () => {
  assert.deepEqual(
    homes.map((home) => [home.deposit, home.rent, home.maintenance]),
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
  assert.equal(homes[5].jeonse, null);
});
test("new housing branches each have four choices and exactly one safe answer", () => {
  for (const scripts of [explorationScripts, contractScripts])
    for (const script of Object.values(scripts)) {
      assert.equal(script.choices.length, 4);
      assert.equal(
        script.choices.filter((choice) => choice.status === "checked").length,
        1,
      );
      assert.equal(script.choices[2].status, "checked");
    }
  assert.equal(
    explorationScripts.oneroom.text,
    '광고에는 "5세대 소규모"라고 적혀 있다. 그런데 사진 속 건물은 그보다 커 보인다.',
  );
  assert.equal(contractScripts.oneroom.choices[1].status, "risk");
  assert.match(contractScripts.oneroom.choices[2].label, /확정일자 부여현황/);
});
test("listing, deposit and contract speech are separate from narration", () => {
  const game = { ...makeNewGame(), answers: { deposit: ["owner"] } };
  const steps = getSteps(game);
  const listing = steps.find((step) => step.id === "listing");
  assert.deepEqual(
    listing.beats.map((beat) => beat.speaker),
    [undefined, undefined, "중개사 · 문자", undefined, "중개사"],
  );
  assert.equal(listing.beats[0].background, "app");
  assert.equal(listing.beats[1].background, "message");
  assert.equal(listing.beats[2].background, "message");
  const clauses = steps.find((step) => step.id === "clauses");
  assert.equal(clauses.beats[3].text, "넣으실 거 있으세요?");
  assert.equal(clauses.beats[3].speaker, "중개사");
});
test("current stage five order ends with a mandatory moving checklist", () => {
  const steps = getSteps(makeNewGame());
  assert.deepEqual(
    steps.filter((step) => step.stage === 5).map((step) => step.id),
    ["account", "timing", "settlement", "defect", "moving"],
  );
  for (const removed of ["cost", "loan", "recap", "renewal", "return"])
    assert.ok(!steps.some((step) => step.id === removed));
  assert.equal(steps.at(-1).requireAll, true);
  assert.equal(movingItems.length, 6);
  const saved = {
    ...makeNewGame(),
    page: "ending",
    answers: { moving: ["lock"] },
  };
  assert.equal(restoreGame(JSON.stringify(saved)).page, "play");
  assert.equal(restoreGame(JSON.stringify(saved)).cursor, "moving");
});
test("all inspected and skipped items, including house-specific extras, remain in the review", () => {
  for (const home of homes) {
    const items = inspectionItems(home.id);
    assert.equal(items.filter((item) => !item.extra).length, 10);
    assert.ok(items.filter((item) => item.extra).length >= 3);
    assert.equal(new Set(items.map((item) => item.id)).size, items.length);
  }
  const game = finish("monthly", "oneroom", "mixed");
  const notes = getCheckpoints(game);
  assert.ok(notes.some((item) => item.status === "checked"));
  assert.ok(notes.some((item) => item.status === "risk"));
  assert.ok(
    notes
      .find((item) => item.stepId === "listing")
      .consequence.includes("좋은 조건의 매물로 방문을 유도"),
  );
  const risks = notes.filter((item) => item.status === "risk").length;
  assert.equal(
    getEnding(game).text,
    "당신은 이번 계약에서 위험한 선택 " + risks + "번을 했습니다.",
  );
});
test("inspection requires every common and house-specific point, including after deselection", () => {
  const totals = { oneroom: 13, officetel: 13, villa: 13, rooftop: 14, basement: 14, goshiwon: 14 };
  for (const home of homes) {
    const step = getSteps({ ...makeNewGame(), house: home.id }).find((step) => step.id === "inspection");
    const all = step.items.map((item) => item.id);
    const common = step.items.filter((item) => !item.extra).map((item) => item.id);
    const extras = step.items.filter((item) => item.extra).map((item) => item.id);
    assert.equal(step.requireAll, true);
    assert.equal(all.length, totals[home.id]);
    assert.equal(hasRequiredItems(step, []), false);
    assert.equal(hasRequiredItems(step, common.slice(0, 5)), false);
    assert.equal(hasRequiredItems(step, [...common.slice(0, 5), ...extras]), false);
    assert.equal(hasRequiredItems(step, common), false);
    assert.equal(hasRequiredItems(step, extras), false);
    assert.equal(hasRequiredItems(step, [...common, ...common]), false);
    assert.equal(hasRequiredItems(step, all), true);
    for (const id of all)
      assert.equal(hasRequiredItems(step, all.filter((item) => item !== id)), false, `${home.id}: ${id} cannot be skipped`);
  }
});

test("old partial inspection saves reopen without losing selections or other scene history", () => {
  for (const home of homes) {
    const complete = finish("monthly", home.id, "checked");
    const items = inspectionItems(home.id);
    const common = items.filter((item) => !item.extra).map((item) => item.id);
    const extras = items.filter((item) => item.extra).map((item) => item.id);
    for (const selected of [[], common.slice(0, 5), [...common.slice(0, 5), ...extras], common]) {
      for (const cursor of ["inspection", "deposit", "moving"]) {
        const saved = { ...complete, cursor, page: cursor === "moving" ? "ending" : "play", answers: { ...complete.answers, inspection: selected } };
        const restored = restoreGame(JSON.stringify(saved));
        assert.equal(restored.page, "play");
        assert.equal(restored.cursor, "inspection");
        assert.deepEqual(restored.drafts.inspection, selected);
        assert.deepEqual(restored.answers.listing, complete.answers.listing);
        assert.deepEqual(restored.answers["house-search"], complete.answers["house-search"]);
        assert.equal(restored.answers.inspection, undefined);
        assert.deepEqual(restored.answers.deposit, complete.answers.deposit);
        assert.deepEqual(restored.answers.moving, complete.answers.moving);
        assert.deepEqual(restoreGame(JSON.stringify(restored)), restored);
      }
    }
  }
});

test("fully checked routes no longer receive risks for forced inspection omissions", () => {
  for (const home of homes) {
    const game = finish("monthly", home.id, "checked");
    assert.equal(getCheckpoints(game).filter((item) => item.status === "risk").length, 0);
    assert.deepEqual(restoreGame(JSON.stringify(game)), game);
  }
});

test("replaying a stage retains earlier decisions and clears dependent branches", () => {
  const game = finish("monthly", "oneroom", "checked");
  assert.ok(game.answers.proxy);
  const replayed = rewindGame(game, "deposit");
  assert.ok(replayed.answers.inspection);
  assert.equal(replayed.answers.proxy, undefined);
  assert.equal(replayed.answers.moving, undefined);
  replayed.answers.deposit = ["immediate"];
  assert.ok(!getSteps(replayed).some((step) => step.id === "proxy"));
  assert.equal(
    getCheckpoints(replayed).filter((item) => item.stepId === "deposit").length,
    1,
  );
  assert.equal(getCheckpoints(rewindGame(game, "listing")).length, 0);
});
test("old or malformed saves cannot reinterpret changed scenario choices", () => {
  for (const raw of [
    "null",
    "{",
    "[]",
    JSON.stringify({ ...makeNewGame(), version: 2 }),
    JSON.stringify({ ...makeNewGame(), answers: [] }),
    JSON.stringify({ ...makeNewGame(), contract: "jeonse", house: "goshiwon" }),
  ]) {
    assert.deepEqual(restoreGame(raw), makeNewGame());
  }
  const game = {
    ...makeNewGame(),
    page: "play",
    cursor: "inspection",
    drafts: { inspection: ["water", "mailbox"] },
  };
  assert.deepEqual(restoreGame(JSON.stringify(game)), game);
});
test("main AI responses map to scenario ids and reject incomplete or impossible combinations", () => {
  assert.deepEqual(parseRecommendation({ first: "월세", second: "원룸" }), {
    contract: "monthly",
    house: "oneroom",
  });
  assert.deepEqual(
    parseRecommendation({ first: " {전세 + 대출} ", second: "빌라(다세대)" }),
    { contract: "jeonse", house: "villa" },
  );
  assert.deepEqual(parseRecommendation({ first: "월세", second: "고시원" }), {
    contract: "monthly",
    house: "goshiwon",
  });
  for (const value of [
    null,
    {},
    { first: 3, second: "원룸" },
    { first: "매매", second: "빌라" },
    { first: "전세", second: "고시원" },
  ])
    assert.throws(() => parseRecommendation(value));
});

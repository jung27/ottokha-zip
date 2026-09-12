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
  isRiskCheckpoint,
  clauseItems,
  tutorials,
  rewindGame,
  explorationScripts,
  contractScripts,
} from "./src/data.ts";
import { calculateMortgage, registryFinding, registryPoints } from "./src/registry.ts";
import { advanceGame, canAdvanceStep, chooseAnswer, getSuccessExplanation, retryChoice, retryStep, submitChecks } from "./src/choiceFlow.ts";

function finish(contract, house, mode) {
  let game = { ...makeNewGame(), page: "play", contract, house };
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
      game = chooseAnswer(game, step.id, choice.id);
      const feedback = getCheckpoints(game).filter(
        (item) => item.stepId === step.id,
      );
      assert.equal(feedback.length, 1);
      assert.equal(feedback[0].status, choice.status);
      assert.equal(feedback[0].choice, choice.label);
      if (choice.status === "risk") {
        assert.equal(canAdvanceStep(game, step), false);
        assert.equal(advanceGame(game, step.id), game);
        game = retryChoice(game, step.id);
        assert.equal(game.cursor, step.id);
        assert.equal(game.answers[step.id], undefined);
        assert.equal(chooseAnswer(game, step.id, choice.id), game);
        const correct = step.choices.find((item) => item.status === "checked" && !item.disabledReason);
        game = chooseAnswer(game, step.id, correct.id);
        assert.equal(getCheckpoints(game).filter((item) => item.stepId === step.id).length, 2);
      }
      assert.equal(canAdvanceStep(game, step), true);
    } else if (step.items) {
      game.drafts[step.id] =
        mode === "risk" && !step.requireAll
          ? (step.requiredItems ?? [])
          : step.items.map((item) => item.id);
      game = submitChecks(game, step.id);
      assert.equal(hasRequiredItems(step, game.answers[step.id]), true);
      const missing = step.items.filter(
        (item) => !game.answers[step.id].includes(item.id),
      );
      assert.equal(
        getCheckpoints(game).filter(
          (item) => item.stepId === step.id && item.status === "risk" && item.category !== "notice",
        ).length,
        missing.length,
      );
      if (!canAdvanceStep(game, step)) {
        assert.equal(advanceGame(game, step.id), game);
        const prior = game.answers[step.id];
        game = retryStep(game, step.id);
        assert.deepEqual(game.drafts[step.id], prior);
        game.drafts[step.id] = step.items.map((item) => item.id);
        game = submitChecks(game, step.id);
        assert.equal(canAdvanceStep(game, step), true);
      }
    } else game.answers[step.id] = ["read"];
    game = advanceGame(game, step.id);
    if (game.page === "ending") {
      assert.deepEqual(
        [...new Set(visited.map((item) => item.stage))],
        [1, 2, 3, 4, 5],
      );
      assert.equal(getEnding(game).id, "complete");
      assert.equal(visited.at(-1).id, "moving");
      return game;
    }
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
    [undefined, undefined, "중개사 · 문자", undefined, undefined, "중개사"],
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
    ["account", "timing", "registry-game", "settlement", "defect", "moving"],
  );
  for (const removed of ["cost", "loan", "recap", "renewal", "return"])
    assert.ok(!steps.some((step) => step.id === removed));
  assert.equal(steps.at(-1).requireAll, true);
  assert.equal(movingItems.length, 6);

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
  const risks = notes.filter(isRiskCheckpoint).length;
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

test("fully checked routes no longer receive risks for forced inspection omissions", () => {
  for (const home of homes) {
    const game = finish("monthly", home.id, "checked");
    assert.equal(getCheckpoints(game).filter((item) => item.status === "risk").length, 0);
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

test("registry game appears on every route and requires finding the new mortgage date", () => {
  for (const home of homes) {
    const step = getSteps({ ...makeNewGame(), house: home.id }).find((s) => s.id === "registry-game");
    assert.equal(step.kind, "registry");
    assert.deepEqual(step.items.map((p) => p.title), ["소유자 이름", "소유권 이전 날짜", "신탁 표기", "근저당권 설정 날짜", "채권최고액", "근저당권자"]);
    assert.equal(hasRequiredItems(step, []), false);
    assert.equal(hasRequiredItems(step, registryPoints.filter((p) => p.id !== "mortgage-date").map((p) => p.id)), false);
    assert.equal(hasRequiredItems(step, ["mortgage-date"]), true);
    assert.match(registryFinding.text, /계약을 해지/);
  }
});

test("mortgage exercise calculates ratios and rejects incomplete or invalid input", () => {
  assert.deepEqual(calculateMortgage(20000, 12000, 120, 8000), { estimatedLoan: 10000, claimRatio: 60, combinedRatio: 100 });
  assert.equal(calculateMortgage(20000, 11000, 110, 0).estimatedLoan, 10000);
  assert.equal(calculateMortgage(20000, 13000, 130, 0).estimatedLoan, 10000);
  for (const args of [[0,12000,120,8000], [20000,-1,120,8000], [20000,12000,109,8000], [20000,12000,131,8000], [20000,12000,120,-1], [NaN,12000,120,8000], [Infinity,12000,120,8000]])
    assert.equal(calculateMortgage(...args), null);
});

test("review retains common tips, oral warning and the actual safe result without duplicate risk counts", () => {
  const game = { ...makeNewGame(), answers: { inspection: inspectionItems("oneroom").map((i) => i.id), deposit: ["owner"], proxy: ["authority"], clauses: [], defect: ["record"], "registry-game": ["mortgage-date"] } };
  const notes = getCheckpoints(game);
  assert.match(notes.find((n) => n.id === "inspection:notice").consequence, /시간대를 바꿔 두 번/);
  assert.match(notes.find((n) => n.id === "clauses:notice").consequence, /거절당한다면/);
  assert.match(notes.find((n) => n.id === "clauses:oral").consequence, /말은 계약서에 없으면/);
  const proxy = notes.find((n) => n.id === "proxy");
  assert.equal(proxy.title, "대리권 확인 완료");
  assert.match(proxy.consequence, /계약 체결과 금전 수령/);
  assert.match(proxy.consequence, /인감증명서 발급일/);
  assert.match(proxy.consequence, /소유자 명의 계좌/);
  assert.match(proxy.explanation.text, /가족 관계는 대리권과 별개/);
  assert.equal(proxy.showFeedback, false);
  assert.equal(notes.find((n) => n.id === "defect").title, "시설물 수리 특약이 없다면");
  assert.ok(notes.some((n) => n.id === "registry-game:finding"));
  assert.equal(notes.filter(isRiskCheckpoint).length, 3);
  game.answers.clauses = ["repair"];
  const resolved = getCheckpoints(game).find((n) => n.id === "defect");
  assert.equal(resolved.title, "하자 수리 해결");
  assert.match(resolved.consequence, /수리 일정과 비용 부담을 서면으로 확인/);
  assert.match(resolved.explanation.title, /시점을 놓친 하자/);
});

test("signing shows only the jeonse tax warning while retaining all checks in review", () => {
  for (const contract of ["monthly", "jeonse"]) {
    for (let mask = 0; mask < 8; mask++) {
      const selected = ["identity", "agent", "tax"].filter((_, index) => mask & (1 << index));
      const notes = getCheckpoints({ ...makeNewGame(), contract, answers: { signing: selected } });
      assert.equal(notes.length, 3);
      const expected = contract === "jeonse" && !selected.includes("tax") ? 1 : 0;
      assert.equal(notes.filter((n) => n.showFeedback).length, expected);
      assert.equal(notes.filter(isRiskCheckpoint).length, expected);
      if (expected) assert.match(notes.find((n) => n.showFeedback).title, /국세 체납/);
    }
  }
});

test("clauses and tutorial text match the supplied scenario", () => {
  assert.deepEqual(clauseItems("monthly").map((i) => i.id), ["defects", "registration", "repair"]);
  assert.deepEqual(clauseItems("jeonse").map((i) => i.id), ["defects", "registration", "repair", "insurance"]);
  assert.equal(tutorials.jeonse[0], "‘전세보증금 ÷ 매매 시세 × 100’로 전세가율을 계산할 수 있고 이를 통해 위험성을 알 수 있다.");
  assert.match(tutorials.jeonse[1], /영향을 줄 수 있다/);
  assert.match(tutorials.jeonse[2], /중요하게 고려해야 한다/);
});

test("extra inspection explanations are available in the confirmed-item UI fields", () => {
  for (const [house, id, required] of [
    ["oneroom", "meter-box", /관리비 분배 분쟁/],
    ["officetel", "ventilation", /요리 냄새/],
    ["officetel", "shops", /냄새와 소음/],
    ["villa", "vacancy", /분양이 안 된/],
    ["rooftop", "insulation", /40도/],
    ["rooftop", "roof-window", /방범창 필수/],
    ["goshiwon", "room-window", /화재 시 매우 위험/],
  ]) {
    const item = inspectionItems(house).find((i) => i.id === id);
    assert.match([item.description, item.signal, item.advice].join(" "), required);
  }
});

test("insurance scene never shows an approval photo before an application", () => {
  for (const home of homes.filter((h) => h.jeonse !== null)) {
    const step = getSteps({ ...makeNewGame(), contract: "jeonse", house: home.id }).find((s) => s.id === "insurance");
    assert.notEqual(step.background, "insurance");
    assert.ok(step.beats.every((b) => b.background !== "insurance"));
    assert.match(step.choices.find((c) => c.id === "apply").feedback.text, /신청했다/);
  }
});

test("a new visit gets independent empty state even after a completed run", () => {
  const completed = finish("jeonse", "villa", "checked");
  const fresh = makeNewGame();
  assert.equal(fresh.page, "home");
  assert.equal(fresh.cursor, "listing");
  assert.deepEqual(fresh.answers, {});
  assert.deepEqual(fresh.drafts, {});
  assert.deepEqual(fresh.attempts, {});
  assert.notEqual(fresh.answers, completed.answers);
});

test("each wrong choice stays disabled after retry and all attempts survive the correct answer", () => {
  for (const home of homes) {
    let game = { ...makeNewGame(), page: "play", house: home.id, cursor: "house-search" };
    const step = getSteps(game).find((item) => item.id === game.cursor);
    const wrong = step.choices.filter((choice) => choice.status === "risk");
    for (const choice of wrong) {
      game = chooseAnswer(game, step.id, choice.id);
      assert.equal(advanceGame(game, step.id), game);
      assert.equal(chooseAnswer(game, step.id, "verify"), game);
      game = retryChoice(game, step.id);
      for (const id of game.attempts[step.id]) assert.equal(chooseAnswer(game, step.id, id), game);
    }
    const correct = step.choices.find((choice) => choice.status === "checked");
    game = chooseAnswer(game, step.id, correct.id);
    assert.equal(game.attempts[step.id].length, 4);
    assert.equal(retryChoice(game, step.id), game);
    assert.equal(chooseAnswer(game, step.id, wrong[0].id), game);
    const notes = getCheckpoints(game).filter((note) => note.stepId === step.id);
    assert.equal(notes.filter(isRiskCheckpoint).length, 3);
    assert.equal(notes.filter((note) => note.showFeedback).length, 0);
    assert.match(getSuccessExplanation(game, step), /선택이 좋습니다/);
    assert.ok(getSuccessExplanation(game, step).includes(correct.feedback.text));
    assert.equal(advanceGame(game, step.id).cursor, "inspection");
    assert.equal(advanceGame(advanceGame(game, step.id), step.id).cursor, "inspection");
  }
});

test("retrying does not rewind earlier progress, while an explicit stage replay clears attempts", () => {
  let game = finish("monthly", "oneroom", "risk");
  const replay = rewindGame(game, "deposit");
  assert.deepEqual(replay.attempts.listing, game.attempts.listing);
  assert.equal(replay.attempts.deposit, undefined);
  assert.equal(replay.attempts.proxy, undefined);
  const before = replay.answers.inspection;
  game = chooseAnswer(replay, "deposit", "immediate");
  game = retryChoice(game, "deposit");
  assert.equal(game.answers.inspection, before);
  assert.equal(game.cursor, "deposit");
  assert.deepEqual(game.attempts.deposit, ["immediate"]);
  assert.equal(canAdvanceStep(game, getSteps(game).find((step) => step.id === "deposit")), false);
});

test("every correct choice has positive, scenario-specific feedback", () => {
  for (const contract of ["monthly", "jeonse"]) {
    for (const home of homes.filter((item) => contract === "monthly" || item.jeonse !== null)) {
      const game = finish(contract, home.id, "checked");
      for (const step of getSteps(game).filter((item) => item.choices)) {
        const text = getSuccessExplanation(game, step);
        assert.match(text, /점이 좋습니다|선택이 좋습니다/, `${contract}/${home.id}/${step.id}`);
        assert.ok(text.length > 30);
        const choice = step.choices.find((item) => item.status === "checked");
        assert.ok(text.includes(choice.feedback.text));
      }
    }
  }
});

test("warning checklists require correction without resetting selections or losing mistake history", () => {
  let game = { ...makeNewGame(), page: "play", contract: "jeonse", cursor: "signing", drafts: { signing: ["identity"] } };
  const step = getSteps(game).find((item) => item.id === "signing");
  game = submitChecks(game, step.id);
  assert.equal(advanceGame(game, step.id), game);
  assert.deepEqual(game.attempts.signing, ["tax"]);
  game = retryStep(game, step.id);
  assert.equal(game.cursor, "signing");
  assert.deepEqual(game.drafts.signing, ["identity"]);
  game.drafts.signing.push("tax");
  game = submitChecks(game, step.id);
  assert.equal(canAdvanceStep(game, step), true);
  assert.equal(getCheckpoints(game).filter(isRiskCheckpoint).length, 1);
  assert.equal(getCheckpoints(game).filter((note) => note.showFeedback).length, 0);
  assert.equal(advanceGame(game, step.id).cursor, "account");
});

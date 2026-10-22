const { test } = require("node:test");
const assert = require("node:assert/strict");
const { summary, csv } = require("../web/lab-rules.js");
test("sample mean and SD, empty and single observations", () => {
  assert.deepEqual(
    summary(
      [2, 4, 6].map((x) => ({ x })),
      "x",
    ),
    { n: 3, mean: 4, sd: 2 },
  );
  assert.deepEqual(summary([], "x"), { n: 0, mean: null, sd: null });
  assert.deepEqual(summary([{ x: 4 }], "x"), { n: 1, mean: 4, sd: null });
  assert.throws(() => summary([{ x: Infinity }], "x"), /finite/);
});
test("CSV preserves order, repetitions and escapes labels", () => {
  const rows = [
    { source_row: 2, x: 0, variety: 'A,"B"' },
    { source_row: 3, x: 0, variety: 'A,"B"' },
  ];
  assert.equal(
    csv(rows, ["x"]),
    '"source_row","x","variety"\r\n"2","0","A,""B"""\r\n"3","0","A,""B"""\r\n',
  );
});

test("linear quartiles use original observations and preserve their order", () => {
  const { distribution } = require("../web/lab-rules");
  const rows = [4, 1, 3, 2].map((x) => ({ x })),
    before = JSON.stringify(rows);
  assert.deepEqual(distribution(rows, "x"), {
    n: 4,
    minimum: 1,
    q1: 1.75,
    median: 2.5,
    q3: 3.25,
    maximum: 4,
  });
  assert.equal(JSON.stringify(rows), before);
});
test("distribution handles empty, single and repeated observations explicitly", () => {
  const { distribution } = require("../web/lab-rules");
  assert.deepEqual(distribution([], "x"), {
    n: 0,
    minimum: null,
    q1: null,
    median: null,
    q3: null,
    maximum: null,
  });
  for (const rows of [[{ x: 2 }], [{ x: 2 }, { x: 2 }, { x: 2 }]])
    assert.deepEqual(distribution(rows, "x"), {
      n: rows.length,
      minimum: 2,
      q1: 2,
      median: 2,
      q3: 2,
      maximum: 2,
    });
});
test("distribution rejects non-finite and missing measurements", () => {
  const { distribution } = require("../web/lab-rules");
  for (const x of [NaN, Infinity, -Infinity, undefined, null, "2"])
    assert.throws(() => distribution([{ x }], "x"), /finite/);
});

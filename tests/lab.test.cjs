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

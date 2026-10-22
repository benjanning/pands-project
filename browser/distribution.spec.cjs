const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const data = require("../docs/data.json");
const base = process.env.EXPLORER_BASE || "http://127.0.0.1:8093/";
const { execFileSync } = require("node:child_process");
const original = JSON.parse(
  execFileSync(
    "python",
    [
      "-c",
      "import csv,json; f=open('iris.csv',encoding='utf-8-sig',newline=''); rows=[dict(**{k:(v if k=='variety' else float(v)) for k,v in row.items()},source_row=i) for i,row in enumerate(csv.DictReader(f),1)]; print(json.dumps(rows))",
    ],
    { encoding: "utf8" },
  ),
);
for (const width of [1440, 390])
  test(`observed distribution quartiles, points and exports at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto(base);
    await expect(page.locator("#results")).toBeVisible();
    await page
      .getByLabel("Vertical feature", { exact: true })
      .selectOption("sepal.width");
    await page
      .getByLabel("Chart view", { exact: true })
      .selectOption("distribution");
    await expect(
      page.getByLabel("Vertical feature", { exact: true }),
    ).toBeDisabled();
    await expect(page.locator("#view-help")).toContainText(
      "vertical control is inactive",
    );
    async function points() {
      return page.locator(".point").evaluateAll((nodes) =>
        nodes.map((node) => ({
          row: Number(node.getAttribute("data-source-row")),
          x:
            node.tagName.toLowerCase() === "circle"
              ? Number(node.getAttribute("cx"))
              : node.tagName.toLowerCase() === "polygon"
                ? Number(node.getAttribute("points").split(",")[0])
                : Number(node.getAttribute("x")) + 4,
        })),
      );
    }
    for (const feature of data.features) {
      await page
        .getByLabel("Horizontal feature", { exact: true })
        .selectOption(feature.key);
      const values = original.map((row) => row[feature.key]),
        minimum = Math.min(...values),
        maximum = Math.max(...values),
        padding = (maximum - minimum) * 0.06,
        low = Math.max(0, minimum - padding),
        high = maximum + padding;
      const x = (value) => 105 + ((value - low) / (high - low)) * 410;
      await expect(page.locator(".point")).toHaveCount(150);
      const drawn = await points();
      expect(drawn.map((p) => p.row)).toEqual(
        original.map((row) => row.source_row),
      );
      for (const point of drawn)
        expect(point.x).toBeCloseTo(x(original[point.row - 1][feature.key]), 8);
      for (const species of data.species) {
        const ref = data.reference_distributions.find(
          (item) => item.species === species && item.feature === feature.key,
        );
        await expect(
          page.locator(
            `[data-species="${species}"] [data-summary="quartiles"]`,
          ),
        ).toHaveText(
          `Q1 ${ref.q1.toFixed(3)} cm · median ${ref.median.toFixed(3)} cm · Q3 ${ref.q3.toFixed(3)} cm`,
        );
        const box = page.locator(
            `.distribution-box[data-species="${species}"]`,
          ),
          range = page.locator(
            `.distribution-range[data-species="${species}"]`,
          ),
          median = page.locator(
            `.distribution-median[data-species="${species}"]`,
          );
        expect(Number(await box.getAttribute("x"))).toBeCloseTo(x(ref.q1), 8);
        expect(Number(await box.getAttribute("width"))).toBeCloseTo(
          x(ref.q3) - x(ref.q1),
          8,
        );
        expect(Number(await median.getAttribute("x1"))).toBeCloseTo(
          x(ref.median),
          8,
        );
        expect(Number(await range.getAttribute("x1"))).toBeCloseTo(
          x(ref.minimum),
          8,
        );
        expect(Number(await range.getAttribute("x2"))).toBeCloseTo(
          x(ref.maximum),
          8,
        );
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    const all = await points();
    for (const species of ["Setosa", "Versicolor"])
      await page
        .getByRole("checkbox", { name: species, exact: true })
        .uncheck();
    await expect(page.locator(".point")).toHaveCount(50);
    expect(await points()).toEqual(all.filter((p) => p.row >= 101));
    await expect(page.locator("#source-table tr")).toHaveCount(50);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("#download").click(),
    ]);
    const exported = fs
      .readFileSync(await download.path(), "utf8")
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .map((line) => line.split(",").map((value) => value.slice(1, -1)));
    expect(exported).toEqual(
      original
        .slice(100)
        .map((row) => [
          String(row.source_row),
          ...data.features.map((f) => String(row[f.key])),
          row.variety,
        ]),
    );
    await page
      .getByRole("checkbox", { name: "Virginica", exact: true })
      .uncheck();
    await expect(page.locator(".point")).toHaveCount(0);
    await expect(page.locator("#empty")).toBeVisible();
    await expect(page.locator("#download")).toBeDisabled();
    for (const species of data.species)
      await page.getByRole("checkbox", { name: species, exact: true }).check();
    await page
      .getByLabel("Chart view", { exact: true })
      .selectOption("scatter");
    await expect(
      page.getByLabel("Vertical feature", { exact: true }),
    ).toBeEnabled();
    await expect(
      page.getByLabel("Vertical feature", { exact: true }),
    ).toHaveValue("sepal.width");
    await page.getByLabel("Chart view", { exact: true }).focus();
    await page.keyboard.press("End");
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Chart view", { exact: true })).toHaveValue(
      "distribution",
    );
    await page
      .getByRole("button", { name: "Compare petals", exact: true })
      .click();
    await expect(page.getByLabel("Chart view", { exact: true })).toHaveValue(
      "scatter",
    );
    await expect(
      page.getByLabel("Vertical feature", { exact: true }),
    ).toHaveValue("petal.width");
    await page
      .getByLabel("Chart view", { exact: true })
      .selectOption("distribution");
    await expect(page.locator(".point")).toHaveCount(150);
    await expect(page.locator("#plot-note")).toContainText(
      "Vertical offsets only separate points",
    );
    fs.mkdirSync("verification/screenshots", { recursive: true });
    await page.locator(".exploration").screenshot({
      path: `verification/screenshots/distribution-${width}.jpg`,
      type: "jpeg",
      quality: 85,
    });
    expect(errors).toEqual([]);
  });

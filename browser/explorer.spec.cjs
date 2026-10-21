const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const data = require("../docs/data.json");
const base = process.env.EXPLORER_BASE || "http://127.0.0.1:8093/";
for (const width of [1440, 390])
  test(`source observations, all feature pairs and exports at ${width}px`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto(base);
    await expect(page.locator("#results")).toBeVisible();
    await expect(page.locator(".point")).toHaveCount(150);
    for (const x of data.features)
      for (const y of data.features) {
        await page.getByLabel("Horizontal feature").selectOption(x.key);
        await page.getByLabel("Vertical feature").selectOption(y.key);
        for (const s of data.species)
          for (const [axis, key] of [
            ["x", x.key],
            ["y", y.key],
          ]) {
            const ref = data.reference_summaries.find(
              (r) => r.species === s && r.feature === key,
            );
            await expect(
              page.locator(`[data-species="${s}"] [data-axis="${axis}"]`),
            ).toContainText(
              `mean ${ref.mean.toFixed(3)} cm · SD ${ref.sd.toFixed(3)} cm`,
            );
          }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    await expect(page.locator("#same-feature")).toBeVisible();
    await page
      .getByText("Inspect selected source rows", { exact: true })
      .click();
    await expect(page.locator("#source-table tr")).toHaveCount(150);
    for (const [i, row] of data.observations.entries())
      await expect(page.locator("#source-table tr").nth(i)).toHaveText(
        [
          row.source_row,
          row.variety,
          ...data.features.map((f) => row[f.key]),
        ].join(""),
      );
    await page
      .getByText("Inspect selected source rows", { exact: true })
      .click();
    for (const s of data.species)
      await page.getByRole("checkbox", { name: s, exact: true }).uncheck();
    await expect(page.locator(".point")).toHaveCount(0);
    await expect(page.locator("#empty")).toBeVisible();
    await expect(page.locator("#download")).toBeDisabled();
    await page
      .getByRole("checkbox", { name: "Virginica", exact: true })
      .check();
    await expect(page.locator(".point")).toHaveCount(50);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("#download").click(),
    ]);
    const csv = fs.readFileSync(await download.path(), "utf8");
    const lines = csv.trim().split("\r\n");
    expect(lines).toHaveLength(51);
    expect(lines[1]).toBe('"101","6.3","3.3","6","2.5","Virginica"');
    expect(lines[50]).toContain('"150"');
    await page
      .getByRole("button", { name: "Compare petals", exact: true })
      .click();
    fs.mkdirSync("verification/screenshots", { recursive: true });
    await page
      .locator(".exploration")
      .evaluate((e) => e.scrollIntoView({ block: "start" }));
    if (width === 1440)
      await page.screenshot({ path: "verification/screenshots/filtered.png" });
    for (const s of data.species)
      await page.getByRole("checkbox", { name: s, exact: true }).check();
    await expect(page.locator(".point")).toHaveCount(150);
    await page
      .locator(".exploration")
      .evaluate((e) => e.scrollIntoView({ block: "start" }));
    await page.screenshot({
      path: `verification/screenshots/explorer-${width}.jpg`,
      type: "jpeg",
      quality: 85,
      fullPage: width === 390,
    });
    if (width === 1440)
      await page.screenshot({ path: "verification/screenshots/explorer.png" });
    expect(errors).toEqual([]);
  });
test("failed source loading offers a recovery state", async ({ page }) => {
  await page.route("**/data.json", (r) =>
    r.fulfill({ status: 503, body: "unavailable" }),
  );
  await page.goto(base);
  await expect(page.getByRole("alert")).toContainText("Please reload");
  await expect(page.locator("#results")).toBeHidden();
});

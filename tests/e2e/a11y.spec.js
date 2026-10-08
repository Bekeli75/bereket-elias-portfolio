import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  { path: "/", name: "home" },
  { path: "/resume", name: "resume" },
  { path: "/projects/digital-billboard-ams", name: "case study" },
  { path: "/projects/does-not-exist", name: "404" },
];

for (const theme of ["light", "dark"]) {
  for (const { path, name } of routes) {
    test(`${name} (${theme}) has no serious or critical accessibility violations`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.goto(path);
      if (name === "home") {
        await page.locator("#about").scrollIntoViewIfNeeded();
      }
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const serious = results.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact),
      );
      expect(serious).toEqual([]);
    });
  }
}
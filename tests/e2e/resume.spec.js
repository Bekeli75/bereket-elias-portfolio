import { expect, test } from "@playwright/test";

test("resume page lists sections and print controls", async ({ page }) => {
  await page.goto("/resume");
  await expect(
    page.getByRole("heading", { level: 1, name: /Bereket Elias/i }),
  ).toBeVisible();
  for (const heading of ["Summary", "Experience", "Education", "Skills", "Certifications"]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  await expect(page.getByRole("button", { name: "Print" })).toBeVisible();
  await expect(page.getByRole("link", { name: "PDF" })).toHaveAttribute(
    "href",
    /\/api\/resume\/download\?source=resume/,
  );
});

test("hero downloads the CV", async ({ page }) => {
  await page.goto("/");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: /Download CV/i }).first().click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Bereket_Elias_CV.pdf");
});
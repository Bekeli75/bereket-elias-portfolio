import { expect, test } from "@playwright/test";

test("home renders hero and all sections", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Bereket Elias/i }),
  ).toBeVisible();
  for (const id of [
    "about",
    "skills",
    "projects",
    "experience",
    "certifications",
    "contact",
  ]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await expect(page.locator(".skip-link")).toHaveCount(1);
});

test("navbar links scroll to sections", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  test.skip(
    !(await nav.isVisible()),
    "desktop-only: primary nav is hidden below lg breakpoint",
  );
  await nav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page.locator("#about")).toBeVisible();
});

test("theme toggle cycles dark -> light", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Click to cycle theme/i });
  await expect(toggle).toHaveAttribute("aria-label", /Theme: Dark/);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-label", /Theme: Light/);
});

test("case study renders and unknown slug shows branded 404", async ({ page }) => {
  await page.goto("/projects/digital-billboard-ams");
  await expect(
    page.getByRole("heading", {
      name: "Digital Billboard Advertising Management System",
      level: 1,
    }),
  ).toBeVisible();

  const response = await page.goto("/projects/does-not-exist");
  expect(response.status()).toBe(404);
  await expect(page.getByText("Page not found")).toBeVisible();
  await expect(page.getByRole("link", { name: /Back to home/i })).toBeVisible();
});

test("unknown route shows branded 404", async ({ page }) => {
  const response = await page.goto("/nope-nope-nope");
  expect(response.status()).toBe(404);
  await expect(page.getByText("Page not found")).toBeVisible();
});

test("mobile menu opens and navigates", async ({ page }) => {
  await page.goto("/");
  const burger = page.getByRole("button", { name: "Open menu" });
  test.skip(
    !(await burger.isVisible()),
    "mobile-only: hamburger is hidden at lg breakpoint and up",
  );
  await burger.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Resume" })
    .click();
  await expect(page).toHaveURL(/\/resume$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /Bereket Elias/i }),
  ).toBeVisible();
});
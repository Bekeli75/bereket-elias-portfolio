import { expect, test } from "@playwright/test";

test("empty submit shows client-side field errors", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
  await expect(page.getByText("Please enter your name (at least 2 characters).")).toBeVisible();
  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
});

test("valid message submits successfully", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByLabel("Name", { exact: true }).fill("E2E Tester");
  await page.getByLabel("Email", { exact: true }).fill("e2e@example.com");
  await page.getByLabel("Subject", { exact: true }).fill("Website check");
  await page
    .getByLabel("Message", { exact: true })
    .fill("This is an automated end-to-end contact form submission.");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("heading", { name: "Message sent." })).toBeVisible();
});
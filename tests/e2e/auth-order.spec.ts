import { expect, test } from "@playwright/test";

test("sign up -> create order -> submit -> view order detail", async ({ page }) => {
  const email = `e2e-${Date.now()}@solvix.studio`;
  const password = "StrongPass1!";

  await page.goto("/auth/sign-up?callbackUrl=%2Fapp%2Forders%2Fnew");

  await page.getByLabel("Nama").fill("E2E User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Konfirmasi Password").fill(password);
  await page.getByRole("button", { name: /sign up/i }).click();

  await expect(page).toHaveURL(/\/app\/orders\/new/);

  await page.getByRole("button", { name: /Landing Page/i }).first().click();
  await page.getByRole("button", { name: /^Next$/ }).click();

  await page.getByLabel("Project Title").fill("E2E Landing Project");
  await page
    .getByLabel("Description")
    .fill("Kami butuh landing page modern untuk campaign dengan fokus conversion.");
  await page.getByLabel("Target Audience").fill("Startup founder dan marketing lead");
  await page.getByLabel("Budget Min").fill("5000000");
  await page.getByLabel("Budget Max").fill("15000000");
  await page.getByRole("button", { name: /^Next$/ }).click();

  await page.getByLabel("Brand Colors").fill("#0ea5e9, #111827");
  await page.getByLabel("Reference Links").fill("https://stripe.com\nhttps://linear.app");
  await page.getByRole("button", { name: /^Next$/ }).click();

  await page.getByLabel("Contact Name").fill("E2E User");
  await page.getByLabel("Contact Email").fill(email);
  await page.getByLabel("Contact Phone").fill("08123456789");

  await page.getByRole("button", { name: /Submit Order/i }).click();

  await expect(page.getByText(/Order submitted/i)).toBeVisible();
  await page.getByRole("link", { name: /View Order Detail/i }).click();

  await expect(page).toHaveURL(/\/app\/orders\/.+/);
  await expect(page.getByText(/Order Summary/i)).toBeVisible();
  await expect(page.getByText(/Timeline/i)).toBeVisible();
});

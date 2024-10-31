import { expect, Locator } from "@playwright/test";
import { test } from "../testOptions";

test.beforeEach(async ({ page, globalsQaURL }) => {
  await page.goto(globalsQaURL);
});

test("drag and drop", async ({ page }) => {
  await page
    .getByRole("dialog")
    .locator(".fc-button-label", { hasText: "Consent" })
    .click({ force: true });

  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');
  await frame
    .locator("li", { hasText: "High Tatras 2" })
    .dragTo(frame.locator("#trash"));
  await frame
    .locator("li", { hasText: "High Tatras 3" })
    .dragTo(frame.locator("#trash"));
  await page.mouse.down();
  await frame.locator("#trash").hover();
  await page.mouse.up();

  await expect(frame.locator("#trash li h5")).toHaveText([
    "High Tatras 2",
    "High Tatras 3",
  ]);
});

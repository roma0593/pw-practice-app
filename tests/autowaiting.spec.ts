import { expect, Locator, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.URL);
  await page.getByText("Button Triggering AJAX Request").click();
});

test("autowaiting test", async ({ page }) => {
  const successButton = page.locator(".bg-success");
  //   await successButton.click();

  //   const textMsg = await successButton.textContent();
  //   await successButton.waitFor({state: "attached"});
  //   const allTextContents = await successButton.allTextContents();
  await expect(successButton).toHaveText("Data loaded with AJAX get request.", {
    timeout: 20000,
  });
});

test.skip("alternative ways for waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");
  await page.waitForSelector(".bg-success");

  await page.waitForResponse("http://www.uitestingplayground.com/ajaxdata");

  await page.waitForLoadState("networkidle");

  const allTextContents = await successButton.allTextContents();
  expect(allTextContents).toContain("Data loaded with AJAX get request.");
});

import { expect, Locator, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test.skip("user facing locators", async ({ page }) => {
  await page.getByText("Form Layouts").click();
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByLabel("Email").first().click();
  await page.getByPlaceholder("Jane Doe").first().click();
  await page.getByText("Using the Grid").first().click();
  // await page.getByTitle('IoT Dashboard').first().click();
  await page.getByTestId("SignIn").first().click();
});

test.skip("locating child elements", async ({ page }) => {
  await page.getByText("Form Layouts").click();
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();
  await page.locator("nb-card").nth(3).getByRole("button").click();
});

test.skip("location parent elements", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();
  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "Email" })
    .click();
  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "Email" })
    .click();
});

test.skip("reusing elements", async ({ page }) => {
  const basicForm: Locator = page
    .locator("nb-card")
    .filter({ hasText: "Basic form" });
  const emailField = basicForm.getByRole("textbox", { name: "Email" });

  await emailField.fill("test@test.com");
  await basicForm
    .getByRole("textbox", { name: "Password" })
    .fill("Welcome1234");
  await basicForm.locator("nb-checkbox").click();
  await basicForm.getByRole("button").click();

  await expect(emailField).toHaveValue("test@test.com");
});

test("extracting values", async ({ page }) => {
  const basicForm: Locator = page
    .locator("nb-card")
    .filter({ hasText: "Basic form" });
  const buttonText = await basicForm.locator("button").textContent();
  expect(buttonText).toEqual("Submit");
  const allRadButtLabels = await page.locator("nb-radio").allTextContents();
  expect(allRadButtLabels).toContain("Option 1");

  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");
  const filledValue = await emailField.inputValue();

  expect(filledValue).toEqual("test@test.com");

  const placeholderValue = await emailField.getAttribute("placeholder");
  expect(placeholderValue).toEqual("Email");
});

test("assertions", async ({ page }) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button');
    const text = await basicFormButton.textContent();
    expect(text).toEqual("Submit");

    await expect(basicFormButton).toHaveText('Submit');

    await expect.soft(basicFormButton).toHaveText('1');
    await basicFormButton.click();
});

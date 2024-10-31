import { expect, Locator, test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByText("Forms").click();
});

test("navigate to form page", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
});

test("parametrized methods", async ({ page }) => {
  const pm = new PageManager(page);
  const fullNameRandom = faker.person.fullName();
  const randomEmail = `${fullNameRandom.replace(" ", "")}${faker.number.int(1000)}@test.com`;

  await pm.navigateTo().formLayoutsPage();
  await pm
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredsAndSelectOption(
      randomEmail,
      "Welcome1",
      "Option 1"
    );

    await page.screenshot({path: 'screenshots/formLayoutsPage.png'});
    await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'});
    const buffer = await page.screenshot();
    console.log(buffer.toString('base64'));
  // await pm.navigateTo().datePickerPage();
  // await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5);
  // await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(5, 14);
});

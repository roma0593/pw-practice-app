import { expect, Locator, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Form layouts page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test('input fields', {tag: '@smoke'}, async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });
    await usingTheGridEmailInput.fill("test@test.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("tst@test.com");

    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("tst@test.com");

    await expect(usingTheGridEmailInput).toHaveValue("tst@test.com");
  });

  test.only("radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", { hasText: "Using the Grid" });
    const radioButton = usingTheGridForm.getByRole("radio", { name: "Option 2" });
    await radioButton.check({ force: true });
    const status = await radioButton.isChecked();
    await expect(usingTheGridForm).toHaveScreenshot({maxDiffPixels: 250});

    // const option2 = page
    //   .locator("nb-card", { hasText: "Using the Grid" })
    //   .getByRole("radio", { name: "Option 2" });
    // await option2.check({ force: true });
    // expect(await radioButton.isChecked()).toBeFalsy();
    // expect(await option2.isChecked()).toBeTruthy();
  });
});

test("checkbox", async ({ page }) => {
  await page.getByTitle("Modal & Overlays").click();
  await page.getByTitle("Toastr").click();

  const checkbox1 = page.getByRole("checkbox", { name: "Hide on click" });
  await checkbox1.uncheck({ force: true });

  const checkbox2 = page.getByRole("checkbox", {
    name: "Prevent arising of duplicate toast",
  });
  await checkbox2.check({ force: true });

  const allCheckboxes = page.getByRole("checkbox");

  for (let checkbox of await allCheckboxes.all()) {
    await checkbox.check({ force: true });
    expect(await checkbox.isChecked()).toBeTruthy();
  }
});

test("lists", async ({ page }) => {
  const listBox = page.locator("ngx-header nb-select");
  await listBox.click();

  // const listElements = page.getByRole('list').locator('nb-option');
  const listElements = page.locator("nb-option-list nb-option");
  await expect(listElements).toHaveText([
    "Light",
    "Dark",
    "Cosmic",
    "Corporate",
  ]);
  await listElements.filter({ hasText: "Cosmic" }).click();
  const header = page.locator("nb-layout-header");
  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  await listBox.click();

  for (let color in colors) {
    await listElements.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", colors[color]);
  }
});

test("tooltips", async ({ page }) => {
  await page.getByTitle("Modal & Overlays").click();
  await page.getByTitle("Tooltip").click();
  const tooltipCard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });
  await tooltipCard.getByRole("button", { name: "Top" }).hover();
  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
});

test("dialog boxes", async ({ page }) => {
  await page.getByTitle("Tables & Data").click();
  await page.getByTitle("Smart Table").click();

  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });

  await page
    .getByRole("table")
    .locator("tr", { hasText: "mdo@gmail.com" })
    .locator(".nb-trash")
    .click();

  await expect(page.locator("table tr").first()).not.toHaveText(
    "mdo@gmail.com"
  );
});

test("tables", async ({ page }) => {
  await page.getByTitle("Tables & Data").click();
  await page.getByTitle("Smart Table").click();

  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await targetRow.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("35");
  await page.locator(".nb-checkmark").click();
  await page.locator(".ng2-smart-pagination").getByText("2").click();
  const targetRowById = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1).getByText("11") });

  const ages = ["20", "30", "40", "200"];
  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);
    await page.waitForTimeout(500);
    const allRows = page.locator("tbody tr");

    if (age === "200") {
      expect(await page.getByRole("table").textContent()).toContain(
        "No data found"
      );
    } else {
      for (let row of await allRows.all()) {
        const cellValue = await row.locator("td").last().textContent();

        expect(cellValue).toEqual(age);
      }
    }
  }
});

test("date pickers", async ({ page }) => {
  await page.getByTitle("Forms").click();
  await page.getByTitle("Datepicker").click();

  const calendarInput = page.getByPlaceholder("Form Picker");
  await calendarInput.click();

  let date = new Date();
  date.setDate(date.getDate() + 200);
  const expectedDate = date.getDate().toString();
  const expectedMonthShort = date.toLocaleString("En-US", { month: "short" });
  const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
  const expectedYear = date.getFullYear();
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  let selectedDate = await page.locator("nb-calendar-view-mode").textContent();
  const expectedMonthYear = ` ${expectedMonthLong} ${expectedYear} `;

  while (!selectedDate.includes(expectedMonthYear)) {
    await page
      .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]')
      .click();
    selectedDate = await page.locator("nb-calendar-view-mode").textContent();
  }

  await page
    .locator('[class="day-cell ng-star-inserted"]')
    .getByText(expectedDate, { exact: true })
    .click();
  await expect(calendarInput).toHaveValue(dateToAssert);
});

test("sliders", async ({ page }) => {
  const temGuage = page.locator(
    '[tabtitle="Temperature"] ngx-temperature-dragger circle'
  );
  //   await temGuage.evaluate(node => {
  //     node.setAttribute('cx', '232.630');
  //     node.setAttribute('cy', '232.630');
  //   })

  //   await temGuage.click();

  const tempBox = page.locator(
    '[tabtitle="Temperature"] ngx-temperature-dragger'
  );

  await tempBox.scrollIntoViewIfNeeded();
  const box = await tempBox.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 100, y); 
  await page.mouse.move(x + 100, y + 100); 
  await page.mouse.up(); 
  await expect(tempBox).toContainText('30')
 });

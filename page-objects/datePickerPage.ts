import { expect, Page } from "@playwright/test";

export class DatePickerPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    const calendarInput = this.page.getByPlaceholder("Form Picker");
    await calendarInput.click();
    const dateToAssert = await this.selectDateInCalendar(numberOfDaysFromToday)
    await expect(calendarInput).toHaveValue(dateToAssert);
  }

  async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
    const calendarInput = this.page.getByPlaceholder("Range Picker");
    await calendarInput.click();
    const startDateToAssert = await this.selectDateInCalendar(startDayFromToday);
    const endDateToAssert = await this.selectDateInCalendar(endDayFromToday);
    const dateToAssert = `${startDateToAssert} - ${endDateToAssert}`;
    await expect(calendarInput).toHaveValue(dateToAssert);
  }

  private async selectDateInCalendar(numberOfDaysFromToday: number) {
    let date = new Date();
    date.setDate(date.getDate() + numberOfDaysFromToday);
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString("En-US", { month: "short" });
    const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
    const expectedYear = date.getFullYear();
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let selectedDate = await this.page
      .locator("nb-calendar-view-mode")
      .textContent();
    const expectedMonthYear = ` ${expectedMonthLong} ${expectedYear} `;

    while (!selectedDate.includes(expectedMonthYear)) {
      await this.page
        .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]')
        .click();
      selectedDate = await this.page
        .locator("nb-calendar-view-mode")
        .textContent();
    }

    await this.page
      .locator('.day-cell.ng-star-inserted')
      .getByText(expectedDate, { exact: true })
      .last()
      .click();

    return dateToAssert;  
  }
}

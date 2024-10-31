import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async formLayoutsPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form Layouts").click();
  }

  async datePickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Datepicker").click();
  }

  private async selectGroupMenuItem(groupItemTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemTitle);
    const expandedState = await groupMenuItem.getAttribute("aria-expanded");

    if (expandedState !== "true") {
      await groupMenuItem.click();
    }
  }
}

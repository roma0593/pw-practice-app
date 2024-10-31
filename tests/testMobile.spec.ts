import test, { expect } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto("/");
    await page.locator('ngx-header nb-icon[icon="menu-2-outline"]').click();
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
    await page.locator('ngx-header nb-icon[icon="menu-2-outline"]').click();
});

test("radio buttons", async ({ page }) => {
    const radioButton = page
        .locator("nb-card", { hasText: "Using the Grid" })
        .getByRole("radio", { name: "Option 1" });
    await radioButton.check({ force: true });
    const status = await radioButton.isChecked();
    expect(status).toBeTruthy();
    await expect(radioButton).toBeChecked();

    const option2 = page
        .locator("nb-card", { hasText: "Using the Grid" })
        .getByRole("radio", { name: "Option 2" });
    await option2.check({ force: true });
    expect(await radioButton.isChecked()).toBeFalsy();
    expect(await option2.isChecked()).toBeTruthy();
});
import { test, expect } from '@playwright/test';
const conf = require('./config.json');
test.beforeEach(async ({ page }) => {
  // login to the website
  await page.goto(conf.config.url);

  await page.fill('input[id="username"]', conf.config.username);
  await page.fill('input[id="password"]', conf.config.password);

  await page.click('button[type="submit"]');
  await expect(page).toHaveTitle("Vite + React + TS");
});


conf.testCases.forEach((testCase: any) => {
  test(`${testCase.name}`, async ({ page }) => {
    // click the button containing the navigate_to text
    await page
      .getByRole('button')
      .filter({ hasText: testCase.action.navigate_to })
      .click();

    // assert column name exists
    const columnCount = await page.getByRole('heading')
      .filter({ hasText: testCase.assertion.column_name })
      .count();
    expect(columnCount).toBe(1);

    // Get column div
    const columnLocator = page.getByRole('heading')
      .filter({ hasText: testCase.assertion.column_name })
      .locator("..");

    // Check if the column has the task name
    const taskCount = await columnLocator
      .locator('h3')
      .filter({ hasText: testCase.assertion.task_name })
      .count();
    expect(taskCount).toBe(1);

    // Get the task div
    const taskLocator = columnLocator
      .locator('h3')
      .filter({ hasText: testCase.assertion.task_name })
      .locator("..");

    // match tags within the task
    for (const tag of testCase.assertion.tags) {
      const tagCount = await taskLocator.locator("span").getByText(tag).count();
      expect(tagCount).toBe(1);
    }

  })
});


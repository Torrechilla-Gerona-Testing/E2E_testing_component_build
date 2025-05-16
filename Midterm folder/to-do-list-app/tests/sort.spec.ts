import { test, expect } from '@playwright/test';
import prisma from '@/lib/prisma';

test.describe('Task Manager Sort', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000', { timeout: 60000 });
    
    // Ensure the page is loaded, with more specific error handling
    try {
      await page.waitForSelector('h1:has-text("Task Manager")', { timeout: 10000 });
    } catch (error) {
      console.error('Failed to load the Todo App page. Current URL:', page.url());
      console.error('Page content:', await page.content());
      throw error;
    }
  });
  test.afterEach(async () => {
    await prisma.task.deleteMany({});
  });


  test('should sort tasks by due date (Earliest)', async ({ page }) => {
    // Task 2: Timed task with the earliest due date
    await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.locator('form')).toBeVisible();

    await page.getByLabel(/Task Type/i).click();
    await page.getByRole('option', { name: /Timed Task/i }).click();
    await page.getByLabel(/Title/i).fill('A Task - Early Due Date');
    await page.getByLabel(/Description/i).fill('This task has the earliest due date');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0] + 'T12:00';
    await page.getByLabel(/Due Date/i).fill(tomorrowStr);
    await page.getByRole('button', { name: /Add Task/i }).click();

    await expect(page.getByLabel(/Title/i)).not.toBeVisible();
    await page.reload({ waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'A Task - Early Due Date' })).toBeVisible();

    // Task 3: Timed task with a later due date
    await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.locator('form')).toBeVisible();

    await page.getByLabel(/Task Type/i).click();
    await page.getByRole('option', { name: /Timed Task/i }).click();
    await page.getByLabel(/Title/i).fill('C Task - Later Due Date');
    await page.getByLabel(/Description/i).fill('This task has a later due date');

    const laterDate = new Date();
    laterDate.setDate(laterDate.getDate() + 2);
    const laterDateStr = laterDate.toISOString().split('T')[0] + 'T12:00';
    await page.getByLabel(/Due Date/i).fill(laterDateStr);
    await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.getByLabel(/Title/i)).not.toBeVisible();
    await page.reload({ waitUntil: 'networkidle' });


    // Sort tasks by due date
    await page.locator('[data-testid="sort-test"]').click();
    await page.locator('text=Due Date (Earliest)').click();

    // Check that "A Task - Early Due Date" is the first task in the list
    const taskTitles = await page.locator('[data-testid="task-title"]').allTextContents();
    expect(taskTitles[0]).toBe('A Task - Early Due Date');
    expect(taskTitles[1]).toBe('C Task - Later Due Date');
  });
});
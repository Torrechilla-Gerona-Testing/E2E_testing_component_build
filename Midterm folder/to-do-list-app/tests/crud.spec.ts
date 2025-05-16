import { test, expect } from '@playwright/test';
import prisma from '@/lib/prisma';

/**
 * Test suite for CRUD operations
 * 
 * This suite tests Add, Edit, and Delete functionality of a todo app
 */

test.describe('Task Manager CRUD Operations', () => {
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

  test('should add a new todo item', async ({ page }) => {
    
   await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.locator('form')).toBeVisible();

    await page.getByLabel(/Task Type/i).click();
    await page.getByRole('option', { name: /Basic Task/i }).click();
    await page.getByLabel(/Title/i).fill('B Task - No Due Date');
    await page.getByLabel(/Description/i).fill('This task has no due date');
    await page.getByRole('button', { name: /Add Task/i }).click();

    await expect(page.getByRole('heading', { name: 'B Task - No Due Date' })).toBeVisible();
  });


  test('should edit an existing todo item', async ({ page }) => {
    await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.locator('form')).toBeVisible();
    await page.getByLabel(/Title/i).fill("buy groceries");
    await page.getByLabel(/Description/i).fill('This task has no due date');
    await page.getByRole('button', { name: /Add Task/i }).click();

    await expect(page.getByRole('heading', { name: "buy groceries" })).toBeVisible();

    await page.locator('[data-testid="edit-test"]').click();

    await page.getByLabel(/Title/i).fill('buy groceries - edited');
    await page.getByRole('button', { name: /Save Changes/i }).click();

//closed ang modal
    await expect(page.getByLabel(/Title/i)).not.toBeVisible();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'buy groceries - edited' })).toBeVisible();
  });

  test('should delete a todo item', async ({ page }) => {
   await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.locator('form')).toBeVisible();
    await page.getByLabel(/Title/i).fill("take out the trash");
    await page.getByLabel(/Description/i).fill('blablabla');
    await page.getByRole('button', { name: /Add Task/i }).click();

    await expect(page.getByRole('heading', { name: "take out the trash" })).toBeVisible();

    await page.locator('[data-testid="delete-test"]').click();
    await expect(page.getByRole('heading', { name: "Delete Task" })).toBeVisible();
    await page.getByRole('button', { name: /Delete Task/i }).click();

// closed ang modal
    await expect(page.getByRole('heading', { name: "Delete Task" })).toBeHidden();

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: "take out the trash" })).toBeHidden();

    
  });
});
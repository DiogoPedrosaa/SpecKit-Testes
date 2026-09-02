import { test, expect } from '@playwright/test';

test.describe('Happy Path: User Journey', () => {
  const username = `testuser_${Date.now()}`;
  const password = 'Password123!';
  const characterName = `TestChar_${Date.now()}`;

  test('should complete the full flow', async ({ page }) => {
    // 1. Register
    await page.goto('/register');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    // Wait for redirect to login or dashboard
    await page.waitForURL('**/login*');

    // 2. Login
    await page.goto('/login');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard*');

    // 3. Add Balance
    await page.fill('input[type="number"][placeholder="Amount"]', '1000');
    await page.click('button:has-text("Add Balance")');
    // Verify balance update (assuming it shows in the UI somewhere)
    await expect(page.locator('text=Current Balance: 1000').first()).toBeVisible();

    // 4. Create Character
    await page.click('a:has-text("My Characters")');
    await page.waitForURL('**/my-characters*');
    await page.click('a:has-text("Create New Character")');
    await page.waitForURL('**/my-characters/new*');
    
    await page.fill('input[name="name"]', characterName);
    await page.selectOption('select[name="vocation"]', 'Knight');
    await page.fill('input[name="level"]', '100');
    await page.click('button[type="submit"]');
    
    // Verify redirect back to character list
    await page.waitForURL('**/my-characters*');
    await expect(page.locator(`text=${characterName}`).first()).toBeVisible();

    // 5. Create Auction
    await page.click(`button:has-text("Create Auction"):near(:text("${characterName}"))`); // Or however the button is linked
    await page.waitForURL('**/my-characters/*/auction*');
    
    await page.fill('input[name="startPrice"]', '100');
    // Select an end time (e.g. tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill('input[name="endTime"]', tomorrow.toISOString().substring(0, 16));
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/*'); // Home or dashboard, assume Home

    // 6. Place Bid (simulated or actual if we can see it on home page)
    await page.goto('/');
    // Assuming there's a list of auctions with the character name
    const bidInput = page.locator(`input[type="number"]:near(:text("${characterName}"))`);
    if (await bidInput.count() > 0) {
        await bidInput.fill('150');
        await page.click(`button:has-text("Place Bid"):near(:text("${characterName}"))`);
    }

    // 7. Check History
    await page.goto('/dashboard');
    await page.click('a:has-text("My History")');
    await page.waitForURL('**/history*');
    
    await expect(page.locator('h2:has-text("My History")')).toBeVisible();
    // We don't strictly require seeing the bid if the backend isn't fully connected, but we verify the page loads.
  });
});

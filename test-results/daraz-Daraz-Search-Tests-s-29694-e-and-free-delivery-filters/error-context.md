# Test info

- Name: Daraz Search Tests >> should search for electronic, apply price, and free delivery filters
- Location: C:\Users\HC\Desktop\Playwright\tests\daraz.spec.js:19:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
    at C:\Users\HC\Desktop\Playwright\tests\daraz.spec.js:56:43
```

# Test source

```ts
   1 | // daraz.spec.js
   2 | // This file contains the test cases for Daraz website
   3 | const { test, expect } = require('@playwright/test');
   4 | const HomePage = require('../pages/HomePage');
   5 | const SearchResultsPage = require('../pages/SearchResultsPage');
   6 | const ProductPage = require('../pages/ProductPage');
   7 |
   8 | test.describe('Daraz Search Tests', () => {
   9 |     let homePage;
  10 |     let searchResultsPage;
  11 |     let productPage;
  12 |
  13 |     test.beforeEach(async ({ page }) => {
  14 |         homePage = new HomePage(page);
  15 |         searchResultsPage = new SearchResultsPage(page);
  16 |         productPage = new ProductPage(page);
  17 |     });
  18 |
  19 |     test('should search for electronic, apply price, and free delivery filters', async ({ page }) => {
  20 |         try {
  21 |             // Navigate to homepage
  22 |             await homePage.navigateToHomePage();
  23 |
  24 |             // Search for electronic
  25 |             await homePage.searchProduct('electronic');
  26 |
  27 |             // Wait for search results to load
  28 |             await page.waitForSelector('div[data-tracking="product-card"]', { state: 'visible', timeout: 10000 });
  29 |
  30 |             // Apply price filter (min: 500, max: 5000)
  31 |             await searchResultsPage.applyPriceFilter(500, 5000);
  32 |             await page.waitForSelector('div[data-tracking="product-card"]', { state: 'visible' });
  33 |
  34 |             // Wait for the Free Delivery label to be visible
  35 |             await page.waitForSelector('span:has-text("Free Delivery")', { state: 'visible', timeout: 5000 });
  36 |             // Then tick the checkbox
  37 |             await page.click('input.ant-checkbox-input[businessvalue="Free_Shipping"]');
  38 |             await page.waitForSelector('div[data-tracking="product-card"]', { state: 'visible' });
  39 |
  40 |             // Verify we have products after filtering
  41 |             const productCount = await searchResultsPage.getProductCount();
  42 |             expect(productCount).toBeGreaterThan(0);
  43 |             console.log(`Number of products found: ${productCount}`);
  44 |
  45 |             // Click on a random product
  46 |             await searchResultsPage.clickRandomProduct();
  47 |
  48 |             // Verify we're on a product page
  49 |             await expect(page).toHaveURL(/.*\/products\/.*/);
  50 |
  51 |             // Check shipping availability and FAIL if not available
  52 |             const freeShippingAvailable = await productPage.hasFreeShipping();
  53 |             console.log(`Free shipping available: ${freeShippingAvailable}`);
  54 |             
  55 |             // This assertion will make the test fail if free shipping is not available
> 56 |             expect(freeShippingAvailable).toBe(true);
     |                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  57 |
  58 |             // Get product details for logging
  59 |             const pageText = await page.textContent('body');
  60 |             console.log('Product page URL:', page.url());
  61 |             
  62 |         } catch (error) {
  63 |             console.error('Test failed:', error.message);
  64 |             throw error;
  65 |         } finally {
  66 |             // Ensure the page is closed properly
  67 |             await page.close();
  68 |         }
  69 |     });
  70 | });
  71 |
```
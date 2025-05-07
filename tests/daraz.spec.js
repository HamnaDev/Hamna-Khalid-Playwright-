// daraz.spec.js
// This file contains the test cases for Daraz website
const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const ProductPage = require('../pages/ProductPage');

test.describe('Daraz Search Tests', () => {
    let homePage;
    let searchResultsPage;
    let productPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        searchResultsPage = new SearchResultsPage(page);
        productPage = new ProductPage(page);
    });

    test('should search for electronic, apply price, and free delivery filters', async ({ page }) => {
        try {
            // Navigate to homepage
            await homePage.navigateToHomePage();

            // Search for electronic
            await homePage.searchProduct('electronic');

            // Wait for search results to load
            await page.waitForSelector('div[data-tracking="product-card"]', { state: 'visible', timeout: 10000 });

            // Apply price filter (min: 500, max: 5000)
            await searchResultsPage.applyPriceFilter(500, 5000);
            await page.waitForSelector('div[data-tracking="product-card"]', { state: 'visible' });

            // Wait for the Free Delivery label to be visible
            await page.waitForSelector('span:has-text("Free Delivery")', { state: 'visible', timeout: 5000 });
            // Then tick the checkbox
            await page.click('input.ant-checkbox-input[businessvalue="Free_Shipping"]');
            await page.waitForSelector('div[data-tracking="product-card"]', { state: 'visible' });

            // Verify we have products after filtering
            const productCount = await searchResultsPage.getProductCount();
            expect(productCount).toBeGreaterThan(0);
            console.log(`Number of products found: ${productCount}`);

            // Click on a random product
            await searchResultsPage.clickRandomProduct();

            // Verify we're on a product page
            await expect(page).toHaveURL(/.*\/products\/.*/);

            // Check shipping availability and FAIL if not available
            const freeShippingAvailable = await productPage.hasFreeShipping();
            console.log(`Free shipping available: ${freeShippingAvailable}`);
            
            // This assertion will make the test fail if free shipping is not available
            expect(freeShippingAvailable).toBe(true);

            // Get product details for logging
            const pageText = await page.textContent('body');
            console.log('Product page URL:', page.url());
            
        } catch (error) {
            console.error('Test failed:', error.message);
            throw error;
        } finally {
            // Ensure the page is closed properly
            await page.close();
        }
    });
});

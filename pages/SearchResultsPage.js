// SearchResultsPage.js
// This page object contains methods for handling search results and filters
const BasePage = require('./BasePage');

class SearchResultsPage extends BasePage {
    constructor(page) {
        super(page);
        // Locators - using more specific selectors
        this.brandFilter = 'input.ant-checkbox-input[type="checkbox"][businessvalue]';
        this.minPriceInput = 'input.q9tZB[placeholder="Min"][type="number"]';
        this.maxPriceInput = 'input.q9tZB[placeholder="Max"][type="number"]';
        this.priceFilterSection = 'div._9xWFp:has-text("Price")';
        this.applyButton = 'button.ant-btn.ant-btn-primary.ant-btn-icon-only[fdprocessedid]';
        this.productCard = 'div[data-tracking="product-card"]';
        this.filterCaret = 'button.ant-btn.ant-btn-primary.ant-btn-icon-only svg[data-icon="caret-right"] path[d*="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"]';
        this.freeDeliveryFilter = 'input.ant-checkbox-input[data-spm-click*="Free_Shipping"]';
    }

    // Select a brand from the filter
    async selectBrand(brandName) {
        try {
            // Wait for brand filter to be visible
            await this.page.waitForSelector(this.brandFilter, { state: 'visible', timeout: 10000 });
            
            // Find the brand checkbox by its label text
            const brandLabel = `span:has-text("${brandName}")`;
            const brandCheckbox = await this.page.locator(brandLabel).locator('xpath=..').locator(this.brandFilter);
            
            if (await brandCheckbox.isVisible()) {
                await brandCheckbox.click();
                // Wait for filter to be applied
                await this.page.waitForTimeout(2000);
            } else {
                console.log(`Brand "${brandName}" not found in filters`);
            }
        } catch (error) {
            console.error('Brand selection failed:', error.message);
            throw error;
        }
    }

    // Select Free Delivery filter
    async selectFreeDelivery() {
        try {
            // Wait for Free Delivery filter to be visible
            await this.page.waitForSelector(this.freeDeliveryFilter, { state: 'visible', timeout: 10000 });
            
            // Click the Free Delivery checkbox
            await this.page.click(this.freeDeliveryFilter);
            
            // Wait for filter to be applied
            await this.page.waitForTimeout(2000);
        } catch (error) {
            console.error('Free Delivery filter selection failed:', error.message);
            throw error;
        }
    }

    // Expand filter section if collapsed
    async expandFilterSection() {
        try {
            // Wait for the caret to be visible
            await this.page.waitForSelector(this.filterCaret, { 
                state: 'visible',
                timeout: 5000 
            });

            const caret = await this.page.$(this.filterCaret);
            if (caret) {
                // Check if the filter section is collapsed (caret is pointing right)
                const isCollapsed = await caret.evaluate(el => {
                    const transform = window.getComputedStyle(el).transform;
                    return transform === 'matrix(1, 0, 0, 1, 0, 0)'; // No rotation means collapsed
                });

                if (isCollapsed) {
                    // Click the parent button element
                    await this.page.click('button.ant-btn.ant-btn-primary.ant-btn-icon-only[fdprocessedid]');
                    // Wait for animation to complete
                    await this.page.waitForTimeout(500);
                }
            }
        } catch (error) {
            console.error('Failed to expand filter section:', error.message);
            throw error;
        }
    }

    // Apply price filter and then free delivery
    async applyPriceFilter(minPrice, maxPrice) {
        try {
            // Expand filter section first
            await this.expandFilterSection();

            // Wait for price filter section to be visible
            await this.page.waitForSelector(this.priceFilterSection, { state: 'visible', timeout: 10000 });

            // Wait for price inputs to be visible and enabled
            await this.page.waitForSelector(this.minPriceInput, { state: 'visible', timeout: 10000 });
            await this.page.waitForSelector(this.maxPriceInput, { state: 'visible', timeout: 10000 });

            // Fill in the price range
            await this.page.fill(this.minPriceInput, '');
            await this.page.type(this.minPriceInput, minPrice.toString());
            await this.page.fill(this.maxPriceInput, '');
            await this.page.type(this.maxPriceInput, maxPrice.toString());

            // Click the orange price apply button (caret-right icon)
            await this.page.click('button.ant-btn.ant-btn-primary.ant-btn-icon-only:has(svg[data-icon="caret-right"])');

            // Wait for results to update
            await this.page.waitForTimeout(2000);

            // Tick the Free Delivery checkbox
            await this.page.click('input.ant-checkbox-input[businessvalue="Free_Shipping"]');

            // Wait for results to update again
            await this.page.waitForTimeout(2000);
        } catch (error) {
            console.error('Price filter application failed:', error.message);
            throw error;
        }
    }

    // Get product count
    async getProductCount() {
        const products = await this.page.$$(this.productCard);
        return products.length;
    }

    // Click on a random product
    async clickRandomProduct() {
        const products = await this.page.$$(this.productCard);
        if (products.length > 0) {
            const randomIndex = Math.floor(Math.random() * products.length);
            await products[randomIndex].click();
            await this.page.waitForLoadState('domcontentloaded');
        } else {
            throw new Error('No products found to click');
        }
    }
}

module.exports = SearchResultsPage; 
// HomePage.js
// This page object contains methods specific to the Daraz home page
const BasePage = require('./BasePage');

class HomePage extends BasePage {
    constructor(page) {
        super(page);
        // Locators - using more specific selectors
        this.searchInput = 'input.search-box__input--O34g[type="search"][id="q"]';
        this.searchButton = 'a.search-box__button--1oH7';
    }

    // Navigate to Daraz homepage
    async navigateToHomePage() {
        await this.page.goto('https://www.daraz.pk/');
        // Wait for the search input to be visible
        await this.page.waitForSelector(this.searchInput, { state: 'visible', timeout: 10000 });
        await this.waitForPageLoad();
    }

    // Search for a product with improved reliability
    async searchProduct(productName) {
        try {
            // Wait for search input to be ready
            await this.page.waitForSelector(this.searchInput, { state: 'visible', timeout: 5000 });
            
            // Clear the search input first
            await this.page.fill(this.searchInput, '');
            
            // Type the search term
            await this.page.type(this.searchInput, productName);
            
            // Click the search button
            await this.click(this.searchButton);
            
            // Wait for navigation to start
            await this.page.waitForLoadState('domcontentloaded');
            
            // Wait for the search results to be visible
            await this.page.waitForSelector('div[data-tracking="product-card"]', { 
                state: 'visible',
                timeout: 15000 
            });
            
            // Additional wait for any dynamic content
            await this.page.waitForTimeout(1000);
        } catch (error) {
            console.error('Search operation failed:', error.message);
            throw error;
        }
    }
}

module.exports = HomePage; 
// BasePage.js
// This is the base page object that contains common methods and properties
// that will be inherited by other page objects

class BasePage {
    constructor(page) {
        this.page = page;
    }

    // Common method to wait for page load
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    // Common method to click on elements with improved reliability
    async click(selector) {
        try {
            // Wait for the element to be visible and enabled
            await this.page.waitForSelector(selector, { 
                state: 'visible',
                timeout: 5000 
            });

            // Ensure element is in viewport
            await this.page.evaluate((sel) => {
                const element = document.querySelector(sel);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, selector);

            // Small delay to ensure smooth scrolling completes
            await this.page.waitForTimeout(100);

            // Click with force option to handle any overlay issues
            await this.page.click(selector, { force: true });
        } catch (error) {
            console.error(`Failed to click element: ${selector}`, error.message);
            throw error;
        }
    }

    // Common method to fill input fields
    async fill(selector, value) {
        await this.page.fill(selector, value);
    }

    // Common method to get text content
    async getText(selector) {
        return await this.page.textContent(selector);
    }

    // Common method to check if element is visible
    async isVisible(selector) {
        return await this.page.isVisible(selector);
    }
}

module.exports = BasePage; 
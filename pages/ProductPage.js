// ProductPage.js
// This page object contains methods for handling product details page
const BasePage = require('./BasePage');

class ProductPage extends BasePage {
    constructor(page) {
        super(page);
        // Updated locators to catch more variations of free shipping text
        this.freeShippingSelectors = [
            '//div[contains(text(), "Free Shipping")]',
            '//div[contains(text(), "Free Delivery")]',
            '//span[contains(text(), "Free Shipping")]',
            '//span[contains(text(), "Free Delivery")]',
            '//div[contains(@class, "free-shipping")]',
            '//div[contains(@class, "free-delivery")]'
        ];
    }

    /**
     * Checks if free shipping is available on the product page.
     * Returns true if any free shipping indicator is visible, otherwise false.
     */
    async hasFreeShipping() {
        try {
            // Check each possible selector
            for (const selector of this.freeShippingSelectors) {
                const isVisible = await this.page.isVisible(selector);
                if (isVisible) {
                    console.log(`Found free shipping indicator with selector: ${selector}`);
                    return true;
                }
            }
            
            // If we get here, no free shipping indicators were found
            console.log('No free shipping indicators found on the page');
            return false;
        } catch (error) {
            console.error('Error checking free shipping:', error.message);
            return false;
        }
    }

    /**
     * Gets the shipping information text if available
     */
    async getShippingInfo() {
        try {
            // Try to find any shipping-related text
            const shippingText = await this.page.evaluate(() => {
                const elements = Array.from(document.querySelectorAll('*'));
                return elements
                    .filter(el => el.textContent.toLowerCase().includes('shipping') || 
                                el.textContent.toLowerCase().includes('delivery'))
                    .map(el => el.textContent.trim())
                    .join('\n');
            });
            
            return shippingText || 'No shipping information found';
        } catch (error) {
            console.error('Error getting shipping info:', error.message);
            return 'Error retrieving shipping information';
        }
    }
}

module.exports = ProductPage; 
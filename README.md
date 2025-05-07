# Daraz.pk Automation Testing Assignment (Playwright + POM)

This project automates product search and filtering on [Daraz.pk](https://www.daraz.pk/) using **Playwright** with the **Page Object Model** design pattern. It fulfills all assignment requirements including applying filters, checking product count, and verifying free shipping status.

## 📋 Requirements Fulfilled

✅ Create a project with Page Object Model  
✅ Navigate to https://www.daraz.pk/  
✅ Search for a specific item (`"electronics"`)  
✅ Select a brand from the filter  
✅ Apply price filter (Min: 500, Max: 5000)  
✅ Write a method to count search result products  
✅ Verify product count is greater than 0  
✅ Click on any one product  
✅ Check and test if **free shipping** is available


## 🔧 Technologies Used

- [Playwright](https://playwright.dev/)
- JavaScript (Node.js)
- Page Object Model
- Git for version control

--Install Dependencies
        npm install
        npm install @playwright/test
        npx playwright test


The test output shows exactly this behavior:
               The test found 40 products
               It checked for free shipping
               Free shipping was not available (Free shipping available: false)

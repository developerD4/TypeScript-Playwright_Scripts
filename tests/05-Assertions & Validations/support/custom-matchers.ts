import { expect as baseExpect, test as baseTest } from '@playwright/test';

// Add our own custom matcher
export const expect = baseExpect.extend({

  toHaveTextLength(received: string, expectedLength: number) {

    const actualLength = received.length;

    const pass = actualLength === expectedLength;

    return {
      pass,
      message: () =>
        `Expected text length to be ${expectedLength}, but got ${actualLength} `
    };
  }
});

// Export normal Playwright test
export const test = baseTest;

// A custom matcher is useful when the same special validation is repeated across many tests. We create the validation once in the framework and then reuse it with a readable assertion.









// Example: E-commerce — Product Price Validation
// //You want to verify that the displayed price is within a valid range, say ₹70,000–₹90,000.
// export const expect = baseExpect.extend({
//   async toBeWithinPriceRange(
//     locator,
//     minPrice: number,
//     maxPrice: number
//   ) {
//     const actualText = await locator.textContent();

//     const actualPrice = Number(actualText?.replace(/[₹,]/g, ""));

//     const pass = actualPrice >= minPrice && actualPrice <= maxPrice;
//     //if(value >= 70000 && value <= 90000){}

//     return {
//       pass,
//       message: () =>
//         pass
//           ? `Expected price not to be between ₹${minPrice} and ₹${maxPrice}`
//           : `Expected price to be between ₹${minPrice} and ₹${maxPrice}, but found ₹${actualPrice}`,
//     };
//   },
// });
//another example of custom matcher is toBeSuccessMessage() which checks if a string contains the word "success". This can be useful for validating success messages in your application.
// import { expect as baseExpect, test as baseTest } from '@playwright/test';
// export const expect = baseExpect.extend({
//   toBeSuccessMessage(received: string) {
//     const pass = received.toLowerCase().includes('success');
//     return {
//       pass,
//       message: () =>
//         `Expected "${received}" to be a success message`
//     };
//   }
// });
// export const test = baseTest;


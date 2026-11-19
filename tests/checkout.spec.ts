import { test, expect } from '../src/fixtures/test';
import { products } from '../src/data/products';
import { aCustomer } from '../src/data/customer';

test.describe('Cart and checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test('complete an order', {
    tag: ['@smoke', '@regression'],
    annotation: { type: 'TC', description: 'TC-4201' },
  }, async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.openCart();
    await cartPage.checkout();
    await checkoutPage.fillCustomer(aCustomer());
    await checkoutPage.finish();

    await checkoutPage.expectOrderComplete();
    await checkoutPage.header.expectCartCount(0);
  });

  test('checkout requires a first name', {
    tag: ['@negative', '@regression'],
    annotation: { type: 'TC', description: 'TC-4202' },
  }, async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.header.openCart();
    await cartPage.checkout();
    await checkoutPage.fillCustomer(aCustomer({ firstName: '' }));

    await expect(checkoutPage.error).toContainText('First Name is required');
    await checkoutPage.expectOpen();
  });

  test('order total equals item prices plus tax', {
    tag: ['@regression'],
    annotation: { type: 'TC', description: 'TC-4203' },
  }, async ({ inventoryPage, cartPage, checkoutPage }) => {
    const expectedPrices = [
      await inventoryPage.priceOf(products.backpack),
      await inventoryPage.priceOf(products.bikeLight),
    ];

    await inventoryPage.addToCart(products.backpack, products.bikeLight);
    await inventoryPage.header.openCart();
    await cartPage.checkout();
    await checkoutPage.fillCustomer(aCustomer());

    const summary = await checkoutPage.summary();
    const sum = (values: number[]) => Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100;

    expect(summary.itemPrices).toEqual(expectedPrices);
    expect(summary.subtotal).toBe(sum(expectedPrices));
    expect(summary.total).toBe(sum([summary.subtotal, summary.tax]));
  });

  test('remove a product from the cart', {
    tag: ['@regression'],
    annotation: { type: 'TC', description: 'TC-4204' },
  }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.openCart();
    await cartPage.remove(products.backpack);

    await cartPage.expectEmpty();
  });
});

import { test, expect } from '../src/fixtures/test';
import { products } from '../src/data/products';
import type { SortOption } from '../src/pages/InventoryPage';

test.describe('Product list', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test('products are listed after login', {
    tag: ['@smoke', '@regression'],
    annotation: { type: 'TC', description: 'TC-4101' },
  }, async ({ inventoryPage }) => {
    await inventoryPage.expectDisplayed();
    await expect(inventoryPage.items).toHaveCount(6);
  });

  const sortCases: { option: SortOption; label: string; by: 'name' | 'price'; order: 'asc' | 'desc' }[] = [
    { option: 'za', label: 'name Z to A', by: 'name', order: 'desc' },
    { option: 'lohi', label: 'price low to high', by: 'price', order: 'asc' },
    { option: 'hilo', label: 'price high to low', by: 'price', order: 'desc' },
  ];

  for (const sort of sortCases) {
    test(`sort products by ${sort.label}`, {
      tag: ['@regression'],
      annotation: { type: 'TC', description: 'TC-4102' },
    }, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(sort.option);
      await expect(inventoryPage.sortSelect).toHaveValue(sort.option);

      const read = () => (sort.by === 'price' ? inventoryPage.prices() : inventoryPage.names());
      const sorted = <T extends string | number>(values: T[]): T[] => {
        const copy = [...values].sort((a, b) =>
          typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b)),
        );
        return sort.order === 'desc' ? copy.reverse() : copy;
      };

      // The list re-renders after the change, so poll instead of reading once (no fixed waits)
      await expect
        .poll(async () => {
          const actual: Array<string | number> = await read();
          return JSON.stringify(actual) === JSON.stringify(sorted(actual));
        }, { message: `products should be sorted by ${sort.label}` })
        .toBe(true);
    });
  }

  test('adding and removing a product updates the cart badge', {
    tag: ['@regression'],
    annotation: { type: 'TC', description: 'TC-4103' },
  }, async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack, products.bikeLight);
    await inventoryPage.header.expectCartCount(2);

    await inventoryPage.removeButton(products.backpack).click();
    await inventoryPage.header.expectCartCount(1);
    await expect(inventoryPage.addButton(products.backpack)).toBeVisible();
  });

  test('product detail page shows the same name and price as the list', {
    tag: ['@regression'],
    annotation: { type: 'TC', description: 'TC-4104' },
  }, async ({ inventoryPage, productDetailPage }) => {
    const listPrice = await inventoryPage.priceOf(products.boltTShirt);

    await inventoryPage.openProduct(products.boltTShirt);

    await productDetailPage.expectOpen();
    await expect(productDetailPage.name).toHaveText(products.boltTShirt);
    expect(await productDetailPage.priceValue()).toBe(listPrice);
  });
});

import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { toPrice, toSlug } from '../data/products';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  addButton(productName: string): Locator {
    return this.page.getByTestId(`add-to-cart-${toSlug(productName)}`);
  }

  removeButton(productName: string): Locator {
    return this.page.getByTestId(`remove-${toSlug(productName)}`);
  }

  async expectDisplayed(): Promise<void> {
    await this.expectOpen();
    await expect(this.title).toHaveText('Products');
  }

  async addToCart(...productNames: string[]): Promise<void> {
    for (const name of productNames) {
      await this.addButton(name).click();
    }
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async openProduct(productName: string): Promise<void> {
    await this.itemNames.filter({ hasText: productName }).click();
  }

  async names(): Promise<string[]> {
    return (await this.itemNames.allInnerTexts()).map((t) => t.trim());
  }

  async prices(): Promise<number[]> {
    return (await this.itemPrices.allInnerTexts()).map(toPrice);
  }

  async priceOf(productName: string): Promise<number> {
    return toPrice(await this.item(productName).getByTestId('inventory-item-price').innerText());
  }
}

import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { toPrice } from '../data/products';

export class ProductDetailPage extends BasePage {
  protected readonly path = '/inventory-item.html';
  readonly name: Locator;
  readonly price: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.name = page.getByTestId('inventory-item-name');
    this.price = page.getByTestId('inventory-item-price');
    this.backButton = page.getByTestId('back-to-products');
  }

  /** The URL changes before the page re-renders, so also wait for a detail-only element */
  async expectOpen(): Promise<void> {
    await super.expectOpen();
    await expect(this.backButton).toBeVisible();
  }

  async priceValue(): Promise<number> {
    return toPrice(await this.price.innerText());
  }
}

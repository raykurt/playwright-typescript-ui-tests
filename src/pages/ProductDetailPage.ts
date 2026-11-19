import type { Locator, Page } from '@playwright/test';
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

  async priceValue(): Promise<number> {
    return toPrice(await this.price.innerText());
  }
}

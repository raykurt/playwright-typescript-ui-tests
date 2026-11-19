import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { toSlug } from '../data/products';

export class CartPage extends BasePage {
  protected readonly path = '/cart.html';
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async remove(productName: string): Promise<void> {
    await this.page.getByTestId(`remove-${toSlug(productName)}`).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async expectEmpty(): Promise<void> {
    await expect(this.items).toHaveCount(0);
    await this.header.expectCartCount(0);
  }
}

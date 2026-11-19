import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { Customer } from '../data/customer';
import { toPrice } from '../data/products';

/** Covers the three checkout steps: customer info, overview, complete. */
export class CheckoutPage extends BasePage {
  protected readonly path = '/checkout-step-one.html';
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly itemPrices: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillCustomer(customer: Customer): Promise<void> {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async summary(): Promise<{ itemPrices: number[]; subtotal: number; tax: number; total: number }> {
    return {
      itemPrices: (await this.itemPrices.allInnerTexts()).map(toPrice),
      subtotal: toPrice(await this.subtotal.innerText()),
      tax: toPrice(await this.tax.innerText()),
      total: toPrice(await this.total.innerText()),
    };
  }

  async expectOrderComplete(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}

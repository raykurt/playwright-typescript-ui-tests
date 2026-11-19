import { expect, type Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

/** Shared base: every page knows its path, can open itself and verify it is open. */
export abstract class BasePage {
  protected abstract readonly path: string;
  readonly header: HeaderComponent;

  constructor(protected readonly page: Page) {
    this.header = new HeaderComponent(page);
  }

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectOpen(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.path.replace(/[.?]/g, '\\$&')));
  }
}

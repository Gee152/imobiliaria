import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly header: Locator;
  readonly brandName: Locator;
  readonly creciBadge: Locator;
  readonly floatingWhatsApp: Locator;
  readonly floatingWhatsAppLink: Locator;
  readonly securitySection: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    // Use getByRole('banner') to target the page header without conflicting with Astro devtoolbar
    this.header = page.getByRole('banner');
    this.brandName = this.header.getByText('TATIANA CAVALCANTI', { exact: false });
    this.creciBadge = this.header.getByText('CRECI 8988', { exact: false });
    this.floatingWhatsApp = page.locator('#floating-whatsapp');
    this.floatingWhatsAppLink = this.floatingWhatsApp.locator('a[href*="wa.me"]');
    this.securitySection = page.locator('#seguranca');
    this.footer = page.getByRole('contentinfo');
  }

  async goto() {
    await this.page.goto('/');
    await this.header.waitFor({ state: 'visible' });
  }

  async expectHeaderVisible() {
    await expect(this.header).toBeVisible();
    await expect(this.brandName.first()).toBeVisible();
    await expect(this.creciBadge.first()).toBeVisible();
  }

  async expectFloatingWhatsAppVisible() {
    await expect(this.floatingWhatsApp).toBeVisible();
    await expect(this.floatingWhatsAppLink).toBeVisible();
    const href = await this.floatingWhatsAppLink.getAttribute('href');
    expect(href).toContain('5581997459932');
  }

  async clickNavLink(linkText: string) {
    const navLink = this.header.getByRole('link', { name: linkText, exact: true });
    await navLink.click();
  }
}

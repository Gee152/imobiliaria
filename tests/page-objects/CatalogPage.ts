import { type Page, type Locator, expect } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly section: Locator;
  readonly counterBadge: Locator;
  readonly propertyCards: Locator;

  // Modal elements
  readonly modal: Locator;
  readonly modalCloseBtn: Locator;
  readonly modalTitle: Locator;
  readonly modalPrice: Locator;
  readonly modalThumbnails: Locator;
  readonly modalMainImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.section = page.locator('#imoveis');
    this.counterBadge = this.section.locator('span').filter({ hasText: /imóve(l|is) disponível|imóveis disponíveis/i }).first();
    this.propertyCards = this.section.locator('.card-dynamic').filter({ hasText: /Ref:/ });

    this.modal = page.locator('div.fixed.inset-0.z-50');
    this.modalCloseBtn = this.modal.locator('button[aria-label="Fechar"]');
    this.modalTitle = this.modal.locator('h3.font-display');
    this.modalPrice = this.modal.locator('span.text-lg, span.text-2xl').filter({ hasText: /R\$/ });
    this.modalThumbnails = this.modal.locator('button img[alt="Miniatura"]');
    this.modalMainImage = this.modal.locator('div.relative.h-66 img, div.relative.aspect-\\[16\\/9\\] img').first();
  }

  async goto() {
    await this.page.goto('/#imoveis');
    await this.section.scrollIntoViewIfNeeded();
  }

  private isMobileViewport(): boolean {
    return (this.page.viewportSize()?.width ?? 1280) < 768;
  }

  private async openMobileDrawerIfNeeded() {
    if (this.isMobileViewport()) {
      const toggle = this.section.getByRole('button', { name: /Filtros/i });
      const drawerVisible = await this.section.locator('div.md\\:hidden.space-y-4').isVisible();
      if (!drawerVisible) {
        await toggle.click();
      }
    }
  }

  async filterByNeighborhood(neighborhood: string) {
    await this.openMobileDrawerIfNeeded();
    const select = this.section.locator('select').filter({ hasText: /Todos os bairros/i }).and(this.page.locator(':visible')).first();
    await select.waitFor({ state: 'visible' });
    await select.selectOption(neighborhood);
  }

  async filterByBedrooms(bedroomsValue: string) {
    await this.openMobileDrawerIfNeeded();
    const select = this.section.locator('select').filter({ hasText: /quartos/i }).and(this.page.locator(':visible')).first();
    await select.waitFor({ state: 'visible' });
    await select.selectOption(bedroomsValue);
  }

  async clearFilters() {
    const resetBtn = this.section.locator('button').filter({ hasText: /Restaurar filtros/i }).or(this.section.locator('button[title="Limpar filtros"]')).first();
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    }
  }

  async openFirstPropertyDetails() {
    const firstDetailBtn = this.propertyCards.first().getByRole('button', { name: /Ver detalhes/i });
    await firstDetailBtn.scrollIntoViewIfNeeded();
    await firstDetailBtn.click();
  }

  async expectModalVisible() {
    await expect(this.modal).toBeVisible();
    await expect(this.modalTitle).toBeVisible();
  }

  async closeModal() {
    await this.modalCloseBtn.click();
    await expect(this.modal).not.toBeVisible();
  }
}

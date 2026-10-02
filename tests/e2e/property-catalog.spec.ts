import { test, expect } from '@playwright/test';
import { CatalogPage } from '../page-objects/CatalogPage';

test.describe('Feature: Catálogo Interativo e Filtros de Imóveis (BDD: property-catalog.feature)', () => {
  let catalogPage: CatalogPage;

  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogPage(page);
    await catalogPage.goto();

    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          transition: none !important;
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      `
    });
  });

  test('Cenário: Visualização inicial do catálogo com contador de imóveis', async () => {
    await expect(catalogPage.counterBadge).toBeVisible();
    const count = await catalogPage.propertyCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Cenário: Filtragem por Bairro', async () => {
    // Act: Filter by "Casa Forte"
    await catalogPage.filterByNeighborhood('Casa Forte');

    // Assert
    const count = await catalogPage.propertyCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const cardText = await catalogPage.propertyCards.nth(i).textContent();
      expect(cardText).toContain('Casa Forte');
    }
  });

  test('Cenário: Filtragem por Quantidade Mínima de Quartos', async () => {
    // Act: Filter by "3" (3+ quartos)
    await catalogPage.filterByBedrooms('3');

    // Assert
    const count = await catalogPage.propertyCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const cardText = await catalogPage.propertyCards.nth(i).textContent();
      // Verify that every card displays 3 or 4+ qtos
      expect(cardText).toMatch(/[3-9]\s*qtos/i);
    }
  });

  test('Cenário: Abrir e Fechar Modal de Detalhes do Imóvel', async () => {
    // Arrange: Ensure catalog is loaded
    await expect(catalogPage.propertyCards.first()).toBeVisible();

    // Act 1: Open modal
    await catalogPage.openFirstPropertyDetails();

    // Assert 1: Modal is visible with specs
    await catalogPage.expectModalVisible();
    await expect(catalogPage.modalPrice).toBeVisible();

    // Act 2: Close modal
    await catalogPage.closeModal();
  });

  test('Cenário: Trocar de Imagem na Galeria do Modal', async () => {
    await catalogPage.openFirstPropertyDetails();
    await catalogPage.expectModalVisible();

    const thumbnailCount = await catalogPage.modalThumbnails.count();
    if (thumbnailCount > 1) {
      const initialSrc = await catalogPage.modalMainImage.getAttribute('src');
      
      // Click second thumbnail
      await catalogPage.modalThumbnails.nth(1).click();
      
      // Assert image src updated
      const newSrc = await catalogPage.modalMainImage.getAttribute('src');
      expect(newSrc).not.toBe(initialSrc);
    }
  });
});

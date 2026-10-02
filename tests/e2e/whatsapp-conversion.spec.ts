import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';

test.describe('Feature: Pontos de Conversão Direta via WhatsApp (BDD: whatsapp-conversion.feature)', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();

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

  test('Cenário: Botão Flutuante de WhatsApp Sempre Acessível', async ({ page }) => {
    // Assert floating element exists and is visible
    await homePage.expectFloatingWhatsAppVisible();

    // Check fixed position styling
    const floatingEl = page.locator('#floating-whatsapp');
    const isFixed = await floatingEl.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.position === 'fixed';
    });
    expect(isFixed).toBe(true);

    // Verify WhatsApp phone number in href
    const href = await homePage.floatingWhatsAppLink.getAttribute('href');
    expect(href).toMatch(/wa\.me\/5581997459932/);
  });

  test('Cenário: Botão de WhatsApp no Catálogo de Imóveis inclui detalhes do imóvel', async ({ page }) => {
    const catalogSection = page.locator('#imoveis');
    await catalogSection.scrollIntoViewIfNeeded();

    const firstPropertyWhatsAppBtn = catalogSection.locator('.card-dynamic a[href*="wa.me"]').first();
    await expect(firstPropertyWhatsAppBtn).toBeVisible();

    const href = (await firstPropertyWhatsAppBtn.getAttribute('href')) ?? '';
    expect(href).toContain('5581997459932');
    expect(decodeURIComponent(href)).toContain('Ref:');
  });

  test('Cenário: Botão de Ação Primária direciona para WhatsApp', async ({ page }) => {
    // Select the currently visible Hero WhatsApp CTA button
    const heroWhatsAppBtn = page.locator('a[href*="wa.me"]')
      .filter({ hasText: /Conversar com Tatiana|Falar no WhatsApp|Falar com Tatiana/i })
      .and(page.locator(':visible'))
      .first();

    await heroWhatsAppBtn.scrollIntoViewIfNeeded();
    await expect(heroWhatsAppBtn).toBeVisible();
    
    const href = await heroWhatsAppBtn.getAttribute('href');
    expect(href).toContain('5581997459932');
  });
});

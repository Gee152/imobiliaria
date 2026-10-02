import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';

test.describe('Feature: Identidade da Marca, Conformidade Legal (CRECI 8988) e Navegação (BDD: navigation-and-creci.feature)', () => {
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

  test('Cenário: Identidade Visual e Credencial CRECI 8988 no Topo', async () => {
    // Assert Header and Brand Name
    await homePage.expectHeaderVisible();

    // Assert CRECI 8988 is explicitly displayed in header
    const creciLocator = homePage.header.getByText('CRECI 8988').first();
    await expect(creciLocator).toBeVisible();

    // Assert Social Icons exist in Header
    const instagramHeaderLink = homePage.header.locator('a[aria-label="Instagram"]');
    const whatsappHeaderLink = homePage.header.locator('a[aria-label="WhatsApp"]');
    await expect(instagramHeaderLink).toBeVisible();
    await expect(whatsappHeaderLink).toBeVisible();
  });

  test('Cenário: Verificação da Seção de Segurança Jurídica e "Só é dono quem registra"', async ({ page }) => {
    // Check Brand Philosophy quote
    const philosophyQuote = page.locator('blockquote').filter({ hasText: /Só é dono quem registra/i });
    await philosophyQuote.scrollIntoViewIfNeeded();
    await expect(philosophyQuote).toBeVisible();

    // Check Purchase Security Checklist section (#seguranca)
    const securitySection = page.locator('#seguranca');
    await securitySection.scrollIntoViewIfNeeded();
    await expect(securitySection).toBeVisible();
    await expect(securitySection.getByText(/Documentação do Imóvel & Proprietários/i).first()).toBeVisible();
    await expect(securitySection.getByText(/Averbação no Cartório de Registro/i).first()).toBeVisible();
  });

  test('Cenário: Conformidade Legal no Rodapé (Footer)', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    await expect(footer).toBeVisible();
    await expect(footer.getByText('CRECI 8988').first()).toBeVisible();
    await expect(footer.getByText(/Tatiana Cavalcanti/i).first()).toBeVisible();
  });
});

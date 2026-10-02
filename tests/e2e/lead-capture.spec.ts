import { test, expect } from '@playwright/test';
import { LeadFormPage } from '../page-objects/LeadFormPage';

test.describe('Feature: Captação de Leads Consultivos (BDD: lead-capture.feature)', () => {
  let leadPage: LeadFormPage;

  test.beforeEach(async ({ page }) => {
    // Prevent real window.open popup from interrupting automated tests
    await page.addInitScript(() => {
      window.open = (url) => {
        (window as any).__lastOpenedUrl = url;
        return null;
      };
    });

    leadPage = new LeadFormPage(page);
    await leadPage.goto();

    // Disable CSS animations to guarantee instantaneous stability
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

  test('Cenário: Envio com sucesso do formulário com dados válidos', async ({ page }) => {
    // Arrange
    const testData = {
      name: 'Dr. Rodrigo Alencar',
      phone: '(81) 98877-6655',
      objective: 'Comprar para morar',
      neighborhood: 'Casa Forte',
      propertyType: 'Apartamento',
      priceRange: 'R$ 1 mi a R$ 2 milhões',
      message: 'Procuro apartamento com 4 quartos e varanda gourmet na Zona Norte.',
    };

    // Act
    await leadPage.fillForm(testData);
    await leadPage.submit();

    // Assert
    await leadPage.expectSuccess();
    
    // Check generated WhatsApp URL content
    const lastUrl = await page.evaluate(() => (window as any).__lastOpenedUrl);
    expect(lastUrl).toContain('5581997459932');
    expect(lastUrl).toContain(encodeURIComponent('Dr. Rodrigo Alencar'));
  });

  test('Cenário: Validação de campos obrigatórios não preenchidos', async ({ page }) => {
    // Arrange: Leave name empty
    await leadPage.phoneInput.fill('(81) 99999-8888');

    // Act
    await leadPage.submit();

    // Assert: Form remains active, success message is NOT visible
    await expect(leadPage.successHeading).not.toBeVisible();
    await expect(leadPage.nameInput).toBeVisible();

    // Browser HTML5 constraint validation check
    const isInvalid = await leadPage.nameInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Cenário: Realizar um novo envio após conclusão', async () => {
    // Arrange & Act 1: Submit form
    await leadPage.fillForm({
      name: 'Camila Vasconcelos',
      phone: '(81) 97766-5544',
    });
    await leadPage.submit();
    await leadPage.expectSuccess();

    // Act 2: Click "Novo envio"
    await leadPage.clickNewSubmission();

    // Assert
    await expect(leadPage.nameInput).toBeVisible();
    await expect(leadPage.submitButton).toBeVisible();
  });
});

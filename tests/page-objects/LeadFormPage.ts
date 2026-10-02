import { type Page, type Locator, expect } from '@playwright/test';

export class LeadFormPage {
  readonly page: Page;
  readonly section: Locator;
  readonly nameInput: Locator;
  readonly phoneInput: Locator;
  readonly objectiveSelect: Locator;
  readonly neighborhoodSelect: Locator;
  readonly propertyTypeSelect: Locator;
  readonly priceRangeSelect: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;
  readonly successHeading: Locator;
  readonly openWhatsAppButton: Locator;
  readonly newSubmissionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.section = page.locator('#contato');
    this.nameInput = this.section.locator('input[name="name"]');
    this.phoneInput = this.section.locator('input[name="phone"]');
    this.objectiveSelect = this.section.locator('select[name="objective"]');
    this.neighborhoodSelect = this.section.locator('select[name="neighborhood"]');
    this.propertyTypeSelect = this.section.locator('select[name="propertyType"]');
    this.priceRangeSelect = this.section.locator('select[name="priceRange"]');
    this.messageTextarea = this.section.locator('textarea[name="message"]');
    this.submitButton = this.section.locator('button[type="submit"]');
    this.successHeading = this.section.getByText('Solicitação enviada com sucesso!');
    this.openWhatsAppButton = this.section.getByRole('link', { name: /Abrir WhatsApp da Tatiana/i });
    this.newSubmissionButton = this.section.getByRole('button', { name: /Novo envio/i });
  }

  async goto() {
    await this.page.goto('/#contato');
    await this.section.scrollIntoViewIfNeeded();
    await this.nameInput.waitFor({ state: 'visible' });
  }

  async fillForm(data: {
    name: string;
    phone: string;
    objective?: string;
    neighborhood?: string;
    propertyType?: string;
    priceRange?: string;
    message?: string;
  }) {
    await this.nameInput.scrollIntoViewIfNeeded();
    await this.nameInput.fill(data.name);
    await this.phoneInput.fill(data.phone);

    if (data.objective) {
      await this.objectiveSelect.selectOption(data.objective);
    }
    if (data.neighborhood) {
      await this.neighborhoodSelect.selectOption(data.neighborhood);
    }
    if (data.propertyType) {
      await this.propertyTypeSelect.selectOption(data.propertyType);
    }
    if (data.priceRange) {
      await this.priceRangeSelect.selectOption(data.priceRange);
    }
    if (data.message) {
      await this.messageTextarea.fill(data.message);
    }
  }

  async submit() {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click({ force: true });
  }

  async expectSuccess() {
    await expect(this.successHeading).toBeVisible({ timeout: 10000 });
    await expect(this.openWhatsAppButton).toBeVisible();
    const href = await this.openWhatsAppButton.getAttribute('href');
    expect(href).toContain('5581997459932');
  }

  async clickNewSubmission() {
    await this.newSubmissionButton.click({ force: true });
    await expect(this.nameInput).toBeVisible();
  }
}

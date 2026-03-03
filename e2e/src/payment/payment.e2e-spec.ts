import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:8081";
const PAYMENT_URL = `${BASE_URL}/client/viewCook/payment/1?amount=150&cookFirstName=Marie&cookLastName=Dupont&startDate=15-06-2026&endDate=15-06-2026`;

const PAYMENT_TIMEOUT = 5_000;

test("le récapitulatif affiche le montant et le nom du cuisinier", async ({
  page,
}) => {
  await page.goto(PAYMENT_URL);

  await expect(page.getByTestId("order-amount")).toContainText("150", {
    timeout: PAYMENT_TIMEOUT,
  });
  await expect(page.getByTestId("order-cook")).toContainText("Marie Dupont", {
    timeout: PAYMENT_TIMEOUT,
  });
});

test("remplir le formulaire avec une carte valide affiche l'écran de confirmation", async ({
  page,
}) => {
  await page.goto(PAYMENT_URL);

  await page.getByTestId("card-number-input").fill("4242 4242 4242 4242");
  await page.getByTestId("expiry-input").fill("12/25");
  await page.getByTestId("cvv-input").fill("123");
  await page.getByTestId("pay-button").click();

  await expect(page.getByTestId("payment-success")).toBeVisible({
    timeout: PAYMENT_TIMEOUT,
  });
  await expect(page.getByTestId("go-home-button")).toBeVisible();
});

import { expect, test } from "@playwright/test";

test.describe("Novel Smith - 認証なしでのアクセス", () => {
  test("未認証ユーザーは自動的にログインページにリダイレクトされる", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await expect(page).toHaveURL("http://localhost:3000/login");
    await page.waitForLoadState("networkidle");
    await expect(
      page
        .locator("h1, div")
        .filter({ hasText: /^ログイン$/ })
        .first(),
    ).toBeVisible();
  });

  test("ログインページが正しく表示される", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.waitForLoadState("networkidle");
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^ログイン$/ })
        .first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button").filter({ hasText: /Google/ }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("xxxx@gmail.com")).toBeVisible();
    await expect(page.getByLabel("パスワード")).toBeVisible();
    await expect(
      page.getByRole("button").filter({ hasText: /^ログイン$/ }),
    ).toBeVisible();
    await expect(page.getByText("パスワードを忘れた方はこちら")).toBeVisible();
    await expect(page.getByText("アカウントを作成する")).toBeVisible();
  });

  test("サインアップページへのナビゲーション", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.waitForLoadState("networkidle");
    await page.getByText("アカウントを作成する").click();
    await expect(page).toHaveURL("http://localhost:3000/signup");
  });

  test("パスワードリセットページへのナビゲーション", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.waitForLoadState("networkidle");
    await page.getByText("パスワードを忘れた方はこちら").click();
    await expect(page).toHaveURL("http://localhost:3000/reset-password");
  });
});

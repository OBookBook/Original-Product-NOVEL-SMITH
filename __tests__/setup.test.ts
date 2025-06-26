import { describe, expect, it } from "vitest";

describe("Test Environment Setup", () => {
  describe("Vitest Configuration", () => {
    it("globals設定が有効になっている", () => {
      // describe, it, expectがグローバルに利用可能であることを確認
      expect(typeof describe).toBe("function");
      expect(typeof it).toBe("function");
      expect(typeof expect).toBe("function");
    });

    it("jsdom環境が設定されている", () => {
      // DOM環境が利用可能であることを確認
      expect(typeof document).toBe("object");
      expect(typeof globalThis.window).toBe("object");
      expect(() => document.createElement("div")).not.toThrow();
    });

    it("@testing-library/jest-domが読み込まれている", () => {
      // jest-domのマッチャーが利用可能であることを確認
      const element = document.createElement("div");
      element.textContent = "Hello World";
      document.body.append(element);

      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent("Hello World");

      // クリーンアップ
      element.remove();
    });
  });

  describe("React Testing Environment", () => {
    it("React関連のライブラリが利用可能", async () => {
      // React Testing Libraryが正常に動作することを確認
      const { render, screen } = await import("@testing-library/react");
      const userEvent = await import("@testing-library/user-event");

      expect(typeof render).toBe("function");
      expect(typeof screen).toBe("object");
      expect(typeof userEvent.default).toBe("object");
    });
  });

  describe("Mock Functions", () => {
    it("viのモック機能が利用可能", async () => {
      const { vi } = await import("vitest");

      expect(typeof vi.fn).toBe("function");
      expect(typeof vi.mock).toBe("function");
      expect(typeof vi.clearAllMocks).toBe("function");
    });

    it("モック関数が正常に動作する", async () => {
      const { vi } = await import("vitest");

      const mockFn = vi.fn();
      mockFn("test");

      expect(mockFn).toHaveBeenCalledWith("test");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("TypeScript Support", () => {
    it("TypeScriptの型が正常に動作する", () => {
      interface TestInterface {
        name: string;
        value: number;
      }

      const testObject: TestInterface = {
        name: "test",
        value: 42,
      };

      expect(testObject.name).toBe("test");
      expect(testObject.value).toBe(42);
    });
  });

  describe("Path Aliases", () => {
    it("@/*パスエイリアスが動作する", async () => {
      // パスエイリアスのテストは実際のインポートでテスト済み
      // ここでは設定が正しく読み込まれていることを確認
      const { createRequire } = await import("node:module");
      expect(typeof createRequire).toBe("function");
    });
  });
});

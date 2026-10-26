import { render, screen, fireEvent, renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

describe("LanguageContext & i18n", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to English (en) with ltr direction", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    });

    expect(result.current.language).toBe("en");
    expect(result.current.direction).toBe("ltr");
    expect(result.current.isRTL).toBe(false);
    expect(result.current.t.app.title).toBe("Simple Tasks");
  });

  it("switches to Arabic (ar) with rtl direction", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    });

    act(() => {
      result.current.setLanguage("ar");
    });

    expect(result.current.language).toBe("ar");
    expect(result.current.direction).toBe("rtl");
    expect(result.current.isRTL).toBe(true);
    expect(result.current.t.app.title).toBe("المهام البسيطة");
    expect(result.current.t.stats.totalTasks).toBe("إجمالي المهام");
  });

  it("formats dates according to selected language", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    });

    const isoDate = "2026-10-26T12:00:00.000Z";
    const enDate = result.current.formatDate(isoDate);
    expect(enDate).toContain("2026");

    act(() => {
      result.current.setLanguage("ar");
    });

    const arDate = result.current.formatDate(isoDate);
    expect(arDate).toBeDefined();
    expect(arDate.length).toBeGreaterThan(0);
  });

  it("LanguageSwitcher component switches language when buttons are clicked", () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const arBtn = screen.getByRole("button", { name: "عربي" });
    const enBtn = screen.getByRole("button", { name: "EN" });

    expect(enBtn).toHaveAttribute("aria-pressed", "true");
    expect(arBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(arBtn);

    expect(arBtn).toHaveAttribute("aria-pressed", "true");
    expect(enBtn).toHaveAttribute("aria-pressed", "false");
  });
});

import { effect, Injectable, signal } from "@angular/core";

export type ThemeType = "light" | "dark";

@Injectable({
  providedIn: "root",
})
export class Theme {
  private readonly STORAGE_KEY = "wt_theme";

  theme = signal<ThemeType>(
    (localStorage.getItem(this.STORAGE_KEY) as ThemeType) || "dark",
  );

  constructor() {
    effect(() => {
      const theme = this.theme();

      document.documentElement.classList.toggle("app-dark", theme === "dark");
      localStorage.setItem(this.STORAGE_KEY, theme);
    });
  }

  toggel() {
    this.theme.update((t) => (t === "dark" ? "light" : "dark"));
  }
}

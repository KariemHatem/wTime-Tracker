import { DOCUMENT, Injectable, effect, inject, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

export type Lang = "en" | "ar";

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  // Priv properties
  private translteService = inject(TranslateService);
  private document = inject(DOCUMENT);
  private readonly STORAGE_KEY = "lang";
  private readonly defaultLang: Lang = "ar";

  lang = signal<Lang>(
    (localStorage.getItem(this.STORAGE_KEY) as Lang) || this.defaultLang,
  );

  constructor() {
    effect(() => {
      const lang = this.lang();
      this.translteService.use(lang);
      this.document.documentElement.lang = lang;
      this.document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      this.document.body.dir = lang === "ar" ? "rtl" : "ltr";
      localStorage.setItem(this.STORAGE_KEY, lang);
    });
  }

  // Toggel
  toggel() {
    this.lang.update((l) => (l === "en" ? "ar" : "en"));
  }

  // Change Lang
  changeLang(language: Lang) {
    this.lang.set(language);
  }

  // Translate Key
  translate(key: string) {
    if (!key) return "";
    const translation = this.translteService.instant(key);
    return translation !== key ? translation : "";
  }

  get currentLang(): Lang {
    return this.lang();
  }
}

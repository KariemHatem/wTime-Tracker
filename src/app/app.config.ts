import { ApplicationConfig } from "@angular/core";
import { provideRouter, withHashLocation } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { providePrimeNG } from "primeng/config";
import Aura from "@primeng/themes/aura";
import { routes } from "./app.routes";
import { authInterceptor } from "./interceptors/auth.interceptor";
import { MessageService, ConfirmationService } from "primeng/api";
import { errorInterceptor } from "./interceptors/error-interceptor";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withInterceptors([errorInterceptor]),
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".app-dark",
        },
      },
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: "./assets/i18n/",
        suffix: ".json",
      }),
      fallbackLang: "en",
    }),
    MessageService,
    ConfirmationService,
  ],
};

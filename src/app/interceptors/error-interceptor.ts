import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { Toater } from "../services/toater";
import { LanguageService } from "../services/language-service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes("/assets/i18n/")) {
    return next(req);
  }

  const router = inject(Router);
  const toastServices = inject(Toater);
  const lang = inject(LanguageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        toastServices.errorToaster(`Client Error: ${error.error.message}`);
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            toastServices.errorToaster(
              lang.translate("TOAST.ERRORS.BAD_REQUEST"),
            );
            break;
          case 401:
            const hadToken = localStorage.getItem("wt_token") !== null;
            localStorage.removeItem("wt_token");
            localStorage.removeItem("wt_user");
            toastServices.errorToaster(
              hadToken
                ? lang.translate("TOAST.ERRORS.SESSION_EXPIRED")
                : lang.translate("TOAST.ERRORS.UNAUTHORIZED"),
            );

            router.navigate(["/login"]);
            break;
          case 403:
            lang.translate("TOAST.ERRORS.FORBIDDEN");
            break;
          case 404:
            toastServices.errorToaster(
              lang.translate("TOAST.ERRORS.NOT_FOUND"),
            );
            break;
          case 500:
            toastServices.errorToaster(
              lang.translate("TOAST.ERRORS.SERVER_ERROR"),
            );
            break;
          default:
            toastServices.errorToaster(
              `Server Error Code: ${error.status}\nMessage: ${error.message}`,
            );
        }
      }

      // Pass the error along to the subscribing component
      return throwError(() => error);
    }),
  );
};

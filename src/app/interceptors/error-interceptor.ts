import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { Toater } from "../services/toater";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastServices = inject(Toater);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        toastServices.errorToaster(`Client Error: ${error.error.message}`);
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            toastServices.errorToaster("Bad Request.");
            break;
          case 401:
            const hadToken = localStorage.getItem("wt_token") !== null;
            localStorage.removeItem("wt_token");
            localStorage.removeItem("wt_user");
            toastServices.errorToaster(
              hadToken
                ? "Your session has expired. Please log in again."
                : "Unauthorized! Please log in again.",
            );

            router.navigate(["/login"]);
            break;
          case 403:
            toastServices.errorToaster(
              "Forbidden! You do not have permission.",
            );
            break;
          case 404:
            toastServices.errorToaster("Resource not found.");
            break;
          case 500:
            toastServices.errorToaster(
              "Internal Server Error! Try again later.",
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

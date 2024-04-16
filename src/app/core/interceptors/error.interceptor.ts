import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, catchError } from 'rxjs';
import { AlertService } from '../services/alert.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const alert = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error.msg) {
        errorMessage = `Error code: ${error.status} Error: ${error.error.msg}`;
      } else {
        errorMessage = `Error al iniciar`;
      }

      console.log(error);

      alert.showAlertError(errorMessage);

      return EMPTY;
    }),
  );
};

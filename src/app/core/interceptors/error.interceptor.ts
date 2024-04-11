import { ErrorMessageComponent } from '@/components/error-message/error-message.component';
import { Dialog } from '@angular/cdk/dialog';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, catchError, finalize } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialog = inject(Dialog);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error.msg) {
        errorMessage = `Error code: ${error.status} Error: ${error.error.msg}`;
      } else {
        errorMessage = `Error code: ${error.status} , message: ${JSON.stringify(error.error.title)}`;
      }

      dialog.open(ErrorMessageComponent, {
        data: errorMessage,
        disableClose: true,
      });

      return EMPTY;
    }),
  );
};

import { Dialog } from '@angular/cdk/dialog';

export interface PageAdmin<T> {
  dialog: Dialog;

  openForm(value?: T): void;

  submitForm(value: any): void;

  submitUpdateForm(value: any): void;

  remove(value: T): void;
}

import { KeyValue } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formerror',
  standalone: true,
})
export class FormErrorPipe implements PipeTransform {
  transform(
    value: KeyValue<string, any>,
    val?: { minl?: number; regex?: string },
  ): string {
    const errorMessages: Record<string, string> = {
      required: 'Este campo es requerido',
      email: 'No es un email valido',
      minlength: `Requiere ${val?.minl} caracteres como minimo`,
    };

    return errorMessages[value.key];
  }
}

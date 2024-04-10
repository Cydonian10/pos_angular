import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysPassed',
  standalone: true,
})
export class DaysPassedPipe implements PipeTransform {
  transform(value: number, starDate: Date, endDate: Date): number {
    var milisegundosInicio = starDate.getTime();
    var milisegundosFin = endDate.getTime();

    var diferenciaMilisegundos = milisegundosFin - milisegundosInicio;
    var diasTranscurridos = diferenciaMilisegundos / (1000 * 60 * 60 * 24);

    return diasTranscurridos;
  }
}

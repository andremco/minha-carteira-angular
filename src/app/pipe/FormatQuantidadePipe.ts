import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatQuantidade'
})
export class FormatQuantidadePipe implements PipeTransform {
  transform(value?: number): string {
    if (value === null || value === undefined || isNaN(value)) return '';

    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8
    });
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatQuantidade'
})
export class FormatQuantidadePipe implements PipeTransform {
  transform(value?: number): string {
    if (value === null || value === undefined || isNaN(value)) return '';

    const formatted = value.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8
    });

    // Remove zeros à direita após a vírgula
    // Ex: 5,000000 → 5  |  2,100000 → 2,1
    const parts = formatted.split(',');
    if (parts.length === 2) {
      parts[1] = parts[1].replace(/0+$/, '');
      return parts[1] ? `${parts[0]},${parts[1]}` : parts[0];
    }

    return formatted;
  }
}

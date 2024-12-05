import {Component} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from 'ngx-toastr';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-base',
  template: '',
  standalone: true,
})
export class BaseComponent {
  constructor(public toastr: ToastrService) {
  }
  success(callback: Function = () => {}) {
    this.toastr.success('Registro salvo com sucesso!', '', {
      timeOut: 8000,
      enableHtml: true,
      closeButton: true,
      positionClass: 'toast-top-center'
    });
    callback();
  }
  error(errorResponse : HttpErrorResponse, callback: Function = () => {}){
    if (errorResponse?.error && errorResponse?.error.success === false &&
      errorResponse?.error.message.length > 0)
    {
      var messages = errorResponse?.error.message.join('<br>');
      this.toastr.error(messages, '', {
        timeOut: 8000,
        enableHtml: true,
        closeButton: true,
        positionClass: 'toast-top-center',
      });
      callback();
    }
  }
  onPrecoInicialBlur(formGroup: FormGroup, value : string){
    // Remove caracteres não numéricos, exceto vírgulas
    const numericValue = value.replace(/[^\d,]/g, '');

    // Substitui vírgulas por pontos para formatar como número
    const formattedValue = numericValue.replace(',', '.');

    // Atualiza o valor no FormControl
    const numeric = parseFloat(formattedValue) || 0;

    // Atualiza o valor no campo (exibindo o formato de moeda)
    formGroup.get('precoInicial')?.setValue(numeric.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }), { emitEvent: false });
  }
  converterRealToDouble(value: string): number {
    // Remove "R$", espaços e outros caracteres não numéricos
    const numericValue = value.replace(/[^\d,-]/g, '');

    // Substitui vírgula por ponto para adequar ao formato de número
    const formattedValue = numericValue.replace(',', '.');

    // Converte para número de ponto flutuante
    const doubleValue = parseFloat(formattedValue);

    return isNaN(doubleValue) ? 0 : doubleValue; // Retorna 0 se não for um número válido
  }
}

import {ChangeDetectorRef, Component} from '@angular/core';
import {ResponseApi} from "src/models/ResponseApi";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-base',
  template: '',
  standalone: true,
})
export class DialogBaseComponent {
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
}

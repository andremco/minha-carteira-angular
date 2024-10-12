import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel, MatError} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Setor} from "src/models/setor/Setor";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SetorService} from "src/services/SetorService";
import {SalvarSetor} from "src/models/setor/SalvarSetor";
import {CommonModule} from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import {HttpErrorResponse} from "@angular/common/http";
import {EditarSetor} from "../../../models/setor/EditarSetor";
import {ResponseApi} from "../../../models/ResponseApi";

@Component({
  selector: 'dialog-setor',
  templateUrl: 'dialog.setor.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatProgressSpinner, CommonModule, MatError, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSetorComponent implements OnInit{
  public setor: Setor = {}
  public setorForm: FormGroup = new FormGroup('');
  loading: boolean = false;
  ehEditar: boolean = false;
  constructor(
    private readonly ref: MatDialogRef<DialogSetorComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: any,
    private readonly service : SetorService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly toastr: ToastrService) {
    if (data && data.setor)
      this.setor = data.setor
    this.ehEditar = this.setor.id != undefined;
  }

  ngOnInit() {
    this.setorForm = new FormGroup({
      descricao: new FormControl(this.setor.descricao, [
        Validators.required,
        Validators.maxLength(60)
      ])
    })
  }

  get descricao() : AbstractControl<any, any> | null{
    return this.setorForm.get('descricao');
  }

  descricaoErrorMessage() : string {
    if (this.descricao?.hasError('required')) {
      return "Campo descrição é obrigatório";
    }
    if (this.descricao?.hasError('maxlength')) {
      return "Campo descrição é permitido até 60 caracteres";
    }
    return "";
  }

  salvar(){
    this.loading = true;
    var salvarReq : SalvarSetor = {
      descricao: this.descricao?.value
    }
    this.service.salvar(salvarReq).subscribe({
        next: (setor : ResponseApi<Setor>) => this.success(setor),
        error: (errorResponse : HttpErrorResponse) => this.error(errorResponse)
      }
    )
  }

  editar(){
    this.loading = true;
    var editarReq : EditarSetor = {
      id: this.setor.id,
      descricao: this.descricao?.value
    }
    this.service.editar(editarReq).subscribe({
        next: (setor : ResponseApi<Setor>) => this.success(setor),
        error: (errorResponse : HttpErrorResponse) => this.error(errorResponse)
      }
    )
  }

  success(setor : ResponseApi<Setor>) {
    this.loading = false;
    this.toastr.success('Registro salvo com sucesso!', '', {
      timeOut: 8000,
      enableHtml: true,
      closeButton: true,
      positionClass: 'toast-top-center'
    });
    this.ref.close();
    this.changeDetectorRef.detectChanges();
  }
  error(errorResponse : HttpErrorResponse){
    this.loading = false;
    if (errorResponse?.error && errorResponse?.error.success === false &&
      errorResponse?.error.message.length > 0)
    {
      var messages = errorResponse?.error.message.join('<br>');
      this.toastr.error(messages, '', {
        timeOut: 8000,
        enableHtml: true,
        closeButton: true,
        positionClass: 'toast-top-center'
      });
    }
    this.changeDetectorRef.detectChanges();
  }
}

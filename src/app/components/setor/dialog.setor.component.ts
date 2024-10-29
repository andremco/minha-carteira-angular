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
import {EditarSetor} from "src/models/setor/EditarSetor";
import {ResponseApi} from "src/models/ResponseApi";
import {MESSAGE} from "src/message/message"
import {DialogBaseComponent} from "../dialog.base.component";

@Component({
  selector: 'dialog-setor',
  templateUrl: 'dialog.setor.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatProgressSpinner, CommonModule, MatError, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSetorComponent extends DialogBaseComponent implements OnInit{
  setor: Setor = {};
  setorForm: FormGroup = new FormGroup('');
  loading: boolean = false;
  ehEditar: boolean = false;
  private carregarSetores: Function = (pagina:Number, tamanho:Number) => {};
  constructor(
    private readonly ref: MatDialogRef<DialogSetorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { setor: Setor, carregarSetores: Function},
    private readonly service : SetorService,
    private readonly cdr: ChangeDetectorRef,
    public override toastr: ToastrService) {
    super(toastr);
    if (data && data.setor)
      this.setor = data.setor
    if (data && data.carregarSetores != undefined)
      this.carregarSetores = data.carregarSetores
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
      return MESSAGE.OBRIGATORIO;
    }
    if (this.descricao?.hasError('maxlength')) {
      return MESSAGE.ATE_60_CHARS;
    }
    return MESSAGE.VAZIO;
  }

  updateDialogSuccess = ()=> {
    this.loading = false;
    this.carregarSetores(0, 10);
    this.ref.close();
    this.cdr.detectChanges();
  }
  updateDialogError = ()=> {
    this.loading = false;
    this.cdr.detectChanges();
  }

  salvar(){
    this.loading = true;
    var salvarReq : SalvarSetor = {
      descricao: this.descricao?.value
    }

    this.service.salvar(salvarReq).subscribe({
        next: (setor : ResponseApi<Setor>) => this.success(this.updateDialogSuccess),
        error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, this.updateDialogError)
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
        next: (setor : ResponseApi<Setor>) => this.success(this.updateDialogSuccess),
        error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, this.updateDialogError)
      }
    )
  }
}

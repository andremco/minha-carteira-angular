import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel, MatError} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Setor} from "src/app/models/setor/Setor";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SetorService} from "src/app/services/SetorService";
import {SalvarSetor} from "src/app/models/setor/SalvarSetor";
import {CommonModule} from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import {HttpErrorResponse} from "@angular/common/http";
import {EditarSetor} from "src/app/models/setor/EditarSetor";
import {ResponseApi} from "src/app/models/ResponseApi";
import {MESSAGE} from "src/app/message/message"
import {BaseComponent} from "src/app/components/base.component";
import {Dominio} from "../../../models/Dominio";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {DominioService} from "../../../services/DominioService";

@Component({
  selector: 'dialog-setor',
  templateUrl: 'dialog.setor.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatProgressSpinner, CommonModule, MatError, ReactiveFormsModule, MatOption, MatSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSetorComponent extends BaseComponent implements OnInit{
  private setor: Setor = {};
  public tipoAtivos? : Dominio[] = [];
  public loading: boolean = false;
  public ehEditar: boolean = false;
  private carregarSetores: Function = (pagina:Number, tamanho:Number) => {};
  constructor(
    private readonly ref: MatDialogRef<DialogSetorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { setor: Setor, carregarSetores: Function},
    private readonly service : SetorService,
    private readonly dominioService : DominioService,
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
    this.formGroup = new FormGroup({
      tipoAtivo: new FormControl(this.setor.tipoAtivo?.id, [
        Validators.required
      ]),
      descricao: new FormControl(this.setor.descricao, [
        Validators.required,
        Validators.maxLength(60)
      ])
    });
    this.carregarTipoAtivos();
  }

  get tipoAtivo() : AbstractControl<any, any> | null{
    return this.formGroup.get('tipoAtivo');
  }

  get descricao() : AbstractControl<any, any> | null{
    return this.formGroup.get('descricao');
  }

  tipoAtivoErrorMessage() : string {
    if (this.tipoAtivo?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    return MESSAGE.VAZIO;
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

  carregarTipoAtivos(){
    this.dominioService.get('tipoAtivos').subscribe({
      next: (response:ResponseApi<Dominio[]>) => {
        this.tipoAtivos = response.data;
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
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
      tipoAtivoId: this.tipoAtivo?.value,
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
      tipoAtivoId: this.tipoAtivo?.value,
      descricao: this.descricao?.value
    }
    this.service.editar(editarReq).subscribe({
        next: (setor : ResponseApi<Setor>) => this.success(this.updateDialogSuccess),
        error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, this.updateDialogError)
      }
    )
  }
}

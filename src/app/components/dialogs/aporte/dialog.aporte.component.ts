import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Aporte} from "src/app/models/aporte/Aporte";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {BaseComponent} from "src/app/components/base.component";
import {ToastrService} from "ngx-toastr";
import {TipoAtivoEnum} from "src/app/models/enums/TipoAtivoEnum";
import {MESSAGE} from "src/app/message/message";
import {ResponseApi} from "src/app/models/ResponseApi";
import {HttpErrorResponse} from "@angular/common/http";
import {AcaoService} from "src/app/services/AcaoService";
import {TituloPublicoService} from "src/app/services/TituloPublicoService";
import {Acao} from "src/app/models/acao/Acao";
import {Paginado} from "src/app/models/Paginado";
import {TituloPublico} from "src/app/models/titulo-publico/TituloPublico";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SalvarAporte} from "src/app/models/aporte/SalvarAporte";
import {AporteService} from "src/app/services/AporteService";

@Component({
  selector: 'dialog-aporte',
  templateUrl: 'dialog.aporte.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatOption, MatSelect, NgClass, NgIf, ReactiveFormsModule, MatError, NgForOf, NgxMatSelectSearchModule, MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAporteComponent extends BaseComponent implements OnInit{
  public aporte: Aporte = {
    quantidade : null,
    preco : null
  };
  public tipoAtivoId: TipoAtivoEnum = 1;
  public movimentacao: string = "c";
  public ehAcao: boolean = true;
  public ativoId?: number;
  public ativos? : any[] = [];
  public pesquisarAtivo: FormControl = new FormControl<String>('');
  public loading: boolean = false;
  constructor(private readonly acaoService : AcaoService,
              private readonly tituloPublicoService: TituloPublicoService,
              private readonly aporteService: AporteService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private readonly cdr: ChangeDetectorRef,
              private readonly ref: MatDialogRef<DialogAporteComponent>,
              public override toastr: ToastrService) {
    super(toastr);
    if (data && data.aporte)
      this.aporte = data.aporte
  }
  ngOnInit(): void {
    this.inicializarAtivoForm();
    this.ehAcao = this.tipoAtivoId == TipoAtivoEnum.Acao;
    this.pesquisarAtivo.valueChanges.subscribe(() => {
      this.filtrarAtivos()
    })
  }

  inicializarAtivoForm(): void{
    this.formGroup = new FormGroup({
      ativo: new FormControl(this.ativoId, [
        Validators.required
      ]),
      preco: new FormControl(this.aporte.preco, [
        Validators.required
      ]),
      quantidade: new FormControl(this.aporte.quantidade, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(1)
      ]),
    });
  }

  get ativo() : AbstractControl<any, any> | null{
    return this.formGroup.get('ativo');
  }

  get preco() : AbstractControl<any, any> | null{
    return this.formGroup.get('preco');
  }

  get quantidade() : AbstractControl<any, any> | null{
    return this.formGroup.get('quantidade');
  }

  ativoErrorMessage() : string {
    if (this.ativo?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    return MESSAGE.VAZIO;
  }

  precoErrorMessage() : string {
    if (this.preco?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    return MESSAGE.VAZIO;
  }

  quantidadeErrorMessage() : string {
    if (this.quantidade?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    if (this.quantidade?.hasError('pattern')) {
      return MESSAGE.SOMENTE_NUMEROS;
    }
    if (this.quantidade?.hasError('min')){
      return MESSAGE.VALOR_ACIMA_DE_1;
    }
    return MESSAGE.VAZIO;
  }

  onSelectChangeTipoAtivoId(event: MatSelectChange){
    this.ehAcao = (event.value == TipoAtivoEnum.Acao);
    this.ativos = [];
    this.ativoId = undefined;
    this.formGroup.get('ativo')?.setValue(undefined);
  }

  filtrarAtivos(){
    let ativo = this.pesquisarAtivo.value;
    if (ativo && ativo.length >= 5){
      if (this.ehAcao)
        this.carregarAcoes(ativo)
      else
        this.carregarTitulosPublico(ativo)
    }
  }

  carregarAcoes(razaoSocial: String){
    this.acaoService.filtrar(0, 10, razaoSocial).subscribe({
      next: (response:ResponseApi<Paginado<Acao>>) => {
        this.ativos = response.data?.itens;
        this.formGroup.get('ativo')?.setValue(undefined);
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  carregarTitulosPublico(descricao: String){
    this.tituloPublicoService.filtrar(0, 10, descricao).subscribe({
      next: (response:ResponseApi<Paginado<TituloPublico>>) => {
        this.ativos = response.data?.itens;
        this.formGroup.get('ativo')?.setValue(undefined);
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  salvar(){
    this.loading = true;
    if(this.formGroup.valid){
      var salvarReq: SalvarAporte = {
        preco: this.converterRealToDouble(this.preco?.value),
        quantidade: this.quantidade?.value,
        movimentacao: this.movimentacao
      }
      if (this.ehAcao)
        salvarReq.acaoId = this.ativo?.value
      else
        salvarReq.tituloPublicoId = this.ativo?.value
      console.log(salvarReq)
      var updateDialogSuccess = ()=>{
        this.loading = false;
        this.ref.close();
        this.cdr.detectChanges();
      }
      var updateDialogError = ()=>{
        this.loading = false;
        this.cdr.detectChanges();
      }
    }
  }
}

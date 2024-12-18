import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {CommonModule, NgClass, NgForOf, NgIf} from "@angular/common";
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
import {MovimentacaoEnum} from "src/app/models/enums/MovimentacaoEnum";
import {Aporte} from "src/app/models/aporte/Aporte";
import {TipoAtivoEnumPipe} from "src/app/pipe/TipoAtivoEnumPipe";
import {MovimentacaoEnumPipe} from "src/app/pipe/MovimentacaoEnumPipe";
import {EditarAporte} from "../../../models/aporte/EditarAporte";
import {PesquisarAporte} from "../../../models/aporte/PesquisarAporte";

@Component({
  selector: 'dialog-aporte',
  templateUrl: 'dialog.aporte.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatOption, MatSelect, NgClass, NgIf, ReactiveFormsModule, MatError, NgForOf, NgxMatSelectSearchModule, MatProgressSpinner, CommonModule, TipoAtivoEnumPipe, MovimentacaoEnumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAporteComponent extends BaseComponent implements OnInit{
  public aporte: Aporte = {};
  public tiposAtivos: TipoAtivoEnum[] = [
    TipoAtivoEnum.Acao,
    TipoAtivoEnum.TituloPublico
  ];
  public movimentacoes: MovimentacaoEnum[] = [
    MovimentacaoEnum.Compra,
    MovimentacaoEnum.Venda
  ];
  public tipoAtivo: TipoAtivoEnum = TipoAtivoEnum.Acao;
  public ativos? : any[] = [];
  public pesquisarAtivo: FormControl = new FormControl<String>('');
  public loading: boolean = false;
  public ehEditar: boolean = false;
  private carregarAportes: Function = (pagina:Number, tamanho:Number) => {};
  constructor(private readonly acaoService : AcaoService,
              private readonly tituloPublicoService: TituloPublicoService,
              private readonly aporteService: AporteService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private readonly cdr: ChangeDetectorRef,
              private readonly ref: MatDialogRef<DialogAporteComponent>,
              public override toastr: ToastrService) {
    super(toastr);
    if (data && data.aporte){
      this.aporte = data.aporte;
    }
    if (data && data.carregarAportes != undefined)
      this.carregarAportes = data.carregarAportes;
    this.ehEditar = this.aporte.id != undefined;
    if (this.aporte.acao){
      const {acao} = this.aporte;
      this.ativos?.push({ id: acao.id, razaoSocial: acao?.razaoSocial });
    }
    if (this.aporte.tituloPublico){
      this.tipoAtivo = TipoAtivoEnum.TituloPublico
      const {tituloPublico} = this.aporte;
      this.ativos?.push({ id: tituloPublico.id, descricao: tituloPublico?.descricao });
    }
  }
  ngOnInit(): void {
    this.inicializarAtivoForm();
    this.pesquisarAtivo.valueChanges.subscribe(() => {
      this.filtrarAtivos()
    })
  }

  inicializarAtivoForm(): void{
    this.formGroup = new FormGroup({
      tipoAtivo: new FormControl(this.tipoAtivo),
      movimentacao: new FormControl(this.movimentacao),
      ativo: new FormControl(this.tipoAtivo == TipoAtivoEnum.Acao ?
        this.aporte.acao?.id :
        this.aporte.tituloPublico?.id, [
        Validators.required
      ]),
      preco: new FormControl(this.aporte.preco, [
        Validators.required
      ]),
      quantidade: new FormControl(this.aporte.quantidade, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(1)
      ])
    });
    if (this.aporte.movimentacao)
      this.formGroup.get('movimentacao')?.setValue(
        this.aporte.movimentacao === "Compra" ?
                MovimentacaoEnum.Compra :
                MovimentacaoEnum.Venda
      );
    else
      this.formGroup.get('movimentacao')?.setValue(MovimentacaoEnum.Compra);
  }

  get ativo() : AbstractControl<any, any> | null{
    return this.formGroup.get('ativo');
  }

  get movimentacao() : AbstractControl<any, any> | null{
    return this.formGroup.get('movimentacao');
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
    this.tipoAtivo = (event.value == TipoAtivoEnum.Acao) ? TipoAtivoEnum.Acao : TipoAtivoEnum.TituloPublico;
    this.ativos = [];
    this.formGroup.get('ativo')?.setValue(undefined);
  }

  filtrarAtivos(){
    let ativo = this.pesquisarAtivo.value;
    if (ativo && ativo.length >= 5){
      if (this.tipoAtivo == TipoAtivoEnum.Acao)
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
        movimentacao: this.movimentacao?.value
      }
      if (this.tipoAtivo == TipoAtivoEnum.Acao)
        salvarReq.acaoId = this.ativo?.value
      else
        salvarReq.tituloPublicoId = this.ativo?.value
      this.aporteService.salvar(salvarReq).subscribe({
        next: () => this.success(this.updateDialogSuccess),
        error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, this.updateDialogError)
        }
      );
    }
  }

  editar(){
    this.loading = true;
    if(this.formGroup.valid){
      var editarReq: EditarAporte = {
        id: this.aporte.id,
        preco: this.converterRealToDouble(this.preco?.value),
        quantidade: this.quantidade?.value,
        movimentacao: this.movimentacao?.value
      }
      if (this.tipoAtivo == TipoAtivoEnum.Acao)
        editarReq.acaoId = this.ativo?.value
      else
        editarReq.tituloPublicoId = this.ativo?.value
      this.aporteService.editar(editarReq).subscribe({
          next: () => this.success(this.updateDialogSuccess),
          error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, this.updateDialogError)
        }
      );
    }
  }

  private updateDialogSuccess = ()=>{
    this.loading = false;
    this.carregarAportes(0,10);
    this.ref.close();
    this.cdr.detectChanges();
  }
  private updateDialogError = ()=>{
    this.loading = false;
    this.cdr.detectChanges();
  }

  protected readonly TipoAtivoEnum = TipoAtivoEnum;
}

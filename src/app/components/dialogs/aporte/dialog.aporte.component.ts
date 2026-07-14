import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {CommonModule, NgClass, NgForOf, NgIf} from "@angular/common";
import {BaseComponent} from "src/app/components/base.component";
import {ToastrService} from "ngx-toastr";
import {descricaoTotipoAtivoEnum, TipoAtivoEnum} from "src/app/models/enums/TipoAtivoEnum";
import {MESSAGE} from "src/app/message/message";
import {ResponseApi} from "src/app/models/ResponseApi";
import {HttpErrorResponse} from "@angular/common/http";
import {AcaoService} from "src/app/services/AcaoService";
import {TituloPublicoService} from "src/app/services/TituloPublicoService";
import {Acao} from "src/app/models/acao/Acao";
import {Paginado} from "src/app/models/Paginado";
import {TituloPublico} from "src/app/models/titulo-publico/TituloPublico";
import {Moeda} from "src/app/models/moeda/Moeda";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SalvarAporte} from "src/app/models/aporte/SalvarAporte";
import {AporteService} from "src/app/services/AporteService";
import {MovimentacaoEnum} from "src/app/models/enums/MovimentacaoEnum";
import {Aporte} from "src/app/models/aporte/Aporte";
import {MovimentacaoEnumPipe} from "src/app/pipe/MovimentacaoEnumPipe";
import {EditarAporte} from "src/app/models/aporte/EditarAporte";
import {Dominio} from "src/app/models/Dominio";
import {DominioService} from "src/app/services/DominioService";
import {numberToReal} from "src/app/util/number-to-real";
import {MoedaService} from "src/app/services/MoedaService";

@Component({
  selector: 'dialog-aporte',
  templateUrl: 'dialog.aporte.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatOption, MatSelect, NgClass, NgIf, ReactiveFormsModule, MatError, NgForOf, NgxMatSelectSearchModule, MatProgressSpinner, CommonModule, MovimentacaoEnumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAporteComponent extends BaseComponent implements OnInit{
  public aporte: Aporte = {};
  public tipoAtivos? : Dominio[] = [];
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
              private readonly dominioService : DominioService,
              private readonly tituloPublicoService: TituloPublicoService,
              private readonly moedaService: MoedaService,
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
      this.tipoAtivo = descricaoTotipoAtivoEnum(<string>acao?.setor?.tipoAtivo?.descricao);
      this.ativos?.push({ id: acao.id, razaoSocial: acao?.razaoSocial });
    }
    if (this.aporte.tituloPublico){
      this.tipoAtivo = TipoAtivoEnum.TituloPublico
      const {tituloPublico} = this.aporte;
      this.ativos?.push({ id: tituloPublico.id, descricao: tituloPublico?.descricao });
    }
    if (this.aporte.moeda){
      this.tipoAtivo = TipoAtivoEnum.Moeda
      const {moeda} = this.aporte;
      this.ativos?.push({ id: moeda.id, nome: moeda?.nome });
    }
  }
  ngOnInit(): void {
    this.inicializarAtivoForm();
    this.pesquisarAtivo.valueChanges.subscribe(() => {
      this.filtrarAtivos()
    });
    this.carregarTipoAtivos();
  }

  inicializarAtivoForm(): void{
    this.formGroup = new FormGroup({
      tipoAtivo: new FormControl(this.tipoAtivo),
      movimentacao: new FormControl(),
      ativo: new FormControl(this.ativos?.at(0), [
        Validators.required
      ]),
      preco: new FormControl(numberToReal(this.aporte.preco), [
        Validators.required
      ]),
      quantidade: new FormControl(
        this.formatQuantidadeParaExibicao(this.aporte.quantidade),
        [Validators.required, this.quantidadeValidator()]
      )
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
    if (this.quantidade?.hasError('quantidadeMoeda')) {
      return 'Informe um número válido';
    }
    if (this.quantidade?.hasError('quantidadeInteiro')) {
      return 'Informe um número válido';
    }
    return MESSAGE.VAZIO;
  }

    onSelectChangeTipoAtivoId(event: MatSelectChange){
    this.tipoAtivo = <TipoAtivoEnum>event.value;
    this.ativos = [];
    this.formGroup.get('ativo')?.setValue(undefined);
    // Revalida o campo quantidade pois a regra muda conforme o tipo de ativo
    this.formGroup.get('quantidade')?.updateValueAndValidity();
  }

  onSelectChangeAtivo(ativo : any){
    this.formGroup.get('preco')?.setValue(numberToReal(ativo.value.precoDinamico));
  }

  filtrarAtivos(){
    let ativo = this.pesquisarAtivo.value;
    if (ativo && ativo.length >= 5){
      if (this.tipoAtivo == TipoAtivoEnum.Acao || this.tipoAtivo == TipoAtivoEnum.BrazilianDepositaryReceipts || this.tipoAtivo == TipoAtivoEnum.FundoImobiliario)
        this.carregarAcoes(ativo, this.tipoAtivo)
      if (this.tipoAtivo == TipoAtivoEnum.TituloPublico)
        this.carregarTitulosPublico(ativo)
      if (this.tipoAtivo == TipoAtivoEnum.Moeda)
        this.carregarMoedas(ativo)
    }
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

  carregarAcoes(descricaoAtivo: String, tipoAtivoId?: TipoAtivoEnum){
    this.acaoService.filtrar(0, 10, tipoAtivoId, descricaoAtivo).subscribe({
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

  carregarMoedas(descricao: String){
    this.moedaService.filtrar(0, 10, descricao).subscribe({
      next: (response:ResponseApi<Paginado<Moeda>>) => {
        this.ativos = response.data?.itens;
        this.formGroup.get('ativo')?.setValue(undefined);
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    });    
  }

  salvar(){
    this.loading = true;
    if(this.formGroup.valid){
      var salvarReq: SalvarAporte = {
        preco: this.converterRealToDouble(this.preco?.value),
        quantidade: this.converterRealToDouble(this.quantidade?.value),
        movimentacao: this.movimentacao?.value
      }
      if(this.tipoAtivo == TipoAtivoEnum.Acao || this.tipoAtivo == TipoAtivoEnum.BrazilianDepositaryReceipts || this.tipoAtivo == TipoAtivoEnum.FundoImobiliario)
        salvarReq.acaoId = this.ativo?.value?.id;
      if (this.tipoAtivo == TipoAtivoEnum.TituloPublico)
        salvarReq.tituloPublicoId = this.ativo?.value?.id;
      if (this.tipoAtivo == TipoAtivoEnum.Moeda)
        salvarReq.moedaId = this.ativo?.value?.id;

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
      if (this.tipoAtivo == TipoAtivoEnum.TituloPublico)
        editarReq.tituloPublicoId = this.ativo?.value?.id;
      else
        editarReq.acaoId = this.ativo?.value?.id;
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

  /**
   * Formata um número para exibição no campo quantidade conforme o tipo de ativo.
   * Para Moeda: usa formato brasileiro com vírgula (ex: 0,00026)
   * Para demais ativos: exibe apenas o número inteiro
   */
  private formatQuantidadeParaExibicao(valor?: number): string {
    if (valor == null) return '';
    if (this.tipoAtivo === TipoAtivoEnum.Moeda) {
      return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 10
      });
    }
    // Para inteiros, remove qualquer fração
    return Math.floor(valor).toString();
  }

  /**
   * Validador customizado que verifica o formato da quantidade conforme o tipo de ativo:
   * - Moeda: aceita números decimais com vírgula (ex: 0,00026; 3,52; 6,5677)
   * - Demais ativos: aceita apenas números inteiros (sem casas decimais e sem vírgula)
   */
  private quantidadeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      let strValue = control.value.toString().trim();

      if (this.tipoAtivo === TipoAtivoEnum.Moeda) {
        const moedaPattern = /^\d+(\,\d+)?$/;
        return moedaPattern.test(strValue) ? null : { quantidadeMoeda: true };
      } else {
        const inteiroPattern = /^\d+$/;
        return inteiroPattern.test(strValue) ? null : { quantidadeInteiro: true };
      }
    };
  }

  /**
   * Manipula o evento blur do campo quantidade para formatar o valor corretamente:
   * - Remove caracteres inválidos
   * - Para Moeda: formata com vírgula como separador decimal
   * - Para demais ativos: mantém apenas dígitos (inteiro)
   */
  onQuantidadeInputBlur(value: string) {
    const cleaned = value.replace(/[^\d,]/g, '');

    if (this.tipoAtivo === TipoAtivoEnum.Moeda) {
      const normalized = cleaned.replace(',', '.');
      const numeric = parseFloat(normalized);
      if (!isNaN(numeric) && numeric > 0) {
        this.formGroup.get('quantidade')?.setValue(
          numeric.toLocaleString('pt-BR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 10
          })
        );
      }
    } else {
      const digitsOnly = cleaned.replace(/[^\d]/g, '');
      if (digitsOnly) {
        this.formGroup.get('quantidade')?.setValue(digitsOnly);
      }
    }
  }
}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatOption, MatSelect, MatSelectChange} from "@angular/material/select";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CommonModule} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AcaoService} from "src/app/services/AcaoService";
import {ResponseApi} from "src/app/models/ResponseApi";
import {Acao} from "src/app/models/acao/Acao";
import {HttpErrorResponse} from "@angular/common/http";
import {Dominio} from "src/app/models/Dominio";
import {DominioService} from "src/app/services/DominioService";
import {MESSAGE} from "src/app/message/message";
import {Ticker} from "src/app/models/Ticker";
import {TickerService} from "src/app/services/TickerService";
import {BaseComponent} from "src/app/components/base.component";
import {ToastrService} from "ngx-toastr";
import {EditarAcao} from "src/app/models/acao/EditarAcao";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {TituloPublicoService} from "src/app/services/TituloPublicoService";
import {TituloPublico} from "src/app/models/titulo-publico/TituloPublico";
import {EditarTituloPublico} from "src/app/models/titulo-publico/EditarTituloPublico";
import {TipoAtivoEnum} from "src/app/models/enums/TipoAtivoEnum";
import {numberToReal} from "../../../util/number-to-real";
import {numberToPercent} from "../../../util/number-to-percent";

@Component({
  selector: 'ativo',
  templateUrl: 'dialog.editar.ativo.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, MatInputModule, MatFormFieldModule, CommonModule, MatSlideToggle, ReactiveFormsModule, MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogEditarAtivoComponent extends BaseComponent implements OnInit {
  public comprar : boolean = false;
  public ativo? : any;
  public loading: boolean = false;
  public btnLoading: boolean = false;
  public tipoAtivos? : Dominio[] = [];
  public setores? : Dominio[] = [];
  private carregarAcoes: Function = () => {};
  private carregarTitulosPublico: Function = () => {};
  constructor(private readonly acaoService : AcaoService,
              private readonly tituloPublicoService: TituloPublicoService,
              private readonly dominioService : DominioService,
              private readonly tickerService : TickerService,
              private readonly cdr: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private readonly ref: MatDialogRef<DialogEditarAtivoComponent>,
              public override toastr: ToastrService) {
    super(toastr);
    this.ativo = data.ativo
    if (data && data.carregarAcoes != undefined)
      this.carregarAcoes = data.carregarAcoes;
    if (data && data.carregarTitulosPublico != undefined)
      this.carregarTitulosPublico = data.carregarTitulosPublico;
  }

  ngOnInit() {
    let tipoAtivo = this.data?.ativo?.setor?.tipoAtivo;
    if(tipoAtivo){
      let tipoAtivoEnum = <TipoAtivoEnum>tipoAtivo.id;
      this.carregarTipoAtivos(tipoAtivoEnum);
      this.carregarSetores(tipoAtivoEnum);
      if (tipoAtivoEnum != TipoAtivoEnum.TituloPublico)
        this.detalharAcao(this.ativo.id);
      else
        this.detalharTituloPublico(this.ativo.id);

      this.inicializarAtivoForm(tipoAtivoEnum);
    }
  }

  inicializarAtivoForm(tipoAtivo?: TipoAtivoEnum){
    if (tipoAtivo != TipoAtivoEnum.TituloPublico){
      this.formGroup = new FormGroup({
        tipoAtivo: new FormControl(this.ativo.setor?.tipoAtivo?.id, [
          Validators.required
        ]),
        setor: new FormControl(this.ativo.setor?.id, [
          Validators.required
        ]),
        nota: new FormControl(this.ativo.nota, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(0),
          Validators.max(10)
        ]),
        ticker: new FormControl(this.ativo.ticker, [
          Validators.required,
          Validators.maxLength(10)
        ]),
        razaoSocial: new FormControl(this.ativo.razaoSocial, [
          Validators.required,
          Validators.maxLength(100)
        ])
      });
      // Escuta mudanças no valor e transforma em maiúsculas
      this.formGroup.get('ticker')?.valueChanges.subscribe(value => {
        if (value !== value.toUpperCase()) {
          this.formGroup.get('ticker')?.setValue(value.toUpperCase(), { emitEvent: false });
        }
      });
    }
    else{
      this.formGroup = new FormGroup({
        tipoAtivo: new FormControl(this.ativo.setor?.tipoAtivo?.id, [
          Validators.required
        ]),
        setor: new FormControl(this.ativo.setor?.id, [
          Validators.required
        ]),
        precoInicial: new FormControl(numberToReal(this.ativo.precoInicial), [
          Validators.required
        ]),
        valorRendimento: new FormControl(numberToReal(this.ativo.valorRendimento), [
          Validators.required
        ]),
        nota: new FormControl(this.ativo.nota, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(0),
          Validators.max(10)
        ]),
        descricao: new FormControl(this.ativo.descricao, [
          Validators.required,
          Validators.maxLength(100)
        ])
      });
    }
    this.comprar = true;
  }

  get razaoSocial() : AbstractControl<any, any> | null{
    return this.formGroup.get('razaoSocial');
  }

  get descricao() : AbstractControl<any, any> | null{
    return this.formGroup.get('descricao');
  }

  get tipoAtivo() : AbstractControl<any, any> | null{
    return this.formGroup.get('tipoAtivo');
  }

  get setor() : AbstractControl<any, any> | null{
    return this.formGroup.get('setor');
  }

  get ticker() : AbstractControl<any, any> | null{
    return this.formGroup.get('ticker');
  }

  get precoInicial() : AbstractControl<any, any> | null{
    return this.formGroup.get('precoInicial');
  }

  get valorRendimento() : AbstractControl<any, any> | null{
    return this.formGroup.get('valorRendimento');
  }

  get nota() : AbstractControl<any, any> | null{
    return this.formGroup.get('nota');
  }

  onSelectChangeTipoAtivoId(event: MatSelectChange){
    this.setor?.setValue(undefined);
    this.carregarSetores(event.value);
  }

  buscarAcaoPorTicker(value: string){
    if (value && value.length >= 5){
      this.tickerService.obter(value).subscribe({
        next: (response:ResponseApi<Ticker>) => {
          this.formGroup.get('razaoSocial')?.setValue(response.data?.razaoSocial)
        },
        error: (errorResponse : HttpErrorResponse) => this.error(errorResponse)
      })
    }
    else
      this.formGroup.get('razaoSocial')?.setValue("")
  }

  carregarTipoAtivos(tipoAtivo? : TipoAtivoEnum){
    this.dominioService.get('tipoAtivos').subscribe({
      next: (response:ResponseApi<Dominio[]>) => {
        let tipoAtivos = response.data;
        if(tipoAtivos && tipoAtivos.length > 0 && tipoAtivo != TipoAtivoEnum.TituloPublico){
          this.tipoAtivos = tipoAtivos.filter(item => item.id !== TipoAtivoEnum.TituloPublico);
        }
        else
          this.tipoAtivos = response.data;
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  carregarSetores(tipoAtivo?: TipoAtivoEnum){
    let urlResource = tipoAtivo != undefined ? "setores/" + tipoAtivo.valueOf() : "setores";
    this.dominioService.get(urlResource).subscribe({
      next: (response:ResponseApi<Dominio[]>) => {
        this.setores = response.data;
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  detalharAcao(id: number){
    this.loading = true;
    this.acaoService.obter(id).subscribe({
      next: (response :ResponseApi<Acao>) => {
        this.ativo = response.data;
        this.comprar = response.data?.comprarOuAguardar === 'Comprar';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loading = false;
        console.log(errorResponse);
        this.cdr.detectChanges();
      }
    });
  }

  detalharTituloPublico(id: number){
    this.loading = true;
    this.tituloPublicoService.obter(id).subscribe({
      next: (response :ResponseApi<TituloPublico>) => {
        this.ativo = response.data;
        this.comprar = response.data?.comprarOuAguardar === 'Comprar';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loading = false;
        console.log(errorResponse);
        this.cdr.detectChanges();
      }
    });
  }

  editar(){
    this.btnLoading = true;
    if(this.formGroup.valid){
      var updateDialogSuccess = ()=> {
        this.btnLoading = false;
        if(this.tipoAtivo?.value != TipoAtivoEnum.TituloPublico)
          this.carregarAcoes();
        else
          this.carregarTitulosPublico();
        this.ref.close();
        this.cdr.detectChanges();
      }
      var updateDialogError = ()=> {
        this.btnLoading = false;
        this.cdr.detectChanges();
      }
      var editarReq: {}
      if(this.tipoAtivo?.value != TipoAtivoEnum.TituloPublico){
        editarReq = {
          id: this.ativo.id,
          razaoSocial: this.razaoSocial?.value,
          setorId: this.setor?.value,
          ticker: this.ticker?.value,
          nota: this.nota?.value
        }
        this.acaoService.editar(<EditarAcao>editarReq).subscribe({
            next: () => this.success(updateDialogSuccess),
            error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, updateDialogError)
          }
        );
      }
      else{
        editarReq = {
          id: this.ativo.id,
          descricao: this.descricao?.value,
          setorId: this.setor?.value,
          precoInicial: this.converterRealToDouble(this.precoInicial?.value),
          valorRendimento: this.converterRealToDouble(this.valorRendimento?.value),
          nota: this.nota?.value
        }
        this.tituloPublicoService.editar(<EditarTituloPublico>editarReq).subscribe({
            next: () => this.success(updateDialogSuccess),
            error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, updateDialogError)
          }
        );
      }
    }
  }

  tipoAtivoErrorMessage() : string {
    if (this.tipoAtivo?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    return MESSAGE.VAZIO;
  }

  razaoSocialErrorMessage() : string {
    if (this.razaoSocial?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    if (this.razaoSocial?.hasError('maxlength')) {
      return MESSAGE.ATE_100_CHARS;
    }
    return MESSAGE.VAZIO;
  }

  tickerErrorMessage() : string {
    if (this.ticker?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    if (this.ticker?.hasError('maxlength')) {
      return MESSAGE.ATE_10_CHARS;
    }
    return MESSAGE.VAZIO;
  }

  setorErrorMessage() : string {
    if (this.setor?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    return MESSAGE.VAZIO;
  }

  precoInicialErrorMessage() : string {
    if (this.precoInicial?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    return MESSAGE.VAZIO;
  }

  valorRendimentoErrorMessage() : string {
    if (this.valorRendimento?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    return MESSAGE.VAZIO;
  }

  notaErrorMessage() : string {
    if (this.nota?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    if (this.nota?.hasError('pattern') ||
      this.nota?.hasError('max') ||
      this.nota?.hasError('min') ) {
      return MESSAGE.VALOR_0_10;
    }
    return MESSAGE.VAZIO;
  }

  descricaoErrorMessage() : string {
    if (this.descricao?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    if (this.descricao?.hasError('maxlength')) {
      return MESSAGE.ATE_100_CHARS;
    }
    return MESSAGE.VAZIO;
  }

  protected readonly TipoAtivoEnum = TipoAtivoEnum;
  protected readonly doubleToReal = numberToReal;
  protected readonly numberToPercent = numberToPercent;
  protected readonly numberToReal = numberToReal;
}

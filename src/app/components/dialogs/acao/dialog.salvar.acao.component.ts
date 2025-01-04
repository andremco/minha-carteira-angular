import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect, MatSelectChange} from "@angular/material/select";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {Acao} from "src/app/models/acao/Acao";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {DominioService} from "src/app/services/DominioService";
import {ResponseApi} from "src/app/models/ResponseApi";
import {HttpErrorResponse} from "@angular/common/http";
import {Dominio} from "src/app/models/Dominio";
import {AcaoService} from "src/app/services/AcaoService";
import {BaseComponent} from "src/app/components/base.component";
import {ToastrService} from "ngx-toastr";
import {SalvarAcao} from "src/app/models/acao/SalvarAcao";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MESSAGE} from "src/app/message/message";
import {TickerService} from "src/app/services/TickerService";
import {Ticker} from "src/app/models/Ticker";
import {TipoAtivoEnum} from "src/app/models/enums/TipoAtivoEnum";
import {TipoAtivoEnumPipe} from "../../../pipe/TipoAtivoEnumPipe";

@Component({
  selector: 'salvar-acao',
  templateUrl: './dialog.salvar.acao.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, DatePipe, NgIf, MatSlideToggle, ReactiveFormsModule, NgForOf, MatError, MatProgressSpinner, TipoAtivoEnumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSalvarAcaoComponent extends BaseComponent implements OnInit {
  private acao: Acao = {};
  public loading: boolean = false;
  public tipoAtivos? : Dominio[] = [];
  public setores? : Dominio[] = [];
  private carregarAcoes: Function = (pagina:Number, tamanho:Number) => {};
  constructor(private readonly ref: MatDialogRef<DialogSalvarAcaoComponent>,
              private readonly dominioService : DominioService,
              private readonly acaoService : AcaoService,
              private readonly tickerService : TickerService,
              private readonly cdr: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) private data: { carregarAcoes: Function},
              public override toastr: ToastrService) {
    super(toastr);
    if (data && data.carregarAcoes != undefined)
      this.carregarAcoes = data.carregarAcoes;
  }

  ngOnInit(): void {
    this.inicializarAcaoForm();
    this.carregarTipoAtivos();
  }

  get tipoAtivo() : AbstractControl<any, any> | null{
    return this.formGroup.get('tipoAtivo');
  }

  get setor() : AbstractControl<any, any> | null{
    return this.formGroup.get('setor');
  }

  get nota() : AbstractControl<any, any> | null{
    return this.formGroup.get('nota');
  }

  get ticker() : AbstractControl<any, any> | null{
    return this.formGroup.get('ticker');
  }

  get razaoSocial() : AbstractControl<any, any> | null{
    return this.formGroup.get('razaoSocial');
  }

  inicializarAcaoForm(){
    this.formGroup = new FormGroup({
      tipoAtivo: new FormControl(this.acao.setor?.tipoAtivo?.id, [
        Validators.required
      ]),
      setor: new FormControl(this.acao.setor?.id, [
        Validators.required
      ]),
      nota: new FormControl(this.acao.nota, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(0),
        Validators.max(10)
      ]),
      ticker: new FormControl(this.acao.ticker, [
        Validators.required,
        Validators.maxLength(10)
      ]),
      razaoSocial: new FormControl(this.acao.razaoSocial, [
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

  onSelectChangeTipoAtivoId(event: MatSelectChange){
    this.setor?.setValue(undefined);
    this.carregarSetores(event.value);
  }

  carregarTipoAtivos(){
    this.dominioService.get('tipoAtivos').subscribe({
      next: (response:ResponseApi<Dominio[]>) => {
        let tipoAtivos = response.data;
        if(tipoAtivos && tipoAtivos.length > 0){
          this.tipoAtivos = tipoAtivos.filter(item => item.id !== TipoAtivoEnum.TituloPublico);
        }
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  carregarSetores(tipoAtivoId?: number){
    let urlResource = tipoAtivoId != undefined ? "setores/" + tipoAtivoId : "setores";
    this.dominioService.get(urlResource).subscribe({
      next: (response:ResponseApi<Dominio[]>) => {
        this.setores = response.data;
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  salvar(){
    this.loading = true;
    if(this.formGroup.valid){
      var salvarReq: SalvarAcao = {
        razaoSocial: this.razaoSocial?.value,
        setorId: this.setor?.value,
        ticker: this.ticker?.value,
        nota: this.nota?.value
      }
      var updateDialogSuccess = ()=>{
        this.loading = false;
        this.carregarAcoes(0, 10);
        this.ref.close();
        this.cdr.detectChanges();
      }
      var updateDialogError = ()=>{
        this.loading = false;
        this.cdr.detectChanges();
      }
      this.acaoService.salvar(salvarReq).subscribe({
          next: () => this.success(updateDialogSuccess),
          error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, updateDialogError)
        }
      );
    }
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

  tipoAtivoErrorMessage() : string {
    if (this.tipoAtivo?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    return MESSAGE.VAZIO;
  }

  setorErrorMessage() : string {
    if (this.setor?.hasError('required')) {
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

  tickerErrorMessage() : string {
    if (this.ticker?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    if (this.ticker?.hasError('maxlength')) {
      return MESSAGE.ATE_10_CHARS;
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
}

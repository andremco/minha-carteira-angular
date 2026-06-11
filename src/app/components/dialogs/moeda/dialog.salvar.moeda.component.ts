import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect, MatSelectChange} from "@angular/material/select";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {Moeda} from "src/app/models/moeda/Moeda";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {DominioService} from "src/app/services/DominioService";
import {ResponseApi} from "src/app/models/ResponseApi";
import {HttpErrorResponse} from "@angular/common/http";
import {Dominio} from "src/app/models/Dominio";
import {MoedaService} from "src/app/services/MoedaService";
import {BaseComponent} from "src/app/components/base.component";
import {ToastrService} from "ngx-toastr";
import {SalvarMoeda} from "src/app/models/moeda/SalvarMoeda";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MESSAGE} from "src/app/message/message";
import {TipoAtivoEnum} from "src/app/models/enums/TipoAtivoEnum";

@Component({
  selector: 'salvar-moeda',
  templateUrl: './dialog.salvar.moeda.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, DatePipe, NgIf, MatSlideToggle, ReactiveFormsModule, NgForOf, MatError, MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSalvarMoedaComponent extends BaseComponent implements OnInit {
  private moeda: Moeda = {};
  public loading: boolean = false;
  public tipoAtivos? : Dominio[] = [];
  private carregarMoedas: Function = (pagina:Number, tamanho:Number) => {};
  constructor(private readonly ref: MatDialogRef<DialogSalvarMoedaComponent>,
              private readonly dominioService : DominioService,
              private readonly moedaService : MoedaService,
              private readonly cdr: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) private data: { carregarMoedas: Function},
              public override toastr: ToastrService) {
    super(toastr);
    if (data && data.carregarMoedas != undefined)
      this.carregarMoedas = data.carregarMoedas;
  }

  ngOnInit(): void {
    this.inicializarMoedaForm();
    this.carregarTipoAtivos();
  }

  get tipoAtivo() : AbstractControl<any, any> | null{
    return this.formGroup.get('tipoAtivo');
  }

  get nome() : AbstractControl<any, any> | null{
    return this.formGroup.get('nome');
  }

  get codigo() : AbstractControl<any, any> | null{
    return this.formGroup.get('codigo');
  }

  get nota() : AbstractControl<any, any> | null{
    return this.formGroup.get('nota');
  }

  get quantidade() : AbstractControl<any, any> | null{
    return this.formGroup.get('quantidade');
  }

  inicializarMoedaForm(){
    this.formGroup = new FormGroup({
      tipoAtivo: new FormControl(TipoAtivoEnum.Moeda, [
        Validators.required
      ]),
      nome: new FormControl(this.moeda.nome, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      codigo: new FormControl(this.moeda.codigo, [
        Validators.required,
        Validators.maxLength(10)
      ]),
      nota: new FormControl(this.moeda.nota, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(0),
        Validators.max(10)
      ]),
      quantidade: new FormControl(this.moeda.quantidade, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(0)
      ])
    });
    // Escuta mudanças no valor e transforma em maiúsculas
    this.formGroup.get('codigo')?.valueChanges.subscribe(value => {
      if (value !== value.toUpperCase()) {
        this.formGroup.get('codigo')?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });
  }

  carregarTipoAtivos(){
    this.dominioService.get('tipoAtivos').subscribe({
      next: (response:ResponseApi<Dominio[]>) => {
        let tipoAtivos = response.data;
        if(tipoAtivos && tipoAtivos.length > 0){
          this.tipoAtivos = tipoAtivos.filter(item => item.id === TipoAtivoEnum.Moeda);
        }
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  salvar(){
    this.loading = true;
    if(this.formGroup.valid){
      var salvarReq: SalvarMoeda = {
        nome: this.nome?.value,
        codigo: this.codigo?.value,
        nota: this.nota?.value,
        quantidade: this.quantidade?.value
      }
      var updateDialogSuccess = ()=>{
        this.loading = false;
        this.carregarMoedas(0, 10);
        this.ref.close();
        this.cdr.detectChanges();
      }
      var updateDialogError = ()=>{
        this.loading = false;
        this.cdr.detectChanges();
      }
      this.moedaService.salvar(salvarReq).subscribe({
          next: () => this.success(updateDialogSuccess),
          error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, updateDialogError)
        }
      );
    }
  }

  tipoAtivoErrorMessage() : string {
    if (this.tipoAtivo?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    return MESSAGE.VAZIO;
  }

  nomeErrorMessage() : string {
    if (this.nome?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    if (this.nome?.hasError('maxlength')) {
      return MESSAGE.ATE_100_CHARS;
    }
    return MESSAGE.VAZIO;
  }

  codigoErrorMessage() : string {
    if (this.codigo?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    if (this.codigo?.hasError('maxlength')) {
      return MESSAGE.ATE_10_CHARS;
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

  quantidadeErrorMessage() : string {
    if (this.quantidade?.hasError('required')) {
      return MESSAGE.OBRIGATORIO;
    }
    if (this.quantidade?.hasError('pattern') ||
      this.quantidade?.hasError('min')) {
      return MESSAGE.SOMENTE_NUMEROS;
    }
    return MESSAGE.VAZIO;
  }
}

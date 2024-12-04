import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from "@angular/common";
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

@Component({
  selector: 'ativo',
  templateUrl: 'dialog.editar.ativo.component.html',
  styleUrls: ['./dialog.editar.ativo.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, MatInputModule, MatFormFieldModule, CommonModule, MatSlideToggle, ReactiveFormsModule, MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogEditarAtivoComponent extends BaseComponent implements OnInit {
  public comprar : boolean = false;
  public ativo? : any;
  public ehAcao? : boolean;
  public loading: boolean = false;
  public btnLoading: boolean = false;
  public ativoForm: FormGroup = new FormGroup('');
  public categorias? : Dominio[] = [];
  public setores? : Dominio[] = [];
  private carregarAcoes: Function = (pagina:Number, tamanho:Number) => {};
  constructor(private readonly service : AcaoService,
              private readonly dominioService : DominioService,
              private readonly tickerService : TickerService,
              private readonly cdr: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private readonly ref: MatDialogRef<DialogEditarAtivoComponent>,
              public override toastr: ToastrService) {
    super(toastr);
    this.ativo = data.ativo
    this.ehAcao = (data.ativo && data.ativo.categoria)
    if (data && data.carregarAcoes != undefined)
      this.carregarAcoes = data.carregarAcoes
  }

  ngOnInit() {
    this.inicializarAtivoForm();
    this.carregarCategorias();
    this.carregarSetores();
    this.detalharAcao(this.ativo.id);
  }

  inicializarAtivoForm(){
    if (this.ehAcao){
      this.ativoForm = new FormGroup({
        categoria: new FormControl(this.ativo.categoria?.id, [
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
      this.ativoForm.get('ticker')?.valueChanges.subscribe(value => {
        if (value !== value.toUpperCase()) {
          this.ativoForm.get('ticker')?.setValue(value.toUpperCase(), { emitEvent: false });
        }
      });
      this.comprar = true;
    }
  }

  get razaoSocial() : AbstractControl<any, any> | null{
    return this.ativoForm.get('razaoSocial');
  }

  get categoria() : AbstractControl<any, any> | null{
    return this.ativoForm.get('categoria');
  }

  get setor() : AbstractControl<any, any> | null{
    return this.ativoForm.get('setor');
  }

  get descricao() : AbstractControl<any, any> | null{
    return this.ativoForm.get('descricao');
  }

  get ticker() : AbstractControl<any, any> | null{
    return this.ativoForm.get('ticker');
  }

  get nota() : AbstractControl<any, any> | null{
    return this.ativoForm.get('nota');
  }

  buscarAcaoPorTicker(value: string){
    if (value && value.length >= 5){
      this.tickerService.obter(value).subscribe({
        next: (response:ResponseApi<Ticker>) => {
          this.ativoForm.get('razaoSocial')?.setValue(response.data?.razaoSocial)
        },
        error: (errorResponse : HttpErrorResponse) => this.error(errorResponse)
      })
    }
    else
      this.ativoForm.get('razaoSocial')?.setValue("")
  }

  carregarCategorias(){
    this.dominioService.get('categorias').subscribe({
      next: (response:ResponseApi<Dominio[]>) => {
        this.categorias = response.data;
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  carregarSetores(){
    this.dominioService.get('setores').subscribe({
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
    this.service.obter(id).subscribe({
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

  editar(){
    this.btnLoading = true;
    if(this.ativoForm.valid){
      var editarReq: EditarAcao = {
        id: this.ativo.id,
        razaoSocial: this.razaoSocial?.value,
        setorId: this.setor?.value,
        categoriaId: this.categoria?.value,
        ticker: this.ticker?.value,
        nota: this.nota?.value
      }
      var updateDialogSuccess = ()=>{
        this.btnLoading = false;
        this.carregarAcoes(0, 10);
        this.ref.close();
        this.cdr.detectChanges();
      }
      var updateDialogError = ()=>{
        this.btnLoading = false;
        this.cdr.detectChanges();
      }
      this.service.editar(editarReq).subscribe({
          next: () => this.success(updateDialogSuccess),
          error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, updateDialogError)
        }
      );
    }
  }

  categoriaErrorMessage() : string {
    if (this.categoria?.hasError('required')) {
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

  formatarPorcento(valor : number) : String {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor) + "%"
  }

  detalharTituloPublico(id: number){
  }

}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {Acao} from "src/models/acao/Acao";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {DominioService} from "src/services/DominioService";
import {ResponseApi} from "src/models/ResponseApi";
import {HttpErrorResponse} from "@angular/common/http";
import {Dominio} from "src/models/Dominio";
import {Categoria} from "src/models/acao/Categoria";
import {AcaoService} from "src/services/AcaoService";
import {DialogBaseComponent} from "../dialog.base.component";
import {ToastrService} from "ngx-toastr";
import {SalvarAcao} from "src/models/acao/SalvarAcao";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MESSAGE} from "src/message/message";

@Component({
  selector: 'salvar-acao',
  templateUrl: 'dialog.salvar.acao.component.html',
  styleUrls: ['./dialog.salvar.acao.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, DatePipe, NgIf, MatSlideToggle, ReactiveFormsModule, NgForOf, MatError, MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSalvarAcaoComponent extends DialogBaseComponent implements OnInit {
  acao: Acao = {
    categoriaId: Categoria.Acao.valueOf()
  };
  acaoForm: FormGroup = new FormGroup('');
  loading: boolean = false;
  categorias? : Dominio[] = [];
  setores? : Dominio[] = [];
  private carregarAcoes: Function = (pagina:Number, tamanho:Number) => {};
  constructor(private readonly ref: MatDialogRef<DialogSalvarAcaoComponent>,
              private readonly dominioService : DominioService,
              private readonly acaoService : AcaoService,
              private readonly cdr: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) private data: { carregarAcoes: Function},
              public override toastr: ToastrService) {
    super(toastr);
    if (data && data.carregarAcoes != undefined)
      this.carregarAcoes = data.carregarAcoes
  }

  ngOnInit(): void {
    this.acaoForm = new FormGroup({
      categoria: new FormControl(this.acao.categoriaId, [
        Validators.required
      ]),
      setor: new FormControl(this.acao.setorId, [
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
    })
    this.carregarCategorias();
    this.carregarSetores();
  }

  get categoria() : AbstractControl<any, any> | null{
    return this.acaoForm.get('categoria');
  }

  get setor() : AbstractControl<any, any> | null{
    return this.acaoForm.get('setor');
  }

  get nota() : AbstractControl<any, any> | null{
    return this.acaoForm.get('nota');
  }

  get ticker() : AbstractControl<any, any> | null{
    return this.acaoForm.get('ticker');
  }

  get razaoSocial() : AbstractControl<any, any> | null{
    return this.acaoForm.get('razaoSocial');
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

  salvar(){
    this.loading = true;
    if(this.acaoForm.valid){
      var salvarReq: SalvarAcao = {
        razaoSocial: this.razaoSocial?.value,
        setorId: this.setor?.value,
        categoriaId: this.categoria?.value,
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

  categoriaErrorMessage() : string {
    if (this.categoria?.hasError('required')) {
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

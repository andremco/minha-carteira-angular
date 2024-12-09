import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {TituloPublico} from "src/app/models/titulo-publico/TituloPublico";
import {Dominio} from "src/app/models/Dominio";
import {DominioService} from "src/app/services/DominioService";
import {TituloPublicoService} from "src/app/services/TituloPublicoService";
import {ToastrService} from "ngx-toastr";
import {BaseComponent} from "src/app/components/base.component";
import {ResponseApi} from "src/app/models/ResponseApi";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MESSAGE} from "src/app/message/message";
import {SalvarTituloPublico} from "src/app/models/titulo-publico/SalvarTituloPublico";

@Component({
  selector: 'salvar-titulo-publico',
  templateUrl: 'dialog.salvar.titulo-publico.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, DatePipe, NgIf, MatSlideToggle, ReactiveFormsModule, NgForOf, MatError, MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSalvarTituloPublicoComponent extends BaseComponent implements OnInit {
  tituloPublico : TituloPublico = {};
  public setorId? : number;
  loading: boolean = false;
  setores? : Dominio[] = [];
  private carregarTitulosPublico: Function = (pagina:Number, tamanho:Number) => {};
  constructor(private readonly ref: MatDialogRef<DialogSalvarTituloPublicoComponent>,
              private readonly dominioService : DominioService,
              private readonly tituloPublicoService : TituloPublicoService,
              private readonly cdr: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: { carregarTitulosPublico: Function},
              public override toastr: ToastrService) {
    super(toastr);
    if (data && data.carregarTitulosPublico != undefined)
      this.carregarTitulosPublico = data.carregarTitulosPublico;
  }

  ngOnInit(): void {
    this.inicializarTituloForm();
    this.carregarSetores();
  }

  inicializarTituloForm(){
    this.formGroup = new FormGroup({
      setor: new FormControl(this.tituloPublico.setor?.id, [
        Validators.required
      ]),
      precoInicial: new FormControl(this.tituloPublico.precoInicial, [
        Validators.required
      ]),
      nota: new FormControl(this.tituloPublico.nota, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(0),
        Validators.max(10)
      ]),
      descricao: new FormControl(this.tituloPublico.descricao, [
        Validators.required,
        Validators.maxLength(100)
      ])
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
    if(this.formGroup.valid){
      var salvarReq: SalvarTituloPublico = {
        descricao: this.descricao?.value,
        setorId: this.setor?.value,
        precoInicial: this.converterRealToDouble(this.precoInicial?.value),
        nota: this.nota?.value
      }
      var updateDialogSuccess = ()=>{
        this.loading = false;
        this.carregarTitulosPublico(0, 10);
        this.ref.close();
        this.cdr.detectChanges();
      }
      var updateDialogError = ()=>{
        this.loading = false;
        this.cdr.detectChanges();
      }
      this.tituloPublicoService.salvar(salvarReq).subscribe({
          next: () => this.success(updateDialogSuccess),
          error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, updateDialogError)
        }
      );
    }
  }

  get setor() : AbstractControl<any, any> | null{
    return this.formGroup.get('setor');
  }

  get precoInicial() : AbstractControl<any, any> | null{
    return this.formGroup.get('precoInicial');
  }

  get nota() : AbstractControl<any, any> | null{
    return this.formGroup.get('nota');
  }

  get descricao() : AbstractControl<any, any> | null{
    return this.formGroup.get('descricao');
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
}

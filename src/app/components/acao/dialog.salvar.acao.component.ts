import {ChangeDetectionStrategy, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
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
import {Categoria} from "../../../models/acao/Categoria";

@Component({
  selector: 'salvar-acao',
  templateUrl: 'dialog.salvar.acao.component.html',
  styleUrls: ['./dialog.salvar.acao.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, DatePipe, NgIf, MatSlideToggle, ReactiveFormsModule, NgForOf, MatError],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSalvarAcaoComponent implements OnInit {
  acao: Acao = {
    categoria: Categoria.Acao
  };
  acaoForm: FormGroup = new FormGroup('');
  loading: boolean = false;
  categorias? : Dominio[] = [];
  setores? : Dominio[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service : DominioService) {
  }

  ngOnInit(): void {
    this.acaoForm = new FormGroup({
      categoria: new FormControl(this.acao.categoria, [
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
    this.service.get('categorias').subscribe({
      next: (response:ResponseApi<Dominio[]>) => {
        this.categorias = response.data;
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  carregarSetores(){
    this.service.get('setores').subscribe({
      next: (response:ResponseApi<Dominio[]>) => {
        this.setores = response.data;
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  categoriaErrorMessage() : string {
    if (this.categoria?.hasError('required')) {
      return "Obrigatório";
    }
    return "";
  }

  setorErrorMessage() : string {
    if (this.setor?.hasError('required')) {
      return "Obrigatório";
    }
    return "";
  }

  notaErrorMessage() : string {
    if (this.nota?.hasError('required')) {
      return "Obrigatório";
    }
    if (this.nota?.hasError('pattern') ||
      this.nota?.hasError('max') ||
      this.nota?.hasError('min') ) {
      return "Valor de 0 a 10";
    }
    return "";
  }

  tickerErrorMessage() : string {
    if (this.ticker?.hasError('required')) {
      return "Obrigatório";
    }
    if (this.ticker?.hasError('maxlength')) {
      return "Até 10 caracteres";
    }
    return "";
  }

  razaoSocialErrorMessage() : string {
    if (this.razaoSocial?.hasError('required')) {
      return "Obrigatório";
    }
    if (this.razaoSocial?.hasError('maxlength')) {
      return "Até 100 caracteres";
    }
    return "";
  }
}

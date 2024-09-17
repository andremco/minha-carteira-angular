import {ChangeDetectionStrategy, Component, Inject, OnInit} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogModule,
  MatDialogTitle
} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'dialog-excluir-entidade',
  templateUrl: 'dialog.excluir.entidade.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, MatInputModule, MatFormFieldModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogExcluirEntidadeComponent implements OnInit{
  public nomeEntidade: string = ""
  public nomeAtivo: string = ""
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.nomeEntidade)
      this.nomeEntidade = data.nomeEntidade
    if (data && data.nomeAtivo)
      this.nomeAtivo = data.nomeAtivo
  }
  ngOnInit(): void {
  }
}

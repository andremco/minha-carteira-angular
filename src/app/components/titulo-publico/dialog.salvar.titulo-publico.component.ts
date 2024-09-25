import {ChangeDetectionStrategy, Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {DatePipe, NgIf} from "@angular/common";
import {TituloPublico} from "../../../models/TituloPublico";

@Component({
  selector: 'salvar-titulo-publico',
  templateUrl: 'dialog.salvar.titulo-publico.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, DatePipe, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSalvarTituloPublicoComponent {
  public tituloPublico? : TituloPublico = {};
  public setorId? : number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}

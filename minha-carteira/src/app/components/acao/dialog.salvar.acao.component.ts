import {ChangeDetectionStrategy, Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {Acao} from "src/app/models/Acao";
import {DatePipe, NgIf} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'salvar-acao',
  templateUrl: 'dialog.salvar.acao.component.html',
  styleUrls: ['./dialog.salvar.acao.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, DatePipe, NgIf, MatSlideToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSalvarAcaoComponent {
  public acao? : Acao = {};
  public setorId? : number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}

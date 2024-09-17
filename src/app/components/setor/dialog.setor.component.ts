import {ChangeDetectionStrategy, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Setor} from "../../models/Setor";

@Component({
  selector: 'dialog-setor',
  templateUrl: 'dialog.setor.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSetorComponent implements OnInit{
  public setor: Setor = {}
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.setor)
      this.setor = data.setor
  }

  ngOnInit() {
    if (this.setor.descricao == undefined)
      this.setor.descricao = ""
  }
}

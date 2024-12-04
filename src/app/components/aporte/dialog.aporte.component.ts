import {ChangeDetectionStrategy, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Aporte} from "src/app/models/aporte/Aporte";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgClass} from "@angular/common";

@Component({
  selector: 'dialog-aporte',
  templateUrl: 'dialog.aporte.component.html',
  styleUrls: ['./dialog.aporte.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatOption, MatSelect, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAporteComponent implements OnInit{
  public aporte: Aporte = {
    quantidade : null,
    preco : null
  };
  public tipoAtivoId: number = 1;
  public ativoId: number = 1;
  public ehAcao: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.aporte)
      this.aporte = data.aporte
  }
  ngOnInit(): void {
      this.ehAcao = <boolean>(this.aporte.acaoId && !this.aporte.tituloPublicoId);
  }
}

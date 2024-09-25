import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from "@angular/common"
import {TipoAtivo} from "../../../../models/TipoAtivo";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'ativo',
  templateUrl: 'dialog.editar.ativo.component.html',
  styleUrls: ['./dialog.editar.ativo.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, MatInputModule, MatFormFieldModule, CommonModule, MatSlideToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogEditarAtivoComponent {
  public comprar : boolean = false;
  public ativo? : any;
  public tipoAtivo? : TipoAtivo;
  public setorId? : string;
  public TipoAtivo = TipoAtivo;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.ativo = data.ativo
    this.tipoAtivo = data.tipoAtivo
  }

  ngOnInit() {
    this.comprar = this.ativo?.comprarOuAguardar === 'Comprar';
    this.setorId = this.ativo?.setorId?.toString()
  }


}

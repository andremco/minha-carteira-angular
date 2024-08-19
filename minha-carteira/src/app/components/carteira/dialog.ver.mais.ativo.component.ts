import {ChangeDetectionStrategy, Component} from "@angular/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  selector: 'ver-mais-ativo',
  templateUrl: 'dialog.ver.mais.ativo.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatSelect, MatOption, MatGridList, MatGridTile, FlexLayoutModule, MatInputModule, MatFormFieldModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogVerMaisAtivoComponent {}

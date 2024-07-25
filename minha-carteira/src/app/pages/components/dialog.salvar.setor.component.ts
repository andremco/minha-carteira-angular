import {ChangeDetectionStrategy, Component} from "@angular/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'dialog-salvar-setor',
  templateUrl: 'dialog.salvar.setor.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSalvarSetorComponent {}

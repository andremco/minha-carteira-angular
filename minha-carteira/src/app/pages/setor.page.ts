import {Component, inject} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {DialogSalvarSetorComponent} from "./components/dialog.salvar.setor.component";

@Component({
  selector: 'setor-page',
  templateUrl: './setor.page.html',
  styleUrl: './setor.page.css'
})
export class SetorPage{
  title = 'setor';
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(DialogSalvarSetorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

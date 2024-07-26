import {Component, inject} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {DialogSalvarSetorComponent} from "./dialog.salvar.setor.component";

const ELEMENT_DATA: Setor[] = [
  {id: 1, descricao: 'Tesouro direto', dataRegistro: '10/07/2024', ativos: 10},
  {id: 2, descricao: 'Fundo Imobiliário', dataRegistro: '10/07/2024', ativos: 3},
  {id: 3, descricao: 'Banco', dataRegistro: '10/07/2024', ativos: 2},
  {id: 4, descricao: 'Seguradora', dataRegistro: '10/07/2024', ativos: 5},
];
export interface Setor {
  id: number;
  descricao: string;
  dataRegistro: string;
  ativos: number;
}

@Component({
  selector: 'setor',
  templateUrl: './setor.component.html',
  styleUrl: './setor.component.css'
})
export class SetorComponent {
  title = 'setor';
  readonly dialog = inject(MatDialog);
  dataSource : Setor[] = [
    {id: 1, descricao: 'Tesouro direto', dataRegistro: '10/07/2024', ativos: 10},
    {id: 2, descricao: 'Fundo Imobiliário', dataRegistro: '10/07/2024', ativos: 3},
    {id: 3, descricao: 'Banco', dataRegistro: '10/07/2024', ativos: 2},
    {id: 4, descricao: 'Seguradora', dataRegistro: '10/07/2024', ativos: 5},
  ];
  displayedColumns: string[] = ['id', 'descricao', 'dataRegistro', 'ativos'];

  openDialog() {
    const dialogRef = this.dialog.open(DialogSalvarSetorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

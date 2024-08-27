import {AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild} from "@angular/core";
import { DialogSalvarAcaoComponent } from "../dialogs/acao/dialog.salvar.acao.component";
import { MatDialog } from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

export interface Acao {
  id: number;
  setorId: number;
  setorDescricao: string;
  razaoSocial: string;
  ticker: string;
  quantidade: number;
  nota: number;
  dataRegistro: string;
}

@Component({
  selector: 'acao',
  templateUrl: './acao.component.html',
  styleUrl: './acao.component.css'
})
export class AcaoComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<Acao>([
    {id: 1, setorId: 3, setorDescricao: 'Banco', razaoSocial: 'Banco do Brasil', ticker: 'BBS3', quantidade: 100, nota: 9, dataRegistro: '10/07/2024'},
  ]);
  displayedColumns: string[] = ['razaoSocial', 'setorDescricao', 'ticker', 'quantidade', 'nota', 'dataRegistro', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogSalvarAcaoComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

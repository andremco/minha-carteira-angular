import {AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {DialogSalvarSetorComponent} from "src/app/components/dialogs/setor/dialog.salvar.setor.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {Setor} from "src/app/models/Setor";

@Component({
  selector: 'setor',
  templateUrl: './setor.component.html',
  styleUrl: './setor.component.css'
})
export class SetorComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<Setor>([
    {id: 1, descricao: 'Tesouro direto', dataRegistro: '10/07/2024', ativos: 10},
    {id: 2, descricao: 'Fundo Imobiliário', dataRegistro: '10/07/2024', ativos: 3},
    {id: 3, descricao: 'Banco', dataRegistro: '10/07/2024', ativos: 25},
    {id: 4, descricao: 'Seguradora', dataRegistro: '10/07/2024', ativos: 5},
    {id: 5, descricao: 'Hospedagem', dataRegistro: '10/07/2024', ativos: 6},
    {id: 6, descricao: 'Tecnologia', dataRegistro: '10/07/2024', ativos: 6},
    {id: 7, descricao: 'Aéreo', dataRegistro: '10/07/2024', ativos: 4},
    {id: 8, descricao: 'Mída', dataRegistro: '10/07/2024', ativos: 9},
    {id: 9, descricao: 'Construção civil', dataRegistro: '10/07/2024', ativos: 5},
    {id: 10, descricao: 'Energia', dataRegistro: '10/07/2024', ativos: 4},
    {id: 11, descricao: 'Farmacêutica', dataRegistro: '10/07/2024', ativos: 5},
    {id: 12, descricao: 'Metalúrgica', dataRegistro: '10/07/2024', ativos: 1},
  ]);
  displayedColumns: string[] = ['descricao', 'dataRegistro', 'ativos', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogSalvarSetorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

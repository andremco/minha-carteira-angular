import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {TituloPublico} from "src/models/titulo-publico/TituloPublico";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogSalvarTituloPublicoComponent} from "./dialog.salvar.titulo-publico.component";
import {DialogEditarAtivoComponent} from "src/app/components/dialogs/ativo/dialog.editar.ativo.component";
import {DialogExcluirEntidadeComponent} from "src/app/components/dialogs/excluir/dialog.excluir.entidade.component";

@Component({
  selector: 'titulo-publico',
  templateUrl: './titulo-publico.component.html',
  styleUrls: ['./titulo-publico.component.scss'],
})
export class TituloPublicoComponent implements OnInit, AfterViewInit{

  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<TituloPublico>([
    {id: 1, setor: { id: 1, descricao: 'Tesouro direto'}, descricao: 'Tesouro IPCA+ 2045', quantidade: 163, nota: 6, dataRegistro: new Date('2024-10-12'), precoAjustado: 30.98, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'},
    {id: 2, setor: { id: 1, descricao: 'Tesouro direto'}, descricao: 'Tesouro Prefixado 2025', quantidade: 74, nota: 6, dataRegistro: new Date('2024-10-09'), precoAjustado: 37.31, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Lucro'},
    {id: 3, setor: { id: 1, descricao: 'Tesouro direto'}, descricao: 'Tesouro Prefixado 2026', quantidade: 33, nota: 6, dataRegistro: new Date('2024-10-08'), precoAjustado: 37.73, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'}
  ]);
  displayedColumns: string[] = ['descricao', 'setorDescricao', 'precoAjustado', 'quantidade', 'nota', 'dataRegistro', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openDialogCreateTitulo() {
    const dialogRef = this.dialog.open(DialogSalvarTituloPublicoComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogEditTitulo(titulo : TituloPublico) {
    const dialogRef = this.dialog.open(DialogEditarAtivoComponent, {
      data: {
        ativo: titulo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogExcluirTitulo(titulo : TituloPublico) {
    this.dialog.open(DialogExcluirEntidadeComponent, {
      data: {
        nomeEntidade: "titulo público",
        nomeAtivo: titulo.descricao
      }
    });
  }
}

import {AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild} from "@angular/core";
import { DialogSalvarAcaoComponent } from "../dialogs/acao/dialog.salvar.acao.component";
import { MatDialog } from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogExcluirEntidadeComponent} from "../dialogs/excluir/dialog.excluir.entidade.component";
import {DialogEditarAtivoComponent} from "../dialogs/ativo/dialog.editar.ativo.component";
import {TipoAtivo} from "src/app/models/TipoAtivo";
import {Acao} from "src/app/models/Acao";

@Component({
  selector: 'acao',
  templateUrl: './acao.component.html',
  styleUrl: './acao.component.css'
})
export class AcaoComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<Acao>([
    {id: 1, setorId: 3, setorDescricao: 'Banco', razaoSocial: 'Banco do Brasil', ticker: 'BBS3', quantidade: 100, nota: 9, dataRegistro: new Date('2024-06-02'), precoDinamico: 35.62, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Lucro'},
    {id: 2, setorId: 4, setorDescricao: 'Bebidas', razaoSocial: 'Ambev S.A.', ticker: 'ABEV3', quantidade: 50, nota: 8, dataRegistro: new Date('2024-07-12'), precoDinamico: 15.00, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Lucro'},
    {id: 3, setorId: 9, setorDescricao: 'Construção civil', razaoSocial: 'Cyrela', ticker: 'CYRE3', quantidade: 60, nota: 8, dataRegistro: new Date('2024-07-08'), precoDinamico: 20.73, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Perda'}
  ]);
  displayedColumns: string[] = ['razaoSocial', 'setorDescricao', 'ticker', 'quantidade', 'nota', 'dataRegistro', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  openDialogCreateAcao() {
    const dialogRef = this.dialog.open(DialogSalvarAcaoComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogEditAcao(acao : Acao) {
    const dialogRef = this.dialog.open(DialogEditarAtivoComponent, {
      data: {
        ativo: acao,
        tipoAtivo: TipoAtivo.Acao
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogExcluirAcao(acao: Acao){
    this.dialog.open(DialogExcluirEntidadeComponent, {
      data: {
        nomeEntidade: "ação",
        nomeAtivo: acao.razaoSocial
      }
    });
  }
}

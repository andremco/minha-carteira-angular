import {AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild} from "@angular/core";
import { DialogSalvarAcaoComponent } from "./dialog.salvar.acao.component";
import { MatDialog } from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogExcluirEntidadeComponent} from "src/app/components/dialogs/excluir/dialog.excluir.entidade.component";
import {DialogEditarAtivoComponent} from "src/app/components/dialogs/ativo/dialog.editar.ativo.component";
import {Acao} from "src/models/acao/Acao";
import {ResponseApi} from "src/models/ResponseApi";
import {Paginado} from "src/models/Paginado";
import {Setor} from "src/models/setor/Setor";
import {HttpErrorResponse} from "@angular/common/http";
import {AcaoService} from "src/services/AcaoService";

@Component({
  selector: 'acao',
  templateUrl: './acao.component.html',
  styleUrl: './acao.component.css'
})
export class AcaoComponent implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  public loading: boolean = false;
  dataSource = new MatTableDataSource<Acao>();
  displayedColumns: string[] = ['razaoSocial', 'setorDescricao', 'ticker', 'quantidade', 'nota', 'dataRegistro', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  constructor(private readonly service : AcaoService,
              private readonly cdr: ChangeDetectorRef) {
  }
  ngAfterViewInit() {
    this.carregarAcoes(0, 10);
  }
  openDialogCreateAcao() {
    this.dialog.open(DialogSalvarAcaoComponent, {
      data: {
        carregarAcoes: this.carregarAcoes.bind(this)
      }
    });
  }

  openDialogEditAcao(acao : Acao) {
    const dialogRef = this.dialog.open(DialogEditarAtivoComponent, {
      data: {
        ativo: acao
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

  carregarAcoes(pagina:number, tamanho:number){
    this.loading = true;
    this.service.filtrar(pagina, tamanho).subscribe({
      next: (setorPaginado:ResponseApi<Paginado<Acao>>) => {
        this.paginator.pageIndex = pagina;
        this.paginator.pageSize = tamanho;
        this.paginator.length = <number>setorPaginado.data?.total;
        this.dataSource.data = <Acao[]>setorPaginado.data?.itens;
        this.loading = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loading = false;
        console.log(errorResponse);
      }
    })
    this.cdr.detectChanges();
  }

  pageHandler(event:PageEvent){
    this.carregarAcoes(event.pageIndex, event.pageSize);
  }
}

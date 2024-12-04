import {AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild} from "@angular/core";
import { DialogSalvarAcaoComponent } from "./dialog.salvar.acao.component";
import { MatDialog } from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogExcluirEntidadeComponent} from "src/app/components/dialogs/excluir/dialog.excluir.entidade.component";
import {DialogEditarAtivoComponent} from "src/app/components/dialogs/ativo/dialog.editar.ativo.component";
import {Acao} from "src/app/models/acao/Acao";
import {ResponseApi} from "src/app/models/ResponseApi";
import {Paginado} from "src/app/models/Paginado";
import {HttpErrorResponse} from "@angular/common/http";
import {AcaoService} from "src/app/services/AcaoService";
import {BaseComponent} from "src/app/components/base.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'acao',
  templateUrl: './acao.component.html',
  styleUrl: './acao.component.css'
})
export class AcaoComponent extends BaseComponent implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  public loading: boolean = false;
  dataSource = new MatTableDataSource<Acao>();
  displayedColumns: string[] = ['razaoSocial', 'setorDescricao', 'ticker', 'quantidade', 'nota', 'dataRegistro', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  constructor(private readonly service : AcaoService,
              private readonly cdr: ChangeDetectorRef,
              public override toastr: ToastrService) {
    super(toastr);
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
    this.dialog.open(DialogEditarAtivoComponent, {
      data: {
        ativo: acao,
        carregarAcoes: this.carregarAcoes.bind(this)
      }
    });
  }

  openDialogExcluirAcao(acao: Acao){
    this.dialog.open(DialogExcluirEntidadeComponent, {
      data: {
        nomeEntidade: acao.razaoSocial,
        idEntidade: acao.id,
        deletar: this.deletar.bind(this)
      }
    });
  }

  deletar(id:Number){
    this.service.deletar(id).subscribe({
      next: (responseApi:ResponseApi<Acao>) => {
        this.dialog.closeAll();
        this.carregarAcoes(0, 10);
      },
      error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, () => this.dialog.closeAll())
    })
    this.cdr.detectChanges();
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
    });
    this.cdr.detectChanges();
  }

  pageHandler(event:PageEvent){
    this.carregarAcoes(event.pageIndex, event.pageSize);
  }
}

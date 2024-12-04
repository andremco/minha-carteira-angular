import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {TituloPublico} from "src/app/models/titulo-publico/TituloPublico";
import {MatPaginator, MatPaginatorIntl, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogSalvarTituloPublicoComponent} from "../dialogs/titulo-publico/dialog.salvar.titulo-publico.component";
import {DialogEditarAtivoComponent} from "src/app/components/dialogs/ativo/dialog.editar.ativo.component";
import {DialogExcluirEntidadeComponent} from "src/app/components/dialogs/excluir/dialog.excluir.entidade.component";
import {BaseComponent} from "src/app/components/base.component";
import {ToastrService} from "ngx-toastr";
import {ResponseApi} from "../../models/ResponseApi";
import {Paginado} from "../../models/Paginado";
import {Acao} from "../../models/acao/Acao";
import {HttpErrorResponse} from "@angular/common/http";
import {AcaoService} from "../../services/AcaoService";
import {TituloPublicoService} from "../../services/TituloPublicoService";

@Component({
  selector: 'titulo-publico',
  templateUrl: './titulo-publico.component.html'
})
export class TituloPublicoComponent extends BaseComponent implements OnInit, AfterViewInit{
  private readonly dialog = inject(MatDialog);
  public loading: boolean = false;
  dataSource = new MatTableDataSource<TituloPublico>();
  displayedColumns: string[] = ['descricao', 'setorDescricao', 'precoAjustado', 'quantidade', 'nota', 'dataRegistro', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  constructor(private readonly service : TituloPublicoService,
              private readonly cdr: ChangeDetectorRef,
              public override toastr: ToastrService) {
    super(toastr);
  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.carregarTitulosPublico(0, 10);
  }

  carregarTitulosPublico(pagina:number, tamanho:number){
    this.loading = true;
    this.service.filtrar(pagina, tamanho).subscribe({
      next: (tituloPaginado:ResponseApi<Paginado<TituloPublico>>) => {
        this.paginator.pageIndex = pagina;
        this.paginator.pageSize = tamanho;
        this.paginator.length = <number>tituloPaginado.data?.total;
        this.dataSource.data = <TituloPublico[]>tituloPaginado.data?.itens;
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
    this.carregarTitulosPublico(event.pageIndex, event.pageSize);
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

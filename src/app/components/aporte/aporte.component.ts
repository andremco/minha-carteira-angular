import {AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {DialogAporteComponent} from "../dialogs/aporte/dialog.aporte.component";
import {MatPaginator, MatPaginatorIntl, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Aporte} from "src/app/models/aporte/Aporte";
import {DialogExcluirEntidadeComponent} from "src/app/components/dialogs/excluir/dialog.excluir.entidade.component";
import {ResponseApi} from "../../models/ResponseApi";
import {Paginado} from "../../models/Paginado";
import {Acao} from "../../models/acao/Acao";
import {HttpErrorResponse} from "@angular/common/http";
import {BaseComponent} from "../base.component";
import {AcaoService} from "../../services/AcaoService";
import {ToastrService} from "ngx-toastr";
import {AporteService} from "../../services/AporteService";

@Component({
  selector: 'aporte',
  templateUrl: './aporte.component.html'
})
export class AporteComponent extends BaseComponent implements AfterViewInit{
  readonly dialog = inject(MatDialog);
  public loading: boolean = false;
  dataSource = new MatTableDataSource<Aporte>();
  displayedColumns: string[] = ['tipoAtivo', 'ativo', 'ticker', 'movimentacao', 'preco', 'quantidade', 'dataAporte', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  constructor(private readonly service : AporteService,
              private readonly cdr: ChangeDetectorRef,
              public override toastr: ToastrService) {
    super(toastr);
  }
  ngAfterViewInit(): void {
    this.carregarAportes(0, 10);
  }

  openDialogCreateAporte() {
    this.dialog.open(DialogAporteComponent, {
      data: {
        carregarAportes: this.carregarAportes.bind(this)
      }
    });
  }

  openDialogEditAporte(aporte : Aporte) {
    this.dialog.open(DialogAporteComponent, {
      data: {
        aporte
      }
    });
  }

  openDialogExcluirAporte(aporte : Aporte) {
    this.dialog.open(DialogExcluirEntidadeComponent, {
      data: {
        nomeEntidade: "aporte",
        nomeAtivo: aporte.acaoId && !aporte.tituloPublicoId ? aporte.razaoSocial : aporte.descricao
      }
    });
  }

  carregarAportes(pagina:number, tamanho:number){
    this.loading = true;
    this.service.filtrar(pagina, tamanho).subscribe({
      next: (responseApi:ResponseApi<Paginado<Aporte>>) => {
        this.paginator.pageIndex = pagina;
        this.paginator.pageSize = tamanho;
        this.paginator.length = <number>responseApi.data?.total;
        this.dataSource.data = <Aporte[]>responseApi.data?.itens;
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
    this.carregarAportes(event.pageIndex, event.pageSize);
  }
}

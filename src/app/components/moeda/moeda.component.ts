import {AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild} from "@angular/core";
import { DialogSalvarMoedaComponent } from "../dialogs/moeda/dialog.salvar.moeda.component";
import { MatDialog } from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogExcluirEntidadeComponent} from "src/app/components/dialogs/excluir/dialog.excluir.entidade.component";
import {DialogEditarAtivoComponent} from "src/app/components/dialogs/ativo/dialog.editar.ativo.component";
import {Moeda} from "src/app/models/moeda/Moeda";
import {ResponseApi} from "src/app/models/ResponseApi";
import {Paginado} from "src/app/models/Paginado";
import {HttpErrorResponse} from "@angular/common/http";
import {MoedaService} from "src/app/services/MoedaService";
import {BaseComponent} from "src/app/components/base.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'moeda',
  templateUrl: './moeda.component.html',
  styleUrl: './moeda.component.css'
})
export class MoedaComponent extends BaseComponent implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  public loading: boolean = false;
  dataSource = new MatTableDataSource<Moeda>();
  displayedColumns: string[] = ['nome', 'codigo', 'quantidade', 'nota', 'dataRegistro', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  constructor(private readonly service : MoedaService,
              private readonly cdr: ChangeDetectorRef,
              public override toastr: ToastrService) {
    super(toastr);
  }
  ngAfterViewInit() {
    this.carregarMoedas(0, 10);
  }
  openDialogCreateMoeda() {
    this.dialog.open(DialogSalvarMoedaComponent, {
      data: {
        carregarMoedas: this.carregarMoedas.bind(this)
      }
    });
  }

  openDialogEditMoeda(moeda : Moeda) {
    this.dialog.open(DialogEditarAtivoComponent, {
      data: {
        ativo: moeda,
        carregarMoedas: () => { this.carregarMoedas(0, 10) }
      }
    });
  }

  openDialogExcluirMoeda(moeda: Moeda){
    this.dialog.open(DialogExcluirEntidadeComponent, {
      data: {
        nomeEntidade: moeda.nome,
        idEntidade: moeda.id,
        deletar: this.deletar.bind(this)
      }
    });
  }

  deletar(id:Number){
    this.service.deletar(id).subscribe({
      next: (responseApi:ResponseApi<Moeda>) => {
        this.dialog.closeAll();
        this.carregarMoedas(0, 10);
      },
      error: (errorResponse : HttpErrorResponse) => this.error(errorResponse, () => this.dialog.closeAll())
    })
    this.cdr.detectChanges();
  }

  carregarMoedas(pagina:number, tamanho:number){
    this.loading = true;
    this.service.filtrar(pagina, tamanho).subscribe({
      next: (moedaPaginado:ResponseApi<Paginado<Moeda>>) => {
        this.paginator.pageIndex = pagina;
        this.paginator.pageSize = tamanho;
        this.paginator.length = <number>moedaPaginado.data?.total;
        this.dataSource.data = <Moeda[]>moedaPaginado.data?.itens;
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
    this.carregarMoedas(event.pageIndex, event.pageSize);
  }
}

import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {DialogSetorComponent} from "src/app/components/setor/dialog.setor.component";
import {DialogExcluirEntidadeComponent} from "src/app/components/dialogs/excluir/dialog.excluir.entidade.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {Setor} from "src/models/setor/Setor";
import {TipoAtivo} from "src/models/TipoAtivo";
import {SetorService} from "src/services/SetorService";
import {HttpErrorResponse} from "@angular/common/http";
import {Paginado} from "../../../models/Paginado";
import {ResponseApi} from "../../../models/ResponseApi";

@Component({
  selector: 'setor',
  templateUrl: './setor.component.html',
  styleUrl: './setor.component.css'
})
export class SetorComponent implements AfterViewInit, OnInit {
  readonly dialog = inject(MatDialog);
  loading: boolean = false;
  dataSource = new MatTableDataSource<Setor>();
  totalDataSource : number = 0;
  setores : Setor[] = [];
  displayedColumns: string[] = ['descricao', 'dataRegistro', 'numAtivos', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(private service : SetorService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.carregarSetores(0, 10);
  }

  ngAfterViewInit() {
  }

  openDialogCreateSetor() {
    this.dialog.open(DialogSetorComponent, {});
  }

  openDialogEditSetor(setor : Setor){
    this.dialog.open(DialogSetorComponent, {
      data: {
        setor
      }
    });
  }

  openDialogExcluirSetor(setor: Setor){
    this.dialog.open(DialogExcluirEntidadeComponent, {
      data: {
        nomeEntidade: "setor",
        nomeAtivo: setor.descricao
      }
    });
  }

  carregarSetores(pagina:number, tamanho:number){
    this.loading = true;
    this.service.filtrar(pagina, tamanho).subscribe({
      next: (setorPaginado:ResponseApi<Paginado<Setor>>) => {
        this.paginator.pageIndex = pagina;
        this.paginator.pageSize = tamanho;
        this.paginator.length = <number>setorPaginado.data?.total;
        this.dataSource.data = <Setor[]>setorPaginado.data?.itens;
        this.loading = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loading = false;
        console.log(errorResponse);
      }
    })
  }

  pageHandler(event:PageEvent){
    this.carregarSetores(event.pageIndex, event.pageSize);
  }
}

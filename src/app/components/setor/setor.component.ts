import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {DialogSetorComponent} from "src/app/components/setor/dialog.setor.component";
import {DialogExcluirEntidadeComponent} from "src/app/components/dialogs/excluir/dialog.excluir.entidade.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {Setor} from "src/models/setor/Setor";
import {SetorService} from "src/services/SetorService";
import {HttpErrorResponse} from "@angular/common/http";
import {Paginado} from "src/models/Paginado";
import {ResponseApi} from "src/models/ResponseApi";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'setor',
  templateUrl: './setor.component.html',
  styleUrl: './setor.component.css'
})
export class SetorComponent implements AfterViewInit, OnInit {
  readonly dialog = inject(MatDialog);
  loading: boolean = false;
  dataSource = new MatTableDataSource<Setor>();
  displayedColumns: string[] = ['descricao', 'dataRegistro', 'numAtivos', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(private service : SetorService,
              private cdr: ChangeDetectorRef,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.carregarSetores(0, 10);
  }

  openDialogCreateSetor() {
    this.dialog.open(DialogSetorComponent, {
      data: {
        carregarSetores: this.carregarSetores.bind(this)
      }
    });
  }

  openDialogEditSetor(setor : Setor){
    this.dialog.open(DialogSetorComponent, {
      data: {
        setor,
        carregarSetores: this.carregarSetores.bind(this)
      }
    });
  }

  openDialogExcluirSetor(setor: Setor){
    this.dialog.open(DialogExcluirEntidadeComponent, {
      data: {
        nomeEntidade: setor.descricao,
        idEntidade: setor.id,
        deletar: this.deletar.bind(this)
      }
    });
  }

  deletar(id:Number){
    this.service.deletar(id).subscribe({
      next: (responseApi:ResponseApi<Setor>) => {
        this.dialog.closeAll();
        this.carregarSetores(0, 10);
      },
      error: (errorResponse : HttpErrorResponse) => {
        if (errorResponse?.error && errorResponse?.error.success === false &&
          errorResponse?.error.message.length > 0)
        {
          var messages = errorResponse?.error.message.join('<br>');
          this.toastr.error(messages, '', {
            timeOut: 8000,
            enableHtml: true,
            closeButton: true,
            positionClass: 'toast-top-center',
          });
        }
        this.dialog.closeAll();
      }
    })
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }

  pageHandler(event:PageEvent){
    this.carregarSetores(event.pageIndex, event.pageSize);
  }
}

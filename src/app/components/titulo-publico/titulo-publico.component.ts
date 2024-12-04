import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {TituloPublico} from "src/app/models/titulo-publico/TituloPublico";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogSalvarTituloPublicoComponent} from "./dialog.salvar.titulo-publico.component";
import {DialogEditarAtivoComponent} from "src/app/components/dialogs/ativo/dialog.editar.ativo.component";
import {DialogExcluirEntidadeComponent} from "src/app/components/dialogs/excluir/dialog.excluir.entidade.component";
import {BaseComponent} from "src/app/components/base.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'titulo-publico',
  templateUrl: './titulo-publico.component.html',
  styleUrls: ['./titulo-publico.component.scss'],
})
export class TituloPublicoComponent extends BaseComponent implements OnInit, AfterViewInit{

  private readonly dialog = inject(MatDialog);
  public loading: boolean = false;
  dataSource = new MatTableDataSource<TituloPublico>();
  displayedColumns: string[] = ['descricao', 'setorDescricao', 'precoAjustado', 'quantidade', 'nota', 'dataRegistro', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  constructor(private readonly cdr: ChangeDetectorRef,
              public override toastr: ToastrService) {
    super(toastr);
  }
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

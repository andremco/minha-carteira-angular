import {AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {DialogSetorComponent} from "src/app/components/setor/dialog.setor.component";
import {DialogExcluirEntidadeComponent} from "src/app/components/dialogs/excluir/dialog.excluir.entidade.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {Setor} from "src/models/setor/Setor";
import {TipoAtivo} from "src/models/TipoAtivo";
import {SetorService} from "src/services/SetorService";

@Component({
  selector: 'setor',
  templateUrl: './setor.component.html',
  styleUrl: './setor.component.css'
})
export class SetorComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<Setor>([
    {id: 1, descricao: 'Tesouro direto', dataRegistro: '10/07/2024', ativos: 10, tipoAtivo: TipoAtivo.TituloPublico},
    {id: 2, descricao: 'Fundo Imobiliário', dataRegistro: '10/07/2024', ativos: 3, tipoAtivo: TipoAtivo.FundoImobiliario},
    {id: 3, descricao: 'Banco', dataRegistro: '10/07/2024', ativos: 25, tipoAtivo: TipoAtivo.Acao},
    {id: 4, descricao: 'Seguradora', dataRegistro: '10/07/2024', ativos: 5, tipoAtivo: TipoAtivo.Acao},
    {id: 5, descricao: 'Hospedagem', dataRegistro: '10/07/2024', ativos: 6, tipoAtivo: TipoAtivo.FundoImobiliario},
    {id: 6, descricao: 'Tecnologia', dataRegistro: '10/07/2024', ativos: 6, tipoAtivo: TipoAtivo.Acao},
    {id: 7, descricao: 'Aéreo', dataRegistro: '10/07/2024', ativos: 4, tipoAtivo: TipoAtivo.Acao},
    {id: 8, descricao: 'Mída', dataRegistro: '10/07/2024', ativos: 9, tipoAtivo: TipoAtivo.Acao},
    {id: 9, descricao: 'Construção civil', dataRegistro: '10/07/2024', ativos: 5, tipoAtivo: TipoAtivo.FundoImobiliario},
    {id: 10, descricao: 'Energia', dataRegistro: '10/07/2024', ativos: 4, tipoAtivo: TipoAtivo.Acao},
    {id: 11, descricao: 'Farmacêutica', dataRegistro: '10/07/2024', ativos: 5, tipoAtivo: TipoAtivo.Acao},
    {id: 12, descricao: 'Metalúrgica', dataRegistro: '10/07/2024', ativos: 1, tipoAtivo: TipoAtivo.Acao},
  ]);
  displayedColumns: string[] = ['descricao', 'dataRegistro', 'ativos', 'tipo', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(private service : SetorService) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialogCreateSetor() {
    this.dialog.open(DialogSetorComponent);
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

  pageHandler(event:any){
    debugger
  }
}

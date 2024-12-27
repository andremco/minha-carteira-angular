import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit} from "@angular/core";
import {Acao} from "src/app/models/acao/Acao";
import {TituloPublico} from "src/app/models/titulo-publico/TituloPublico";
import {Ativo} from "src/app/models/Ativo";
import {DialogEditarAtivoComponent} from "src/app/components/dialogs/ativo/dialog.editar.ativo.component";
import {MatDialog} from "@angular/material/dialog";
import {TipoAtivoEnum} from "src/app/models/enums/TipoAtivoEnum";
import {BaseComponent} from "../base.component";
import {AcaoService} from "../../services/AcaoService";
import {ToastrService} from "ngx-toastr";
import {ResponseApi} from "../../models/ResponseApi";
import {Paginado} from "../../models/Paginado";
import {HttpErrorResponse} from "@angular/common/http";
import {TituloPublicoService} from "../../services/TituloPublicoService";

@Component({
  selector: 'ativo',
  templateUrl: './ativo.component.html',
  styleUrl: './ativo.component.scss'
})
export class AtivoComponent extends BaseComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);
  public loadingAcoes: boolean = false;
  public loadingTitulos: boolean = false;
  public totalTitulos: number = 0;
  public totalAcoes: number = 0;
  public acoes: Acao[] = [];
  public fiis: Acao[] = <Acao[]>this.acoes.find(a => a.categoria === undefined);
  public titulosPublico: TituloPublico[] = [];
  constructor(private readonly acaoService : AcaoService,
              private readonly tituloPublicoService : TituloPublicoService,
              private readonly cdr: ChangeDetectorRef,
              public override toastr: ToastrService) {
    super(toastr);
  }
  ngAfterViewInit(): void {
    this.carregarAcoes(0, 4);
    this.carregarTitulosPublico(0, 4);
  }

  openDialog(ativo : Ativo) {
    const dialogRef = this.dialog.open(DialogEditarAtivoComponent, {
      data: {
        ativo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  carregarAcoes(pagina:number, tamanho:number){
    this.loadingAcoes = true;
    this.acaoService.filtrar(pagina, tamanho).subscribe({
      next: (acaoPaginado:ResponseApi<Paginado<Acao>>) => {
        this.totalAcoes = <number>acaoPaginado.data?.total;
        this.acoes = <Acao[]>acaoPaginado.data?.itens;
        this.loadingAcoes = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loadingAcoes = false;
        console.log(errorResponse);
      }
    });
    this.cdr.detectChanges();
  }

  carregarTitulosPublico(pagina:number, tamanho:number){
    this.loadingTitulos = true;
    this.tituloPublicoService.filtrar(pagina, tamanho).subscribe({
      next: (tituloPaginado:ResponseApi<Paginado<TituloPublico>>) => {
        this.totalTitulos = <number>tituloPaginado.data?.total;
        this.titulosPublico = <TituloPublico[]>tituloPaginado.data?.itens;
        this.loadingTitulos = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loadingTitulos = false;
        console.log(errorResponse);
      }
    });
    this.cdr.detectChanges();
  }
}

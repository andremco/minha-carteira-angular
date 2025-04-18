import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit} from "@angular/core";
import {Acao} from "src/app/models/acao/Acao";
import {TituloPublico} from "src/app/models/titulo-publico/TituloPublico";
import {Ativo} from "src/app/models/ativo/Ativo";
import {DialogEditarAtivoComponent} from "src/app/components/dialogs/ativo/dialog.editar.ativo.component";
import {MatDialog} from "@angular/material/dialog";
import {BaseComponent} from "../base.component";
import {AcaoService} from "src/app/services/AcaoService";
import {ToastrService} from "ngx-toastr";
import {ResponseApi} from "src/app/models/ResponseApi";
import {Paginado} from "src/app/models/Paginado";
import {HttpErrorResponse} from "@angular/common/http";
import {TituloPublicoService} from "src/app/services/TituloPublicoService";
import {TipoAtivoEnum} from "../../models/enums/TipoAtivoEnum";
import {checkUrlLogoAtivo} from "../../util/check-url-logo-ativo";

@Component({
  selector: 'ativo',
  templateUrl: './ativo.component.html',
  styleUrl: './ativo.component.scss'
})
export class AtivoComponent extends BaseComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);
  public loadingTitulos: boolean = false;
  public loadingAcoes: boolean = false;
  public loadingFiis: boolean = false;
  public loadingBdrs: boolean = false;
  public limiteInicialAtivos: number = 4;
  public totalTitulos: number = 0;
  public cumulativoTitulos: number = 0;
  public proximaPaginaTitulos: number = 0;
  public totalAcoes: number = 0;
  public cumulativoAcoes: number = 0;
  public proximaPaginaAcoes: number = 0;
  public totalFiis: number = 0;
  public cumulativoFiis: number = 0;
  public proximaPaginaFiis: number = 0;
  public totalBdrs: number = 0;
  public cumulativoBdrs: number = 0;
  public proximaPaginaBdrs: number = 0;
  public titulosPublico: TituloPublico[] = [];
  public acoes: Acao[] = [];
  public fiis: Acao[] = [];
  public bdrs: Acao[] = [];

  constructor(private readonly acaoService : AcaoService,
              private readonly tituloPublicoService : TituloPublicoService,
              private readonly cdr: ChangeDetectorRef,
              public override toastr: ToastrService) {
    super(toastr);
  }
  ngAfterViewInit(): void {
    let pagina = 0;
    let tamanho = this.limiteInicialAtivos;
    this.carregarTitulosPublico(pagina, tamanho);
    this.carregarAcoes(pagina, tamanho);
    this.carregarFiis(pagina, tamanho);
    this.carregarBdrs(pagina, tamanho);
  }

  openDialog(ativo : Ativo) {
    let pagina = 0;
    let tamanho = this.limiteInicialAtivos;
    this.dialog.open(DialogEditarAtivoComponent, {
      data: {
        ativo,
        carregarTitulosPublico: () => { this.carregarTitulosPublico(pagina, tamanho, true) },
        carregarAcoes: () => {
          let acao = <Acao>ativo;
          if (acao.setor?.tipoAtivo?.id === TipoAtivoEnum.Acao)
            this.carregarAcoes(pagina, tamanho, true);
          if (acao.setor?.tipoAtivo?.id === TipoAtivoEnum.FundoImobiliario)
            this.carregarFiis(pagina, tamanho, true);
          if (acao.setor?.tipoAtivo?.id === TipoAtivoEnum.BrazilianDepositaryReceipts)
            this.carregarBdrs(pagina, tamanho, true);
        }
      }
    });
  }

  exibirBotaoCarregarTituloPublico(){
    return this.totalTitulos >= this.limiteInicialAtivos + this.cumulativoTitulos;
  }

  carregarMaisTituloPublico(){
    if(this.totalTitulos < this.limiteInicialAtivos)
      return;
    this.cumulativoTitulos += 4;
    this.proximaPaginaTitulos += 1;
    this.carregarTitulosPublico(this.proximaPaginaTitulos, this.limiteInicialAtivos);
  }

  carregarTitulosPublico(pagina:number, tamanho:number, zerarTitulosPublico: boolean = false){
    this.loadingTitulos = true;
    this.tituloPublicoService.filtrar(pagina, tamanho).subscribe({
      next: (tituloPaginado:ResponseApi<Paginado<TituloPublico>>) => {
        this.totalTitulos = <number>tituloPaginado.data?.total;
        if (zerarTitulosPublico){
          this.cumulativoTitulos = 0;
          this.proximaPaginaTitulos = 0;
          this.titulosPublico = <TituloPublico[]>tituloPaginado.data?.itens;
        }
        else
          this.titulosPublico.push(...<TituloPublico[]>tituloPaginado.data?.itens);
        this.loadingTitulos = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loadingTitulos = false;
        console.log(errorResponse);
      }
    });
    this.cdr.detectChanges();
  }

  exibirBotaoCarregarAcoes(){
    return this.totalAcoes >= this.limiteInicialAtivos + this.cumulativoAcoes;
  }

  carregarMaisAcoes(){
    if(this.totalAcoes < this.limiteInicialAtivos)
      return;
    this.cumulativoAcoes += 4;
    this.proximaPaginaAcoes += 1;
    this.carregarAcoes(this.proximaPaginaAcoes, this.limiteInicialAtivos);
  }

  carregarAcoes(pagina:number, tamanho:number, zerarAcoes: boolean = false){
    this.loadingAcoes = true;
    this.acaoService.filtrar(pagina, tamanho, TipoAtivoEnum.Acao).subscribe({
      next: (acaoPaginado:ResponseApi<Paginado<Acao>>) => {
        this.totalAcoes = <number>acaoPaginado.data?.total;
        if (zerarAcoes){
          this.cumulativoAcoes = 0;
          this.proximaPaginaAcoes = 0;
          this.acoes = <Acao[]>acaoPaginado.data?.itens;
        }
        else
          this.acoes.push(...<Acao[]>acaoPaginado.data?.itens);
        this.loadingAcoes = false;
        this.acoes.forEach(async (acao) => {
          acao.iconLogoUp = await checkUrlLogoAtivo(acao.urlIconAtivo);
        });
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loadingAcoes = false;
        console.log(errorResponse);
      }
    });
    this.cdr.detectChanges();
  }

  exibirBotaoCarregarFiis(){
    return this.totalFiis >= this.limiteInicialAtivos + this.cumulativoFiis;
  }

  carregarMaisFiis(){
    if(this.totalFiis < this.limiteInicialAtivos)
      return;
    this.cumulativoFiis += 4;
    this.proximaPaginaFiis += 1;
    this.carregarFiis(this.proximaPaginaFiis, this.limiteInicialAtivos);
  }

  carregarFiis(pagina:number, tamanho:number, zerarFiis: boolean = false){
    this.loadingFiis = true;
    this.acaoService.filtrar(pagina, tamanho, TipoAtivoEnum.FundoImobiliario).subscribe({
      next: (fiisPaginado:ResponseApi<Paginado<Acao>>) => {
        this.totalFiis = <number>fiisPaginado.data?.total;
        if (zerarFiis){
          this.cumulativoFiis = 0;
          this.proximaPaginaFiis = 0;
          this.fiis = <Acao[]>fiisPaginado.data?.itens;
        }
        else
          this.fiis.push(...<Acao[]>fiisPaginado.data?.itens);
        this.fiis.forEach(async (fundo) => {
          fundo.iconLogoUp = await checkUrlLogoAtivo(fundo.urlIconAtivo);
        });
        this.loadingFiis = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loadingFiis = false;
        console.log(errorResponse);
      }
    });
    this.cdr.detectChanges();
  }

  exibirBotaoCarregarBdrs(){
    return this.totalBdrs >= this.limiteInicialAtivos + this.cumulativoBdrs;
  }

  carregarMaisBdrs(){
    if(this.totalBdrs < this.limiteInicialAtivos)
      return;
    this.cumulativoBdrs += 4;
    this.proximaPaginaBdrs += 1;
    this.carregarBdrs(this.proximaPaginaBdrs, this.limiteInicialAtivos);
  }

  carregarBdrs(pagina:number, tamanho:number, zerarBdrs: boolean = false){
    this.loadingBdrs = true;
    this.acaoService.filtrar(pagina, tamanho, TipoAtivoEnum.BrazilianDepositaryReceipts).subscribe({
      next: (bdrPaginado:ResponseApi<Paginado<Acao>>) => {
        this.totalBdrs = <number>bdrPaginado.data?.total;
        if (zerarBdrs){
          this.cumulativoBdrs = 0;
          this.proximaPaginaBdrs = 0;
          this.bdrs = <Acao[]>bdrPaginado.data?.itens;
        }
        else
          this.bdrs.push(...<Acao[]>bdrPaginado.data?.itens);
        this.bdrs.forEach(async (bdr) => {
          bdr.iconLogoUp = await checkUrlLogoAtivo(bdr.urlIconAtivo);
        });
        this.loadingBdrs = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loadingBdrs = false;
        console.log(errorResponse);
      }
    });
    this.cdr.detectChanges();
  }

  protected readonly String = String;
  protected readonly checkUrlLogoAtivo = checkUrlLogoAtivo;
}

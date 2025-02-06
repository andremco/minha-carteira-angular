import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import 'chartist/dist/index.css';
import * as Chartist from 'chartist';
import {CarteiraService} from "../../services/CarteiraService";
import {ResponseApi} from "../../models/ResponseApi";
import {HttpErrorResponse} from "@angular/common/http";
import {ValoresCarteiraTotal} from "../../models/carteira/ValoresCarteiraTotal";
import {BaseComponent} from "../base.component";
import {ToastrService} from "ngx-toastr";
import {AportesTotal} from "../../models/carteira/AportesTotal";
import {AportesValorMensal} from "../../models/carteira/AportesValorMensal";
import {tipoAtivoEnumDescricao, TipoAtivoEnum} from "../../models/enums/TipoAtivoEnum";

@Component({
  selector: 'carteira',
  templateUrl: './carteira.component.html',
  styleUrls: ['./carteira.component.scss'],
})
export class CarteiraComponent extends BaseComponent implements AfterViewInit {
  public loadingCarteiraTotal : boolean = false;
  public loadingAportesPorcentagemTotal : boolean = false;
  public loadingAportesValorTotal : boolean = false;
  public loadingAportesMensal : boolean = false;
  public loadingSetores : boolean = false;
  public loadingSetoresAumento : boolean = false;
  public valorCarteiraTotal?: ValoresCarteiraTotal = {};
  public hj : Date = new Date();
  protected tiposAtivos: TipoAtivoEnum [] = [
    TipoAtivoEnum.Acao,
    TipoAtivoEnum.FundoImobiliario,
    TipoAtivoEnum.BrazilianDepositaryReceipts,
    TipoAtivoEnum.TituloPublico
  ]
  constructor(private readonly carteiraService : CarteiraService,
              private ref: ChangeDetectorRef,
              public override toastr: ToastrService) {
    super(toastr);
  }

  ngAfterViewInit(){
    this.carregarValorTotalCarteira();
    this.gerarPorcentagemAtivosDashboard();
    this.gerarValorTotalAtivosDashboard();
    this.gerarAportesMensalDashboard();
    this.gerarSetoresAcoesChart();
    this.gerarAumentarPosicaoSetoresAcoesChart();
    this.gerarSetoresFiisChart();
    this.gerarAumentarPosicaoSetoresFiisChart();
  }

  carregarValorTotalCarteira(){
    this.loadingCarteiraTotal = true;
    this.carteiraService.obterCarteiraTotal().subscribe({
      next: (response:ResponseApi<ValoresCarteiraTotal>) => {
        this.valorCarteiraTotal = response.data;
        this.loadingCarteiraTotal = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loadingCarteiraTotal = false;
        this.error(errorResponse);
      }
    });
  }

  gerarPorcentagemAtivosDashboard(){
    this.loadingAportesPorcentagemTotal = true;
    this.carteiraService.obterAportesPorcentagemTotal().subscribe({
      next: (response:ResponseApi<AportesTotal>) => {
        let porcentagemAtivos = response.data;
        if (porcentagemAtivos){
          this.montarDashboardAtivos(porcentagemAtivos, "#porcentagem-ativos-dashboard");
        }
        this.loadingAportesPorcentagemTotal = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loadingAportesPorcentagemTotal = false;
        this.error(errorResponse);
      }
    });
    this.ref.detectChanges();
  }

  gerarValorTotalAtivosDashboard(){
    this.loadingAportesValorTotal = true;
    this.carteiraService.obterAportesValorTotal().subscribe({
      next: (response:ResponseApi<AportesTotal>) => {
        let valorAtivos = response.data;
        if (valorAtivos){
          this.montarDashboardAtivos(valorAtivos, '#valor-ativos-total-dashboard');
        }
        this.loadingAportesValorTotal = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loadingAportesValorTotal = false;
        this.error(errorResponse);
      }
    });
    this.ref.detectChanges();
  }

  montarDashboardAtivos(aportes : AportesTotal, divDashboard : string){
    let labelsAtivos : string[] = this.tiposAtivos.map(tipo => tipoAtivoEnumDescricao(tipo))
    new Chartist.BarChart(divDashboard, {
      labels: labelsAtivos,
      series: [aportes.porAcoes, aportes.porFIIs, aportes.porBDRs, aportes.porTitulos]
    }, {
      distributeSeries: true
    });
  }

  gerarAportesMensalDashboard(){
    this.loadingAportesMensal = true;
    //TODO alterar este comportamento
    let dataInicio = new Date(2024, 0, 1).toLocaleDateString("pt-BR");
    let dataFim = new Date(2024, 11, 31).toLocaleDateString("pt-BR");
    this.carteiraService.obterAportesValorMensal(dataInicio, dataFim).subscribe({
      next: (response:ResponseApi<AportesValorMensal>) => {
        let valoresMensal = response.data;
        if (valoresMensal){
          this.montarDashboardAportesMensal(valoresMensal);
        }
        this.loadingAportesMensal = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loadingAportesMensal = false;
        this.error(errorResponse);
      }
    });
    this.ref.detectChanges();
  }

  montarDashboardAportesMensal(valoresMensal : AportesValorMensal){
    new Chartist.BarChart('#aportes-mensal-dashboard', {
      labels: valoresMensal.mesesPesquisados,
      series: [
        valoresMensal.aportesAcoesMensal ? valoresMensal.aportesAcoesMensal.map(a => a.totalAportado) : [], //Ações
        valoresMensal.aportesFIIsMensal ? valoresMensal.aportesFIIsMensal.map(a => a.totalAportado) : [], //FIIs
        valoresMensal.aportesBDRsMensal ? valoresMensal.aportesBDRsMensal.map(a => a.totalAportado) : [], // BDRs
        valoresMensal.aportesTituloPublicoMensal ? valoresMensal.aportesTituloPublicoMensal.map(a => a.totalAportado) : [] //Fundos Imobiliários
      ]
    }, {
      // Default mobile configuration
      stackBars: true,
      axisX: {
        labelInterpolationFnc: function(value: string) {
          return value.split(/\s+/).map(function(word) {
            return word[0];
          }).join('');
        }
      },
      axisY: {
        offset: 20
      },
      plugins: [
        //Chartist.BarChart.plugins.legend()
      ]
    }, [
      // Options override for media > 400px
      ['screen and (min-width: 400px)', {
        reverseData: true,
        horizontalBars: true,
        axisX: {
          labelInterpolationFnc: value => value
        },
        axisY: {
          offset: 60
        }
      }],
      // Options override for media > 800px
      ['screen and (min-width: 800px)', {
        stackBars: false,
        seriesBarDistance: 10
      }],
      // Options override for media > 1000px
      ['screen and (min-width: 1000px)', {
        reverseData: false,
        horizontalBars: false,
        seriesBarDistance: 15
      }]
    ]);
  }

  gerarSetoresAcoesChart(){
    var setores = {
      /*Máximo 15 setores!! acima disso não renderiza mais cores na fatia do gráfico =/*/
      labels: ['Título público 5,66%', 'Bebidas 5,66%', 'Hospedagem 5,66%', 'Tecnologia 5,66%', 'Bolsa 5,66%', 'Banco 5,66%', 'Seguradora 5,66%', 'Holding 5,66%',
        'Logística 5,66%', 'Escritório 5,66%', 'Construção civil 5,66%', 'Mídia 5,66%', 'Energia 5,66%', 'Aéreo 5,66%', 'Farmacêutica 5,66%'],
      series: [6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66]
    };

    const options: Chartist.PieChartOptions = {
      labelInterpolationFnc: value => String(value)[0]
    };

    const responsiveOptions: Chartist.ResponsiveOptions<Chartist.PieChartOptions> = [
      [
        'screen and (min-width: 640px)',
        {
          chartPadding: 30,
          labelOffset: 100,
          labelDirection: 'explode',
          labelInterpolationFnc: value => value
        }
      ],
      [
        'screen and (min-width: 1024px)',
        {
          labelOffset: 80,
          chartPadding: 20
        }
      ]
    ];

    new Chartist.PieChart('#setores-acoes-chart', setores, options, responsiveOptions);
  }

  gerarAumentarPosicaoSetoresAcoesChart(){

    var aumentarPosicaoSetores = {
      /*Máximo 15 setores!! acima disso não renderiza mais cores na fatia do gráfico =/*/
      labels: ['Título público 20%', 'Bebidas 12%', 'Hospedagem 2%', 'Tecnologia 2%', 'Bolsa 2%', 'Banco 1%', 'Seguradora 8%', 'Holding 8%',
        'Logística 3%', 'Escritório 6%', 'Construção civil 3%', 'Mídia 3%', 'Energia 15%', 'Aéreo 10%', 'Farmacêutica 5%'],
      series: [20, 12, 2, 2, 2, 1, 8, 8, 3, 6, 3, 3, 15, 10, 5]
    };

    const options: Chartist.PieChartOptions = {
      labelInterpolationFnc: value => String(value)[0]
    };

    const responsiveOptions: Chartist.ResponsiveOptions<Chartist.PieChartOptions> = [
      [
        'screen and (min-width: 640px)',
        {
          chartPadding: 30,
          labelOffset: 100,
          labelDirection: 'explode',
          labelInterpolationFnc: value => value
        }
      ],
      [
        'screen and (min-width: 1024px)',
        {
          labelOffset: 80,
          chartPadding: 20
        }
      ]
    ];

    new Chartist.PieChart('#quero-setores-acoes-chart', aumentarPosicaoSetores, options, responsiveOptions);
  }

  gerarSetoresFiisChart(){
    var setores = {
      /*Máximo 15 setores!! acima disso não renderiza mais cores na fatia do gráfico =/*/
      labels: ['Título público 5,66%', 'Bebidas 5,66%', 'Hospedagem 5,66%', 'Tecnologia 5,66%', 'Bolsa 5,66%', 'Banco 5,66%', 'Seguradora 5,66%', 'Holding 5,66%',
        'Logística 5,66%', 'Escritório 5,66%', 'Construção civil 5,66%', 'Mídia 5,66%', 'Energia 5,66%', 'Aéreo 5,66%', 'Farmacêutica 5,66%'],
      series: [6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66]
    };

    const options: Chartist.PieChartOptions = {
      labelInterpolationFnc: value => String(value)[0]
    };

    const responsiveOptions: Chartist.ResponsiveOptions<Chartist.PieChartOptions> = [
      [
        'screen and (min-width: 640px)',
        {
          chartPadding: 30,
          labelOffset: 100,
          labelDirection: 'explode',
          labelInterpolationFnc: value => value
        }
      ],
      [
        'screen and (min-width: 1024px)',
        {
          labelOffset: 80,
          chartPadding: 20
        }
      ]
    ];

    new Chartist.PieChart('#setores-fiis-chart', setores, options, responsiveOptions);
  }

  gerarAumentarPosicaoSetoresFiisChart(){

    var aumentarPosicaoSetores = {
      /*Máximo 15 setores!! acima disso não renderiza mais cores na fatia do gráfico =/*/
      labels: ['Título público 20%', 'Bebidas 12%', 'Hospedagem 2%', 'Tecnologia 2%', 'Bolsa 2%', 'Banco 1%', 'Seguradora 8%', 'Holding 8%',
        'Logística 3%', 'Escritório 6%', 'Construção civil 3%', 'Mídia 3%', 'Energia 15%', 'Aéreo 10%', 'Farmacêutica 5%'],
      series: [20, 12, 2, 2, 2, 1, 8, 8, 3, 6, 3, 3, 15, 10, 5]
    };

    const options: Chartist.PieChartOptions = {
      labelInterpolationFnc: value => String(value)[0]
    };

    const responsiveOptions: Chartist.ResponsiveOptions<Chartist.PieChartOptions> = [
      [
        'screen and (min-width: 640px)',
        {
          chartPadding: 30,
          labelOffset: 100,
          labelDirection: 'explode',
          labelInterpolationFnc: value => value
        }
      ],
      [
        'screen and (min-width: 1024px)',
        {
          labelOffset: 80,
          chartPadding: 20
        }
      ]
    ];

    new Chartist.PieChart('#quero-setores-fiis-chart', aumentarPosicaoSetores, options, responsiveOptions);
  }

  cssLegendSquareDashboard(tipoAtivo : TipoAtivoEnum) : string {
    if (tipoAtivo == TipoAtivoEnum.Acao)
      return "square-acoes";
    if (tipoAtivo == TipoAtivoEnum.FundoImobiliario)
      return "square-fiis";
    if (tipoAtivo == TipoAtivoEnum.BrazilianDepositaryReceipts)
      return "square-bdrs";
    if (tipoAtivo == TipoAtivoEnum.TituloPublico)
      return "square-titulos";
    return "";
  }

  tituloSetoresDashboard(){

  }

  tituloSetoresAumentoDashboard(){

  }

  idDivSetoresDashboard(){

  }

  idDivSetoresAumentoDashboard(){

  }

  protected readonly tipoAtivoEnumDescricao = tipoAtivoEnumDescricao;
}

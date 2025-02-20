import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import 'chartist/dist/index.css';
import * as Chartist from 'chartist';
import {CarteiraService} from "src/app/services/CarteiraService";
import {ResponseApi} from "src/app/models/ResponseApi";
import {HttpErrorResponse} from "@angular/common/http";
import {ValoresCarteiraTotal} from "src/app/models/carteira/ValoresCarteiraTotal";
import {BaseComponent} from "../base.component";
import {ToastrService} from "ngx-toastr";
import {AportesTotal} from "src/app/models/carteira/AportesTotal";
import {AportesValorMensal} from "src/app/models/carteira/AportesValorMensal";
import {TipoAtivoEnum, tipoAtivoEnumDescricao} from "src/app/models/enums/TipoAtivoEnum";
import {SetoresFatiado} from "../../models/carteira/SetoresFatiado";

@Component({
  selector: 'carteira',
  templateUrl: './carteira.component.html',
  styleUrls: ['./carteira.component.scss'],
})
export class CarteiraComponent extends BaseComponent implements AfterViewInit {
  public loadingCarteiraTotal: boolean = false;
  public loadingAportesPorcentagemTotal: boolean = false;
  public loadingAportesValorTotal: boolean = false;
  public loadingAportesMensal: boolean = false;
  public valorCarteiraTotal?: ValoresCarteiraTotal = {};
  public hj: Date = new Date();
  protected tiposAtivos: TipoAtivoEnum [] = [
    TipoAtivoEnum.Acao,
    TipoAtivoEnum.FundoImobiliario,
    TipoAtivoEnum.BrazilianDepositaryReceipts,
    TipoAtivoEnum.TituloPublico
  ];
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
    this.gerarAumentarPosicaoSetoresFatiadoDashboard();
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
    let dataInicio = new Date(new Date().getFullYear(), 0, 1).toLocaleDateString("pt-BR");
    //Mês corrente com último dia do mês!!
    let dataFim = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString("pt-BR");
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

  montarDashboardSetoresFatiado(fatia : SetoresFatiado[], idDiv : string){
    if (!fatia || fatia.length == 0 || !idDiv)
      return

    let labels = fatia.map(f => (f.setor ? f.setor : "") + (f.percentual?.toString()) + "%")
    let series = fatia.map(f => f.percentual)

    var setores = {
      labels: labels,
      series: series
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

    new Chartist.PieChart('#' + idDiv, setores, options, responsiveOptions);
  }

  gerarAumentarPosicaoSetoresFatiadoDashboard(){

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

    //new Chartist.PieChart('#quero-setores-acoes-chart', aumentarPosicaoSetores, options, responsiveOptions);
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

  tituloSetoresAumentoDashboard(tipoAtivo : TipoAtivoEnum) : string {
    if (tipoAtivo == TipoAtivoEnum.Acao)
      return "nas ações";
    if (tipoAtivo == TipoAtivoEnum.FundoImobiliario)
      return "nos FIIs";
    if (tipoAtivo == TipoAtivoEnum.BrazilianDepositaryReceipts)
      return "nas BDRs";
    if (tipoAtivo == TipoAtivoEnum.TituloPublico)
      return "nos títulos";
    return "";
  }

  protected readonly tipoAtivoEnumDescricao = tipoAtivoEnumDescricao;
  protected readonly TipoAtivoEnum = TipoAtivoEnum;
}

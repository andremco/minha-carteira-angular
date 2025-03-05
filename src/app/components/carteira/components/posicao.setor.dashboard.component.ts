import {BaseComponent} from "src/app/components/base.component";
import {AfterViewInit, ChangeDetectorRef, Component, Input} from "@angular/core";
import {TipoAtivoEnum} from "src/app/models/enums/TipoAtivoEnum";
import {CarteiraService} from "src/app/services/CarteiraService";
import {ToastrService} from "ngx-toastr";
import {ResponseApi} from "src/app/models/ResponseApi";
import {HttpErrorResponse} from "@angular/common/http";
import {SetoresFatiado} from "src/app/models/carteira/SetoresFatiado";
import * as Chartist from "chartist";
import {NgIf} from "@angular/common";

@Component({
  selector: 'posicao-setor',
  templateUrl: './posicao.setor.dashboard.component.html',
  standalone: true,
  imports: [
    NgIf
  ]
})
export class PosicaoSetorDashboardComponent extends BaseComponent implements AfterViewInit {
  @Input() tipoAtivo: TipoAtivoEnum = TipoAtivoEnum.Acao;
  @Input() buscarMinhaPosicao: boolean = false;
  public loading: boolean = false;
  public showDashboard: boolean = true;

  constructor(private readonly carteiraService : CarteiraService,
              private ref: ChangeDetectorRef,
              public override toastr: ToastrService) {
    super(toastr);
  }
  ngAfterViewInit(): void {
    this.gerarDashboard();
  }

  get titulo(): string{
    if(this.buscarMinhaPosicao){
      if (this.tipoAtivo == TipoAtivoEnum.Acao)
        return "Setores das ações";
      if (this.tipoAtivo == TipoAtivoEnum.FundoImobiliario)
        return "Setores dos FIIs";
      if (this.tipoAtivo == TipoAtivoEnum.BrazilianDepositaryReceipts)
        return "Setores das BDRs";
      if (this.tipoAtivo == TipoAtivoEnum.TituloPublico)
        return "Setores dos títulos";
    }
    else{
      if (this.tipoAtivo == TipoAtivoEnum.Acao)
        return "Aumentar posições nas ações";
      if (this.tipoAtivo == TipoAtivoEnum.FundoImobiliario)
        return "Aumentar posições nos FIIs";
      if (this.tipoAtivo == TipoAtivoEnum.BrazilianDepositaryReceipts)
        return "Aumentar posições nas BDRs";
      if (this.tipoAtivo == TipoAtivoEnum.TituloPublico)
        return "Aumentar posições nos títulos";
    }
    return "";
  }

  get divId() : string {
    if(this.buscarMinhaPosicao){
      if (this.tipoAtivo == TipoAtivoEnum.Acao)
        return "setores-acoes";
      if (this.tipoAtivo == TipoAtivoEnum.FundoImobiliario)
        return "setores-fiis";
      if (this.tipoAtivo == TipoAtivoEnum.BrazilianDepositaryReceipts)
        return "setores-bdrs";
      if (this.tipoAtivo == TipoAtivoEnum.TituloPublico)
        return "setores-titulos";
    }
    else{
      if (this.tipoAtivo == TipoAtivoEnum.Acao)
        return "quero-setores-acoes";
      if (this.tipoAtivo == TipoAtivoEnum.FundoImobiliario)
        return "quero-setores-fiis";
      if (this.tipoAtivo == TipoAtivoEnum.BrazilianDepositaryReceipts)
        return "quero-setores-bdrs";
      if (this.tipoAtivo == TipoAtivoEnum.TituloPublico)
        return "quero-setores-titulos";
    }
    return "";
  }

  gerarDashboard(){
    this.loading = true;
    let observer = {
      next: (response:ResponseApi<SetoresFatiado[]>) => {
        let itens = response.data;
        if (itens && itens.length != 0)
          this.montarDashboard(itens);

        if (itens && itens.length == 0)
          this.showDashboard = false;

        this.loading = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loading = false;
        this.error(errorResponse);
      }
    }
    if (this.buscarMinhaPosicao)
      this.carteiraService.obterSetoresFatiado(this.tipoAtivo).subscribe(observer);
    else
      this.carteiraService.obterSetoresAumentoFatiado(this.tipoAtivo).subscribe(observer);

    this.ref.detectChanges();
  }

  montarDashboard(itens : SetoresFatiado[]){
    if (!itens || itens.length == 0)
      return

    let labels = itens.map(f => (f.setor ? f.setor : "") + " " + (f.percentual?.toString()) + "%")
    let series = itens.map(f => f.percentual)

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

    new Chartist.PieChart('#' + this.divId, setores, options, responsiveOptions);
  }
}

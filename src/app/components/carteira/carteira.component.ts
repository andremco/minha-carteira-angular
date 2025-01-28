import {Component, inject, OnInit} from '@angular/core';
import 'chartist/dist/index.css';
import * as Chartist from 'chartist';

@Component({
  selector: 'carteira',
  templateUrl: './carteira.component.html',
  styleUrls: ['./carteira.component.scss'],
})
export class CarteiraComponent implements OnInit {

  public totalAporte : number = 20000000.20;
  public investAjustado : number = 28152086.78;
  public lucroPerda : number = (this.investAjustado - this.totalAporte);
  public hj : Date = new Date();

  constructor() { }

  ngOnInit(): void {
    this.gerarPorcetagemAtivosCarteiraChart();
    this.gerarValorAtivosCarteiraChart();
    this.gerarAportesAnualChart();
    this.gerarSetoresAcoesChart();
    this.gerarAumentarPosicaoSetoresAcoesChart();
    this.gerarSetoresFiisChart();
    this.gerarAumentarPosicaoSetoresFiisChart();
  }

  gerarPorcetagemAtivosCarteiraChart(){
    new Chartist.BarChart('#porcetagem-ativos-carteira-chart', {
      labels: ['Tesouro Direto', 'Ações', 'Fundos Imobiliários'],
      series: [70, 20, 10]
    }, {
      distributeSeries: true
    });
  }

  gerarValorAtivosCarteiraChart(){
    new Chartist.BarChart('#valor-ativos-carteira-chart', {
      labels: ['Tesouro Direto', 'Ações', 'Fundos Imobiliários'],
      series: [5500, 17000, 4500]
    }, {
      distributeSeries: true
    });
  }

  gerarAportesAnualChart(){
    new Chartist.BarChart('#aportes-anual-chart', {
      labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO'],
      series: [
        [350, 200, 100, 500, 1000, 350, 600, 100], //Tesouro Direto
        [350, 300, 600, 500, 0, 350, 300, 250], //Ações
        [300, 200, 300, 0, 0, 300, 100, 277]  //Fundos Imobiliários
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
}

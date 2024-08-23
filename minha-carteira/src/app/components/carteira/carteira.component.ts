import {Component, inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Acao} from "../../models/Acao";
import {TituloPublico} from "../../models/TituloPublico";
import {Ativo} from "../../models/Ativo";
import {TipoAtivo} from "../../models/TipoAtivo";
import 'chartist/dist/index.css';
import {AnimationDefinition, easings, PieChart, PieChartOptions, ResponsiveOptions} from 'chartist';

@Component({
  selector: 'carteira',
  templateUrl: './carteira.component.html',
  styleUrls: ['./carteira.component.scss'],
})
export class CarteiraComponent implements OnInit {

  public totalAporte : number = 20000000.20;
  public investAjustado : number = 28152086.78;
  public lucroPerda : number = (this.investAjustado - this.totalAporte);

  constructor() { }

  ngOnInit(): void {
    this.gerarSetoresChart();
    this.gerarAtivosChart();
    this.gerarAumentarPosicaoSetoreChart();
  }

  gerarSetoresChart(){
    var setores = {
      /*Máximo 15 setores!! acima disso não renderiza mais cores na fatia do gráfico =/*/
      labels: ['Título público 5,66%', 'Bebidas 5,66%', 'Hospedagem 5,66%', 'Tecnologia 5,66%', 'Bolsa 5,66%', 'Banco 5,66%', 'Seguradora 5,66%', 'Holding 5,66%',
        'Logística 5,66%', 'Escritório 5,66%', 'Construção civil 5,66%', 'Mídia 5,66%', 'Energia 5,66%', 'Aéreo 5,66%', 'Farmacêutica 5,66%'],
      series: [6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66, 6.66]
    };

    const options: PieChartOptions = {
      labelInterpolationFnc: value => String(value)[0]
    };

    const responsiveOptions: ResponsiveOptions<PieChartOptions> = [
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

    new PieChart('#setores-chart', setores, options, responsiveOptions);
  }

  gerarAtivosChart(){

    const chart = new PieChart(
      '#ativos-chart',
      {
        /*Máximo 15 setores!! acima disso não renderiza mais cores na fatia do gráfico =/*/
        labels: ['Ações', 'Títulos públicos', 'Fundos Imobiliários'],
        series: [20, 50, 30]
      },
      {
        donut: true,
        donutWidth: 60,
        startAngle: 270,
        showLabel: true
      }
    );
  }

  gerarAumentarPosicaoSetoreChart(){

    var aumentarPosicaoSetores = {
      /*Máximo 15 setores!! acima disso não renderiza mais cores na fatia do gráfico =/*/
      labels: ['Título público 20%', 'Bebidas 12%', 'Hospedagem 2%', 'Tecnologia 2%', 'Bolsa 2%', 'Banco 1%', 'Seguradora 8%', 'Holding 8%',
        'Logística 3%', 'Escritório 6%', 'Construção civil 3%', 'Mídia 3%', 'Energia 15%', 'Aéreo 10%', 'Farmacêutica 5%'],
      series: [20, 12, 2, 2, 2, 1, 8, 8, 3, 6, 3, 3, 15, 10, 5]
    };

    const options: PieChartOptions = {
      labelInterpolationFnc: value => String(value)[0]
    };

    const responsiveOptions: ResponsiveOptions<PieChartOptions> = [
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

    new PieChart('#quero-setores-chart', aumentarPosicaoSetores, options, responsiveOptions);
  }
}

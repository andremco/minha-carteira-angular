import { Component, OnInit } from '@angular/core';

export interface Acao {
  id: number;
  setorId: number;
  setorDescricao: string;
  razaoSocial: string;
  ticker: string;
  quantidade: number;
  nota: number;
  dataRegistro: string;
  precoDinamico: number;
  comprarOuAguardar: string;
  lucroOuPerda: string
}

@Component({
  selector: 'carteira',
  templateUrl: './carteira.component.html',
  styleUrls: ['./carteira.component.css']
})
export class CarteiraComponent implements OnInit {
  acoes: Acao[] = [   // Adicione mais ações conforme necessário
    {id: 1, setorId: 3, setorDescricao: 'Banco', razaoSocial: 'Banco do Brasil', ticker: 'BBS3', quantidade: 100, nota: 9, dataRegistro: '10/07/2024', precoDinamico: 35.62, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'},
  ];

  constructor() { }

  ngOnInit(): void {
  }
}

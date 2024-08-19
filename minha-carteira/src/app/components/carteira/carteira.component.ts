import {Component, inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {DialogVerMaisAtivoComponent} from "./dialog.ver.mais.ativo.component";

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

export interface TituloPublico {
  id: number;
  setorId: number;
  setorDescricao: string;
  descricao: string;
  quantidade: number;
  nota: number;
  dataRegistro: string;
  precoAjustado: number;
  comprarOuAguardar: string;
  lucroOuPerda: string
}

@Component({
  selector: 'carteira',
  templateUrl: './carteira.component.html',
  styleUrls: ['./carteira.component.scss'],
})
export class CarteiraComponent implements OnInit {

  public totalAporte : number = 20000000.20;
  public investAjustado : number = 28152086.78;
  public lucroPerda : number = (this.investAjustado - this.totalAporte);

  readonly dialog = inject(MatDialog);

  acoes: Acao[] = [   // Adicione mais ações conforme necessário
    {id: 1, setorId: 3, setorDescricao: 'Banco', razaoSocial: 'Banco do Brasil', ticker: 'BBS3', quantidade: 100, nota: 9, dataRegistro: '10/07/2024', precoDinamico: 35.62, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'},
    {id: 2, setorId: 4, setorDescricao: 'Bebidas', razaoSocial: 'Ambev S.A.', ticker: 'ABEV3', quantidade: 50, nota: 8, dataRegistro: '12/07/2024', precoDinamico: 15.00, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Lucro'},
    {id: 3, setorId: 5, setorDescricao: 'Construção civil', razaoSocial: 'Cyrela', ticker: 'CYRE3', quantidade: 60, nota: 8, dataRegistro: '12/07/2024', precoDinamico: 20.73, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Perda'},
    {id: 4, setorId: 6, setorDescricao: 'Mídia', razaoSocial: 'The Walt Disney Company Inc.', ticker: 'DISB34', quantidade: 10, nota: 7, dataRegistro: '21/07/2024', precoDinamico: 28.65, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Perda'},
    {id: 5, setorId: 7, setorDescricao: 'Aéreo', razaoSocial: 'Embraer', ticker: 'EMBR3', quantidade: 21, nota: 8, dataRegistro: '12/09/2024', precoDinamico: 18.13, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'},
    {id: 6, setorId: 8, setorDescricao: 'Fundo Imobiliário Títulos', razaoSocial: 'Patria Recebiveis Imobiliarios', ticker: 'HGCR11', quantidade: 4, nota: 7, dataRegistro: '28/07/2024', precoDinamico: 103.8, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Perda'},
  ];

  titulosPublico: TituloPublico[] = [
    {id: 1, setorId: 9, setorDescricao: 'Titulo Público', descricao: 'Tesouro IPCA+ 2045', quantidade: 163, nota: 6, dataRegistro: '10/09/2024', precoAjustado: 30.98, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'},
    {id: 2, setorId: 9, setorDescricao: 'Titulo Público', descricao: 'Tesouro Prefixado 2025', quantidade: 74, nota: 6, dataRegistro: '08/10/2024', precoAjustado: 37.31, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Lucro'},
    {id: 3, setorId: 9, setorDescricao: 'Titulo Público', descricao: 'Tesouro Prefixado 2026', quantidade: 33, nota: 6, dataRegistro: '01/11/2024', precoAjustado: 37.73, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'}
  ]

  constructor() { }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogVerMaisAtivoComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

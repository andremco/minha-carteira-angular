import {Component, inject, OnInit} from "@angular/core";
import {Acao} from "src/app/models/acao/Acao";
import {TituloPublico} from "src/app/models/titulo-publico/TituloPublico";
import {Ativo} from "src/app/models/Ativo";
import {DialogEditarAtivoComponent} from "src/app/components/dialogs/ativo/dialog.editar.ativo.component";
import {MatDialog} from "@angular/material/dialog";
import {CategoriaEnum} from "src/app/models/acao/CategoriaEnum";

@Component({
  selector: 'ativo',
  templateUrl: './ativo.component.html',
  styleUrl: './ativo.component.scss'
})
export class AtivoComponent implements OnInit {

  acoes: Acao[] = [   // Adicione mais ações conforme necessário
    {id: 1, setor: { id: 3, descricao: 'Banco'}, categoria: {  id: CategoriaEnum.Acao.valueOf(), descricao: 'Ação' }, razaoSocial: 'Banco do Brasil', ticker: 'BBS3', quantidade: 100, nota: 9, dataRegistro: new Date('2024-06-02'), precoDinamico: 35.62, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'},
    {id: 2, setor: { id: 4, descricao: 'Bebidas'}, categoria: { id: CategoriaEnum.Acao.valueOf(), descricao: 'Ação' },  razaoSocial: 'Ambev S.A.', ticker: 'ABEV3', quantidade: 50, nota: 8, dataRegistro: new Date('2024-07-12'), precoDinamico: 15.00, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Lucro'},
    {id: 3, setor: { id: 9, descricao: 'Construção civil'}, categoria: { id: CategoriaEnum.Acao.valueOf(), descricao: 'Ação' }, razaoSocial: 'Cyrela', ticker: 'CYRE3', quantidade: 60, nota: 8, dataRegistro: new Date('2024-07-08'), precoDinamico: 20.73, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Perda'},
    {id: 4, setor: { id: 6, descricao: 'Mídia'}, categoria: { id: CategoriaEnum.Acao.valueOf(), descricao: 'Ação' }, razaoSocial: 'The Walt Disney Company Inc.', ticker: 'DISB34', quantidade: 10, nota: 7, dataRegistro: new Date('2024-07-07'), precoDinamico: 28.65, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Perda'},
    {id: 5, setor: { id: 7, descricao: 'Aéreo'}, categoria: { id: CategoriaEnum.Acao.valueOf(), descricao: 'Ação' }, razaoSocial: 'Embraer', ticker: 'EMBR3', quantidade: 21, nota: 8, dataRegistro: new Date('2024-07-06'), precoDinamico: 18.13, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'},
    {id: 1, setor: { id: 2, descricao: 'Fundo Imobiliário Títulos'}, categoria: { id: CategoriaEnum.FundoImobiliario.valueOf(), descricao: 'Fundo Imobiliário' }, razaoSocial: 'Patria Recebiveis Imobiliarios', ticker: 'HGCR11', quantidade: 5, nota: 7, dataRegistro: new Date('2024-07-05'), precoDinamico: 103.8, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Perda'},
    {id: 1, setor: { id: 5, descricao: 'Logística'}, categoria: { id: CategoriaEnum.FundoImobiliario.valueOf(), descricao: 'Fundo Imobiliário' }, razaoSocial: 'XP Log Fundo de Investimento Imobiliário', ticker: 'XPLG11', quantidade: 8, nota: 7, dataRegistro: new Date('2024-12-12'), precoDinamico: 122.7, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Perda'},
    {id: 1, setor: { id: 8, descricao: 'Escritório'}, categoria: { id: CategoriaEnum.FundoImobiliario.valueOf(), descricao: 'Fundo Imobiliário' }, razaoSocial: 'XP Properties FII', ticker: 'XPPR11', quantidade: 12, nota: 7, dataRegistro: new Date('2024-09-09'), precoDinamico: 115.2, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Perda'}
  ];

  fiis: Acao[] = <Acao[]>this.acoes.find(a => a.categoria === undefined)

  titulosPublico: TituloPublico[] = [
    {id: 1, setor: { id: 1, descricao: 'Tesouro direto'}, descricao: 'Tesouro IPCA+ 2045', quantidade: 163, nota: 6, dataRegistro: new Date('2024-10-12'), precoAjustado: 30.98, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'},
    {id: 2, setor: { id: 1, descricao: 'Tesouro direto'}, descricao: 'Tesouro Prefixado 2025', quantidade: 74, nota: 6, dataRegistro: new Date('2024-10-09'), precoAjustado: 37.31, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Lucro'},
    {id: 3, setor: { id: 1, descricao: 'Tesouro direto'}, descricao: 'Tesouro Prefixado 2026', quantidade: 33, nota: 6, dataRegistro: new Date('2024-10-08'), precoAjustado: 37.73, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'}
  ];

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
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
}

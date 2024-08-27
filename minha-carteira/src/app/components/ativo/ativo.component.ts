import {AfterViewInit, Component, inject, OnInit} from "@angular/core";
import {TipoAtivo} from "src/app/models/TipoAtivo";
import {Acao} from "src/app/models/Acao";
import {TituloPublico} from "src/app/models/TituloPublico";
import {Ativo} from "src/app/models/Ativo";
import {DialogEditarAtivoComponent} from "src/app/components/dialogs/ativo/dialog.editar.ativo.component";
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'ativo',
  templateUrl: './ativo.component.html',
  styleUrl: './ativo.component.scss'
})
export class AtivoComponent implements OnInit {

  acoes: Acao[] = [   // Adicione mais ações conforme necessário
    {id: 1, setorId: 3, setorDescricao: 'Banco', razaoSocial: 'Banco do Brasil', ticker: 'BBS3', quantidade: 100, nota: 9, dataRegistro: new Date('2024-06-02'), precoDinamico: 35.62, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'},
    {id: 2, setorId: 4, setorDescricao: 'Bebidas', razaoSocial: 'Ambev S.A.', ticker: 'ABEV3', quantidade: 50, nota: 8, dataRegistro: new Date('2024-07-12'), precoDinamico: 15.00, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Lucro'},
    {id: 3, setorId: 9, setorDescricao: 'Construção civil', razaoSocial: 'Cyrela', ticker: 'CYRE3', quantidade: 60, nota: 8, dataRegistro: new Date('2024-07-08'), precoDinamico: 20.73, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Perda'},
    {id: 4, setorId: 6, setorDescricao: 'Mídia', razaoSocial: 'The Walt Disney Company Inc.', ticker: 'DISB34', quantidade: 10, nota: 7, dataRegistro: new Date('2024-07-07'), precoDinamico: 28.65, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Perda'},
    {id: 5, setorId: 7, setorDescricao: 'Aéreo', razaoSocial: 'Embraer', ticker: 'EMBR3', quantidade: 21, nota: 8, dataRegistro: new Date('2024-07-06'), precoDinamico: 18.13, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'},
    {id: 6, setorId: 2, setorDescricao: 'Fundo Imobiliário Títulos', razaoSocial: 'Patria Recebiveis Imobiliarios', ticker: 'HGCR11', quantidade: 4, nota: 7, dataRegistro: new Date('2024-07-05'), precoDinamico: 103.8, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Perda'},
  ];

  titulosPublico: TituloPublico[] = [
    {id: 1, setorId: 1, setorDescricao: 'Tesouro direto', descricao: 'Tesouro IPCA+ 2045', quantidade: 163, nota: 6, dataRegistro: new Date('2024-10-12'), precoAjustado: 30.98, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'},
    {id: 2, setorId: 1, setorDescricao: 'Tesouro direto', descricao: 'Tesouro Prefixado 2025', quantidade: 74, nota: 6, dataRegistro: new Date('2024-10-09'), precoAjustado: 37.31, comprarOuAguardar: 'Comprar', lucroOuPerda: 'Lucro'},
    {id: 3, setorId: 1, setorDescricao: 'Tesouro direto', descricao: 'Tesouro Prefixado 2026', quantidade: 33, nota: 6, dataRegistro: new Date('2024-10-08'), precoAjustado: 37.73, comprarOuAguardar: 'Aguardar', lucroOuPerda: 'Lucro'}
  ];

  public readonly TipoAtivo = TipoAtivo;

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
  }

  openDialog(ativo : Ativo, tipoAtivo : TipoAtivo) {
    const dialogRef = this.dialog.open(DialogEditarAtivoComponent, {
      data: {
        ativo,
        tipoAtivo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

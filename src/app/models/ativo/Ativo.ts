import {Setor} from "../setor/Setor";

export interface Ativo{
  id?: number;
  setor?: Setor;
  quantidade?: number;
  nota?: number;
  dataRegistro?: Date;
  valorTotalAtivo?: string;
  valorTotalAtivoAtual?: string;
  valorTotalCompras?: string;
  valorTotalVendas?: string;
  carteiraIdealPorcento?: string;
  carteiraTenhoPorcento?: string;
  quantoQueroTotal?: string;
  quantoFaltaTotal?: string;
  quantidadeQueFaltaTotal?: number;
  comprarOuAguardar?: string;
  lucroOuPerda?: string;
}

import {Setor} from "./setor/Setor";

export interface Ativo{
  id?: number;
  setor?: Setor;
  quantidade?: number;
  nota?: number;
  dataRegistro?: Date;
  valorTotalAtivo?: number;
  valorTotalAtivoAtual?: number;
  carteiraIdealPorcento?: number;
  carteiraTenhoPorcento?: number;
  quantoQueroTotal?: number;
  quantoFaltaTotal?: number;
  quantidadeQueFaltaTotal?: number;
  comprarOuAguardar?: string;
  lucroOuPerda?: string;
}

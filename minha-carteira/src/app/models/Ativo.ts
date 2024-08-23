export interface Ativo{
  id?: number
  setorId?: number
  setorDescricao? : string
  quantidade? : number
  nota? : number
  dataRegistro? : Date
  comprarOuAguardar?: string;
  lucroOuPerda?: string
}

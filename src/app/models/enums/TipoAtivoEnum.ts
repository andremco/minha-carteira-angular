export enum TipoAtivoEnum{
  Acao = 1,
  FundoImobiliario = 2,
  BrazilianDepositaryReceipts = 3,
  TituloPublico = 4
}

export function tipoAtivoEnumDescricao(tipoAtivo : TipoAtivoEnum) : string {
  if (tipoAtivo == TipoAtivoEnum.Acao)
    return "Ação";
  if (tipoAtivo == TipoAtivoEnum.FundoImobiliario)
    return "Fundo Imobiliário";
  if (tipoAtivo == TipoAtivoEnum.BrazilianDepositaryReceipts)
    return "Brazilian Depositary Receipts";
  if (tipoAtivo == TipoAtivoEnum.TituloPublico)
    return "Título Público";
  return "";
}

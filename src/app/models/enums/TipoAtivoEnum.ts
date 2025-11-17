export enum TipoAtivoEnum{
  Acao = 1,
  FundoImobiliario = 2,
  BrazilianDepositaryReceipts = 3,
  TituloPublico = 4
}

export function tipoAtivoEnumToDescricao(tipoAtivo : TipoAtivoEnum) : string {
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

export function descricaoTotipoAtivoEnum(descricao : string) : TipoAtivoEnum {
  if (descricao.toLowerCase() == "ação")
    return TipoAtivoEnum.Acao;
  if (descricao.toLowerCase() == "fundo imobiliário")
    return TipoAtivoEnum.FundoImobiliario;
  if (descricao.toLowerCase() == "brazilian depositary receipts")
    return TipoAtivoEnum.BrazilianDepositaryReceipts;
  if (descricao.toLowerCase() == "título público")
    return TipoAtivoEnum.TituloPublico;
  return TipoAtivoEnum.Acao;
}

export function numberToReal(valor?: number) : string {
  const zero : number = 0
  if (!valor)
    return zero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


export function numberToPercent(valor?: number) : string {
  if (valor === null || valor === undefined || isNaN(valor))
    return "0,00 %";
  let decimalPlaces: number = 2
  // Format the string to the specified number of decimal places
  return valor.toFixed(decimalPlaces).replace('.', ',') + ' %';
}


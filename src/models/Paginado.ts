export class Paginado<T> {
  pagina: number = 0;
  tamanho: number = 10;
  total: number = 0;
  itens: T[] = [];
}

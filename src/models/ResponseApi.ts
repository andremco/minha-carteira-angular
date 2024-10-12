export class ResponseApi<T> {
  data?: T;
  message: String[] = [];
  success: boolean = false;
}

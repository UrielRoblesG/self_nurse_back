export class Response {
  status: string;
  msg: string;
  data: any | Array<any>;

  constructor(status: string, msg: string, data?: any | Array<any>) {
    this.status = status;
    this.msg = msg;
    this.data = data;
  }
}

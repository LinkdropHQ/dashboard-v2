import { expose } from 'comlink'

export class MyWebWorker {
  private cb: (value: string) => void;

  public constructor(
    cb: (value: string) => void
  ) {
    this.cb = cb
  }  

  public async getData(
    
  ) : Promise<any> {
    this.cb('Hello world')
  }
}

expose(MyWebWorker)
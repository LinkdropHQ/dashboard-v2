import { expose } from 'comlink'
import LinkdropSDK from '@linkdrop/sdk';
import { EXPIRATION_DATE } from 'configs/app'
import { ethers } from 'ethers'

// export async function remoteFunction() {
//   await cb("A string from a worker")
// }

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
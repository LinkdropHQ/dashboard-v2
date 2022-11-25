// eslint-disable-next-line import/no-webpack-loader-syntax
import QRsWorkerItem from 'worker-loader!web-workers/qrs-worker'
import { QRsWorker } from 'web-workers/qrs-worker'
import { wrap, Remote, proxy } from 'comlink'
// eslint-disable-next-line import/no-webpack-loader-syntax
import LinksWorkerItem from 'worker-loader!web-workers/links-worker'
import { LinksWorker } from 'web-workers/links-worker'

type TWorker = {
  worker: Remote<QRsWorker> | Remote<LinksWorker>,
  data: any,
  worker_id: number,
  workerInstance: Worker
}

type TCreateDataGroups = (
  totalDataArray: any[],
  workersCount: number
) => any[][]

type TCreateQuantityGroups = (
  totalDataQuantity: number,
  workersCount: number
) => number[]

type TCreateWorkers = (
  groupData: any[][] | any[],
  type: 'links' | 'qrs',
  cb: (value: number) => Promise<void>
) => Promise<TWorker[]>

type TTerminateWorkers = (workers: TWorker[]) => void

export const createDataGroups: TCreateDataGroups = (
  totalDataArray,
  workersCount
) => {
  const initialData = [...totalDataArray]
  const result = []
  const groupData = totalDataArray.length / workersCount
  while(initialData.length) {
    result.push(initialData.splice(0, Math.ceil(groupData)))
  }
  return result
}

export const createQuantityGroups: TCreateQuantityGroups = (
  totalDataQuantity,
  workersCount
) => {
  const result = []
  let groupData = totalDataQuantity / workersCount
  while(totalDataQuantity > 0) {
    let singleItemQuantity = Math.ceil(groupData)
    if (singleItemQuantity > totalDataQuantity) {
      result.push(totalDataQuantity)
      totalDataQuantity = 0
    } else {
      result.push(singleItemQuantity)
      totalDataQuantity = totalDataQuantity - singleItemQuantity
    }
  }
  return result
}

export const createQRsWorker = async (
  cb: (value: number) => Promise<void>
  ) => {
  const workerInstance = new QRsWorkerItem()
  const RemoteChannel = wrap<typeof QRsWorker>(workerInstance)
  const worker: Remote<QRsWorker> = await new RemoteChannel(proxy(cb))
  return {
    worker,
    workerInstance
  }
}

export const createLinksWorker = async (
  cb: (value: number) => Promise<void>
  ) => {
  const workerInstance = new LinksWorkerItem()
  const RemoteChannel = wrap<typeof LinksWorker>(workerInstance)
  const worker: Remote<LinksWorker> = await new RemoteChannel(proxy(cb))
  return {
    worker,
    workerInstance
  }
}

export const createWorkers: TCreateWorkers = async (
  groupData,
  type,
  cb
) => {
  const workers = []
  for (let x = 0; x < groupData.length; x++) {
    const { worker, workerInstance } = type === 'qrs' ? await createQRsWorker(cb) : await createLinksWorker(cb)
    workers.push({
      worker,
      data: groupData[x],
      worker_id: x,
      workerInstance
    })
  }

  return workers
}

export const terminateWorkers: TTerminateWorkers = (workers) => {
  workers.forEach(({ workerInstance, worker_id }) => {
    console.log(`worker ${worker_id} terminated`)
    workerInstance.terminate()
  })
}
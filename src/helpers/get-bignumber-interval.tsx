import { bignumber, subtract } from 'mathjs'


type TGetBigNumberInterval = (
  initial: string,
  final: string
) => {
  prefix: string,
  suffix: string,
  limit: number,
  diff: string
}

const getBignumberInterval: TGetBigNumberInterval = (initial: string, final: string) => {
  const initialBN = bignumber(initial)
  const finalBN = bignumber(final)
  const result = subtract(finalBN, initialBN)
  const diff = String(result)
  const prefix = initial.slice(0, Number(`-${diff.length}`))
  const suffix = initial.slice(Number(`-${diff.length}`))
  const limit = Number(diff)
  return {
    prefix,
    suffix,
    limit,
    diff
  }
}


export default getBignumberInterval
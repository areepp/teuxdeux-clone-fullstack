import { IList } from './IList'

export interface IListCollection {
  id: number
  listOrder: number[]
  userId: string
  lists: IList[]
}

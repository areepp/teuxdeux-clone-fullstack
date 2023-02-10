/* eslint-disable no-unused-vars */
import create from 'zustand'
import { getInitialDateColumns } from '@/helper/dateHelper'
import { IDateColumn } from '@/types/IDateColumn'

interface State {
  dateColumns: IDateColumn[]
}

export interface DateColumnStore {
  dateColumns: IDateColumn[]
  setColumns: (_columns: IDateColumn[]) => void
  unshiftColumns: (_newColumns: IDateColumn[]) => void
  pushColumns: (_newColumns: IDateColumn[]) => void
  syncColumns: (_cloudColumns: IDateColumn[]) => void
  editColumnById: (_columnId: string, _newColumn: IDateColumn) => void
}

const useDateColumnStore = create<DateColumnStore>((set: any) => ({
  dateColumns: getInitialDateColumns(),
  setColumns: (newColumns: IDateColumn[]) =>
    set(() => ({ dateColumns: newColumns })),
  unshiftColumns: (newColumns: IDateColumn[]) =>
    // ADD COLUMNS TO THE BEGINNING OF THE ARRAY
    set((state: State) => ({
      dateColumns: [...newColumns, ...state.dateColumns],
    })),
  pushColumns: (newColumns: IDateColumn[]) =>
    // ADD COLUMNS TO THE END OF THE ARRAY
    set((state: State) => ({
      dateColumns: [...state.dateColumns, ...newColumns],
    })),
  syncColumns: (cloudColumns: IDateColumn[]) =>
    // REPLACE THE LOCAL COLUMN STATE WITH THE COLUMN FROM API IF MATCH
    set((state: State) => ({
      dateColumns: state.dateColumns.map(
        (local: IDateColumn) =>
          cloudColumns.find((cloud) => cloud.id === local.id) || local,
      ),
    })),
  editColumnById: (columnId: string, newColumn: IDateColumn) =>
    // prettier-ignore
    set((state: State) => ({
      dateColumns: state.dateColumns.map((column: IDateColumn) =>
        (column.id === columnId ? newColumn : column)),
    })),
}))

export default useDateColumnStore

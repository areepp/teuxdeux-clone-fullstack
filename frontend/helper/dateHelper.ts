import { IDateColumn } from '@/types/IDateColumn'

export const transformDateSlashToDash = (date: string) =>
  date.replace(/\//g, '-')

const columnFactory = (date: string) => ({
  id: transformDateSlashToDash(date),
  todoOrder: [],
})

export const getDateColumns = (
  initialDate: Date,
  days: number,
  direction: 'future' | 'past',
): IDateColumn[] => {
  const returnValue: IDateColumn[] = []
  let multiplier = 1

  if (direction === 'past') multiplier = -1

  for (let i = 1; i <= days; i++) {
    const nextDate = new Date(
      initialDate.getTime() + 24 * 60 * 60 * 1000 * i * multiplier,
    ).toLocaleDateString()
    returnValue.push(columnFactory(nextDate))
  }

  return returnValue
}

export const getInitialDateColumns = (): IDateColumn[] => {
  // returns an array of column that contains 21 days (last week and next 2 weeks)
  const today = new Date()
  const nextTwoWeeks = getDateColumns(today, 14, 'future')
  const lastWeek = getDateColumns(today, 7, 'past')

  return [
    ...lastWeek.reverse(),
    columnFactory(today.toLocaleDateString()),
    ...nextTwoWeeks,
  ]
}

export const getReintiatedDateColumns = (date: Date): IDateColumn[] => [
  ...getDateColumns(date, 7, 'past').reverse(),
  columnFactory(date.toLocaleDateString()),
  ...getDateColumns(date, 7, 'future'),
]

export const getNextFourDates = (startDate: string): IDateColumn[] => {
  const date = new Date(startDate)

  return getDateColumns(date, 4, 'future')
}

export const getPastFourDates = (startDate: string): IDateColumn[] => {
  const date = new Date(startDate)

  return getDateColumns(date, 4, 'past')
}

export const getDayOfTheWeek = (prop: string) => {
  const date = new Date(prop)

  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

export const getFullDate = (prop: string) => {
  const date = new Date(prop)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const checkIsToday = (date: string) => {
  const todayDate = new Date()
  const inputDate = new Date(date)

  return inputDate.setHours(0, 0, 0, 0) === todayDate.setHours(0, 0, 0, 0)
}

export const checkIsPast = (date: string) => {
  const todayDate = new Date()
  const inputDate = new Date(date)

  return inputDate.setHours(0, 0, 0, 0) < todayDate.setHours(0, 0, 0, 0)
}

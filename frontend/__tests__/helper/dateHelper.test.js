import { getDateColumns } from '@/helper/dateHelper'

test('getDateColumns functions properly', () => {
  const date = new Date('1/1/2023')
  const columns = getDateColumns(date, 7, 'future')

  const expectedOutput = [
    { id: '1-2-2023', todoOrder: [] },
    { id: '1-3-2023', todoOrder: [] },
    { id: '1-4-2023', todoOrder: [] },
    { id: '1-5-2023', todoOrder: [] },
    { id: '1-6-2023', todoOrder: [] },
    { id: '1-7-2023', todoOrder: [] },
    { id: '1-8-2023', todoOrder: [] },
  ]

  expect(columns).toEqual(expectedOutput)
})

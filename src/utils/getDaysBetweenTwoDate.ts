import convertMillisecondsToDays from 'utils/convertMillisecondsToDays'

type DaysBetweenTwoDate = number

const getDaysBetweenTwoDate = (
  startDate: Date,
  endDate: Date
): DaysBetweenTwoDate => {
  const startMilliseconds = startDate.getTime()
  const endMilliseconds = endDate.getTime()

  const daysBetweenTwoDate = convertMillisecondsToDays(
    endMilliseconds - startMilliseconds
  )

  return Math.floor(daysBetweenTwoDate)
}

export default getDaysBetweenTwoDate

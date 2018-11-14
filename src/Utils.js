import * as d3 from 'd3'
import * as R from 'ramda'

const bisectX = d3.bisector(d => d.date).left
export const getIdx = (date, values) => {
  const index = R.clamp(0, values.length - 1, bisectX(values, date, 1))
  const d0 = values[index - 1].date
  const d1 = values[index].idx
  return Math.abs(d0 - date) < Math.abs(d1 - date) ? index - 1 : index
}

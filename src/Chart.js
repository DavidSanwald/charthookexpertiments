import * as d3 from 'd3'
import * as R from 'ramda'
import React, { useRef, useMemo, useReducer } from 'react'
import { useComponentSize, useMedia } from './customHooks'
import { localPoint, touchPoint } from './eventHelpers'
import { colors, padding, chartConfig } from './config'
import Line from './Line'
import { Box, Card, Heading } from 'rebass'
import data from './exampleData'
import { getIdx } from './Utils'

const marginS = { top: 0, right: 64, bottom: 64, left: 64 }
const marginM = { top: 0, right: 64, bottom: 64, left: 64 }
const marginL = { top: 0, right: 128, bottom: 128, left: 64 }
const marginXL = { top: 0, right: 128, bottom: 128, left: 64 }
const marginList = [marginS, marginM, marginL, marginXL]
const pluckIDs = R.pluck('id')
const xAcc = R.prop('date')
const yAcc = R.prop('value')
const values = R.prop('values')
const id = R.prop('id')
const getWidth = R.propOr(900, 'width')
const getHeight = R.propOr(450, 'height')
const getAllData = state => state.allIds.map(id => state.byId[id])

const getVisibleData = state => {
  const allData = getAllData(state)
  return allData.filter(data => data.isActive || data.isHovered)
}
const getHoveredDate = scale =>
  R.compose(
    scale.invert,
    R.defaultTo(0),
    R.prop('position')
  )
const getFlatVisibleData = state => R.chain(values, getVisibleData(state))
const initialState = {
  position: '',
  allIds: pluckIDs(data),
  byId: R.reduce(
    (acc, value) => ({
      ...acc,
      [id(value)]: {
        values: values(value),
        id: id(value),
        isActive: true,
        isHovered: false
      }
    }),
    {},
    data
  )
}
const positionReducer = (state, action) => {
  const { payload, type } = action
  switch (type) {
    case 'mouseLeave':
      return ''
    case 'mouseMove':
      return payload
    default:
      return state
  }
}
const activeReducer = (state, action) => {
  const { type } = action
  switch (type) {
    case 'toggle':
      const isActive = !state.isActive
      return { ...state, isActive }
    default:
      return state
  }
}
const hoverReducer = (state, action) => {
  const { type } = action
  switch (type) {
    case 'mouseEnter':
      return { ...state, isHovered: true }
    case 'mouseLeave':
      return { ...state, isHovered: false }
    default:
      return state
  }
}
const seriesReducer = (state, action) => {
  const { payload, type } = action
  switch (type) {
    case 'toggle':
      return { ...state, [payload]: activeReducer(state[payload], action) }
    case 'mouseEnter':
      return { ...state, [payload]: hoverReducer(state[payload], action) }
    case 'mouseLeave':
      return { ...state, [payload]: hoverReducer(state[payload], action) }
    default:
      return state
  }
}
const reducer = (state, action) => {
  const byId = state.byId
  const position = positionReducer(state.position, action)
  const series = seriesReducer(byId, action)
  return { ...state, position, byId: series }
}
const aspectRatio = 2
const Chart = () => {
  const M = useMedia('(min-width:40em )') ? 1 : 0
  const L = useMedia('(min-width:52em )') ? 1 : 0
  const XL = useMedia('(min-width:62em )') ? 1 : 0
  const media = M + L + XL
  const margin = marginList[media]
  console.log(margin)
  const ref = useRef(null)
  const xAxisRef = useRef(null)
  const yAxisRef = useRef(null)
  const componentSize = useComponentSize(ref)
  const outerWidth = R.min(900, getWidth(componentSize))
  const outerHeight = outerWidth / aspectRatio

  const height = useMemo(() => outerHeight - margin.bottom - margin.top, [
    outerWidth
  ])
  const width = useMemo(() => outerWidth - margin.left - margin.right, [
    outerWidth
  ])

  const [state, dispatch] = useReducer(reducer, initialState)

  const flatData = getFlatVisibleData(state)
  const colorMap = R.zipObj(state.allIds, colors)

  const xExtent = useMemo(() => d3.extent(flatData, xAcc))
  const yExtent = useMemo(() => d3.extent(flatData, yAcc))
  const yRange = yExtent[1] - yExtent[0]

  const xScale = useMemo(
    () =>
      d3
        .scaleTime()
        .domain(xExtent)
        .range([0, width]),
    [xExtent, width]
  )

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, yExtent[1] + yRange * padding])
        .range([height, 0]),
    [height, yExtent, yRange]
  )
  const hoveredIndex = useMemo(
    () =>
      state.position
        ? R.converge(getIdx, [
            getHoveredDate(xScale),
            R.path(['byId', 'Haskell', 'values'])
          ])(state)
        : 0,
    [state.position]
  )
  const xAxis = d3
    .axisBottom(xScale)
    .tickSizeOuter(0)
    .tickSizeInner(0)
    .tickPadding(32)
    .tickFormat(d3.timeFormat('%b'))
    .ticks(d3.timeMonth.every(1))

  const yAxis = d3
    .axisLeft(yScale)
    .tickSizeOuter(0)
    .tickSizeInner(-width)
    .tickPadding(32)
    .ticks(3)

  d3.select(xAxisRef.current)
    .call(xAxis)
    .style('font-size', 14)
  d3.select(yAxisRef.current)
    .call(yAxis)
    .style('font-size', 14)
    .select('.domain')
    .remove()
  return (
    <Card
      boxShadow="0 2px 16px rgba(0, 0, 0, 0.25)"
      width={[1, 1, 1, 1]}
      bg="#FFFFFF"
      css={{ maxWidth: '900px' }}>
      <Heading p={[4, 4, 5, 5]}>Hello</Heading>
      <Box ref={ref}>
        <svg width={outerWidth} height={outerHeight} pointerEvents="none">
          <g
            transform={`translate(${margin.left}, ${margin.top})`}
            pointerEvents="none">
            <rect
              width={width}
              height={height}
              pointerEvents="all"
              fill="transparent"
              onMouseMove={e =>
                dispatch({
                  type: 'mouseMove',
                  payload: localPoint(e).x - margin.left
                })
              }
              onTouchMove={e =>
                dispatch({
                  type: 'mouseMove',
                  payload: localPoint(e).x - margin.left
                })
              }
              onTouchStart={e =>
                dispatch({
                  type: 'mouseMove',
                  payload: localPoint(e).x - margin.left
                })
              }
              onMouseLeave={e =>
                dispatch({
                  type: 'mouseLeave'
                })
              }
            />
            {getVisibleData(state).map((d, i) => (
              <Line
                hovered={d.isHovered}
                position={state.position}
                xAcc={xAcc}
                yAcc={yAcc}
                xScale={xScale}
                yScale={yScale}
                data={R.prop('values')(d)}
                opacity={d.isActive ? 1 : 0.1}
                color={colorMap[d.id]}
                key={d.id}
                idx={hoveredIndex}
              />
            ))}
            <g transform={`translate(${0}, ${height})`} ref={xAxisRef} />
            <g transform={`translate(${0}, ${0})`} ref={yAxisRef} />
          </g>
        </svg>
      </Box>
    </Card>
  )
}
export default Chart

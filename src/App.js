import './App.css'
import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  forwardRef,
  useMemo
} from 'react'
import { Layout, Card } from 'antd'
import * as d3 from 'd3'
import * as R from 'ramda'
import { DateTime } from 'luxon'
import rawData from './dummyData'
const { Header, Content, Footer, Sider } = Layout

const margin = { top: 20, right: 10, bottom: 20, left: 10 }
const outerHeight = 300
const outerWidth = 900
const width = outerWidth - margin.left - margin.right
const height = outerHeight - margin.bottom - margin.top
const x = R.prop('acres')
const y = R.prop('vertical')
const keyAcc = R.prop('resort_name')
const xExtent = d3.extent(rawData, x)
const yExtent = d3.extent(rawData, y)

const Scatter = ({ x, y, xScale, yScale, keyAcc, data, size }) => {
  console.log(size)
  const xAcc = R.compose(
    xScale,
    x
  )
  const yAcc = R.compose(
    yScale,
    y
  )
  const isSelected = isInBounds(size)
  const circles = data.map(datum => (
    <circle
      key={`dot-${keyAcc(datum)}`}
      fill={isSelected(xAcc(datum), yAcc(datum)) ? 'red' : 'green'}
      className="dot"
      r="3.5"
      cx={xAcc(datum)}
      cy={yAcc(datum)}
    />
  ))
  return <g>{circles}</g>
}

const useBrush = (ref, size, setSize) => {
  const brush = d3
    .brush()
    .extent([[0, 0], [width, height]])
    .on('brush', function brushed() {
      const s = d3.event.selection
      setSize(s)
    })
  useEffect(() => {
    const container = d3
      .select(ref.current)
      .selectAll('.container')
      .data([null])
    container
      .enter()
      .append('g')
      .merge(container)
      .call(brush)
  })
  return size
}
const isInBounds = s => (x, y) => {
  const x0 = s[0][0]
  const y0 = s[0][1]
  const dx = s[1][0] - x0
  const dy = s[1][1] - y0
  return x >= x0 && x <= x0 + dx && y >= y0 && y <= y0 + dy
}
const App = () => {
  const ref = useRef(null)
  const [size, setSize] = useState([[0, 0], [width, height]])
  useBrush(ref, size, setSize)
  const xScale = d3
    .scaleLinear()
    .domain(xExtent)
    .range([0, width])
  const yScale = d3
    .scaleLinear()
    .domain(yExtent)
    .range([height, 0])
  
  return (
    <Layout>
      <Content>
        <Card title="Chart">
          <svg width={outerWidth} ref={ref} height={outerHeight}>
            <g
              className="container"
              transform={`translate(${margin.left}, ${margin.top})`}>
              <Scatter
                size={size}
                data={rawData}
                keyAcc={keyAcc}
                y={y}
                x={x}
                yScale={yScale}
                xScale={xScale}
              />
            </g>
          </svg>
        </Card>
      </Content>
    </Layout>
  )
}
export default App

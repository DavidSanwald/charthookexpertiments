import { useSpring, animated, config } from 'react-spring'
import * as d3 from 'd3'
import * as R from 'ramda'
import React, { useRef, useMemo, memo } from 'react'
const fast = { tension: 1200, friction: 40 }
const slow = { tension: 1200, friction: 80 }
const getYforX = (x, path, error = 0.01) => {
  if (!path) return
  var end = path.getTotalLength()

  var start = 0
  var point = path.getPointAtLength((end + start) / 2)
  var iterMax = 5
  var iters = 0
  while (Math.abs(x - point.x) > error) {
    point = path.getPointAtLength((end + start) / 2)
    if (x < point.x) {
      end = (start + end) / 2
    } else {
      start = (end + start) / 2
    }
    if (iters++ > iterMax) break
  }
  return point.y
}

const Line = memo(
  ({
    xAcc,
    yAcc,
    data,
    xScale,
    yScale,
    id,
    color,
    opacity,
    idx,
    position,
    hovered
  }) => {
    const ref = useRef()
    const x = R.compose(
      xScale,
      xAcc
    )
    const y = R.compose(
      yScale,
      yAcc
    )
    const lineGen = d3
      .line()
      .x(d => x(d))
      .y(d => y(d))
      .curve(d3.curveCatmullRom.alpha(1))

    const pathD = lineGen(data)
    const [properties] = useSpring({
      d: `${pathD}`,
      strokeOpacity: `${opacity}`,
      from: { strokeOpacity: `${0}`, d: `${pathD}` }
    })
    const yPos =
      useMemo(() => getYforX(position, ref.current, 1), [position]) ||
      y(data[idx])
    const [{ pos1 }] = useSpring({
      pos1: [position || 0, yPos],
      from: { pos1: [position || 0, 0] },
      config: fast
    })
    const [{ pos2 }] = useSpring({ pos2: pos1, config: slow })
    const [{ pos3 }] = useSpring({ pos3: pos2, config: slow })
    const [{ pos4 }] = useSpring({ pos4: pos3, config: slow })
    const [{ pos5 }] = useSpring({ pos5: pos4, config: slow })
    console.log(position)

    return (
      <>
        <animated.path
          strokeDasharray={hovered ? '4' : 'none'}
          ref={ref}
          strokeWidth={2}
          fill="none"
          className="line"
          stroke={color}
          key={id}
          {...properties}
        />{' '}
        {position && (
          <>
            <animated.circle
              className="dot"
              r={15}
              fill={color}
              cx={pos1.interpolate((x, y) => `${x}`)}
              cy={pos1.interpolate((x, y) => `${y}`)}
            />
            <animated.circle
              className="dot"
              r={12}
              fill={color}
              cx={pos2.interpolate((x, y) => `${x}`)}
              cy={pos2.interpolate((x, y) => `${y}`)}
            />
            <animated.circle
              className="dot"
              r={10}
              fill={color}
              cx={pos3.interpolate((x, y) => `${x}`)}
              cy={pos3.interpolate((x, y) => `${y}`)}
            />
            <animated.circle
              className="dot"
              r={8}
              fill={color}
              cx={pos4.interpolate((x, y) => `${x}`)}
              cy={pos4.interpolate((x, y) => `${y}`)}
            />
            <animated.circle
              className="dot"
              r={5}
              fill={color}
              cx={pos5.interpolate((x, y) => `${x}`)}
              cy={pos5.interpolate((x, y) => `${y}`)}
            />
          </>
        )}
      </>
    )
  }
)
export default Line

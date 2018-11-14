import { useSpring, animated } from 'react-spring'
import * as d3 from 'd3'
import * as R from 'ramda'
import React, { useEffect } from 'react'
const fast = { tension: 1200, friction: 40 }
const slow = { mass: 10, tension: 200, friction: 50 }
const Dots = ({
  xAcc,
  yAcc,
  data,
  xScale,
  yScale,
  id,
  idx,
  color,
  position
}) => {
  const x = R.compose(
    xScale,
    xAcc
  )
  const y = R.compose(
    yScale,
    yAcc
  )
  const [{ pos1 }, set] = useSpring({
    pos1: [x(data[idx || 1]), y(data[idx || 1])],
    config: fast
  })
  const [{ pos2 }] = useSpring({ pos2: pos1, config: fast })
  const [{ pos3 }] = useSpring({ pos3: pos2, config: fast })
  return (
    <>
      {position && (
        <>
          <animated.circle
            className="dot"
            r={10}
            fill={color}
            cx={pos1.interpolate((x, y) => `${x}`)}
            cy={pos1.interpolate((x, y) => `${y}`)}
          />{' '}
          <animated.circle
            className="dot"
            r={8}
            fill={color}
            cx={pos2.interpolate((x, y) => `${x}`)}
            cy={pos2.interpolate((x, y) => `${y}`)}
          />
          <animated.circle
            className="dot"
            r={5}
            fill={color}
            cx={pos3.interpolate((x, y) => `${x}`)}
            cy={pos3.interpolate((x, y) => `${y}`)}
          />
        </>
      )}
    </>
  )
}
export default Dots

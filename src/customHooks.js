import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback
} from 'react'
import * as d3 from 'd3'
import { chartConfig } from './config'

export const useMedia = (query, defaultState = false) => {
  const [state, setState] = useState(defaultState)

  useEffect(
    () => {
      let mounted = true
      const mql = window.matchMedia(query)
      const onChange = () => {
        if (!mounted) return
        setState(!!mql.matches)
      }

      mql.addListener(onChange)
      setState(mql.matches)

      return () => {
        mounted = false
        mql.removeListener(onChange)
      }
    },
    [query]
  )

  return state
}

export const useCycle = ({ from = 1, to = 4, step = 1 } = {}) => {
  const [cycle, setCycle] = useState(from)
  const advanceCycle = () => setCycle(cycle => (cycle + step) % to || from)
  return [cycle, advanceCycle]
}

export const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
function getSize(el) {
  if (!el) {
    return {}
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight
  }
}

export function useComponentSize(ref) {
  let [ComponentSize, setComponentSize] = useState(getSize(ref.current))

  function handleResize() {
    if (ref && ref.current) {
      setComponentSize(getSize(ref.current))
    }
  }

  useLayoutEffect(() => {
    handleResize()

    if (ResizeObserver) {
      let resizeObserver = new ResizeObserver(() => handleResize())
      resizeObserver.observe(ref.current)

      return () => {
        resizeObserver.disconnect(ref.current)
        resizeObserver = null
      }
    } else {
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return ComponentSize
}
export const AxisBox = ({ x = 0, y = 0, axis } = {}) => {
  const ref = useRef(null)
  useEffect(() => {
    const g = d3
      .select(ref.current)
      .attr('stroke', chartConfig.strokeColor)
      .style('font-family', 'Libre Baskerville')
      .call(axis)
      .select('.domain')
      .remove()
      .transition()
  })
  return <g ref={ref} transform={`translate(${x}, ${y})`} />
}
export const useFilter = initial => {
  const [dataFilter, setValue] = useState(
    initial.reduce((acc, curr) => {
      acc[curr] = true
      return acc
    }, {})
  )
  return {
    dataFilter,
    setValue,
    toggle: useCallback(id =>
      setValue(dataFilter => ({ ...dataFilter, [id]: !dataFilter[id] }), [])
    )
  }
}
export const useBuffer = (init, capacity = 10) => {
  const [buffer, setBuffer] = useState([].concat(init))
  const addEntry = entry => {
    const newBuffer =
      buffer.length < capacity
        ? [...buffer, entry]
        : [...buffer.slice(1, capacity), entry]
    setBuffer(newBuffer)
  }
  return { buffer, addEntry }
}

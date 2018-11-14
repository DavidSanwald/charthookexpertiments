import styled from 'styled-components'
import { Box } from '@rebass/grid'

const ChartContainer = styled(Box)`
  background-color: yellow;
`
ChartContainer.defaultProps = {
  width: [1, 1, 2 / 3]
}
export default ChartContainer

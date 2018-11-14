import styled from 'styled-components'
import { Flex } from '@rebass/grid'

const Container = styled(Flex)`
  max-width: 1024px;
  height: 100vh;
  align-items: center;
  justify-content: center;
`
Container.defaultProps = {
  mx: 'auto'
}
export default Container

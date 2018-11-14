import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Chart from './Chart'
import ErrorBoundary from './ErrorBoundary'
import { normalize } from 'polished'
import { Flex, Box } from '@rebass/grid'
const GlobalStyle = createGlobalStyle`

${normalize()}
  body {
    font-family:'Libre Baskerville', serif;
    background-color: #9E9E9E;
  }
`

const App = () => {
  return (
    <ErrorBoundary>
      <GlobalStyle />
      <Flex
        alignItems="center"
        justifyContent="center"
        css={{
          minHeight: '100vh'
        }}>
        <Chart />
      </Flex>
    </ErrorBoundary>
  )
}
export default App

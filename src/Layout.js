import styled from 'styled-components'
import { fluidRange } from 'polished'

export const MainWrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  justify-content: center;
`

export const Menu = styled.ul`
  width: 100%;
  list-style: none;
`

export const Name = styled.h1`
  font-size: 100%;
`

export const Value = styled.h1`
  font-size: 100%;
`

export const Item = styled.li`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  border-radius: 5px;
  background-color: ${props => (props.isActive ? props.color : 'none')};
  text-decoration: ${props => (props.isActive ? 'none' : 'line-through')};
  color: ${props => (props.isHovered ? '#fafafa' : ' #3c3c3c')};
`

export const Card = styled.div`
  background-color: #efecea;
  width: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
`

import styled, { css } from 'styled-components'

export const CustomCheckboxClassName = 'CustomCheckboxClassName'

export const CheckboxContainer = styled.div<{disabled?: boolean}>`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: fit-content;
  position: relative;

  ${props => props.disabled && css`
    cursor: not-allowed;
    opacity: .6;
    user-select: none;
  `}
`

export const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
  height: 20px;
  width: 20px;

  &:checked ~ .${CustomCheckboxClassName} {
    background: ${props => props.theme.primaryHighlightColor};
  }
`

export const CheckboxLabel = styled.h3`
  margin: 0 0 0 4px;
  font-weight: 400;
  font-size: 16px;
`

export const CheckboxMark = styled.span`
  border-radius: 3px;
  content: '';
  display: inline-block;
  width: 20px;
  position: relative;
  user-select: none;
  height: 20px;
  border: 1px solid ${props => props.theme.primaryBorderColor};
  padding: 1px;
  

  svg {
    width: 100%;
  }
`

export const CheckboxContent = styled.div``
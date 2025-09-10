import styled, { css } from "styled-components"
import TProps from "./types"

export const TooltipContainer = styled.span<TProps>`
  position: relative;
  color: ${props => props.theme.primaryHighlightColor};

  &:after {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    content: "${props => props.text}";
    right: 0;
    top: calc(100% + 10px);
    border-radius: 8px;
    color: ${props => props.theme.primaryTextColor};
    box-shadow: 0px 8px 16px rgba(96,97,112,0.16);
    background-color: ${props => props.theme.primaryBackgroundColor};
    z-index: 10;
    padding: 8px 16px;
    font-size: 14px;
    width: 300px;
    transform: translateY(-20px);
    transition: all 150ms cubic-bezier(.25, .8, .25, 1);

    ${props => props.position === 'right' && css`
      right: auto;
      left: 0;
    `}
  }

  &:hover:after {
    opacity: 1;
    transform: translateY(0);
    transition-duration: 300ms;
  }
`
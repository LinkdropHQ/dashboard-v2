import {
  FC,
  useState
} from 'react'
import { TProps } from './types'
import {
  AsidePopup
} from 'components/common'
import { InputStyled, InputContainer, TokenSymbol } from './styled-components'
import { ethers } from 'ethers5'

const ForcedTokenAmount: FC<TProps> = ({
  title,
  subtitle,
  onClose,
  action,
  toggleAction,
  toggleValue,
  forcedTokenAmount,
  tokenDecimals,
  tokenSymbol,
  loading
}) => {
  const formatAmount = (amountWei: string, decimals: number): string => {
    if (!amountWei || amountWei === '0') return ''
    try {
      return ethers.utils.formatUnits(amountWei, decimals)
    } catch {
      return ''
    }
  }

  const [amountValue, setAmountValue] = useState<string>(
    formatAmount(forcedTokenAmount, tokenDecimals)
  )

  const parseAmount = (amount: string, decimals: number): string => {
    if (!amount || amount === '') return '0'
    try {
      return ethers.utils.parseUnits(amount, decimals).toString()
    } catch {
      return '0'
    }
  }

  const isValidAmount = (amount: string): boolean => {
    if (!amount || amount === '') return true
    try {
      const num = parseFloat(amount)
      return !isNaN(num) && num >= 0
    } catch {
      return false
    }
  }

  return <AsidePopup
    title={title}
    subtitle={subtitle}
    onClose={onClose}
    toggleAction={toggleAction}
    toggleState={toggleValue}
    actionDisabled={loading}
    action={() => {
      if (amountValue && !isValidAmount(amountValue)) {
        return alert('Please enter a valid token amount')
      }

      const amountWei = parseAmount(amountValue, tokenDecimals)
      action(
        amountWei,
        () => onClose()
      )
    }}
  >
    {toggleValue && <>
      <InputContainer>
        <InputStyled
          placeholder="0.0"
          value={amountValue}
          onChange={(value: string) => {
            setAmountValue(value)
            return value
          }}
        />
        <TokenSymbol>{tokenSymbol}</TokenSymbol>
      </InputContainer>
    </>}
  </AsidePopup>
}

export default ForcedTokenAmount

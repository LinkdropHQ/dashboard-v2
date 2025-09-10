import { FC, useEffect, useState } from 'react'
import { TProps } from './types'
import {
  AsidePopup
} from 'components/common'
import { TextAreaStyled } from './styled-components'
import { parseWhitelistAddresses } from 'helpers'

const Whitelist: FC<TProps> = ({
  title,
  subtitle,
  onClose,
  toggleAction,
  toggleValue,
  currentDispenser,
  loading,
  action,
  getDispenserWhitelist
}) => {

  const [ value, setValue ] = useState<string>('')

  useEffect(() => {
    const value = currentDispenser && currentDispenser.whitelist ? currentDispenser.whitelist.map(whitelistItem => {
      if (whitelistItem.type === 'address') return whitelistItem.address
    }).join('\n'): ``
    setValue(value)
  }, [currentDispenser?.whitelist])

  useEffect(() => {
    if (!currentDispenser) { return }
    getDispenserWhitelist(currentDispenser.dispenser_id as string)
  }, [])

  return <AsidePopup
    title={title}
    subtitle={subtitle}
    onClose={onClose}
    action={() => {
      const addresses = parseWhitelistAddresses(value)
      if (!addresses) {
        return alert('Check format')
      }

      action(
        addresses,
        () => onClose()
      )

    }}
    toggleAction={toggleAction}
    toggleState={toggleValue}
  >
      {toggleValue && <TextAreaStyled
        onChange={(value: string) => {
          setValue(value)
          return value
        }}
        disabled={loading}
        value={value}
        title='Recipient address'
        placeholder={`Be careful and paste addresses here, i.e.:

0xdfs7d8f7s8df98df09s8df98s0df9s80df90sdf
0xdfs7d8f7s8df98df09s8df98s0df9s80df90sdf
0xdfs7d8f7s8df98df09s8df98s0df9s80df90sdf and so on
        `}
      />}
  </AsidePopup>
}

export default Whitelist
import {
  QRItem,
  QRItemTitle,
  QRItemAmount,
  QRItemStatus,
  QRItemControls,
  QRItemButton,
  QRItemLinks
} from './styled-components'

import { FC } from 'react'
import { TQRProps } from './types'
import { defineQRStatusName } from 'helpers'

const QR: FC<TQRProps> = ({
  set_name,
  qr_quantity,
  status,
  className,
  links_uploaded,
  onManage
}) => {
  return <QRItem className={className}>
    <QRItemTitle>
      {set_name}
    </QRItemTitle>
    <QRItemAmount>
      <span>{qr_quantity}</span> QR(s)
    </QRItemAmount>
    <QRItemStatus>
      {defineQRStatusName(status)}
    </QRItemStatus>
    <QRItemLinks>
      {links_uploaded ? 'Links uploaded' : 'No links uploaded'}
    </QRItemLinks>
    <QRItemControls>
      <QRItemButton
        title='Manage'
        onClick={onManage}
      />
    </QRItemControls>
  </QRItem>
}

export default QR
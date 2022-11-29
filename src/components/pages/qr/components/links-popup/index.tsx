import { FC, useState, FormEvent } from 'react'
import { Popup, Note } from 'components/common'
import { TProps } from './types'
import { InputComponent, StyledProgressBar, PopupForm, WidgetButton, PopupFormContent } from '../../styled-components'

const LinksPopup: FC<TProps> = ({
  onClose,
  onSubmit,
  quantity,
  loader,
  loading
}) => {
  const [ data, setData ] = useState<any>('')
  const onSubmitCallback = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const target = (evt.target as HTMLFormElement)
    
    if (!target) { return }
    const { elements } = target
    const file = elements[0] as HTMLInputElement
    if (!file || !file.files) { return }
    const reader = new FileReader()
    reader.readAsBinaryString(file.files[0])
    reader.onloadend = function () {
      const lines = (reader.result as string).split('\n')
      if (lines[0] !== "link_id,claim_link") {
        return alert('Invalid file. File should be downloaded from campaigns page')
      }
      lines.shift()
      const links = lines.map(item => {
        const [ link_id, claim_link ] = item.split(',')
        return {
          link_id,
          claim_link
        }
      })
      if (links.length !== Number(quantity)) {
        return alert(`Amount of links should be equal to an amount of QRs. Number of links is ${links.length}, but ${quantity} needed`)
      }
      onSubmit(links)
    }
  }

  return <Popup
    title='Upload links'
    onClose={() => {
      onClose()
    }}
  >
    <PopupForm onSubmit={onSubmitCallback}>
      <PopupFormContent>
        <InputComponent
          type='file'
          value={data}
          name='file'
          onChange={(value) => {
            setData(value)
            return ''
          }}
          placeholder='Quantity'
        />
        <Note>
          You will not be able to change quantity of QR's after upload of links
        </Note>
      </PopupFormContent>

      {loading && <StyledProgressBar
        current={Math.ceil(loader * 100)}
        max={100}
      />}

      <WidgetButton
        disabled={loading}
        type='submit'
        title='Upload'
      />
    </PopupForm>
  </Popup>
}

export default LinksPopup

import styled from 'styled-components'
import { Input, Select } from 'components/common'

export const UserAssets = styled.div`
  display: flex;
  color: ${props => props.theme.primaryHighlightColor};
`

export const UserAsset = styled.div`
  
`

export const UserAssetNative = styled(UserAsset)`
  margin-right: auto;
`

export const WidgetInput = styled(Input)`
  margin-bottom: 6px;
`

export const WidgetInputTokenId = styled(Input)`
  margin-bottom: 20px;
  margin-top: 10px;
`

export const SelectComponent = styled(Select)`
  margin-bottom: 40px;
`
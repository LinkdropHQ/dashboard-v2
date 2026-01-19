import { FC, useState } from 'react'
import {
  InputsContainer,
  InputStyled,
  ButtonStyled,
  TextBold,
  NotesContainer,
  InstructionNoteStyled,
  Container,
  Header,
  WidgetTitleStyled,
  Form
} from '../../styled-components'
import { TProps } from './type'
import {
  TokenBalance,
  TokenBalanceValue
} from './styled-components'
import {
  WidgetComponent,
} from 'components/pages/common'
import { defineIfUserHasEnoughERC20Tokens } from 'helpers'
import LinksContents from '../links-contents'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import { Tooltip } from 'components/common'
import { useParams } from 'react-router-dom'
import { TTokenType, TLinkContent } from 'types'
import Icons from 'icons'
import { utils, BigNumber } from 'ethers5'

const mapStateToProps = ({
  user: {
    address,
    chainId,
    loading: userLoading,
    tokenAmount
  },
  campaign: {
    loading,
    decimals,
    symbol,
    claimPattern,
    tokenStandard
  }
}: RootState) => ({
  loading,
  address,
  decimals,
  chainId,
  symbol,
  tokenStandard,
  tokenAmount,
  userLoading,
  claimPattern
})


type ReduxType = ReturnType<typeof mapStateToProps> &
  TProps

const Erc20: FC<ReduxType > = ({
  tokenStandard,
  setAssetsData,
  assetsData,
  children,
  sdk,
  claimPattern,
  symbol,
  decimals,
  tokenAmount,
  formData,
  setFormData,
  getDefaultValues
}) => {

  const { type } = useParams<{ type: TTokenType }>()

  const checkIfDisabled = () => {
    return !formData.tokenAmount ||
           !formData.linksAmount ||
           formData.tokenAmount === '0' ||
           formData.linksAmount === '0'
  }

  const tokenAmountFormatted = (tokenAmount && decimals !== null) ? utils.formatUnits(tokenAmount, decimals) : '0'

  return <WidgetComponent>
      <Header>
        <WidgetTitleStyled>Add tokens to distribute</WidgetTitleStyled>
        {tokenAmount && <TokenBalance>
          Token balance: <Tooltip text={`${tokenAmountFormatted} ${symbol}`}><TokenBalanceValue>{tokenAmountFormatted}</TokenBalanceValue> {symbol}</Tooltip>
        </TokenBalance>}
      </Header>
      <Container>
        <LinksContents
          type={type}
          sdk={sdk}
          claimPattern={claimPattern}
          data={assetsData}
          onRemove={(id) => {
            setAssetsData(assetsData.filter(item => item.id !== id))
          }}
        />
        <Form onSubmit={(event) => {
          event.preventDefault()
          // const hasEnoughTokens = defineIfUserHasEnoughERC20Tokens(
          //   tokenAmount as BigNumber,
          //   formData.tokenAmount as string,
          //   formData.linksAmount as string,
          //   decimals,
          // )
          // if (!hasEnoughTokens) {
          //   return alert(`Not enough tokens on balance. Current balance: ${tokenAmountFormatted} ${symbol}`)
          // }
          setAssetsData([ ...assetsData, {
            ...formData,
            id: assetsData.length
          }])
          setFormData(getDefaultValues(tokenStandard as TTokenType))
        }}>
          <InputsContainer>
            <InputStyled
              value={formData.tokenAmount}
              name='amount'
              placeholder='Amount per link'
              onChange={value => {
                if (/^[0-9.]+$/.test(value) || value === '') {
                  setFormData({ ...formData, tokenAmount: value })
                }
                return value
              }}
            />
            <InputStyled
              value={formData.linksAmount}
              name='links'
              placeholder='Number of links'
              onChange={value => {
                if (/^[0-9]+$/.test(value) || value === '') {
                  setFormData({ ...formData, linksAmount: value })
                }
                return value
              }}
            />

            <ButtonStyled
              size='extra-small'
              appearance='additional'
              type='submit'
              disabled={checkIfDisabled()}
            >
              + Add
            </ButtonStyled>
          </InputsContainer>
        </Form>
        
        <NotesContainer>
          <InstructionNoteStyled icon={<Icons.InputNoteIcon />} >
            <TextBold>Amount per link</TextBold> — amount of tokens that you would like to include in every link
          </InstructionNoteStyled>
          <InstructionNoteStyled icon={<Icons.InputNoteIcon />} >
            <TextBold>Number of links</TextBold> — number of claim links to be generated
          </InstructionNoteStyled>
          {children}
        </NotesContainer>
      </Container>
    </WidgetComponent>
}

export default connect(mapStateToProps)(Erc20)

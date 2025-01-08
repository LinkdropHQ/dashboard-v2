import {
  FC,
  useState,
  useEffect
} from 'react'
import { TProps } from './types'
import {
  AsidePopup
} from 'components/common'
import {
  Content,
  SelectStyled,
  CountryItem,
  ButtonStyled
} from './styled-components'
import { alertError } from 'helpers'
import { TCountry } from 'types'

const CountryContent: FC<TCountry & {
  onRemove: (id: string) => void
}> = ({
  id,
  name,
  onRemove
}) => {
  return <CountryItem >
    {name}

    <ButtonStyled
      onClick={() => onRemove(id)}
      appearance='additional'
      size='extra-small'
    >
      Remove
    </ButtonStyled>
  </CountryItem>
}

const defineSelectOptions = (countries: TCountry[]) => {
  return countries.map(country => ({
    value: country.id,
    label: country.name
  }))
}

const Countries: FC<TProps> = ({
  title,
  subtitle,
  onClose,
  action,
  toggleAction,
  toggleValue,
  availableCountriesValue,
  countries
}) => {

  const [
    availableCountries,
    setAvailableCountries
  ] = useState<TCountry[]>(availableCountriesValue)
  
  return <AsidePopup
    title={title}
    subtitle={subtitle}
    onClose={onClose}
    toggleAction={toggleAction}
    toggleState={toggleValue}
    action={() => {
      action(
        availableCountries.map(country => country.id),
        onClose
      )
    }}
  >
    {
      toggleValue && <Content>
        <SelectStyled
          onChange={async ({ value, label }) => {
            const countryId = value
            const countryAlreadyAdded = availableCountries.find(country => country.id === countryId)
            if (countryAlreadyAdded) {
              return alertError(`Country ${countryId} was already added`)
            }
            setAvailableCountries([...availableCountries, {
              id: value,
              name: label
            }])
          }}
          value={null}
          placeholder='Select Country'
          options={defineSelectOptions(countries)}
        />
        {availableCountries.map(item => {
          return <CountryContent
            {...item}
            onRemove={(id) => {
              const updatedAvailableCountries = availableCountries.filter(item => item.id !== id)
              setAvailableCountries(updatedAvailableCountries)
            }}
          />
        })}
      </Content>
    }
  </AsidePopup>
}

export default Countries
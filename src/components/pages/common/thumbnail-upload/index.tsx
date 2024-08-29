import { FC } from 'react'
import {
  ThumbnailContainer,
  FileInputStyled,
  Thumbnail,
  ThumbnailVideo
} from './styled-component'
import { TProps } from './types'
import CollectionPlaceholder from 'images/collection-placeholder.png'
import {
  InputTitleAdditional,
  InputTitle,
  InputContainer,
  InputSubtitle
} from 'components/pages/common'

const ThumbnailUpload: FC<TProps> = ({
  thumbnail,
  setThumbnail,
  setFile,
  title,
  note,
  subtitle,
  sizeAllowed,
  formatAllowed
}) => {
  const renderThumbnail = () => {
    if (!thumbnail) {
      return <Thumbnail
        src={CollectionPlaceholder}
        alt='image'
      />
    }
    if (thumbnail.includes('video')) {
      return <ThumbnailVideo autoPlay loop muted key={thumbnail}>
        <source src={thumbnail} />
        Your browser does not support the video tag.
      </ThumbnailVideo>
    }

    return <Thumbnail
      src={thumbnail}
      alt='image'
    />
  }
  return <InputContainer>
    <InputTitle>
      {title} <InputTitleAdditional>{note}</InputTitleAdditional>
    </InputTitle>
    {subtitle && <InputSubtitle>
      {subtitle}
    </InputSubtitle>}
    <ThumbnailContainer>
      {renderThumbnail()}
      <FileInputStyled
        sizeAllowed={sizeAllowed}
        formatAllowed={formatAllowed}
        onChange={(thumbnail, file) => {
          thumbnail && setThumbnail(thumbnail)
          if (file) {
            setFile(file)
          }
        }}
      />
    </ThumbnailContainer>
  </InputContainer>
}

export default ThumbnailUpload
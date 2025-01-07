import { uploadFile } from '@uploadcare/upload-client'
import CollectionPlaceholder from 'images/collection-placeholder.png'
const {
  REACT_APP_UPLOADCARE
} = process.env

type TUploadcareUpload = (
  thumbnail?: string,
  file?: File
) => Promise<string>

const uploadcareUpload: TUploadcareUpload = async (
  thumbnail,
  file
) => {
  if (!file) {
    if (thumbnail) {
      return thumbnail
    }
    return CollectionPlaceholder
  }
  try {
    const uploadCareResult = await uploadFile(
      file,
      {
        publicKey: REACT_APP_UPLOADCARE as string,
        store: 'auto',
        metadata: {
          subsystem: 'js-client',
          pet: 'cat'
        }
      }
    )
    return uploadCareResult.cdnUrl
  } catch (err) {
    if (thumbnail) {
      return thumbnail
    }
    return CollectionPlaceholder
  }
}

export default uploadcareUpload

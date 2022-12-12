import { TBase64File } from "types"
import JSZip from 'jszip'
import { saveAs } from '@progress/kendo-file-saver'

const defineFileExtension: (type: TBase64File) => string = (type) => {
  switch (type) {
    case 'jpeg':
      return 'jpg'
    case 'png':
      return 'png'
    case 'svg':
      return 'svg'
    default:
      return ''
  }
}

const downloadBase64FilesAsZip = async (
  type: TBase64File,
  base64Files: Blob[],
  zipFileName: string = 'example',
  index: number
) : Promise<void> => {
  const jszip = new JSZip();
  for(let i = 0; i < base64Files.length; i++) {
    jszip.file(`qr-${index + i}.${defineFileExtension(type)}`, base64Files[i])
  }
  const content = await jszip.generateAsync({ type: 'blob' })
    // see FileSaver.js
  return saveAs(content, `${zipFileName}.zip`)
}

export default downloadBase64FilesAsZip
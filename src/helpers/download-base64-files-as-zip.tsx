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

const downloadBase64FilesAsZip = (
  type: TBase64File,
  base64Files: Blob[],
  zipFileName: string = 'example'
) : void => {
  const jszip = new JSZip();
  for(let i = 0; i < base64Files.length; i++) {
    jszip.file(`qr-${i}.${defineFileExtension(type)}`, base64Files[i])
  }
  jszip.generateAsync({ type: 'blob' }).then(function(content) {
    // see FileSaver.js
    saveAs(content, `${zipFileName}.zip`)
  })
}

export default downloadBase64FilesAsZip
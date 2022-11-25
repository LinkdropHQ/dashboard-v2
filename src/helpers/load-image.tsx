import { TQRImageOptions } from 'types'

type TLoadImage = (
  imageOptions: TQRImageOptions,
  imageSrc: string
) => Promise<HTMLImageElement>

const loadImage: TLoadImage = (
  imageOptions,
  imageSrc
) => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    if (!image) {
      return reject("Image is not defined");
    }

    if (typeof imageOptions.crossOrigin === "string") {
      image.crossOrigin = imageOptions.crossOrigin;
    }

    image.onload = (): void => {
      resolve(image);
    };

    image.src = imageSrc;
  });
}

export default loadImage
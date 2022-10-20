import * as Contentful from 'contentful';
import type { ComponentProps } from '..';
import useImage from 'src/utils/useImage';

type TextData = {
  asset: Contentful.Asset;
};

export default function Button(
  props: ComponentProps<TextData>,
): JSX.Element | null {
  const image = useImage(props.data.asset);
  if (image == null) return null;
  const assetUrl = image.fields.file.url;
  const assetType = image.fields.file.contentType;
  if (assetType.startsWith('image/')) {
    return <img src={assetUrl} alt={image.fields.title} />;
  }
  return null;
}

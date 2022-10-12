import * as Contentful from 'contentful';
import type { ComponentProps } from '..';

type TextData = {
  asset: Contentful.Asset;
};

export default function button(
  props: ComponentProps<TextData>,
): JSX.Element | null {
  const assetUrl = props.data.asset.fields.file.url;
  const assetType = props.data.asset.fields.file.contentType;
  if (assetType.startsWith('image/')) {
    return <img src={assetUrl} alt={props.data.asset.fields.title} />;
  }
  return null;
}

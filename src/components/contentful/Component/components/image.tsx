import type { ComponentProps } from '..';
import { SafeEntryFields } from 'src/utils/contentful';

type ImageData = {
  asset: SafeEntryFields.Asset;
};

export default function Image(
  props: ComponentProps<ImageData>,
): JSX.Element | null {
  const { asset } = props.data;
  if (asset == null) return null;
  const assetUrl = asset.fields.file.url;
  const assetType = asset.fields.file.contentType;
  if (assetType.startsWith('image/')) {
    return <img src={assetUrl} alt={asset.fields.title} />;
  }
  return null;
}

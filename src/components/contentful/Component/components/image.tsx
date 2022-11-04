import { SafeEntryFields } from 'src/utils/contentful';
import type { ComponentProps } from '..';
import classNames from 'classnames';

type ImageData = {
  asset: SafeEntryFields.Asset;
  classes: SafeEntryFields.Symbol[];
};

export default function Image(
  props: ComponentProps<ImageData>,
): JSX.Element | null {
  const { asset } = props.data;
  if (asset == null) return null;
  const assetUrl = asset.fields.file.url;
  const assetType = asset.fields.file.contentType;
  if (assetType.startsWith('image/')) {
    return (
      <img
        src={assetUrl}
        alt={asset.fields.title}
        className={classNames(...(props.data?.classes || []))}
      />
    );
  }
  return null;
}

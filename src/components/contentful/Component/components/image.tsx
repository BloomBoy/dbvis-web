import * as Contentful from 'contentful';
import type { ComponentProps } from '..';
import { SafeEntryFields } from 'src/utils/contentful';
import classNames from 'classnames';

type ImageData = {
  asset: SafeEntryFields.Asset;
  classes: Contentful.EntryFields.Symbol[];
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

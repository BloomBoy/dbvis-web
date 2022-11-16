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
  const {
    data: { asset, classes },
  } = props;
  if (asset == null) return null;
  const src = `${asset.fields.file.url}?w=1024`;
  const assetType = asset.fields.file.contentType;

  if (assetType.startsWith('image/')) {
    return (
      <picture>
        <source
          media="(min-width: 1920px)"
          srcSet={`${asset.fields.file.url}?w=1440&q=85`}
        />
        <source
          media="(min-width: 768px)"
          srcSet={`${asset.fields.file.url}?w=1152&q=85`}
        />
        <source
          media="(min-width: 450px)"
          srcSet={`${asset.fields.file.url}?w=675&q=85`}
        />
        <source
          media="(min-width: 370px)"
          srcSet={`${asset.fields.file.url}?w=555&q=85`}
        />
        <source
          media="(max-width: 370px)"
          srcSet={`${asset.fields.file.url}?w=400&q=85`}
        />
        <img
          src={src}
          alt={asset.fields.title}
          className={classNames(...(classes || []), 'w-full')}
        />
      </picture>
    );
  }
  return null;
}

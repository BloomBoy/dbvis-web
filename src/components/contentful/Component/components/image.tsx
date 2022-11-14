import { SafeEntryFields } from 'src/utils/contentful';
import type { ComponentProps } from '..';
import NextImage from 'next/image';
import classNames from 'classnames';

type ImageData = {
  asset: SafeEntryFields.Asset;
  classes: SafeEntryFields.Symbol[];
  priority?: boolean;
};

export default function Image(
  props: ComponentProps<ImageData>,
): JSX.Element | null {
  const {
    data: { asset, classes, priority },
  } = props;
  if (asset == null) return null;
  const assetUrl = `https:${asset.fields.file.url}`;
  const assetType = asset.fields.file.contentType;
  const dimensions = {
    h: asset.fields.file.details?.image?.height,
    w: asset.fields.file.details?.image?.width,
  };
  if (assetType.startsWith('image/')) {
    return (
      <NextImage
        src={assetUrl}
        alt={asset.fields.title}
        height={dimensions.h}
        width={dimensions.w}
        sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        priority={priority}
        className={classNames(...(classes || []), 'w-full')}
      />
    );
  }
  return null;
}

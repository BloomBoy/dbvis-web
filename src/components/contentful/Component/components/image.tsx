import { SafeEntryFields } from 'src/utils/contentful';
import type { ComponentProps } from '..';
import classNames from 'classnames';

type ImageData = {
  asset: SafeEntryFields.Asset;
  classes: SafeEntryFields.Symbol[];
};

const breakpointSizes = [
  { breakpoint: 1920, width: 1440 },
  { breakpoint: 768, width: 1152 },
  { breakpoint: 450, width: 675 },
  { breakpoint: 370, width: 555 },
];

export default function Image(
  props: ComponentProps<ImageData>,
): JSX.Element | null {
  const {
    data: { asset, classes },
  } = props;
  if (asset == null) return null;
  const { width, height } = asset.fields.file.details?.image;
  const src = `${asset.fields.file.url}?w=1024`;
  const assetType = asset.fields.file.contentType;

  if (assetType.startsWith('image/')) {
    return (
      <picture>
        {breakpointSizes.map((size) => (
          <source
            key={size.breakpoint}
            type="image/webp"
            media={`(min-width: ${size.breakpoint}px)`}
            srcSet={`${asset.fields.file.url}?w=${size.width}&q=85&fm=webp`}
          />
        ))}

        <source
          media="(max-width: 370px)"
          type="image/webp"
          srcSet={`${asset.fields.file.url}?w=400&q=85&fm=webp`}
        />
        {breakpointSizes.map((size) => (
          <source
            key={size.breakpoint}
            media={`(min-width: ${size.breakpoint}px)`}
            srcSet={`${asset.fields.file.url}?w=${size.width}&q=85`}
          />
        ))}

        <source
          media="(max-width: 370px)"
          srcSet={`${asset.fields.file.url}?w=400&q=85`}
        />

        <img
          src={src}
          width={width}
          height={height}
          loading="lazy"
          alt={asset.fields.title}
          className={classNames(...(classes || []), 'w-full')}
        />
      </picture>
    );
  }
  return null;
}

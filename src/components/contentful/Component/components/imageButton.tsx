import type { ComponentProps } from '..';
import { SafeEntryFields } from 'src/utils/contentful';
import MaybeLink from '../../MaybeLink';

type ImageData = {
  asset: SafeEntryFields.Asset;
  target: SafeEntryFields.Symbol;
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
      <MaybeLink
        href={props.data.target}
        className="bg-grey-300 self-center text-white rounded-3xl p-8"
      >
        <div className="w-[82px] aspect-square">
          <img src={assetUrl} alt={asset.fields.title} />
        </div>
      </MaybeLink>
    );
  }
  return null;
}

import * as Contentful from 'contentful';
import type {
  LayoutListEntryProps,
  LayoutProps,
} from 'src/components/contentful/Layout';
import { SafeAsset, SafeEntry } from './types';
import { SafeValue, isNotLink, safeValue } from './helpers';
import { Entry } from 'contentful';

type InternalLayoutFields<
  LayoutFieldId extends string,
  AssetListFieldId extends string,
  ReferenceListFieldId extends string,
> = {
  [key in LayoutFieldId]:
    | (Extract<key, LayoutFieldId> extends never ? never : LayoutProps[])
    | (Extract<key, AssetListFieldId> extends never ? never : SafeAsset[])
    | (Extract<key, ReferenceListFieldId> extends never
        ? never
        : SafeEntry<unknown>[]);
} & {
  [key in AssetListFieldId]:
    | (Extract<key, LayoutFieldId> extends never ? never : LayoutProps[])
    | (Extract<key, AssetListFieldId> extends never ? never : SafeAsset[])
    | (Extract<key, ReferenceListFieldId> extends never
        ? never
        : SafeEntry<unknown>[]);
} & {
  [key in ReferenceListFieldId]:
    | (Extract<key, LayoutFieldId> extends never ? never : LayoutProps[])
    | (Extract<key, AssetListFieldId> extends never ? never : SafeAsset[])
    | (Extract<key, ReferenceListFieldId> extends never
        ? never
        : SafeEntry<unknown>[]);
};

export type LayoutFields<
  LayoutFieldId extends string = 'pageLayout',
  AssetListFieldId extends string = 'pageAssetReferences',
  ReferenceListFieldId extends string = 'pageEntryReferences',
> = {
  [key in keyof InternalLayoutFields<
    LayoutFieldId,
    AssetListFieldId,
    ReferenceListFieldId
  >]: InternalLayoutFields<
    LayoutFieldId,
    AssetListFieldId,
    ReferenceListFieldId
  >[key];
};

export default function parseLayout<
  Props extends LayoutListEntryProps[] = LayoutListEntryProps[],
>(entry: Contentful.Entry<LayoutFields>): SafeValue<Props>;
export default function parseLayout<
  LayoutFieldId extends string,
  Props extends LayoutListEntryProps[] = LayoutListEntryProps[],
>(
  entry: Contentful.Entry<LayoutFields<LayoutFieldId>>,
  layoutFieldId: LayoutFieldId,
): SafeValue<Props>;
export default function parseLayout<
  LayoutFieldId extends string,
  AssetListFieldId extends string,
  Props extends LayoutListEntryProps[] = LayoutListEntryProps[],
>(
  entry: Contentful.Entry<LayoutFields<LayoutFieldId, AssetListFieldId>>,
  layoutFieldId: LayoutFieldId,
  assetListFieldId: AssetListFieldId,
): SafeValue<Props>;
export default function parseLayout<
  LayoutFieldId extends string,
  AssetListFieldId extends string,
  ReferenceListFieldId extends string,
  Props extends LayoutListEntryProps[] = LayoutListEntryProps[],
>(
  entry: Contentful.Entry<
    LayoutFields<LayoutFieldId, AssetListFieldId, ReferenceListFieldId>
  >,
  layoutFieldId: LayoutFieldId,
  assetListFieldId: AssetListFieldId,
  referenceListFieldId: ReferenceListFieldId,
): SafeValue<Props>;
export default function parseLayout(
  entry: Contentful.Entry<LayoutFields<string, string, string>>,
  layoutFieldId = 'pageLayout',
  assetListFieldId = 'pageAssetReferences',
  referenceListFieldId = 'pageEntryReferences',
): LayoutListEntryProps[] {
  const layouts = entry.fields[layoutFieldId] as
    | LayoutListEntryProps[]
    | undefined;
  if (layouts == null) return [];
  const assetList = (
    (entry.fields[assetListFieldId] as Contentful.Asset[] | undefined) ?? []
  ).filter(isNotLink);
  const referenceList = (
    (entry.fields[referenceListFieldId] as
      | Contentful.Entry<unknown>[]
      | undefined) ?? []
  ).filter(isNotLink);

  const linkMap = Object.fromEntries([
    ...assetList.map(
      (asset) => [asset.sys.id, asset as Entry<unknown>] as const,
    ),
    ...referenceList.map((reference) => [reference.sys.id, reference] as const),
  ]);

  return safeValue(layouts, linkMap);
}

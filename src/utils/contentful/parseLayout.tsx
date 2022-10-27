import * as Contentful from 'contentful';
import type {
  LayoutLinkProps,
  LayoutListEntryProps,
  LayoutProps,
} from 'src/components/contentful/Layout';
import { SafeAsset, SafeEntry } from './types';
import { SafeValue, isNotLink, safeValue, isLink } from './helpers';
import { Entry } from 'contentful';
import { components, isComponent } from 'src/components/contentful/Component';
import { asyncMapMaxConcurrent } from '../asyncArray.mjs';

type InternalLayoutFields<
  LayoutFieldId extends string,
  AssetListFieldId extends string,
  ReferenceListFieldId extends string,
> = {
  [key in LayoutFieldId]:
    | (Extract<key, LayoutFieldId> extends never
        ? never
        : (LayoutProps | LayoutLinkProps)[])
    | (Extract<key, AssetListFieldId> extends never ? never : SafeAsset[])
    | (Extract<key, ReferenceListFieldId> extends never
        ? never
        : SafeEntry<unknown>[]);
} & {
  [key in AssetListFieldId]:
    | (Extract<key, LayoutFieldId> extends never
        ? never
        : (LayoutProps | LayoutLinkProps)[])
    | (Extract<key, AssetListFieldId> extends never ? never : SafeAsset[])
    | (Extract<key, ReferenceListFieldId> extends never
        ? never
        : SafeEntry<unknown>[]);
} & {
  [key in ReferenceListFieldId]:
    | (Extract<key, LayoutFieldId> extends never
        ? never
        : (LayoutProps | LayoutLinkProps)[])
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

export default async function parseLayout(
  entry: Contentful.Entry<LayoutFields>,
): Promise<{
  layoutList: SafeValue<(LayoutProps | LayoutLinkProps)[]>;
  collectedData: Record<string, unknown>;
}>;
export default async function parseLayout<LayoutFieldId extends string>(
  entry: Contentful.Entry<LayoutFields<LayoutFieldId>>,
  layoutFieldId: LayoutFieldId,
): Promise<{
  layoutList: LayoutListEntryProps[];
  collectedData: Record<string, unknown>;
}>;
export default async function parseLayout<
  LayoutFieldId extends string,
  AssetListFieldId extends string,
>(
  entry: Contentful.Entry<LayoutFields<LayoutFieldId, AssetListFieldId>>,
  layoutFieldId: LayoutFieldId,
  assetListFieldId: AssetListFieldId,
): Promise<{
  layoutList: LayoutListEntryProps[];
  collectedData: Record<string, unknown>;
}>;
export default async function parseLayout<
  LayoutFieldId extends string,
  AssetListFieldId extends string,
  ReferenceListFieldId extends string,
>(
  entry: Contentful.Entry<
    LayoutFields<LayoutFieldId, AssetListFieldId, ReferenceListFieldId>
  >,
  layoutFieldId: LayoutFieldId,
  assetListFieldId: AssetListFieldId,
  referenceListFieldId: ReferenceListFieldId,
): Promise<{
  layoutList: LayoutListEntryProps[];
  collectedData: Record<string, unknown>;
}>;
export default async function parseLayout(
  entry: Contentful.Entry<LayoutFields<string, string, string>>,
  layoutFieldId = 'pageLayout',
  assetListFieldId = 'pageAssetReferences',
  referenceListFieldId = 'pageEntryReferences',
): Promise<{
  layoutList: LayoutListEntryProps[];
  collectedData: Record<string, unknown>;
}> {
  const layouts = entry.fields[layoutFieldId] as
    | LayoutListEntryProps[]
    | undefined;
  if (layouts == null) {
    return {
      layoutList: [],
      collectedData: {},
    };
  }
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
      (asset) => [asset.sys.id, asset as Entry<unknown> | undefined] as const,
    ),
    ...referenceList.map(
      (reference) =>
        [reference.sys.id, reference as Entry<unknown> | undefined] as const,
    ),
  ]);

  const dataCollectors: Record<
    string,
    { collect(): Promise<unknown> | unknown }
  > = {};

  const layoutList = safeValue(layouts, (o) => {
    let ret = o as SafeValue<typeof o> | typeof o;
    if (isLink(o)) {
      const resolvedLink = linkMap[o.sys.id] as SafeValue<typeof o>;
      if (resolvedLink != null) {
        ret = resolvedLink;
      }
    }
    if (isComponent(ret)) {
      const componentRenderer = components[ret.type];
      const dataCollector = componentRenderer?.registerDataCollector?.(
        ret,
        false,
      );
      if (dataCollector != null) {
        dataCollectors[dataCollector.fetchKey] = dataCollector;
      }
    }
    return ret !== o ? (ret as SafeValue<typeof o>) : undefined;
  });

  const collectedData = await asyncMapMaxConcurrent(
    10,
    Object.entries(dataCollectors),
    ([key, dataCollector]) =>
      Promise.resolve(dataCollector.collect()).then(
        (data) => [key, data] as const,
      ),
  ).then((entries) => Object.fromEntries(entries));
  return {
    layoutList,
    collectedData,
  };
}
import type {
  LayoutLinkProps,
  LayoutListEntryProps,
  SavedLayout,
} from 'src/components/contentful/Layout';
import { SafeAsset, SafeEntry, SafeEntryFields } from './types';
import { SafeValue, isNotLink, safeValue, isLink } from './helpers';
import { components, isComponent } from 'src/components/contentful/Component';
import { asyncMapMaxConcurrent } from '../asyncArray.mjs';
import { PageContext } from './pageContext';

type InternalLayoutFields<
  LayoutFieldId extends string,
  AssetListFieldId extends string,
  ReferenceListFieldId extends string,
> = {
  [key in LayoutFieldId]:
    | (Extract<key, LayoutFieldId> extends never
        ? never
        : (SavedLayout | LayoutLinkProps)[])
    | (Extract<key, AssetListFieldId> extends never ? never : SafeAsset[])
    | (Extract<key, ReferenceListFieldId> extends never
        ? never
        : SafeEntry<unknown>[]);
} & {
  [key in AssetListFieldId]:
    | (Extract<key, LayoutFieldId> extends never
        ? never
        : (SavedLayout | LayoutLinkProps)[])
    | (Extract<key, AssetListFieldId> extends never ? never : SafeAsset[])
    | (Extract<key, ReferenceListFieldId> extends never
        ? never
        : SafeEntry<unknown>[]);
} & {
  [key in ReferenceListFieldId]:
    | (Extract<key, LayoutFieldId> extends never
        ? never
        : (SavedLayout | LayoutLinkProps)[])
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
  readonly [key in keyof InternalLayoutFields<
    LayoutFieldId,
    AssetListFieldId,
    ReferenceListFieldId
  >]: InternalLayoutFields<
    LayoutFieldId,
    AssetListFieldId,
    ReferenceListFieldId
  >[key];
};

export type WithLayoutFields<Fields> = {
  [key in keyof LayoutFields | keyof Fields]: (LayoutFields & Fields)[key];
};

export interface ParsingContext {
  collectedData?: {
    [k: string]: unknown;
  };
  pageContext?: PageContext;
}

export default async function parseLayout(
  preview: boolean,
  entry: {
    readonly fields: LayoutFields;
  },
  context?: ParsingContext,
): Promise<{
  layoutList: LayoutListEntryProps[];
  collectedData: Record<string, unknown>;
}>;
export default async function parseLayout<LayoutFieldId extends string>(
  preview: boolean,
  entry: {
    readonly fields: LayoutFields<LayoutFieldId>;
  },
  layoutFieldId: LayoutFieldId,
  context?: ParsingContext,
): Promise<{
  layoutList: LayoutListEntryProps[];
  collectedData: Record<string, unknown>;
}>;
export default async function parseLayout<
  LayoutFieldId extends string,
  AssetListFieldId extends string,
>(
  preview: boolean,
  entry: {
    readonly fields: LayoutFields<LayoutFieldId, AssetListFieldId>;
  },
  layoutFieldId: LayoutFieldId,
  assetListFieldId: AssetListFieldId,
  context?: ParsingContext,
): Promise<{
  layoutList: LayoutListEntryProps[];
  collectedData: Record<string, unknown>;
}>;
export default async function parseLayout<
  LayoutFieldId extends string,
  AssetListFieldId extends string,
  ReferenceListFieldId extends string,
>(
  preview: boolean,
  entry: {
    readonly fields: LayoutFields<
      LayoutFieldId,
      AssetListFieldId,
      ReferenceListFieldId
    >;
  },
  layoutFieldId: LayoutFieldId,
  assetListFieldId: AssetListFieldId,
  referenceListFieldId: ReferenceListFieldId,
  context?: ParsingContext,
): Promise<{
  layoutList: LayoutListEntryProps[];
  collectedData: Record<string, unknown>;
}>;
export default async function parseLayout(
  preview: boolean,
  entry: {
    readonly fields: LayoutFields<string, string, string>;
  },
  layoutFieldId?: ParsingContext | string,
  assetListFieldId?: ParsingContext | string,
  referenceListFieldId?: ParsingContext | string,
  context?: ParsingContext,
): Promise<{
  layoutList: LayoutListEntryProps[];
  collectedData: Record<string, unknown>;
}> {
  context = (() => {
    if (typeof layoutFieldId === 'object') {
      return layoutFieldId;
    }
    if (typeof assetListFieldId === 'object') {
      return assetListFieldId;
    }
    if (typeof referenceListFieldId === 'object') {
      return referenceListFieldId;
    }
    return context;
  })();
  layoutFieldId =
    typeof layoutFieldId === 'string' ? layoutFieldId : 'pageLayout';
  assetListFieldId =
    typeof assetListFieldId === 'string'
      ? assetListFieldId
      : 'pageAssetReferences';
  referenceListFieldId =
    typeof referenceListFieldId === 'string'
      ? referenceListFieldId
      : 'pageEntryReferences';

  const layouts = entry.fields[layoutFieldId] as
    | LayoutListEntryProps[]
    | undefined;
  if (layouts == null) {
    return {
      layoutList: [],
      collectedData: context?.collectedData ?? {},
    };
  }
  const assetList = (
    (entry.fields[assetListFieldId] as SafeEntryFields.Asset[] | undefined) ??
    []
  ).filter(isNotLink);
  const referenceList = (
    (entry.fields[referenceListFieldId] as
      | SafeEntryFields.Entry<unknown>[]
      | undefined) ?? []
  ).filter(isNotLink);

  const linkMap = Object.fromEntries([
    ...assetList.map(
      (asset) =>
        [
          asset.sys.id,
          asset as SafeEntryFields.Entry<unknown> | undefined,
        ] as const,
    ),
    ...referenceList.map(
      (reference) =>
        [
          reference.sys.id,
          reference as SafeEntryFields.Entry<unknown> | undefined,
        ] as const,
    ),
  ]);

  const dataCollectors: Record<
    string,
    { collect(): Promise<unknown> | unknown }
  > = {};

  const preCollectedData = context?.collectedData ?? {};

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
        preview,
        context?.pageContext ?? {},
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
    ([key, dataCollector]) => {
      if (key in preCollectedData) {
        return [key, preCollectedData[key]] as const;
      }
      return Promise.resolve(dataCollector.collect()).then(
        (data) => [key, data] as const,
      );
    },
  ).then((entries) =>
    Object.fromEntries(entries.filter(([, val]) => val !== undefined)),
  );
  return {
    layoutList,
    collectedData,
  };
}

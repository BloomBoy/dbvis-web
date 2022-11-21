import type {
  LayoutListEntryProps,
  SavedLayout,
  SavedLayoutLink,
  SavedLayoutListEntry,
} from 'src/components/contentful/Layout';
import { SafeAsset, SafeEntry, SafeEntryFields } from './types';
import { SafeValue, isNotLink, safeValue, isLink } from './helpers';
import { components, isComponent } from 'src/components/contentful/Component';
import { asyncMapMaxConcurrent } from '../asyncArray.mjs';
import { PageContext } from './pageContext';
import { getLayoutHeaderCount } from 'src/components/contentful/Layout/LayoutList';
import { isLinkProps } from 'src/components/contentful/Layout/helpers';

type InternalLayoutFields<
  LayoutFieldId extends string,
  AssetListFieldId extends string,
  ReferenceListFieldId extends string,
> = {
  [key in LayoutFieldId]:
    | (Extract<key, LayoutFieldId> extends never
        ? never
        : (SavedLayout | SavedLayoutLink)[])
    | (Extract<key, AssetListFieldId> extends never ? never : SafeAsset[])
    | (Extract<key, ReferenceListFieldId> extends never
        ? never
        : SafeEntry<unknown>[]);
} & {
  [key in AssetListFieldId]:
    | (Extract<key, LayoutFieldId> extends never
        ? never
        : (SavedLayout | SavedLayoutLink)[])
    | (Extract<key, AssetListFieldId> extends never ? never : SafeAsset[])
    | (Extract<key, ReferenceListFieldId> extends never
        ? never
        : SafeEntry<unknown>[]);
} & {
  [key in ReferenceListFieldId]:
    | (Extract<key, LayoutFieldId> extends never
        ? never
        : (SavedLayout | SavedLayoutLink)[])
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
  layoutList: SavedLayoutListEntry[];
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
  layoutList: SavedLayoutListEntry[];
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
  layoutList: SavedLayoutListEntry[];
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
  layoutList: SavedLayoutListEntry[];
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
  layoutList: SavedLayoutListEntry[];
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
    | SavedLayoutListEntry[]
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

  const collectorRegistrators: Promise<{
    fetchKey: string;
    collect: () => unknown;
  } | null>[] = [];

  function valueParser<U>(o: U): SafeValue<U> | undefined {
    let ret = o as SafeValue<typeof o> | typeof o;
    if (isLink(o)) {
      const resolvedLink = linkMap[o.sys.id] as SafeValue<typeof o>;
      if (resolvedLink != null) {
        ret = resolvedLink;
      }
    }
    if (isComponent(ret)) {
      const componentRenderer = components[ret.type];
      const dataCollectorRegistrator = componentRenderer?.registerDataCollector(
        ret,
        preview,
        context?.pageContext ?? {},
      );
      if (dataCollectorRegistrator != null) {
        collectorRegistrators.push(dataCollectorRegistrator);
      }
    }
    return ret !== o ? (ret as SafeValue<typeof o>) : undefined;
  }

  referenceList.forEach((reference) => {
    reference.fields = safeValue(reference.fields, valueParser);
  });

  const layoutList = safeValue(layouts, valueParser);

  await Promise.all(collectorRegistrators).then((registrators) => {
    registrators.forEach((registrator) => {
      if (registrator == null) {
        return;
      }
      dataCollectors[registrator.fetchKey] = registrator;
    });
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
  )
    .then((entries) =>
      Object.fromEntries(entries.filter(([, val]) => val !== undefined)),
    )
    .then((collected) => Object.assign(preCollectedData, collected));

  return {
    layoutList,
    collectedData,
  };
}
export async function savedLayoutListToProps(
  savedList: SavedLayoutListEntry[],
  collectedData: Record<string, unknown>,
  preview: boolean,
  context?: PageContext,
  startHeaderIndex = 0,
): Promise<LayoutListEntryProps[]> {
  const layoutPropList: LayoutListEntryProps[] = [];
  let count = startHeaderIndex;
  for (const savedLayout of savedList) {
    if (isLinkProps(savedLayout)) {
      const { target, ...rest } = savedLayout;
      let targetPageLayout: LayoutListEntryProps[] = [];
      const mainHeaderIndex = count;
      if (target != null) {
        targetPageLayout = await savedLayoutListToProps(
          target.fields.pageLayout,
          collectedData,
          preview,
          context,
          count,
        );
        const last = targetPageLayout.at(-1);
        if (last != null) {
          count =
            last.mainHeaderIndex +
            (await getLayoutHeaderCount(
              last,
              collectedData,
              last.mainHeaderIndex,
              preview,
              context,
            )) -
            count;
        }
        layoutPropList.push({
          ...rest,
          target: {
            ...target,
            fields: {
              ...target.fields,
              pageLayout: targetPageLayout,
            },
          },
          mainHeaderIndex,
        });
      }
    } else {
      const mainHeaderIndex = count;
      const toAdd = await getLayoutHeaderCount(
        savedLayout,
        collectedData,
        mainHeaderIndex,
        preview,
        context,
      );
      count += toAdd;
      layoutPropList.push({
        ...savedLayout,
        mainHeaderIndex,
      });
    }
  }
  return layoutPropList;
}

import z, { string } from 'zod';
import { LayoutFields } from '../parseLayout';
import { SafeEntryFields } from '../types';

function withLayoutFields<Obj extends z.ZodRawShape>(
  o: Obj,
): z.ZodObject<{
  [key in keyof LayoutFields | keyof Obj]: (LayoutFields &
    Obj)[key] extends z.ZodType
    ? (LayoutFields & Obj)[key]
    : z.ZodType<(LayoutFields & Obj)[key]>;
}>;
function withLayoutFields<
  Obj extends z.ZodRawShape,
  LayoutFieldId extends string,
>(
  o: Obj,
  layoutFieldId: LayoutFieldId,
): z.ZodObject<{
  [key in keyof LayoutFields<LayoutFieldId> | keyof Obj]: z.ZodType<
    (LayoutFields<LayoutFieldId> & Obj)[key]
  >;
}>;
function withLayoutFields<
  Obj extends z.ZodRawShape,
  LayoutFieldId extends string,
  AssetListFieldId extends string,
>(
  o: Obj,
  layoutFieldId: LayoutFieldId,
  assetListFieldId: AssetListFieldId,
): z.ZodObject<{
  [key in
    | keyof LayoutFields<LayoutFieldId, AssetListFieldId>
    | keyof Obj]: z.ZodType<
    (LayoutFields<LayoutFieldId, AssetListFieldId> & Obj)[key]
  >;
}>;
function withLayoutFields<
  Obj extends z.ZodRawShape,
  LayoutFieldId extends string,
  AssetListFieldId extends string,
  ReferenceListFieldId extends string,
>(
  o: Obj,
  layoutFieldId: LayoutFieldId,
  assetListFieldId: AssetListFieldId,
  referenceListFieldId: ReferenceListFieldId,
): z.ZodObject<{
  [key in
    | keyof LayoutFields<LayoutFieldId, AssetListFieldId, ReferenceListFieldId>
    | keyof Obj]: z.ZodType<
    (LayoutFields<LayoutFieldId, AssetListFieldId, ReferenceListFieldId> &
      Obj)[key]
  >;
}>;
function withLayoutFields<
  Obj extends z.ZodRawShape,
  LayoutFieldId extends string,
  AssetListFieldId extends string,
  ReferenceListFieldId extends string,
>(
  o: Obj,
  layoutFieldId?: LayoutFieldId,
  assetListFieldId?: AssetListFieldId,
  referenceListFieldId?: ReferenceListFieldId,
) {
  return z.object({
    ...o,
    [layoutFieldId ?? 'pageLayout']: z.array(z.record(z.unknown())),
    [assetListFieldId ?? 'pageAssetReferences']: z.array(z.record(z.unknown())),
    [referenceListFieldId ?? 'pageEntryReferences']: z.array(
      z.record(z.unknown()),
    ),
  }) as unknown as z.ZodObject<{
    [key in
      | keyof LayoutFields<
          LayoutFieldId,
          AssetListFieldId,
          ReferenceListFieldId
        >
      | keyof Obj]: z.ZodType<
      (LayoutFields<LayoutFieldId, AssetListFieldId, ReferenceListFieldId> &
        Obj)[key]
    >;
  }>;
}

const richText = () =>
  z.record(z.unknown()) as unknown as z.ZodType<SafeEntryFields.RichText>;

const safeEntry = <T>() =>
  z.record(z.unknown()) as unknown as z.ZodType<SafeEntryFields.SafeEntry<T>>;

const safeAsset = () =>
  z.record(z.unknown()) as unknown as z.ZodType<SafeEntryFields.SafeAsset>;

const standardPage = withLayoutFields({
  title: z.string(),
  slug: z.string(),
});

const menuItem = z.object({
  id: z.string(),
  title: z.string(),
  targetUrl: z.string().optional(),
  styles: z.array(z.string()),
  subItems: z.array(safeEntry()).optional(),
});

const menu = z.object({
  menuId: z.string(),
  menuItems: z.array(safeEntry<z.infer<typeof menuItem>>()),
});

const reviewSource = z.object({
  name: z.string(),
  logo: safeAsset(),
  url: z.string().optional(),
  reviewMaxScore: z.number(),
  averageScore: z.number().optional(),
});

const userReview = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().optional(),
  score: z.number(),
  review: richText(),
  source: safeEntry<z.infer<typeof reviewSource>>(),
  weight: z.number(),
});

const stringToken = z.object({
  key: z.string(),
  value: z.string(),
});

const databasePage = withLayoutFields({
  title: z.string(),
  listTitle: z.string(),
  slug: z.string(),
  logo: safeAsset(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  searchable: z.boolean(),
  weight: z.number(),
});

const extraDatabaseSearchResult = z.object({
  title: z.string(),
  logo: safeAsset(),
  description: string(),
  keywords: z.array(z.string()).optional(),
  targetUrl: z.string(),
  weight: z.number(),
});

const contentTypeSchemas = {
  standardPage,
  menuItem,
  menu,
  reviewSource,
  userReview,
  stringToken,
  databasePage,
  extraDatabaseSearchResult,
};

export default contentTypeSchemas;

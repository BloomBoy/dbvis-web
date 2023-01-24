import z, { string } from 'zod';
import { LayoutFields } from '../parseLayout';
import { SafeEntryFields } from '../types';

type LayoutZodFields<
  LayoutFieldId extends string = 'pageLayout',
  AssetListFieldId extends string = 'pageAssetReferences',
  ReferenceListFieldId extends string = 'pageEntryReferences',
> = {
  readonly [key in keyof LayoutFields<
    LayoutFieldId,
    AssetListFieldId,
    ReferenceListFieldId
  >]: z.ZodDefault<
    z.ZodType<
      LayoutFields<LayoutFieldId, AssetListFieldId, ReferenceListFieldId>[key]
    >
  >;
};

function withLayoutFields<Obj extends z.ZodRawShape>(
  o: Obj,
): {
  [key in keyof LayoutZodFields | keyof Obj]: (LayoutZodFields & Obj)[key];
};
function withLayoutFields<
  Obj extends z.ZodRawShape,
  LayoutFieldId extends string,
>(
  o: Obj,
  layoutFieldId: LayoutFieldId,
): {
  [key in
    | keyof LayoutZodFields<LayoutFieldId>
    | keyof Obj]: (LayoutZodFields<LayoutFieldId> & Obj)[key];
};
function withLayoutFields<
  Obj extends z.ZodRawShape,
  LayoutFieldId extends string,
  AssetListFieldId extends string,
>(
  o: Obj,
  layoutFieldId: LayoutFieldId,
  assetListFieldId: AssetListFieldId,
): {
  [key in
    | keyof LayoutZodFields<LayoutFieldId, AssetListFieldId>
    | keyof Obj]: (LayoutZodFields<LayoutFieldId, AssetListFieldId> & Obj)[key];
};
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
): {
  [key in
    | keyof LayoutZodFields<
        LayoutFieldId,
        AssetListFieldId,
        ReferenceListFieldId
      >
    | keyof Obj]: (LayoutZodFields<
    LayoutFieldId,
    AssetListFieldId,
    ReferenceListFieldId
  > &
    Obj)[key];
};
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
  return {
    ...o,
    [layoutFieldId ?? 'pageLayout']: z.array(z.record(z.unknown())).default([]),
    [assetListFieldId ?? 'pageAssetReferences']: z
      .array(z.record(z.unknown()))
      .default([]),
    [referenceListFieldId ?? 'pageEntryReferences']: z
      .array(z.record(z.unknown()))
      .default([]),
  } as {
    [key in
      | keyof LayoutZodFields<
          LayoutFieldId,
          AssetListFieldId,
          ReferenceListFieldId
        >
      | keyof Obj]: z.ZodType<
      (LayoutZodFields<LayoutFieldId, AssetListFieldId, ReferenceListFieldId> &
        Obj)[key]
    >;
  };
}

const richText = () =>
  z.record(z.unknown()) as unknown as z.ZodType<SafeEntryFields.RichText>;

const safeEntry = <T>() =>
  z.record(z.unknown()) as unknown as z.ZodType<SafeEntryFields.SafeEntry<T>>;

const safeAsset = () =>
  z.record(z.unknown()) as unknown as z.ZodType<SafeEntryFields.SafeAsset>;

const standardPage = z.object(
  withLayoutFields({
    internalTitle: z.string(),
    title: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.array(z.string()).optional(),
    seoKeywordsMode: z
      .enum([
        'Only include the keywords specified above',
        'Include site keywords',
        'Include content tags',
        'Include content tags and site keywords',
      ])
      .optional(),
    seoEmbedImage: safeAsset().optional(),
    slug: z.string(),
  }),
);

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
  weight: z.number().default(0),
});

const stringToken = z.object({
  key: z.string(),
  value: z.string(),
});

const databasePage = z.object(
  withLayoutFields({
    title: z.string(),
    listTitle: z.string(),
    slug: z.string(),
    logo: safeAsset(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
    searchable: z.boolean(),
    weight: z.number(),
  }),
);

const extraDatabaseSearchResult = z.object({
  title: z.string(),
  logo: safeAsset(),
  description: string(),
  keywords: z.array(z.string()).optional(),
  targetUrl: z.string(),
  weight: z.number(),
});

const productIndex = z.object(
  withLayoutFields(
    withLayoutFields(
      withLayoutFields(
        {
          name: z.string(),
          type: z.string(),
          active: z.boolean(),
          slug: z.string(),
        },
        'downloadLayout',
        'downloadAssetReferences',
        'downloadEntryReferences',
      ),
      'changelogIndexLayout',
      'changelogIndexAssetReferences',
      'changelogIndexEntryReferences',
    ),
    'changelogLayout',
    'changelogAssetReferences',
    'changelogEntryReferences',
  ),
);

const featureVersion = z.object(
  withLayoutFields(
    {
      productIndex: safeEntry<z.infer<typeof productIndex>>(),
      version: z.string(),
      releaseDate: z.string(),
      haveUsersGuideHTML: z.boolean(),
      haveUsersGuidePdf: z.boolean(),
    },
    'whatsNewLayout',
    'whatsNewAssetReferences',
    'whatsNewEntryReferences',
  ),
);

const productRelease = z.object({
  version: z.string(),
  featureVersion: safeEntry<z.infer<typeof featureVersion>>(),
  releaseDate: z.string(),
  download: z.object({
    reqs: z.string(),
    installers: z.array(
      z.object({
        type: z.enum([
          'windows',
          'linux',
          'mac',
          'unix',
          'solaris',
          'aix',
          'hpux',
          'java',
        ]),
        arch: z.string().optional(),
        note: z.string().optional(),
        files: z.array(
          z.object({
            filename: z.string(),
            size: z.string(),
            sizeInBytes: z.number().optional(),
            type: z.string(),
            jre: z.boolean().optional(),
            recommended: z.boolean().optional(),
            md5Sum: z.string().optional(),
            sha256Sum: z.string().optional(),
            bundledJre: z.string().optional(),
          }),
        ),
      }),
    ),
  }),
  releaseNotes: z
    .array(
      z.object({
        header: z.string(),
        items: z.array(
          z.object({
            components: z.array(z.string()),
            desc: z.string(),
            link: z.string().optional(),
            jira: z.string().optional(),
          }),
        ),
      }),
    )
    .optional(),
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
  productIndex,
  featureVersion,
  productRelease,
};

export default contentTypeSchemas;

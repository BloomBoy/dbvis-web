import { useRouter } from 'next/router';
import FeatureVersionReleaseNotesList, {
  FeatureVersionReleaseNotesListEntry,
} from 'src/components/releaseNotes/FeatureVersionReleaseNotesList';
import ReleaseNotesDetails, {
  ReleaseNoteDetails,
} from 'src/components/releaseNotes/ReleaseNotesDetails';
import useCollectedData from 'src/hooks/useCollectedData';
import usePageContext from 'src/hooks/usePageContex';
import {
  getFeatureVersionList,
  LATEST,
} from 'src/utils/contentful/content/release';
import {
  getProductRelease,
  getProductReleaseList,
} from 'src/utils/contentful/content/release/productRelease';
import { PageContext } from 'src/utils/contentful/pageContext';
import { isNonNull } from 'src/utils/filters';
import getFetchKey from 'src/utils/getFetchKey';
import { ComponentProps, SavedComponentProps } from '..';

type ReleaseNotesData = {
  a?: unknown;
};

type CollectedData =
  | {
      readonly variant: 'listFeatureVersions';
      readonly featureVersions: FeatureVersionReleaseNotesListEntry[];
    }
  | {
      readonly variant: 'productRelease';
      readonly productReleases: ReleaseNoteDetails[];
    };

function releasenotesFetchKey(
  { data: {}, type }: SavedComponentProps<ReleaseNotesData>,
  context: PageContext,
  preview: boolean,
) {
  return getFetchKey(
    type,
    { preview },
    context.productIndex?.sys.id,
    context.featureVersion?.sys.id,
  );
}

function ReleaseNotesComponent(props: ComponentProps<ReleaseNotesData>) {
  const { isPreview } = useRouter();
  const pageContext = usePageContext();
  const key = releasenotesFetchKey(props, pageContext, isPreview);
  const releaseNotes = useCollectedData<CollectedData>(key);
  if (releaseNotes == null) return null;
  if (releaseNotes.variant == 'listFeatureVersions') {
    return (
      <FeatureVersionReleaseNotesList
        featureVersions={releaseNotes.featureVersions}
      />
    );
  }
  if (releaseNotes.variant == 'productRelease') {
    return <ReleaseNotesDetails details={releaseNotes.productReleases} />;
  }
  return null;
}

const releaseNotes = Object.assign(ReleaseNotesComponent, {
  registerDataCollector(
    props: SavedComponentProps<ReleaseNotesData>,
    preview: boolean,
    context: PageContext,
  ) {
    return {
      fetchKey: releasenotesFetchKey(props, context, preview),
      async collect(): Promise<CollectedData | undefined> {
        const { featureVersion, productIndex } = context;
        if (productIndex == null) {
          return undefined;
        }
        if (featureVersion == null) {
          const { featureVersions } = await getFeatureVersionList(
            {
              productIndex: productIndex.sys.id,
              preview,
            },
            { pickFields: [] },
          );
          const mappedFeatureVersions = await Promise.all(
            featureVersions.map(async (v) => {
              const release = await getProductRelease(
                {
                  version: LATEST,
                  featureVersion: v.sys.id,
                  preview,
                },
                { pickFields: [], pageContext: context },
              );
              if (release == null) return null;
              return {
                id: v.sys.id,
                featureVersion: v.fields.version,
                featureReleaseDate: v.fields.releaseDate,
                latestReleaseVersion: release.fields.version,
                latestReleaseDate: release.fields.releaseDate,
              };
            }),
          ).then((arr) => arr.filter(isNonNull));
          return {
            variant: 'listFeatureVersions',
            featureVersions: mappedFeatureVersions,
          };
        }
        const productReleases = await getProductReleaseList(
          {
            featureVersion: featureVersion.sys.id,
            preview,
          },
          {
            pickFields: ['releaseNotes'],
          },
        );
        return {
          variant: 'productRelease',
          productReleases: productReleases.map((r) => ({
            id: r.sys.id,
            releaseDate: r.fields.releaseDate,
            verison: r.fields.version,
            ...(r.fields.releaseNotes != null
              ? {
                  sections: r.fields.releaseNotes?.map((s) => ({
                    type: s.header,
                    items: s.items.map((i, index) => ({
                      id: `${r.sys.id}-${s.header}-${index}`,
                      components: i.components,
                      description: i.desc,
                      ...(i.link != null ? { link: i.link } : null),
                      ...(i.jira != null ? { jira: i.jira } : null),
                    })),
                  })),
                }
              : null),
          })),
        };
      },
    };
  },
});

export default releaseNotes;

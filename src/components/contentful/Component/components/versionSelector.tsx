import { Fragment, useEffect, useMemo, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { PageContext } from 'src/utils/contentful/pageContext';
import { ComponentProps, SavedComponentProps } from '..';
import getFetchKey from 'src/utils/getFetchKey';
import {
  getFeatureVersionList,
  getProductIndex,
} from 'src/utils/contentful/content/release';
import usePageContext from 'src/hooks/usePageContex';
import { useRouter } from 'next/router';
import useCollectedData from 'src/hooks/useCollectedData';

// eslint-disable-next-line @typescript-eslint/ban-types
type VersionSelectorData = {};

type CollectedData = {
  productIndexSlug: string;
  featureVersions: {
    id: string;
    version: string;
    releaseDate: string;
    isLatest?: true;
  }[];
};

function versionSelectorFetchKey(
  { type, data: {} }: SavedComponentProps<VersionSelectorData>,
  preview: boolean,
  context: PageContext,
) {
  return getFetchKey(type, { preview }, context.productIndex?.sys.id);
}

function getPathName(path: string, latest: boolean) {
  if (latest) return path.replace(/\/\[version\]$/, '');
  if (!path.endsWith('/[version]'))
    return `${path}${path.endsWith('/') ? '' : '/'}[version]`;
}

function VersionSelectorComponent(
  props: ComponentProps<VersionSelectorData>,
): JSX.Element | null {
  const context = usePageContext();
  const router = useRouter();
  const key = versionSelectorFetchKey(props, router.isPreview, context);
  const data = useCollectedData<CollectedData>(key);
  const initialVersion = useMemo(() => {
    if (data == null) return undefined;
    const currentFeatureVersion = context.featureVersion;
    if (currentFeatureVersion == null) return data.featureVersions[0];
    return data.featureVersions.find(
      ({ id }) => currentFeatureVersion.sys.id === id,
    );
  }, [context.featureVersion, data]);
  const [selectedVersion, setSelectedVersion] = useState(initialVersion);

  useEffect(() => {
    if (selectedVersion == null) return;
    if (selectedVersion.id !== initialVersion?.id) {
      const newPathname = getPathName(
        router.pathname,
        selectedVersion.isLatest ?? false,
      );
      router
        .push({
          pathname: newPathname,
          query: {
            ...router.query,
            version: selectedVersion.isLatest ? null : selectedVersion.version,
          },
        })
        .catch(console.error);
    }
  }, [selectedVersion, initialVersion, router]);

  if (data == null) return null;

  return (
    <div>
      <span className="block quote-decoration uppercase title-sub mb-6">
        Change Version
      </span>
      <div className="text-sm md:text-base top-16 w-full font-mono">
        <Listbox value={selectedVersion} onChange={setSelectedVersion}>
          <div className="relative mt-1 z-10">
            <Listbox.Button
              className="relative w-full cursor-default rounded-full bg-white py-3 pl-6 pr-10 text-left border border-grey-200"
              style={{ boxShadow: '0px 0px 18px rgba(0, 0, 0, 0.02)' }}
            >
              {selectedVersion != null ? (
                <span className="block truncate uppercase">
                  Version: DbVisualizer {selectedVersion.version} -{' '}
                  {selectedVersion.releaseDate}
                  {selectedVersion.isLatest ? (
                    <span className="text-primary ml-2">[Latest]</span>
                  ) : (
                    ''
                  )}
                </span>
              ) : (
                <span className="block truncate uppercase">Version:</span>
              )}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 py-2 m-2 text-white bg-grey-600 rounded-full">
                <span className="uppercase">Change</span>
                <span className="uppercase hidden md:inline-block ml-2">
                  Version
                </span>
                <span className="ml-2">▼</span>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className="absolute mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1 border border-grey-200"
                style={{ boxShadow: '0px 0px 18px rgba(0, 0, 0, 0.02)' }}
              >
                {data.featureVersions.map((featureVersion) => (
                  <Listbox.Option
                    key={featureVersion.version}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-grey-600 text-white' : 'text-gray-600'
                      }`
                    }
                    value={featureVersion}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          DbVisualizer {featureVersion.version} -{' '}
                          {featureVersion.releaseDate}
                          {featureVersion.isLatest ? (
                            <span className="text-primary ml-2">[Latest]</span>
                          ) : (
                            ''
                          )}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
                            <CheckIcon
                              className="h-5 w-5 text-primary"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
}

const versionSelector = Object.assign(VersionSelectorComponent, {
  registerDataCollector(
    props: SavedComponentProps<VersionSelectorData>,
    preview: boolean,
    context: PageContext,
  ) {
    return {
      fetchKey: versionSelectorFetchKey(props, preview, context),
      async collect(): Promise<CollectedData | undefined> {
        const productIndex = context.productIndex
          ? {
              id: context.productIndex.sys.id,
              slug: context.productIndex.fields.slug,
            }
          : await getProductIndex(
              {
                slug: '/',
                preview,
              },
              {
                pickFields: [],
              },
            ).then(({ productIndex: index }) =>
              index ? { id: index.sys.id, slug: index.fields.slug } : undefined,
            );
        if (productIndex == null) {
          return undefined;
        }
        const { featureVersions } = await getFeatureVersionList(
          {
            productIndex: productIndex.id,
          },
          {
            pickFields: [],
          },
        );
        return {
          productIndexSlug: productIndex.slug,
          featureVersions: featureVersions.map(
            ({ fields: { version, releaseDate }, sys: { id } }, index) => ({
              id,
              version,
              releaseDate,
              ...(index === 0 ? { isLatest: true as const } : null),
            }),
          ),
        };
      },
    };
  },
});

export default versionSelector;

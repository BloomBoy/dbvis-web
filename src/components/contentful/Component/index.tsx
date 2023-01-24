/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { LayoutProps } from '../Layout';
import { PageContext } from 'src/utils/contentful/pageContext';
import dynamic from 'next/dynamic';

export interface SavedComponentProps<
  Data extends Record<string, unknown> = Record<string, any>,
> {
  id: string;
  type: `${string}Component`;
  data: Partial<Data>;
}

export interface ComponentProps<
  Data extends Record<string, unknown> = Record<string, any>,
> extends SavedComponentProps<Data> {
  layout: LayoutProps;
}

interface ComponentRenderer<
  Data extends Record<string, unknown> = Record<string, any>,
> extends React.FC<ComponentProps<Data>> {
  headerCount?:
    | number
    | ((
        props: ComponentProps<Data>,
        collectedData: Record<string, unknown>,
      ) => number);
  headers?: (
    props: ComponentProps<Data>,
    collectedData: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ) =>
    | {
        id: string;
        mainTitle?: string;
        subTitle?: string;
        linkText?: string;
      }[]
    | undefined
    | null;

  registerDataCollector?: (
    props: SavedComponentProps<Data>,
    preview: boolean,
    context: PageContext,
  ) => {
    fetchKey: string;
    collect: () => unknown | Promise<unknown>;
  } | null;
}

interface AsyncComponentRenderer<
  Data extends Record<string, unknown> = Record<string, any>,
> {
  component: React.ComponentType<ComponentProps<Data>>;
  headerCount(
    ...args: Parameters<
      Extract<ComponentRenderer<Data>['headerCount'], (...a: any[]) => unknown>
    >
  ): Promise<number>;
  headers(
    ...args: Parameters<
      Extract<ComponentRenderer<Data>['headers'], (...a: any[]) => unknown>
    >
  ): Promise<
    NonNullable<
      ReturnType<
        Extract<ComponentRenderer<Data>['headers'], (...a: any[]) => unknown>
      >
    >
  >;
  registerDataCollector(
    ...args: Parameters<
      Extract<
        ComponentRenderer<Data>['registerDataCollector'],
        (...a: any[]) => unknown
      >
    >
  ): Promise<
    | ReturnType<
        Extract<
          ComponentRenderer<Data>['registerDataCollector'],
          (...a: any[]) => unknown
        >
      >
    | Exclude<
        ComponentRenderer<Data>['registerDataCollector'],
        ((...a: any[]) => unknown) | undefined
      >
  >;
}

export type LoaderComponent<
  Data extends Record<string, unknown> = Record<string, any>,
> = Promise<
  | ComponentRenderer<Data>
  | {
      default: ComponentRenderer<Data>;
    }
>;
function makeDynamicComponent<
  Data extends Record<string, unknown> = Record<string, any>,
>(
  loader: (() => LoaderComponent<Data>) | LoaderComponent<Data>,
  nextDynamicComp: React.ComponentType<ComponentProps<Data>>,
): AsyncComponentRenderer<Data> {
  let dynamicPromise: Promise<ComponentRenderer<Data>> | undefined;
  let comp: ComponentRenderer<Data> | undefined;
  const realLoader = () => {
    if (comp != null) return Promise.resolve(comp);
    if (dynamicPromise == null) {
      dynamicPromise =
        typeof loader === 'function'
          ? loader().then((imported) => {
              if ('default' in imported) {
                comp = imported.default;
                return comp;
              }
              comp = imported;
              return comp;
            })
          : loader.then((imported) => {
              if ('default' in imported) {
                comp = imported.default;
                return comp;
              }
              comp = imported;
              return comp;
            });
    }
    return dynamicPromise;
  };
  return {
    component: nextDynamicComp,
    async headerCount(...args) {
      const syncComp = await realLoader();
      if (typeof syncComp.headerCount !== 'function') {
        return syncComp.headerCount ?? 0;
      }
      return syncComp.headerCount(...args);
    },
    async headers(...args) {
      const syncComp = await realLoader();
      return syncComp.headers?.(...args) ?? [];
    },
    async registerDataCollector(...args) {
      const syncComp = await realLoader();
      return syncComp.registerDataCollector?.(...args) ?? null;
    },
  };
}

export const components: Record<
  `${string}Component`,
  AsyncComponentRenderer | undefined
> = {
  textComponent: makeDynamicComponent(
    () => import('./components/text'),
    dynamic(() => import('./components/text')),
  ),
  buttonComponent: makeDynamicComponent(
    () => import('./components/button'),
    dynamic(() => import('./components/button')),
  ),
  imageComponent: makeDynamicComponent(
    () => import('./components/image'),
    dynamic(() => import('./components/image')),
  ),
  userReviewsComponent: makeDynamicComponent(
    () => import('./components/userReviews'),
    dynamic(() => import('./components/userReviews')),
  ),
  databaseSearchComponent: makeDynamicComponent(
    () => import('./components/databaseSearch'),
    dynamic(() => import('./components/databaseSearch')),
  ),
  emailSignupFormComponent: makeDynamicComponent(
    () => import('./components/emailSignupForm'),
    dynamic(() => import('./components/emailSignupForm')),
  ),
  imageButtonComponent: makeDynamicComponent(
    () => import('./components/imageButton'),
    dynamic(() => import('./components/imageButton')),
  ),
  layoutTitleComponent: makeDynamicComponent(
    () => import('./components/layoutTitle'),
    dynamic(() => import('./components/layoutTitle')),
  ),
  titleComponent: makeDynamicComponent(
    () => import('./components/title'),
    dynamic(() => import('./components/title')),
  ),
  downloadButtonComponent: makeDynamicComponent(
    () => import('./components/downloadButton'),
    dynamic(() => import('./components/downloadButton')),
  ),
  reviewSourcesComponent: makeDynamicComponent(
    () => import('./components/reviewSources'),
    dynamic(() => import('./components/reviewSources')),
  ),
  versionSelectorComponent: makeDynamicComponent(
    () => import('./components/versionSelector'),
    dynamic(() => import('./components/versionSelector')),
  ),
  badgeComponent: makeDynamicComponent(
    () => import('./components/badge'),
    dynamic(() => import('./components/badge')),
  ),
  releaseQuickLinksComponent: makeDynamicComponent(
    () => import('./components/releaseQuickLinks'),
    dynamic(() => import('./components/releaseQuickLinks')),
  ),
  releasenotesComponent: makeDynamicComponent(
    () => import('./components/releasenotes'),
    dynamic(() => import('./components/releasenotes')),
  ),
  recommendedInstallersComponent: makeDynamicComponent(
    () => import('./components/installers/recommendedInstallers'),
    dynamic(() => import('./components/installers/recommendedInstallers')),
  ),
  allInstallersComponent: makeDynamicComponent(
    () => import('./components/installers/allInstallers'),
    dynamic(() => import('./components/installers/allInstallers')),
  ),
  installationInstructionsComponent: makeDynamicComponent(
    () => import('./components/installationInstructions'),
    dynamic(() => import('./components/installationInstructions')),
  ),
  systemRequirementsComponent: makeDynamicComponent(
    () => import('./components/installers/systemRequirements'),
    dynamic(() => import('./components/installers/systemRequirements')),
  ),
};

export function isComponent(obj: unknown): obj is SavedComponentProps {
  if (typeof obj !== 'object' || obj == null) return false;
  if (Array.isArray(obj)) return false;
  if (!('type' in obj) || !('id' in obj) || !('data' in obj)) return false;
  const { type, id, data } = obj as Record<string, unknown>;
  if (typeof type !== 'string' || !type.endsWith('Component')) return false;
  if (typeof id !== 'string') return false;
  if (typeof data !== 'object' || data == null || Array.isArray(data)) {
    return false;
  }
  return true;
}

function ComponentComp(props: ComponentProps): JSX.Element | null {
  const { type } = props;
  const Comp = components[type]?.component;
  if (Comp == null) {
    return null;
  }
  return <Comp {...props} />;
}

const Component = Object.assign(ComponentComp, {
  async headerCount(
    props: ComponentProps,
    collectedData: Record<string, unknown>,
  ) {
    const { type } = props;
    const Comp = components[type];
    return (await Comp?.headerCount(props, collectedData)) ?? 0;
  },
  async headers(
    props: ComponentProps,
    collectedData: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ) {
    const { type } = props;
    const Comp = components[type];
    return (await Comp?.headers(props, collectedData, preview, context)) ?? [];
  },
});

export default Component;

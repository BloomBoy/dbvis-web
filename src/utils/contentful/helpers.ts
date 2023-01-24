/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ContentfulEntity,
  ContentfulFieldLink,
  SafeEntryFields,
  VALID_LINK_TYPES,
} from './types';
import { Locale } from 'contentful';
import { isNonNull } from '../filters';

export function isLink<T extends typeof VALID_LINK_TYPES[number]>(
  value: unknown,
  targetLinkType: T,
): value is ContentfulFieldLink<T>;
export function isLink(
  value: unknown,
  targetLinkType?: typeof VALID_LINK_TYPES[number],
): value is ContentfulFieldLink;
export function isLink<T extends typeof VALID_LINK_TYPES[number]>(
  value: unknown,
  targetLinkType?: T,
): value is ContentfulFieldLink<T> {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  if (!isContentfulEntity) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  if (value === null) return false;
  if (!('sys' in value)) return false;
  const { sys } = value as { sys: unknown };
  if (typeof sys !== 'object') return false;
  if (sys == null) return false;
  if (!('type' in sys)) return false;
  if (!('linkType' in sys)) return false;
  if (!('id' in sys)) return false;
  const { type, linkType, id } = sys as {
    type: unknown;
    linkType: unknown;
    id: unknown;
  };
  if (type !== 'Link') return false;
  if (
    typeof linkType !== 'string' ||
    (targetLinkType == null
      ? !(VALID_LINK_TYPES as readonly string[]).includes(linkType)
      : targetLinkType !== linkType)
  ) {
    return false;
  }
  if (typeof id !== 'string') return false;
  return true;
}

export function isNotLink<T = unknown>(
  value: T,
): value is Exclude<T, ContentfulFieldLink> {
  return !isLink(value);
}

export function hasSys(obj: unknown): obj is {
  sys: {
    type: string;
    id: string;
  };
} {
  if (typeof obj !== 'object' || obj == null) return false;
  if (Array.isArray(obj)) return false;
  const { sys } = obj as {
    sys?: unknown;
  };
  if (typeof sys !== 'object' || sys == null) return false;
  if (Array.isArray(sys)) return false;
  const { type, id } = sys as {
    type?: unknown;
    id?: unknown;
  };
  return typeof type === 'string' && typeof id === 'string';
}

export function isAsset(obj: {
  sys: {
    type: string;
    id: string;
  };
}): obj is SafeEntryFields.Asset;
export function isAsset(obj: {
  sys: {
    type: string;
    id: string;
    [key: string]: unknown;
  };
}): boolean {
  const { sys } = obj;
  if (typeof sys.createdAt !== 'string') return false;
  if (typeof sys.updatedAt !== 'string') return false;
  if (typeof sys.locale !== 'string') return false;
  if (typeof sys.revision !== 'number' && typeof sys.revision !== 'undefined') {
    return false;
  }
  if (
    (typeof sys.space !== 'object' || sys.space === null) &&
    typeof sys.space !== 'undefined'
  ) {
    return false;
  }
  if (
    (typeof sys.environment !== 'object' || sys.environment === null) &&
    typeof sys.environment !== 'undefined'
  ) {
    return false;
  }
  if (
    (typeof sys.contentType !== 'object' || sys.contentType === null) &&
    typeof sys.contentType !== 'undefined'
  ) {
    return false;
  }
  if (sys.space != null && !isLink(sys.space, 'Space')) {
    return false;
  }
  if (sys.environment != null && !isLink(sys.environment, 'Environment')) {
    return false;
  }
  if (sys.contentType != null && !isLink(sys.contentType, 'ContentType')) {
    return false;
  }
  if (!('metadata' in obj)) {
    return false;
  }
  const { metadata } = obj as {
    metadata?: unknown;
  };
  if (typeof metadata !== 'object' || metadata == null) return false;
  if (Array.isArray(metadata)) return false;
  if (!('tags' in metadata)) return false;
  const { tags } = metadata as {
    tags?: unknown;
  };
  if (!Array.isArray(tags)) return false;
  if (!tags.every((tag: unknown) => isLink(tag, 'Tag'))) return false;
  return true;
}

export function isEntry(obj: {
  sys: {
    type: string;
    id: string;
  };
}): obj is SafeEntryFields.Entry<unknown>;
export function isEntry(obj: {
  sys: {
    type: string;
    id: string;
    [key: string]: unknown;
  };
}): boolean {
  const { sys } = obj;
  if (typeof sys.contentType === 'undefined') return false;
  if (typeof sys.createdAt !== 'string') return false;
  if (typeof sys.updatedAt !== 'string') return false;
  if (typeof sys.locale !== 'string') return false;
  if (typeof sys.revision !== 'number' && typeof sys.revision !== 'undefined') {
    return false;
  }
  if (
    (typeof sys.space !== 'object' || sys.space == null) &&
    typeof sys.space !== 'undefined'
  ) {
    return false;
  }
  if (
    (typeof sys.environment !== 'object' || sys.environment == null) &&
    typeof sys.environment !== 'undefined'
  ) {
    return false;
  }
  if (typeof sys.contentType !== 'object' || sys.contentType == null) {
    return false;
  }
  if (!isLink(sys.space, 'Space')) {
    return false;
  }
  if (!isLink(sys.environment, 'Environment')) {
    return false;
  }
  if (!isLink(sys.contentType, 'ContentType')) {
    return false;
  }
  if (!('metadata' in obj)) {
    return false;
  }
  const { metadata } = obj as {
    metadata?: unknown;
  };
  if (typeof metadata !== 'object' || metadata == null) return false;
  if (Array.isArray(metadata)) return false;
  if (!('tags' in metadata)) return false;
  const { tags } = metadata as {
    tags?: unknown;
  };
  if (!Array.isArray(tags)) return false;
  if (!tags.every((tag: unknown) => isLink(tag, 'Tag'))) return false;
  return true;
}

export function isLocale(obj: {
  sys: {
    type: string;
    id: string;
  };
}): obj is Locale;
export function isLocale(obj: {
  sys: {
    type: string;
    id: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}): boolean {
  if (obj.sys.type !== 'Locale') return false;
  if (typeof obj.sys.version !== 'number') return false;
  if (typeof obj.code !== 'string') return false;
  if (typeof obj.name !== 'string') return false;
  if (typeof obj.fallbackCode !== 'string' && obj.fallbackCode !== null) {
    return false;
  }
  if (typeof obj.default !== 'boolean') return false;
  return true;
}

export function isTag(obj: {
  sys: {
    type: string;
    id: string;
  };
}): obj is Locale;
export function isTag(obj: {
  sys: {
    type: string;
    id: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}): boolean {
  if (obj.sys.type !== 'Locale') return false;
  if (typeof obj.sys.version !== 'number') return false;
  if (typeof obj.sys.visibility !== 'number') return false;
  if (typeof obj.name !== 'string') return false;
  return true;
}

export function isEntryOrAsset(
  obj: unknown,
): obj is SafeEntryFields.Entry<unknown> {
  if (!hasSys(obj)) return false;
  return isEntry(obj) || isAsset(obj);
}

export function isContentfulEntity(obj: unknown): obj is ContentfulEntity {
  if (isLink(obj)) return true;
  if (!hasSys(obj)) return false;
  if (isEntry(obj)) return true;
  if (isAsset(obj)) return true;
  if (isLocale(obj)) return true;
  if (isTag(obj)) return true;
  return false;
}

export function linkToUndefined<
  T extends Exclude<
    SafeEntryFields.Any<Record<string, unknown>>,
    SafeEntryFields.Link<any>
  >,
>(o: T): T;
export function linkToUndefined<
  T extends SafeEntryFields.Any<Record<string, unknown>>,
>(o: T): Exclude<T, ContentfulFieldLink> | undefined;
export function linkToUndefined<
  T extends SafeEntryFields.Any<Record<string, unknown>>,
>(o: T): Exclude<T, ContentfulFieldLink> | undefined {
  if (isNotLink(o)) return o as Exclude<T, ContentfulFieldLink>;
  return undefined;
}

const CLEANED = Symbol('Cleaned');

type SafeMap<T extends object> = T extends {
  readonly sys: object;
}
  ? T extends ContentfulFieldLink
    ? undefined
    : {
        [key in keyof T]: key extends 'fields' ? SafeValue<T[key]> : T[key];
      }
  : {
      [key in keyof T]: SafeValue<T[key]>;
    };

type SafeArray<T extends Array<unknown>> = T extends Array<infer Q>
  ? Array<NonNullable<SafeValue<Q>>>
  : T;

export type SafeValue<T> = T extends object
  ? T extends Array<unknown>
    ? SafeArray<T>
    : SafeMap<T>
  : T;

function isClean<T>(val: T): val is T & { [CLEANED]: SafeValue<T> } {
  return CLEANED in val;
}

function isObject<T>(val: T): val is T & object {
  return typeof val === 'object' && val != null;
}

function applyCleanVersion<T extends object>(val: T, cleaned: SafeValue<T>) {
  (
    val as {
      [CLEANED]?: SafeValue<T> | undefined;
    }
  )[CLEANED] = cleaned;
}

export function safeValue<T>(
  val: T,
  process?: <U>(val: U) => SafeValue<U> | undefined,
): SafeValue<T> {
  if (isObject(val)) {
    if (isClean(val)) {
      return val[CLEANED];
    }
    const processed = process?.(val);
    let ret: SafeValue<T & object>;
    if (processed != null) {
      ret = processed;
    } else {
      if (Array.isArray(val)) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        ret = cleanupArrayField(val, process) as SafeValue<T & object>;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        ret = cleanupObject(
          val as Record<string, unknown>,
          process,
        ) as SafeValue<T & object>;
      }
    }
    applyCleanVersion(val, ret);
    return ret;
  }
  return val as SafeValue<T>;
}

function cleanupArrayField<Arr extends unknown[]>(
  array: Arr,
  process: (<U>(val: U) => SafeValue<U> | undefined) | undefined,
): NonNullable<SafeValue<Arr[number]>>[] {
  return array
    .map((val) => safeValue(val, process))
    .filter(isNonNull) as NonNullable<SafeValue<Arr[number]>>[];
}

function cleanupObject<T extends Record<string, unknown>>(
  o: T,
  process: (<U>(val: U) => SafeValue<U> | undefined) | undefined,
): SafeValue<T> {
  const proto = Object.getPrototypeOf(o);
  if (hasSys(o)) {
    if (isEntry(o)) {
      const a = {
        sys: o.sys,
        fields: safeValue(o.fields),
        ...(o.metadata !== undefined ? { metadata: o.metadata } : null),
      } as any;
      return a;
    }
    return o as SafeValue<T>;
  }
  if (proto === Object.prototype || proto === null) {
    return Object.fromEntries(
      Object.entries(o)
        .map(([key, value]) => {
          return [key, safeValue(value, process)];
        })
        .filter(([, value]) => typeof value !== 'undefined'),
    ) as SafeValue<T>;
  }
  return o as SafeValue<T>;
}

export function pickFieldsQuery(
  pickFields: readonly string[] | null | undefined,
) {
  return pickFields != null
    ? {
        select: [
          'sys',
          'metadata',
          ...pickFields.map((field) => `fields.${field}`),
        ].join(','),
      }
    : null;
}

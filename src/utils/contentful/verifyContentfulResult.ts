/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entry } from 'contentful';
import { z } from 'zod';
import { fromEntries } from '../objects';
import contentTypeSchemas from './schemas';
import { ContentTypeFieldsMap, SafeEntryFields } from './types';

/**
 * Contetnful can return unfinished entries in preview mode.
 * This function verifies the schema in preview mode to avoid unecessary crashing.
 *
 * In order to preserve the ordinary failurue mode of a published entry, in production
 * this function will return the data untouched without verifying it.
 *
 * If issues where published Contetnful data becomes corrupted or incomplete,
 * expanding this function to verify the schema in production mode may be a good idea,
 * but it would require a more communicative failure mode than just pretending the entry doesn't exist.
 *
 * @param schema The schema to match with
 * @param entry The data to verify
 * @param preview Whether we're in preview mode
 * @param pickFields Which fields are included in the data
 * @returns The the provided entry, or null
 */
export default function verifyContentfulResult<
  ZType extends z.ZodObject<z.ZodRawShape>,
  EntryType extends SafeEntryFields.Entry<any>,
  Picks extends keyof z.infer<ZType>,
>(
  schema: ZType,
  entry: EntryType,
  preview: boolean | undefined | null,
  pickFields: readonly Picks[],
): EntryType extends Entry<any>
  ? Entry<Pick<z.infer<ZType>, Picks>> | null
  : SafeEntryFields.Entry<Pick<z.infer<ZType>, Picks>> | null;
export default function verifyContentfulResult<
  ZType extends z.ZodObject<z.ZodRawShape>,
  EntryType extends SafeEntryFields.Entry<any>,
>(
  schema: ZType,
  entry: EntryType,
  preview: boolean | undefined | null,
): EntryType extends Entry<any>
  ? Entry<z.infer<ZType>> | null
  : SafeEntryFields.Entry<z.infer<ZType>> | null;
export default function verifyContentfulResult<
  ZType extends z.ZodObject<z.ZodRawShape>,
  EntryType extends SafeEntryFields.Entry<any>,
  Picks extends keyof z.infer<ZType>,
>(
  schema: ZType,
  entry: EntryType,
  preview: boolean | undefined | null,
  pickFields?: readonly Picks[],
): EntryType extends Entry<any>
  ? Entry<Partial<z.infer<ZType>>> | Entry<Pick<z.infer<ZType>, Picks>> | null
  :
      | SafeEntryFields.Entry<z.infer<ZType>>
      | SafeEntryFields.Entry<Pick<z.infer<ZType>, Picks>>
      | null;
export default function verifyContentfulResult<
  SchemaName extends keyof typeof contentTypeSchemas,
  EntryType extends SafeEntryFields.Entry<any>,
  Picks extends keyof ContentTypeFieldsMap[SchemaName],
>(
  schema: SchemaName,
  entry: EntryType,
  preview: boolean | undefined | null,
  pickFields: readonly Picks[],
): EntryType extends Entry<any>
  ? Entry<Pick<ContentTypeFieldsMap[SchemaName], Picks>> | null
  : SafeEntryFields.Entry<Pick<ContentTypeFieldsMap[SchemaName], Picks>> | null;
export default function verifyContentfulResult<
  SchemaName extends keyof typeof contentTypeSchemas,
  EntryType extends SafeEntryFields.Entry<any>,
>(
  schema: SchemaName,
  entry: EntryType,
  preview: boolean | undefined | null,
): EntryType extends Entry<any>
  ? Entry<ContentTypeFieldsMap[SchemaName]> | null
  : SafeEntryFields.Entry<ContentTypeFieldsMap[SchemaName]> | null;
export default function verifyContentfulResult<
  SchemaName extends keyof typeof contentTypeSchemas,
  EntryType extends SafeEntryFields.Entry<any>,
  Picks extends keyof ContentTypeFieldsMap[SchemaName],
>(
  schema: SchemaName,
  entry: EntryType,
  preview: boolean | undefined | null,
  pickFields?: readonly Picks[],
): EntryType extends Entry<any>
  ?
      | Entry<ContentTypeFieldsMap[SchemaName]>
      | Entry<Pick<ContentTypeFieldsMap[SchemaName], Picks>>
      | null
  :
      | SafeEntryFields.Entry<ContentTypeFieldsMap[SchemaName]>
      | SafeEntryFields.Entry<Pick<ContentTypeFieldsMap[SchemaName], Picks>>
      | null;
export default function verifyContentfulResult(
  schema: z.ZodObject<z.ZodRawShape> | keyof typeof contentTypeSchemas,
  entry: SafeEntryFields.Entry<unknown> | undefined,
  preview: boolean | undefined | null,
  pickFields?: readonly (string | symbol | number)[],
): SafeEntryFields.Entry<unknown> | null {
  const baseSchema =
    typeof schema === 'string' ? contentTypeSchemas[schema] : schema;
  // If we're in development mode or preview mode
  // verify the schema
  if (process.env.NODE_ENV === 'development' || preview) {
    const parseSchema =
      pickFields != null
        ? baseSchema.pick(
            fromEntries(pickFields.map((key) => [key, true] as const)),
          )
        : baseSchema;
    if (entry == null) {
      return null;
    }
    const parsed = parseSchema.safeParse(entry.fields);
    if (parsed.success) return entry;
    // If we're in development mode, and not preview mode, crash the page
    else if (process.env.NODE_ENV === 'development' && !preview) {
      throw parsed.error;
    } else {
      // Else, log the error, but return null to fail gracefully with 404
      console.error(parsed.error);
      return null;
    }
  }

  // If we're neither in preview mode nor development mode, just return the data
  // and hope for the best, as we want to maintain a sane failure mode
  // that isn't impossible to debug, and Contentful presents some guarantees for
  // published content.
  return entry ?? null;
}

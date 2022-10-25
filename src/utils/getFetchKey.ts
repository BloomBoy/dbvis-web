export default function getFetchKey(
  type: string,
  ...values: (
    | string
    | number
    | null
    | undefined
    | (string | number | null | undefined)[]
  )[]
): string;
export default function getFetchKey(
  type: string,
  flags: Record<string, boolean>,
  ...values: (
    | string
    | number
    | null
    | undefined
    | (string | number | null | undefined)[]
  )[]
): string;
export default function getFetchKey(
  type: string,
  flags:
    | Record<string, boolean | null | undefined>
    | (
        | string
        | number
        | null
        | undefined
        | (string | number | null | undefined)[]
      ),
  ...values: (
    | string
    | number
    | null
    | undefined
    | (string | number | null | undefined)[]
  )[]
): string {
  let flatFlags: string;
  if (typeof flags === 'object' && !Array.isArray(flags) && flags != null) {
    flatFlags = Object.entries(flags)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .sort()
      .join('-');
  } else {
    values = [flags, ...values];
    flatFlags = '';
  }
  const flatValues = values
    .filter((value): value is NonNullable<typeof value> => value != null)
    .map((value) => {
      if (Array.isArray(value)) {
        return value
          .filter(
            (val): val is NonNullable<typeof val> => val !== '' && val != null,
          )
          .sort()
          .join('-');
      }
      return String(value);
    }, [])
    .filter((v) => v !== '')
    .join('-');
  return `${type}${flatValues ? `:${flatValues}` : ''}${
    flatFlags ? `:${flatFlags}` : ''
  }`;
}

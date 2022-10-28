type Keys<
  T extends readonly unknown[] | { readonly [key: string | number]: unknown },
> = T extends readonly unknown[]
  ?
      | Exclude<keyof T & string, keyof [] | `${number}`>
      | `${number extends {
          readonly [key in keyof T]: key;
        }[Extract<keyof T, `${number}`>]
          ? `${number}`
          : {
              readonly [key in keyof T]: key;
            }[Extract<keyof T, `${number}`>]}`
  : keyof T extends number
  ? `${keyof T}`
  : keyof T & string;

export function objectEntries<In extends { readonly [key: string]: unknown }>(
  input: In,
) {
  return Object.entries(input) as {
    [key in Keys<In>]: [key, In[key]];
  }[Keys<In>][];
}

type FromEntry<T extends readonly [string, unknown]> = (
  T extends unknown ? () => { [key in T[0]]: T[1] } : never
) extends () => infer R
  ? (R extends unknown ? (k: R) => void : never) extends (k: infer I) => void
    ? I
    : never
  : never;

export function fromEntries<In extends readonly (readonly [string, unknown])[]>(
  input: In,
) {
  return Object.fromEntries(input) as {
    [key in keyof FromEntry<In[number]>]: FromEntry<In[number]>[key];
  };
}

export function objectKeys<
  In extends readonly unknown[] | { readonly [key: string]: unknown },
>(input: In): readonly Keys<In>[] {
  return Object.keys(input) as Keys<In>[];
}

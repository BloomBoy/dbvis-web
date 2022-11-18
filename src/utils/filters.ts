export function isNonNull<T>(o: T): o is NonNullable<T> {
  return o != null;
}

export function isReadonlyArray(arg: unknown): arg is readonly unknown[] {
  return Array.isArray(arg);
}

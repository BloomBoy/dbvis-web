export function isNonNull<T>(o: T): o is NonNullable<T> {
  return o != null;
}

export function asyncMapMaxConcurrent<T, U>(
  maxCount: number,
  iterable: Iterable<T>,
  fn: (cur: T, index: number, array: readonly T[]) => U | Promise<U>,
): Promise<U[]>;

export function asyncForEachMaxConcurrent<T>(
  maxCount: number,
  iterable: Iterable<T>,
  fn: (cur: T, index: number, array: readonly T[]) => void | Promise<void>,
): Promise<void>;

export function asyncFilterMaxConcurrent<T>(
  maxCount: number,
  iterable: Iterable<T>,
  fn: (
    cur: T,
    index: number,
    array: readonly T[],
  ) => boolean | Promise<boolean>,
): Promise<T[]>;

export function asyncEveryMaxConcurrent<T>(
  maxCount: number,
  iterable: Iterable<T>,
  fn: (
    cur: T,
    index: number,
    array: readonly T[],
  ) => boolean | Promise<boolean>,
): Promise<boolean>;

export function asyncSomeMaxConcurrent<T>(
  maxCount: number,
  iterable: Iterable<T>,
  fn: (
    cur: T,
    index: number,
    array: readonly T[],
  ) => boolean | Promise<boolean>,
): Promise<boolean>;

export function asyncFindIndexMaxConcurrent<T>(
  maxCount: number,
  iterable: Iterable<T>,
  fn: (
    cur: T,
    index: number,
    array: readonly T[],
  ) => boolean | Promise<boolean>,
): Promise<number>;

export function asyncFindMaxConcurrent<T>(
  maxCount: number,
  iterable: Iterable<T>,
  fn: (
    cur: T,
    index: number,
    array: readonly T[],
  ) => boolean | Promise<boolean>,
): Promise<T | undefined>;

export function asyncReduce<T>(
  iterable: Iterable<T>,
  fn: (acc: T, cur: T, index: number, array: readonly T[]) => T | Promise<T>,
): Promise<T>;
export function asyncReduce<T, U>(
  iterable: Iterable<T>,
  fn: (acc: U, cur: T, index: number, array: readonly T[]) => U | Promise<U>,
  initialValue: U,
): Promise<U>;

export function asyncReduceRight<T>(
  iterable: Iterable<T>,
  fn: (acc: T, cur: T, index: number, array: readonly T[]) => T | Promise<T>,
): Promise<T>;
export function asyncReduceRight<T, U>(
  iterable: Iterable<T>,
  fn: (acc: U, cur: T, index: number, array: readonly T[]) => U | Promise<U>,
  initialValue: U,
): Promise<U>;

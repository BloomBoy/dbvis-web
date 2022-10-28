export default function delay(
  ms: number,
): <T>(input: T | Promise<T>) => Promise<T> {
  return (input) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(input), ms);
    });
  };
}

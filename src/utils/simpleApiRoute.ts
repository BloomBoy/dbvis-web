import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import stringify from 'fast-safe-stringify';

type HeaderValue = string | number | string[];

/**
 * hello
 */
type HeaderFn = (
  name: string,
  value?:
    | (HeaderValue | null)
    | ((old: HeaderValue | null) => HeaderValue | null),
) => HeaderValue | null;

type Handler<T> = {
  /**
   * @param req the request
   * @param resHeader a function to set headers
   */
  (req: NextApiRequest, resHeader: HeaderFn): Promise<T> | T;
};

function thrownToMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public headers?: Record<string, HeaderValue>,
  ) {
    super(message);
  }
}

/**
 * A simple wrapper around Next.js API routes that handles errors and JSON
 * serialization.
 *
 * @param handler The async handler that returns the result
 * @returns a Next.js API handler
 */
export default function simpleApiRoute<T>(handler: Handler<T>): NextApiHandler {
  async function wrappedHandler(
    req: NextApiRequest,
    res: NextApiResponse<string | { error: string }>,
  ) {
    try {
      const extraHeaders: Record<string, HeaderValue | null> = {};
      const resHeader: HeaderFn = (name, value) => {
        let old = extraHeaders[name] as HeaderValue | undefined | null;
        if (old === undefined) {
          old = res.getHeader(name) ?? null;
        }
        if (typeof value === 'undefined') {
          return old;
        }
        if (typeof value === 'function') {
          const newValue = value(old);
          extraHeaders[name] = newValue;
          return old;
        } else if (value === null) {
          delete extraHeaders[name];
          return old;
        } else {
          extraHeaders[name] = value;
          return old;
        }
      };
      const data = await handler(req, resHeader);
      const json = stringify(data);
      if (typeof json !== 'undefined') {
        Object.entries(extraHeaders).forEach(([key, value]) => {
          if (value !== null) {
            res.setHeader(key, value);
          } else {
            res.removeHeader(key);
          }
        });
        res
          .status(200)
          .setHeader('content-type', 'application/json; charset=utf-8')
          .send(json);
      } else {
        res.status(204).end();
      }
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status);
        if (error.headers) {
          Object.entries(error.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
          });
        }
        res.json({ error: error.message });
      } else {
        res.status(500).json({ error: thrownToMessage(error) });
      }
    }
  }
  return wrappedHandler;
}

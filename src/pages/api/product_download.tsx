import { NextApiRequest, NextApiResponse } from 'next';
import getContentfulClient from 'src/utils/getContentfulClient.mjs';

class HttpError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}
HttpError.prototype.name = HttpError.name;

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { path } = req.query;
  try {
    if (path == null || !Array.isArray(path) || path.length === 0) {
      throw new HttpError(400, 'Invalid path');
    }
    const client = getContentfulClient(false);
    const [asset] = (
      await client.getAssets({
        'fields.file.fileName': path[2],
      })
    ).items;
    if (asset == null) {
      throw new HttpError(404, 'Not Found');
    }
    return res
      .writeHead(302, {
        Location: `${asset.fields.file.url.startsWith('//') ? 'https:' : ''}${
          asset.fields.file.url
        }`,
      })
      .end();
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Unknown Error' });
  }
}

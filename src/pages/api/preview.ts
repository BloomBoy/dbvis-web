import { NextApiRequest, NextApiResponse } from 'next';
import getContentfulClient from 'src/utils/getContentfulClient.mjs';
import { isValidEntry, getEntryUrl } from 'src/utils/resolveUrl';

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
  const { secret, id } = req.query;
  if (secret !== process.env.CF_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const client = getContentfulClient(true);

  const entry = await client.getEntry(id);

  if (!isValidEntry(entry)) {
    return res.status(400).json({ message: 'Invalid contentType for entry' });
  }

  try {
    const url = getEntryUrl(entry) ?? '/';

    // Enable Preview Mode by setting the cookies
    res.setHeader(
      'Set-Cookie',
      `previewToken=${encodeURIComponent(
        process.env.CF_PREVIEW_ACCESS_TOKEN ?? '',
      )}; path=/; SameSite=Strict`,
    );
    res.setPreviewData({});

    // Redirect to the path from the fetched post
    // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
    return res.writeHead(307, { Location: url }).end();
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(401).json({ message: err.message });
    }
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Unknown Error' });
  }
}

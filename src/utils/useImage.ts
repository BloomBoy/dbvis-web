import * as Contentful from 'contentful';
import { useEffect, useState } from 'react';

const baseClient = Contentful.createClient({
  space: process.env.CF_SPACE_ID!,
  accessToken: process.env.CF_DELIVERY_ACCESS_TOKEN!,
});

export default function useImage(data: Contentful.Asset) {
  const [image, setImage] = useState<Contentful.Asset | null>(null);
  useEffect(() => {
    void baseClient.getAsset(data.sys.id).then((asset) => {
      setImage(asset);
    });
  }, [data.sys.id]);
  return image;
}

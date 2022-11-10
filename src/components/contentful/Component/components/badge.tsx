import type { ComponentProps } from '..';
import { SafeEntryFields } from 'src/utils/contentful';
import { resolveUrl } from 'src/utils/resolveUrl';
import Badge from 'src/components/Badge';
import classNames from 'classnames';

type ImageData = {
  icon?: SafeEntryFields.Asset;
  text?: SafeEntryFields.Symbol;
  linkTarget?: SafeEntryFields.Symbol | SafeEntryFields.Entry;
  classes?: SafeEntryFields.Symbol[];
};

function shouldRender(props: ComponentProps<ImageData>): boolean {
  if (
    props.data.icon != null ||
    props.data.text != null ||
    props.data.linkTarget != null
  ) {
    return true;
  }
  return false;
}

export default function badge(
  props: ComponentProps<ImageData>,
): JSX.Element | null {
  const { icon, text, linkTarget } = props.data;
  if (!shouldRender(props)) return null;

  const iconFields = icon?.fields;

  const targetUrl = resolveUrl(linkTarget);

  if (iconFields?.file?.contentType?.startsWith?.('image/')) {
    return (
      <div className="p-3">
        <Badge
          icon={{
            url: iconFields.file.url,
            alt: iconFields.title,
          }}
          text={text}
          href={targetUrl?.href}
          className={classNames(props.data.classes)}
        />
      </div>
    );
  }
  return null;
}

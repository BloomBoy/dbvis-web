import classNames from 'classnames';
import { useMemo } from 'react';
import MaybeLink from './contentful/MaybeLink';

type Props = {
  icon?: {
    url: string;
    alt: string;
    height?: number | undefined;
    width?: number | undefined;
  };
  text?: string;
  href?: string;
  className?: string;
};

function renderEl({ icon, text, href }: Pick<Props, 'icon' | 'text' | 'href'>) {
  if (text) {
    return (
      <div className="flex items-center">
        {icon && (
          <img
            src={icon.url}
            alt={icon.alt}
            width={icon.width}
            height={icon.height}
            className="flex-shrink-0 flex-grow-0 w-6 mr-2"
          />
        )}
        <span>{text}</span>
        {Boolean(href) && (
          <span className="text-primary-500 flex-shrink-0 whitespace-nowrap ml-auto">
            -&gt;
          </span>
        )}
      </div>
    );
  }
  if (icon) {
    return (
      <div className="flex items-center m-auto justify-center aspect-square max-h-full max-w-full">
        <img
          src={icon.url}
          alt={icon.alt}
          width={icon.width}
          height={icon.height}
        />
      </div>
    );
  }
  return null;
}

export default function Badge({
  icon,
  text,
  href,
  className,
}: Props): JSX.Element | null {
  const el = renderEl({
    icon,
    text,
    href,
  });
  const [hasHeight, hasWidth] = useMemo(() => {
    let w = false;
    let h = false;
    className?.split(' ')?.forEach((c) => {
      if (c.startsWith('h-')) h = true;
      if (c.startsWith('w-')) w = true;
    });
    return [w, h];
  }, [className]);
  if (el == null) return null;
  return (
    <MaybeLink
      href={href}
      className="font-normal block decoration-from-font underline-offset-4 justify-between items-center rounded-2xl shadow-imageShadow border border-grey-300 bg-badgeBackground"
    >
      <div
        className={classNames(className, 'p-2', {
          'h-[82px]': !hasHeight && !text,
          'w-[82px]': !hasWidth && !text,
        })}
      >
        {el}
      </div>
    </MaybeLink>
  );
}

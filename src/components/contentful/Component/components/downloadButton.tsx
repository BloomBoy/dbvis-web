import * as Contentful from 'contentful';
import type { ComponentProps } from '..';
import { SafeEntryFields } from 'src/utils/contentful';
import Button, { ButtonData } from './button';
import { useMemo } from 'react';
import DropDownButton from 'src/components/DropDownButton';
import { useGlobalData } from 'src/hooks/useGlobalData';
import useCurrentSystem from 'src/hooks/useCurrentBrowser';
import { browserOsMap } from 'src/utils/deviceSystemConstants';

type DownloadButtonData = Omit<ButtonData, 'target'> & {
  hoverWidget: SafeEntryFields.Boolean;
  classes?: Contentful.EntryFields.Symbol[];
};

export default function DownloadButton(
  props: ComponentProps<DownloadButtonData>,
): JSX.Element | null {
  const { data } = props;
  const { hoverWidget } = data;
  const { latestProductRelease } = useGlobalData();
  const { os } = useCurrentSystem();
  const deviceOs = os != null ? browserOsMap[os] : null;
  const installers = latestProductRelease?.fields.download?.installers;
  const releaseVersion = latestProductRelease?.fields.version;
  const recommendedInstallers = useMemo(() => {
    if (installers == null || !hoverWidget) return [];
    return installers
      .filter((i) => i.type === deviceOs)
      .flatMap((curOs) => {
        return curOs.files
          .filter((file) => file.recommended)
          .map(
            ({ recommended, ...file }) =>
              ({
                ...file,
                arch: curOs.arch,
                note: curOs.note,
                os: curOs.type,
              } as const),
          );
      });
  }, [installers, hoverWidget, deviceOs]);
  const buttonData = useMemo(
    () => ({
      ...data,
      target: '/download',
    }),
    [data],
  );

  if (recommendedInstallers.length === 0 || releaseVersion == null) {
    return <Button {...props} data={buttonData} />;
  }

  return (
    <DropDownButton
      recommendedInstallers={recommendedInstallers}
      releaseVersion={releaseVersion}
      classes={props.data.classes}
    >
      {props.data.buttonText || 'Download for free'}
    </DropDownButton>
  );
}

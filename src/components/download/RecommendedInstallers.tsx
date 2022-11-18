import React, { useMemo } from 'react';
import useCurrentSystem from 'src/hooks/useCurrentBrowser';
import {
  browserOsMap,
  knownOsNameMap,
  archMap,
} from 'src/utils/deviceSystemConstants';
import MaybeLink from '../contentful/MaybeLink';
import OSIcon, { hasOSIcon } from '../Icon';
import { InstallerTypeProp } from './AllInstallers';

export default function RecommendedInstallers({
  data,
  releaseVersion,
}: {
  data: InstallerTypeProp[];
  releaseVersion: string;
}): JSX.Element | null {
  const { deviceType, os } = useCurrentSystem();
  const deviceOs = os != null ? browserOsMap[os] : null;
  const recommendedInstallers = useMemo(() => {
    return data
      .filter((i) => i.type === deviceOs)
      .flatMap((curOs) => {
        return curOs.files
          .filter((file) => file.recommended)
          .map((file) => ({
            ...file,
            arch: curOs.arch,
            note: curOs.note,
            os: curOs.type,
          }));
      });
  }, [data, deviceOs]);
  if (deviceType === 'mobile') {
    return (
      <div
        className="mx-auto p-8 rounded-3xl max-w-7xl"
        style={{ backgroundColor: 'rgb(255, 255, 204)' }}
      >
        <h3
          className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
        >
          Mobile Device Alert
        </h3>
        <p className="mb-8 text-grey-900">
          DbVisualizer will not run on your mobile device. However, we’d be
          happy to send you an email with a direct link to a recommended
          installer for your computer.{' '}
        </p>
        <form className="flex flex-col">
          <input
            type="email"
            id="email"
            name="email"
            className="mb-4 rounded-3xl py-3 px-8 font-mono font-light uppercase"
            placeholder="MAIL@MAIL.COM"
          />
          <div className="mb-4 flex font-mono text-grey-600">
            <input
              type="checkbox"
              id="accept"
              name="accept"
              value="Accept"
              className="mb-4 shrink-0 self-center"
            />
            <label htmlFor="accept" className="px-4">
              By submitting this form, I agree to the DbVis Privacy Policy.
            </label>
          </div>
          <button className="bg-black self-center text-white rounded-3xl p-3 px-8 font-mono font-light uppercase">
            SUBMIT -&gt;
          </button>
        </form>
      </div>
    );
  }
  if (recommendedInstallers.length === 0) {
    return null;
  }
  return (
    <>
      <h3
        className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
      >
        Recommended Installers
      </h3>
      <div className="flex flex-col w-full border-b border-dashed pb-16">
        {recommendedInstallers.map((installer) => (
          <div
            className="w-full flex flex-row gap-8 rounded-md mb-3 p-4 items-center flex-wrap lg:flex-nowrap"
            style={{
              backgroundColor: 'rgb(43, 43, 43)',
              boxShadow: '0px 0px 44px 0px rgba(0, 0, 0, 0.25)',
            }}
            key={`${installer.os}-${installer.arch}-${installer.type}-${installer.filename}`}
          >
            {hasOSIcon(installer.os) && (
              <OSIcon
                os={installer.os}
                className="text-green-50"
                style={{ padding: '0px' }}
                size={50}
              />
            )}
            <div className="flex flex-col pt-1">
              <div className="text-white text-2xl leading-none">
                {knownOsNameMap[installer.os]}
                {installer.arch != null ? ` ${archMap[installer.arch]}` : ''}
              </div>
              <div className="text-grey-500 leading-none">
                <span className="uppercase">{`${installer.type}`}</span>
                {installer.jre != null &&
                  (installer.jre === true ? ' with Java' : ' without Java')}
              </div>
            </div>
            <MaybeLink
              href={`https://dbvis.com/product_download/dbvis-${releaseVersion}/media/${installer.filename}`}
              aria-label="Home"
              className="group ml-auto flex-grow-0 flex-shrink-0 basis-auto self-center block border border-transparent px-8 py-2 text-lg font-mono rounded-full text-black text-center bg-primary"
            >
              DOWNLOAD THIS INSTALLER ↓
            </MaybeLink>
          </div>
        ))}
      </div>
    </>
  );
}

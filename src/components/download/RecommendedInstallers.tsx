import React from 'react';
import { OsTypes } from 'react-device-detect';
import useCurrentSystem from 'src/hooks/useCurrentBrowser';
import MaybeLink from '../contentful/MaybeLink';
import OSIcon from '../Icon';

const installers = [
  {
    id: 1,
    title: 'Windows',
    url: 'a link',
    os: OsTypes.Windows,
    text: 'DMG with Java',
  },
  {
    id: 2,
    title: 'macOS Silicon',
    url: 'a link',
    os: OsTypes.MAC_OS,
    text: 'DMG with Java',
  },
  {
    id: 3,
    title: 'Linux Silicon',
    url: 'a link',
    os: 'Linux',
    text: 'DMG with Java',
  },
  {
    id: 4,
    title: 'macOS Intel',
    url: 'a link',
    os: OsTypes.MAC_OS,
    text: 'DMG with Java',
  },
  {
    id: 5,
    title: 'Windows Silicon',
    url: 'a link',
    os: OsTypes.Windows,
    text: 'DMG with Java',
  },
] as const;

export default function RecommendedInstallers(): JSX.Element {
  const { deviceType, os } = useCurrentSystem();
  const recommendedInstallers = installers.filter((i) => i.os === os);
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
  return (
    <>
      <h3
        className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
      >
        Recommended Installers
      </h3>
      <div className="flex flex-col w-full">
        {recommendedInstallers.map((installer) => (
          <div
            className="w-full flex flex-row gap-8 rounded-md mb-3 p-4"
            style={{
              backgroundColor: 'rgb(43, 43, 43)',
              boxShadow: '0px 0px 44px 0px rgba(0, 0, 0, 0.25)',
            }}
            key={installer.id}
          >
            <div>
              <OSIcon
                os={installer.os}
                className="text-green-50"
                style={{ padding: '0px' }}
                size={50}
              />
            </div>
            <div className="flex flex-col grow pt-1">
              <div className="text-white text-2xl leading-none">
                {installer.title}
              </div>
              <div className="text-grey leading-none">{installer.text}</div>
            </div>
            <div>
              <MaybeLink
                href={installer.url}
                aria-label="Home"
                className="group block flex-shrink-0 w-full border border-transparent px-8 py-2 text-lg font-mono rounded-full text-black text-center bg-primary"
              >
                DOWNLOAD THIS INSTALLER ↓
              </MaybeLink>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

import { useMemo } from 'react';
import MaybeLink from '../contentful/MaybeLink';

export type FeatureVersionReleaseNotesListEntry = {
  id: string;
  featureVersion: string;
  featureReleaseDate: string;
  latestReleaseVersion: string;
  latestReleaseDate: string;
};

export default function FeatureVersionReleaseNotesList({
  featureVersions,
}: {
  featureVersions: FeatureVersionReleaseNotesListEntry[];
}): JSX.Element {
  const [first, rest] = useMemo(() => {
    const [f, ...r] = featureVersions;
    return [f, r];
  }, [featureVersions]);
  return (
    <>
      <div className="background-dark-gradient">
        <div className="px-8 py-16 mx-auto max-w-7xl">
          <h3
            className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
          >
            LATEST VERSION
          </h3>
          <table>
            <thead>
              <tr>
                <th>Version</th>
                <th>Release Date</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  DbVisualizer {first.featureVersion}
                  {first.latestReleaseVersion !== first.featureVersion &&
                    ` - ${first.latestReleaseVersion}`}
                </td>
                <td className="text-grey-400">{first.latestReleaseDate}</td>
                <td>
                  <MaybeLink
                    href={`/releasenotes/${first.featureVersion}`}
                    className="underline text-primary"
                  >
                    Release Notes -&gt;
                  </MaybeLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {rest.length > 0 && (
        <div className="background-dark-gradient">
          <div className="px-8 py-16 mx-auto max-w-7xl">
            <h3
              className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
            >
              PREVIOUS VERSIONS
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Release Date</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((item) => (
                  <tr key={item.id}>
                    <td>
                      DbVisualizer {item.featureVersion}
                      {item.latestReleaseVersion !== item.featureVersion &&
                        ` - ${item.latestReleaseVersion}`}
                    </td>
                    <td className="text-grey-400">{item.latestReleaseDate}</td>
                    <td>
                      <MaybeLink
                        href={`/releasenotes/${item.featureVersion}`}
                        className="underline text-primary"
                      >
                        Release Notes -&gt;
                      </MaybeLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

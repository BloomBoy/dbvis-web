import React, { CSSProperties } from 'react';

export type ReleaseNoteDetails = {
  id: string;
  verison: string;
  releaseDate: string;
  sections?: {
    type: string;
    items: {
      id: string;
      components: string[];
      description: string;
      link?: string;
      jira?: string;
    }[];
  }[];
};

const tableHeaderMap: Record<string, string | undefined> = {
  Improvements: 'Improvement',
  'Bugs Fixed': 'Bug Fixed',
};

export default function ReleaseNotesDetails({
  details,
}: {
  details: ReleaseNoteDetails[];
}): JSX.Element {
  return (
    <>
      {details.flatMap((releaseVersion) =>
        releaseVersion.sections ? (
          releaseVersion.sections.map((section, sectionIndex) => (
            <div
              className="background-dark-gradient"
              key={`${releaseVersion.id}-${section.type}`}
            >
              <div className="px-8 py-16 mx-auto max-w-7xl">
                {sectionIndex === 0 && (
                  <h2 className="text-5xl text-white mb-6">
                    v{releaseVersion.verison} was released on{' '}
                    {releaseVersion.releaseDate}
                  </h2>
                )}
                <h3
                  className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
                >
                  {section.type}
                </h3>
                <table>
                  <thead>
                    <tr>
                      <th>{tableHeaderMap[section.type] ?? section.type}</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.components.map((component) => (
                            <React.Fragment key={component}>
                              {component}
                              <br />
                            </React.Fragment>
                          ))}
                        </td>
                        <td className="text-grey-400">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div
            className="background-dark-gradient title-5xl"
            style={{ '--title-main-color': 'white' } as CSSProperties}
            key={`${releaseVersion.id}-no-sections`}
          >
            <div className="px-8 py-16 mx-auto max-w-7xl">
              <h2 className="title-main mb-6">
                v{releaseVersion.verison} was released on{' '}
                {releaseVersion.releaseDate}
              </h2>
              <h3 className="title-sub block quote-decoration uppercase mb-6">
                No release notes available for this version
              </h3>
            </div>
          </div>
        ),
      )}
    </>
  );
}

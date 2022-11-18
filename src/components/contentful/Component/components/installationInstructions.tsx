import { useRouter } from 'next/router';
import { useMemo } from 'react';
import InstallationInstructions from 'src/components/download/InstallationInstructions';
import useCollectedData from 'src/hooks/useCollectedData';
import { SafeEntryFields, SafeValue, safeValue } from 'src/utils/contentful';
import { isKnownnOS } from 'src/utils/deviceSystemConstants';
import { isNonNull } from 'src/utils/filters';
import getContentfulClient from 'src/utils/getContentfulClient.mjs';
import getFetchKey from 'src/utils/getFetchKey';
import { ComponentProps, SavedComponentProps } from '..';

// eslint-disable-next-line @typescript-eslint/ban-types
type InstallationInstructionsData = {};

type CollectedData = SafeEntryFields.Entry<
  SafeValue<{
    title: SafeEntryFields.Symbol;
    operatingSystem: SafeEntryFields.Symbol;
    text: SafeEntryFields.RichText;
  }>
>[];

function installationInstructionsFetchKey(
  { data: {} }: SavedComponentProps<InstallationInstructionsData>,
  preview: boolean,
) {
  return getFetchKey('installationInstructions', { preview });
}

function InstallationInstructionsComponent(
  props: ComponentProps<InstallationInstructionsData>,
) {
  const { isPreview } = useRouter();
  const key = installationInstructionsFetchKey(props, isPreview);
  const installationInstructions = useCollectedData<CollectedData>(key, []);
  const mappedInstructions = useMemo(
    () =>
      installationInstructions
        .map((instruction) => {
          const { title, operatingSystem, text } = instruction.fields;
          if (!isKnownnOS(operatingSystem)) return null;
          return {
            id: instruction.sys.id,
            title,
            os: operatingSystem,
            text,
          };
        })
        .filter(isNonNull),
    [installationInstructions],
  );
  return (
    <div className="py-5">
      <InstallationInstructions data={mappedInstructions} />
    </div>
  );
}

const installationInstructions = Object.assign(
  InstallationInstructionsComponent,
  {
    registerDataCollector(
      props: SavedComponentProps<InstallationInstructionsData>,
      preview: boolean,
    ) {
      return {
        fetchKey: installationInstructionsFetchKey(props, preview),
        async collect(): Promise<CollectedData> {
          const client = await getContentfulClient(preview);
          const { items } = await client.getEntries<{
            title: SafeEntryFields.Symbol;
            weight: SafeEntryFields.Number;
            operatingSystem: SafeEntryFields.Symbol;
            text: SafeEntryFields.RichText;
          }>({
            include: 2,
            content_type: 'installationInstruction',
          });
          return items.map((item) => safeValue(item));
        },
      };
    },
  },
);

export default installationInstructions;

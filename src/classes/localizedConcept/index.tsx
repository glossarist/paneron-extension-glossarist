/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx, css } from '@emotion/react';
import type { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import type { Designation } from '../../models/concepts';
import { defaultLanguage, getHTMLDirForLanguage } from '../../models/lang';
import LocalizedConceptForm from './LocalizedConceptForm';
import LocalizedConceptDetails from './LocalizedConceptDetails';
import type LocalizedConceptData from './LocalizedConceptData';


const PrimaryDesignation: React.FC<{ term: Designation | undefined }> =
React.memo(function ({ term }) {
  if (!term) {
    return <>(no designation)</>;
  }
  let suffix = '';
  if (term.type === 'expression' && term.partOfSpeech) {
    suffix += ` (${term.partOfSpeech})`;
  }
  return <>{term.designation}{suffix}</>;
});


export const localizedConcept: ItemClassConfiguration<LocalizedConceptData> = {
  itemCanBeSuperseded: false,
  meta: {
    title: "Concept description",
    description: "Provides a verbal representation of a concept in a particular language, including definition (with accompanying notes and examples), acceptable designations (terms) and supporting authoritative sources.",
    id: 'localized-concept',
    alternativeNames: [],
  },
  defaults: {
    terms: [
      { designation: "New designation", type: 'expression', normative_status: 'preferred', partOfSpeech: undefined },
    ],
    language_code: defaultLanguage,
    definition: [{ content: "New definition" }],
    notes: [],
    examples: [],
  },
  itemSorter: () => 0,
  views: {
    listItemView: React.memo((props) => {
      return (
        <div
            className={props.className}
            dir={getHTMLDirForLanguage(props.itemData.language_code)}
            css={css`flex: 1;`}>
          <PrimaryDesignation term={props.itemData?.terms?.[0]} />
        </div>
      );
      // const conceptUUID = useUniversalConceptUUID(props.itemRef.itemID ?? '');
      // const { useRegisterItemData } = React.useContext(regkit.BrowserCtx);
      // const itemPath = regkit.itemRefToItemPath({
      //   classID: 'concept',
      //   itemID: conceptUUID ?? '',
      // });
      // const conceptID: string | null | undefined = useRegisterItemData({ itemPaths: [itemPath] }).value[itemPath]?.data?.identifier;
      // return (
      //   <span className={props.className}>
      //     {conceptID
      //       ? <><code>{conceptID}/{props.itemData?.language_code ?? 'N/A'}</code>&ensp;</>
      //       : null}
      //     <PrimaryDesignation term={props.itemData?.terms?.[0]} />
      //   </span>
      // );
    }),
    detailView: (props) => <LocalizedConceptDetails
      css={css`padding: 1rem; position: absolute; inset: 0;`}
      itemID={props.itemRef.itemID}
      localizedConcept={props.itemData}
      className={props.className}
    />,
    editView: (props) => <LocalizedConceptForm
      css={css`padding: 1rem; position: absolute; inset: 0;`}
      localizedConcept={props.itemData}
      className={props.className}
      onChange={props.onChange}
    />,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
} as const;


export default localizedConcept;

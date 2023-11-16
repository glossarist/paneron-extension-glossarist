/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useContext, memo } from 'react';
import { jsx, css } from '@emotion/react';
import type { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import { BrowserCtx } from '@riboseinc/paneron-registry-kit/views/BrowserCtx';
import { itemRefToItemPath } from '@riboseinc/paneron-registry-kit/views/itemPathUtils';
import type { Designation } from '../../models/concepts';
import { useUniversalConceptUUID } from './util';
import { defaultLanguage, getHTMLDirForLanguage } from '../../models/lang';
import LocalizedConceptForm from './LocalizedConceptForm';
import LocalizedConceptDetails from './LocalizedConceptDetails';
import type LocalizedConceptData from './LocalizedConceptData';


const PrimaryDesignation: React.FC<{ term: Designation | undefined }> =
memo(function ({ term }) {
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
    listItemView: memo((props) => {
      const conceptUUID = useUniversalConceptUUID(props.itemRef.itemID ?? '');
      const { useRegisterItemData } = useContext(BrowserCtx);
      const itemPath = itemRefToItemPath({
        classID: 'concept',
        itemID: conceptUUID ?? '',
      });
      const conceptID: string | null | undefined = useRegisterItemData({ itemPaths: [itemPath] }).value[itemPath]?.data?.identifier;
      return (
        <span className={props.className}>
          {conceptID
            ? <><code>{conceptID}/{props.itemData?.language_code ?? 'N/A'}</code>&ensp;</>
            : null}
          <PrimaryDesignation term={props.itemData?.terms?.[0]} />
        </span>
      );
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

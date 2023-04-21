/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx, css } from '@emotion/react';
import type { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import type { Designation } from '../../models/concepts';
import { defaultLanguage, type WritingDirectionality, writingDirectionalityOverrides } from '../../models/lang';
import LocalizedConceptForm from './LocalizedConceptForm';
import LocalizedConceptDetails from './LocalizedConceptDetails';
import LocalizedConceptData from './LocalizedConceptData';


const PrimaryDesignation: React.FC<{ term: Designation | undefined }> =
function ({ term }) {
  if (!term) {
    return <>(no designation)</>;
  }
  let suffix = '';
  if (term.type === 'expression' && term.partOfSpeech) {
    suffix += ` (${term.partOfSpeech})`;
  }
  return <>{term.designation}{suffix}</>;
}


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
    definition: "",
    notes: [],
    examples: [],
  },
  itemSorter: () => 0,
  views: {
    listItemView: (props) => <span className={props.className}>
      <PrimaryDesignation term={props.itemData?.terms?.[0]} />
    </span>,
    detailView: (props) => <LocalizedConceptDetails
      css={css`padding: 1rem; position: absolute; inset: 0;`}
      localizedConcept={props.itemData}
      className={props.className}
      writingDirectionality={
        writingDirectionalityOverrides[props.itemData.language_code ?? defaultLanguage]
        ?? ('LTR' as WritingDirectionality)
      }
    />,
    editView: (props) => <LocalizedConceptForm
      css={css`padding: 1rem; position: absolute; inset: 0;`}
      localizedConcept={props.itemData}
      className={props.className}
      onChange={props.onChange}
      writingDirectionality={
        writingDirectionalityOverrides[props.itemData.language_code ?? defaultLanguage]
        ?? ('LTR' as WritingDirectionality)
      }
    />,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};


export default localizedConcept;

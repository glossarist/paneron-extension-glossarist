/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx } from '@emotion/core';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import { LocalizedConceptForm } from './LocalizedConceptForm';
import { LocalizedConceptData } from './LocalizedConceptData';


export const localizedConcept: ItemClassConfiguration<LocalizedConceptData> = {
  meta: {
    title: "Localized concept",
    description: "Concept verbalised in a language",
    id: 'localized-concept',
    alternativeNames: [],
  },
  defaults: {
    terms: [
      { designation: "New designation", type: 'expression', normativeStatus: 'preferred', partOfSpeech: undefined },
    ],
    definition: "",
    notes: [],
    examples: [],
  },
  itemSorter: () => 0,
  views: {
    listItemView: (props) => {
      return (
        <span className={props.className}>
          {props.itemData.terms[0]?.designation ?? '<no designation>'}
        </span>
      );
    },
    editView: (props) => <>
      <LocalizedConceptForm
        localizedConcept={props.itemData}
        className={props.className}
        lang="eng"
      />
    </>,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};


export default localizedConcept;

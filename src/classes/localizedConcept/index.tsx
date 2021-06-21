/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx, css } from '@emotion/react';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import { SupportedLanguage, WritingDirectionality, writingDirectionalityOverrides } from '../../models/lang';
import LocalizedConceptForm from './LocalizedConceptForm';
import LocalizedConceptDetails from './LocalizedConceptDetails';
import LocalizedConceptData from './LocalizedConceptData';


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
    listItemView: (props) => {
      return (
        <span className={props.className}>
          {props.itemData.terms?.[0]?.designation ?? '<no designation>'}
        </span>
      );
    },
    detailView: (props) => <>
      <LocalizedConceptDetails
        css={css`padding: 1rem; position: absolute; top: 0; left: 0; right: 0; bottom: 0;`}
        localizedConcept={props.itemData}
        className={props.className}
        writingDirectionality={
          (props.subregisterID
            ? writingDirectionalityOverrides[props.subregisterID as SupportedLanguage]
            : undefined
          ) ?? ('LTR' as WritingDirectionality)}
      />
    </>,
    editView: (props) => <>
      <LocalizedConceptForm
        css={css`padding: 1rem; position: absolute; top: 0; left: 0; right: 0; bottom: 0;`}
        localizedConcept={props.itemData}
        className={props.className}
        onChange={props.onChange}
        writingDirectionality={
          (props.subregisterID
            ? writingDirectionalityOverrides[props.subregisterID as SupportedLanguage]
            : undefined
          ) ?? ('LTR' as WritingDirectionality)}
      />
    </>,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};


export default localizedConcept;

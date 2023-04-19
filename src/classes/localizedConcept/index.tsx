/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx, css } from '@emotion/react';
import { SupportedLanguage, WritingDirectionality, writingDirectionalityOverrides } from '../../models/lang';
import type { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
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
          {props.itemData?.terms?.[0]?.designation ?? '<no designation>'}
        </span>
      );
    },
    detailView: (props) => <>
      {props.itemData
        ? <LocalizedConceptDetails
            css={css`padding: 1rem; position: absolute; inset: 0;`}
            localizedConcept={props.itemData}
            className={props.className}
            writingDirectionality={
              (props.itemRef.subregisterID
                ? writingDirectionalityOverrides[props.itemRef.subregisterID as SupportedLanguage]
                : undefined
              ) ?? ('LTR' as WritingDirectionality)}
          />
        : null}
    </>,
    editView: (props) => <>
      <LocalizedConceptForm
        css={css`padding: 1rem; position: absolute; inset: 0;`}
        localizedConcept={props.itemData}
        className={props.className}
        onChange={props.onChange}
        writingDirectionality={
          (props.itemRef.subregisterID
            ? writingDirectionalityOverrides[props.itemRef.subregisterID as SupportedLanguage]
            : undefined
          ) ?? ('LTR' as WritingDirectionality)}
      />
    </>,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};


export default localizedConcept;

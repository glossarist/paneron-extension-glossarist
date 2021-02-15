/** @jsx jsx */
/** @jsxFrag React.Fragment */

//import React from 'react';
import { H3, UL } from '@blueprintjs/core';
import { css, jsx } from '@emotion/core';
//import React from 'react';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import { GenericRelatedItemView, PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import { availableLanguages, SupportedLanguages } from '../models/lang';


export interface ConceptData {
  identifier: string

  // These strings are UUIDs
  designations: {
    [languageCode: string]: string[]
  }
  definitions: {
    [languageCode: string]: string
  }
};

export const concept: ItemClassConfiguration<ConceptData> = {
  itemCanBeSuperseded: false,
  meta: {
    title: "Concept",
    description: "Abstract concept",
    id: 'concept',
    alternativeNames: [],
  },
  defaults: {},
  itemSorter: (p1, p2) => p1.identifier.localeCompare(p2.identifier),
  views: {
    listItemView: (props) => <span className={props.className}>{props.itemData.identifier}</span>,
    detailView: ({ itemData, useRegisterItemData, getRelatedItemClassConfiguration }) => {
      const designationsByLang = Object.entries(itemData.designations);
      const definitionsByLang = Object.entries(itemData.definitions);

      return (
        <div>
          <H3 css={css`margin-top: 1.5em`}>Designations</H3>

          <UL css={css`padding-left: 0; list-style: square;`}>
            {designationsByLang.map(([langID, designations]) =>
              designations.map((uuid, idx) =>
                <li key={`${langID}-${idx}`} css={css`margin-top: 1em;`}>
                  <PropertyDetailView
                      title={`Designation ${idx + 1}`}
                      secondaryTitle={availableLanguages[langID as keyof SupportedLanguages]}>
                    <GenericRelatedItemView
                      itemRef={{ classID: 'designation', subregisterID: langID, itemID: uuid }}
                      useRegisterItemData={useRegisterItemData}
                      getRelatedItemClassConfiguration={getRelatedItemClassConfiguration}
                    />
                  </PropertyDetailView>
                </li>
              )
            )}
          </UL>

          <H3 css={css`margin-top: 1.5em`}>Definition</H3>

          <UL css={css`padding-left: 0; list-style: square;`}>
            {definitionsByLang.map(([langID, uuid]) =>
              <li key={langID} css={css`margin-top: 1em;`}>
                <PropertyDetailView
                    title={`In ${availableLanguages[langID as keyof SupportedLanguages]}`}>
                  <GenericRelatedItemView
                    itemRef={{ classID: 'definition', subregisterID: langID, itemID: uuid }}
                    useRegisterItemData={useRegisterItemData}
                    getRelatedItemClassConfiguration={getRelatedItemClassConfiguration}
                  />
                </PropertyDetailView>
              </li>
            )}
          </UL>
        </div>
      );
    },
    editView: () => <span></span>,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};


export default concept;

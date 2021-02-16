/** @jsx jsx */
/** @jsxFrag React.Fragment */

//import React from 'react';
import { H3, UL } from '@blueprintjs/core';
import { css, jsx } from '@emotion/core';
//import React from 'react';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import { GenericRelatedItemView, PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import { languageTitles, SupportedLanguage } from '../models/lang';


export interface ConceptData {
  identifier: string

  // These point to UUIDs
  localizedConcepts: {
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
      const localizedConcepts = Object.entries(itemData.localizedConcepts ?? {});

      return (
        <div>
          <PropertyDetailView title="Localized concepts">
            <UL css={css`padding-left: 0; list-style: square;`}>
              {localizedConcepts.map(([langID, uuid]) =>
                <li key={langID} css={css`margin-top: 1em;`}>
                  <PropertyDetailView
                      title={`In ${languageTitles[langID as SupportedLanguage]}`}>
                    <GenericRelatedItemView
                      itemRef={{ classID: 'localized-concept', subregisterID: langID, itemID: uuid }}
                      useRegisterItemData={useRegisterItemData}
                      getRelatedItemClassConfiguration={getRelatedItemClassConfiguration}
                    />
                  </PropertyDetailView>
                </li>
              )}
            </UL>
          </PropertyDetailView>
        </div>
      );
    },
    editView: () => <span></span>,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};


export default concept;

/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { UL } from '@blueprintjs/core';
import { css, jsx } from '@emotion/core';
//import React from 'react';
import { ItemClassConfiguration, RegisterItemDataHook } from '@riboseinc/paneron-registry-kit/types';
import { GenericRelatedItemView, PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import { defaultLanguage, languageTitles, SupportedLanguage } from '../models/lang';
import { LocalizedConceptData } from './localizedConcept/LocalizedConceptData';


const _PrimaryDesignation: React.FC<{ lang: string, itemID: string, useRegisterItemData: RegisterItemDataHook }> =
function ({ lang, itemID, useRegisterItemData }) {
  const defaultLanguageEntryPath = `subregisters/${lang}/localized-concept/${itemID}`;
  const itemData = useRegisterItemData({ [defaultLanguageEntryPath]: 'utf-8' as const });
  const defaultLanguageEntry = itemData.value?.[defaultLanguageEntryPath]?.data as LocalizedConceptData | undefined;
  return <>{defaultLanguageEntry?.terms?.[0]?.designation}</>;
}

const PrimaryDesignation = React.memo(
  _PrimaryDesignation,
  (p1, p2) => p1.lang === p2.lang && p1.itemID === p2.itemID);


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
    listItemView: (props) => {
      return (
        <span className={props.className}>
          <code>{props.itemData.identifier}</code>
          &ensp;
          <PrimaryDesignation
            lang={defaultLanguage}
            itemID={props.itemData.localizedConcepts?.[defaultLanguage] ?? ''}
            useRegisterItemData={props.useRegisterItemData}
          />
        </span>
      );
    },
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

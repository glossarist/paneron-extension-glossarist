/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { UL, InputGroup } from '@blueprintjs/core';
import { css, jsx } from '@emotion/core';
//import React from 'react';
import { InternalItemReference, ItemClassConfiguration, RegisterItemDataHook } from '@riboseinc/paneron-registry-kit/types';
import { GenericRelatedItemView, PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import { defaultLanguage, languageTitles, priorityLanguages, nonPriorityLanguages, SupportedLanguage } from '../models/lang';
import { LocalizedConceptData } from './localizedConcept/LocalizedConceptData';
import rdfExport from './concept-export';


const _PrimaryDesignation: React.FC<{ lang: string, itemID: string, useRegisterItemData: RegisterItemDataHook }> =
function ({ lang, itemID, useRegisterItemData }) {
  const defaultLanguageEntryPath = `subregisters/${lang}/localized-concept/${itemID}`;
  const itemData = useRegisterItemData({ itemPaths: [defaultLanguageEntryPath] });
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
    description: "A concept is a unit of meaning. Each concept acts as an umbrella, linking together descriptions of the concept in different languages.",
    id: 'concept',
    alternativeNames: [],
  },
  defaults: {},
  itemSorter: (p1, p2) => p1.identifier.localeCompare(p2.identifier),
  exportFormats: [rdfExport],
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
    detailView: (props) => {
      return (
        <ConceptEditView {...props} />
      );
    },
    editView: (props) => {
      return (
        <ConceptEditView {...props} />
      );
    },
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};


const ConceptEditView: ItemClassConfiguration<ConceptData>["views"]["editView"] = function (props) {
  const { itemData } = props;

  const localizedConcepts = itemData.localizedConcepts ?? {};

  let langs: SupportedLanguage[];
  if (props.onChange) {
    langs = [
      ...priorityLanguages,
      ...nonPriorityLanguages,
    ];
  } else {
    langs = [
      ...priorityLanguages,
      ...nonPriorityLanguages,
    ].filter(langID => localizedConcepts[langID] !== undefined);
  }

  function handleIdentifierChange(newVal: string) {
    if (!props.onChange) { return; }
    props.onChange({ ...props.itemData, identifier: newVal });
  }

  async function handleCreateDescription(classID: string, langID: SupportedLanguage) {
    if (!props.onCreateRelatedItem || !props.onChange) { throw new Error("Cannot create description (read-only)") }
    const itemRef = await props.onCreateRelatedItem(classID, langID);
    props.onChange({ ...props.itemData, localizedConcepts: { ...localizedConcepts, [langID]: itemRef.itemID } });
    return itemRef;
  }

  function handleSetDescription(itemRef: InternalItemReference, langID: SupportedLanguage) {
    if (!props.onChange) { throw new Error("Cannot set description (read-only)") }
    props.onChange({ ...props.itemData, localizedConcepts: { ...localizedConcepts, [langID]: itemRef.itemID } });
    return itemRef;
  }

  function handleClearDescription(langID: SupportedLanguage) {
    if (!props.onChange) { throw new Error("Cannot clear description (read-only)") }
    const localizedConcepts = { ...(props.itemData.localizedConcepts ?? {}) };
    delete localizedConcepts[langID];
    props.onChange({ ...props.itemData, localizedConcepts });
  }

  return (
    <div css={css`padding: 1rem; position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow-y: auto;`}>
      <PropertyDetailView title="Identifier">
        <InputGroup
          fill
          readOnly={!props.onChange}
          value={itemData.identifier ?? ''}
          onChange={props.onChange
            ? ((evt: React.FormEvent<HTMLInputElement>) => handleIdentifierChange(evt.currentTarget.value))
            : undefined}
        />
      </PropertyDetailView>

      <UL css={css`padding-left: 0; list-style: square;`}>
        {langs.map(langID =>
          <li key={langID} css={css`margin-top: 1em;`}>
            <PropertyDetailView
                title={`Description in ${languageTitles[langID as SupportedLanguage]}`}>
              <GenericRelatedItemView
                itemRef={{ classID: 'localized-concept', subregisterID: langID, itemID: localizedConcepts[langID] ?? '' }}
                onClear={props.onChange ? () => handleClearDescription(langID) : undefined}
                onChange={props.onChange && !localizedConcepts[langID]
                  ? (itemRef) => handleSetDescription(itemRef, langID)
                  : undefined}
                onCreateNew={props.onCreateRelatedItem && props.onChange
                  ? (() => handleCreateDescription('localized-concept', langID))
                  : undefined}
                useRegisterItemData={props.useRegisterItemData}
                getRelatedItemClassConfiguration={props.getRelatedItemClassConfiguration}
              />
            </PropertyDetailView>
          </li>
        )}
      </UL>
    </div>
  );
}


export default concept;

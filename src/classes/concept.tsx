/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useContext } from 'react';
import { css, jsx } from '@emotion/react';
import { UL, InputGroup } from '@blueprintjs/core';
import type { InternalItemReference, ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import { GenericRelatedItemView, PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import { defaultLanguage, languageTitles, priorityLanguages, nonPriorityLanguages, type SupportedLanguage } from '../models/lang';
import type { LocalizedConceptData } from './localizedConcept/LocalizedConceptData';
import { BrowserCtx } from '@riboseinc/paneron-registry-kit/views/BrowserCtx';
import rdfExport from './concept-export';


const _PrimaryDesignation: React.FC<{ itemID: string }> =
function ({ itemID }) {
  const { useRegisterItemData } = useContext(BrowserCtx);
  const defaultLanguageEntryPath = `localized-concept/${itemID}.yaml`;
  const itemData = useRegisterItemData({ itemPaths: [defaultLanguageEntryPath] });
  const defaultLanguageEntry = itemData.value?.[defaultLanguageEntryPath]?.data as LocalizedConceptData | undefined;
  return <>{defaultLanguageEntry?.terms?.[0]?.designation}</>;
}

const PrimaryDesignation = React.memo(
  _PrimaryDesignation,
  (p1, p2) => p1.itemID === p2.itemID);


const ConceptEditView:
ItemClassConfiguration<ConceptData>["views"]["editView"] =
function (props) {
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
    if (!props.onCreateRelatedItem || !props.onChange) {
      throw new Error("Cannot create localized concept (read-only)");
    }
    const itemRef = await props.onCreateRelatedItem(classID, langID);
    props.onChange({
      ...props.itemData,
      localizedConcepts: { ...localizedConcepts, [langID]: itemRef.itemID },
    });
    return itemRef;
  }

  function handleSetDescription(itemRef: InternalItemReference, langID: SupportedLanguage) {
    if (!props.onChange) {
      throw new Error("Cannot set localized concept (read-only)");
    }
    props.onChange({
      ...props.itemData,
      localizedConcepts: { ...localizedConcepts, [langID]: itemRef.itemID },
    });
    return itemRef;
  }

  function handleClearDescription(langID: SupportedLanguage) {
    if (!props.onChange) {
      throw new Error("Cannot clear localized concept (read-only)");
    }
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
                itemRef={{ classID: 'localized-concept', itemID: localizedConcepts[langID] ?? '' }}
                onClear={props.onChange ? () => handleClearDescription(langID) : undefined}
                onChange={props.onChange && !localizedConcepts[langID]
                  ? (itemRef) => handleSetDescription(itemRef, langID)
                  : undefined}
                onCreateNew={props.onCreateRelatedItem && props.onChange
                  ? (() => handleCreateDescription('localized-concept', langID))
                  : undefined}
              />
            </PropertyDetailView>
          </li>
        )}
      </UL>
    </div>
  );
}


/** Concept as umbrella, universal, cross-language unit of meaning. */
export interface ConceptData {
  /**
   * Human-readable identifier idiomatic for concept database.
   */
  identifier: string

  /**
   * Each language code points to UUID for respective
   * concept description in a particular human language.
   */
  localizedConcepts: {
    [languageCode: string]: string
  }
};

export const concept: ItemClassConfiguration<ConceptData> = {
  itemCanBeSuperseded: false,
  meta: {
    title: "Concept",
    description: "A concept is a cross-language unit of meaning. Each concept links together detailed definitions of the concept in different languages.",
    id: 'concept',
    alternativeNames: [],
  },
  defaults: {},
  itemSorter: (p1, p2) => p1.identifier.localeCompare(p2.identifier),
  exportFormats: [rdfExport],
  views: {
    listItemView: (props) => <span className={props.className}>
      <code>{props.itemData?.identifier}</code>
      &ensp;
      <PrimaryDesignation
        itemID={props.itemData?.localizedConcepts?.[defaultLanguage] ?? ''}
      />
    </span>,
    detailView: ConceptEditView,
    editView: ConceptEditView,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};


export default concept;

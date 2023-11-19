/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { css, jsx } from '@emotion/react';
import { UL, InputGroup } from '@blueprintjs/core';
import React from 'react';
import type { InternalItemReference, ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import { GenericRelatedItemView, PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
//import type { LocalizedConceptData } from './localizedConcept/LocalizedConceptData';
import { languageTitles, priorityLanguages, nonPriorityLanguages, type SupportedLanguage } from '../models/lang';
import rdfExport from './concept-export';


//const _PrimaryDesignation: React.FC<{ itemID: string }> =
//function ({ itemID }) {
//  const { useRegisterItemData } = React.useContext(registryKit.BrowserCtx);
//  const defaultLanguageEntryPath = `localized-concept/${itemID}.yaml`;
//  const itemData = useRegisterItemData({ itemPaths: [defaultLanguageEntryPath] });
//  const defaultLanguageEntry = itemData.value?.[defaultLanguageEntryPath]?.data as LocalizedConceptData | undefined;
//  return <>{defaultLanguageEntry?.terms?.[0]?.designation}</>;
//};
//
//const PrimaryDesignation = React.memo(
//  _PrimaryDesignation,
//  (p1, p2) => p1.itemID === p2.itemID);


const PLACEHOLDER_LOCALIZED_CCONCEPTS = {} as const;


const ConceptEditView:
ItemClassConfiguration<ConceptData>["views"]["editView"] =
function (props) {
  const { itemData } = props;

  const localizedConcepts = itemData.localizedConcepts ?? PLACEHOLDER_LOCALIZED_CCONCEPTS;

  const langs: SupportedLanguage[] = React.useMemo(() => {
    if (props.onChange) {
      return [
        ...priorityLanguages,
        ...nonPriorityLanguages,
      ];
    } else {
      return [
        ...priorityLanguages,
        ...nonPriorityLanguages,
      ].filter(langID => localizedConcepts[langID] !== undefined);
    }
  }, [props.onChange, localizedConcepts]);

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

  // /**
  //  */
  // parents: ItemReference[]
  // XXX: Immediate parent is listed as domain?
  // XXX: What about further ancestors parents?
  // XXX: What distinguishes listed domain from a regular parent concept?
  // XXX: Maybe two listed domains, immediate parent and topmost parent?
  // XXX: No real existing examples of multiple parents/domains?
  // XXX: No real existing examples of non-immediate ancestor listed as domain?
  // XXX: Multiple parents/domains: follow ancestors of each parent?
  // XXX: Easy on the web (can collapse/expand) but hard in a traditional representation

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
    listItemView: (props) => <code className={props.className}>{props.itemData?.identifier}</code>,
    // listItemView: (props) => <span className={props.className}>
    //   <code>{props.itemData?.identifier}</code>
    //   &ensp;
    //   <PrimaryDesignation
    //     itemID={props.itemData?.localizedConcepts?.[defaultLanguage] ?? ''}
    //   />
    // </span>,
    detailView: ConceptEditView,
    editView: ConceptEditView,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
} as const;


export default concept;

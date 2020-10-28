/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { jsx } from '@emotion/core';
import React from 'react';

import { SupportedLanguages, availableLanguages } from '../../models/lang';
import { MultiLanguageConcept, ConceptRef, Concept, PARENT_RELATIONSHIP } from '../../models/concepts';

//import styles from '../styles.scss';
import { RepresentingDesignation } from './designation';
import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';


interface LazyParentConceptListProps {
  React: RepositoryViewProps["React"]
  useObjectData: RepositoryViewProps["useObjectData"]

  parentConceptIDs: ConceptRef[]
  lang: keyof SupportedLanguages
  className?: string
}
export const LazyParentConceptList: React.FC<LazyParentConceptListProps> =
function ({ React, useObjectData, parentConceptIDs, lang, className }) {
  return (
    <>
      {(parentConceptIDs && parentConceptIDs.length > 0)
        ? <span className={`${styles.parents} ${className}`}
                title="Parent concept (domain, broader concept)">
            {parentConceptIDs.map(id =>
              <LazyConceptItem
                React={React} useObjectData={useObjectData}
                conceptRef={id} lang={lang}
              />
            )}
          </span>
        : null}
    </>
  );
};


interface ConceptItemProps {
  React: RepositoryViewProps["React"]
  concept: MultiLanguageConcept<any>
  lang: keyof typeof availableLanguages
  className?: string
}
export const ConceptItem: React.FC<ConceptItemProps> =
function ({ React, lang, concept, className }) {

  const c = concept[lang as keyof typeof availableLanguages] || concept.eng;

  const isValid = c ? ['retired', 'superseded'].indexOf(c.entry_status) < 0 : undefined;
  const designationValidityClass = isValid === false ? styles.invalidDesignation : '';

  const parents = (concept.relations || []).
    filter(r => r.type === PARENT_RELATIONSHIP).
    map(r => r.to);

  return (
    <span
        className={`
          ${styles.conceptItem} ${className || ''}
          ${designationValidityClass}
        `}>
      {c
        ? <RepresentingDesignation React={React} entry={c} parentConceptIDs={parents} />
        : <i>missing designation</i>}
    </span>
  );
};


interface LocalizedEntryProps {
  React: RepositoryViewProps["React"]
  entry: Concept<any, any>
  className?: string
}
export const LocalizedEntry: React.FC<LocalizedEntryProps> =
function ({ React, entry, className }) {

  return (
    <span
        className={`
          ${styles.conceptItem} ${className || ''}
        `}>
      <RepresentingDesignation React={React} entry={entry} />
    </span>
  );
};


interface LazyConceptItemProps {
  React: RepositoryViewProps["React"]
  useObjectData: RepositoryViewProps["useObjectData"]

  conceptRef: ConceptRef
  lang: keyof typeof availableLanguages
  className?: string
}
export const LazyConceptItem: React.FC<LazyConceptItemProps> =
function ({ React, useObjectData, conceptRef, lang, className }) {
  /* Fetches concept data from backend, defers display to ConceptItem.
     NOTE: Should not be used in large lists, too slow.
     For large lists, fetch all concepts in one request and use LazyConceptList.
  */
  const concept = useConcept<MultiLanguageConcept<any>, ConceptRef>(useObjectData, conceptRef);

  if (concept.object) {
    return <ConceptItem
      React={React}
      concept={concept.object}
      lang={lang}
      className={className}
    />;
  } else {
    return <span className={`${styles.conceptItem} ${className || ''}`}>
      {conceptRef}
    </span>
  }
};

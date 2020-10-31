/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';

import { SupportedLanguages, availableLanguages } from '../../models/lang';
import { MultiLanguageConcept, ConceptRef, Concept, PARENT_RELATIONSHIP } from '../../models/concepts';

//import styles from '../styles.scss';
import { RepresentingDesignation } from './designation';
import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';
import { Colors } from '@blueprintjs/core';
import { useConcept } from '../../hooks';


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
        ? <ParentConceptList className={className}
                title="Parent concept (domain, broader concept)">
            {parentConceptIDs.map(id =>
              <LazyConceptItem
                React={React} useObjectData={useObjectData}
                conceptRef={id} lang={lang}
              />
            )}
          </ParentConceptList>
        : null}
    </>
  );
};


const ParentConceptList = styled.span`
  white-space: nowrap;

  &::before {
    content: "<";
    color: ${Colors.LIGHT_GRAY1};
  }
  &::after {
    content: ">";
    margin-left: -.25em;
    color: ${Colors.LIGHT_GRAY1};
  }

  > :not(:last-child) {
    margin-right: -.25em;

    &::after {
      display: inline;
      margin-left: -.25em;
      content: ", ";
    }
  }

  div {
    display: inline;
  }
`;


interface ConceptItemProps {
  React: RepositoryViewProps["React"]
  useObjectData: RepositoryViewProps["useObjectData"]

  concept: MultiLanguageConcept<any>
  lang: keyof typeof availableLanguages
  className?: string
}
export const ConceptItem: React.FC<ConceptItemProps> =
function ({ React, useObjectData, lang, concept, className }) {

  const c = concept[lang as keyof typeof availableLanguages] || concept.eng;

  const isValid = c ? ['retired', 'superseded'].indexOf(c.entry_status) < 0 : undefined;

  const parents = (concept.relations || []).
    filter(r => r.type === PARENT_RELATIONSHIP).
    map(r => r.to);

  return (
    <span
        css={isValid === false
          ? css`
            text-decoration: line-through;
            opacity: .4;

            :global .bp3-input {
              text-decoration: line-through;
            }
          `
          : undefined}
        className={className}>
      {c
        ? <RepresentingDesignation React={React} useObjectData={useObjectData} entry={c} parentConceptIDs={parents} />
        : <i>missing designation</i>}
    </span>
  );
};


interface LocalizedEntryProps {
  React: RepositoryViewProps["React"]
  useObjectData: RepositoryViewProps["useObjectData"]
  entry: Concept<any, any>
  className?: string
}
export const LocalizedEntry: React.FC<LocalizedEntryProps> =
function ({ React, useObjectData, entry, className }) {

  return (
    <span className={className || ''}>
      <RepresentingDesignation React={React} useObjectData={useObjectData} entry={entry} />
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
  const concept = useConcept(useObjectData, conceptRef).value;

  if (concept !== undefined) {
    return <ConceptItem
      React={React}
      useObjectData={useObjectData}
      concept={concept}
      lang={lang}
      className={className}
    />;

  } else {
    return <span className={className}>
      {conceptRef}
    </span>
  }
};

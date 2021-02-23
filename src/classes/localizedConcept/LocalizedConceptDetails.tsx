/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import MathJax from 'react-mathjax2';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Classes, Colors, H2 } from '@blueprintjs/core';

import { getHTMLDir, WritingDirectionality } from '../../models/lang';
import { Designation } from '../../models/concepts';
import { LocalizedConceptData } from './LocalizedConceptData';
import { FullDesignation } from './designation';
import { openLinkInBrowser } from './util';
import { Label } from '../../widgets';


const styles: Record<string, any> = {};



interface EntryDetailsProps {
  localizedConcept: LocalizedConceptData
  className?: string
  writingDirectionality: WritingDirectionality
}
export const EntryDetails: React.FC<EntryDetailsProps> = function ({
  localizedConcept,
  className,
  writingDirectionality,
}) {
  const entry = localizedConcept;

  const primaryDesignation = entry.terms[0];

  //const parentConceptIDs: string[] = [];

  const dir = getHTMLDir(writingDirectionality);

  let synonyms: Designation[];
  if (entry.terms.length > 1) {
    synonyms = entry.terms.slice(1, entry.terms.length);
  } else {
    synonyms = [];
  }

  function openAuthSource(link: string) {
    return openLinkInBrowser(link);
  }

  const authSources: LocalizedConceptData["authoritativeSource"] = Array.isArray(entry.authoritativeSource)
    ? entry.authoritativeSource
    : Object.keys(entry.authoritativeSource).length > 0
      ? [entry.authoritativeSource]
      : [];

  return (
    <div
        dir={dir}
        className={`${writingDirectionality === 'RTL' ? Classes.RTL : ''} ${className ?? ''}`}>

      {/*entry.domain
        ? <span className={sharedStyles.legacyDomain}>&lt;{entry.domain}&gt;</span>
        : null*/}

      {/*(parentConceptIDs && parentConceptIDs.length > 0)
        ? <LazyParentConceptList
            className={styles.domain}
            parentConceptIDs={parentConceptIDs}
            lang={entry.language_code} />
        : null*/}

      <H2
          className={`${styles.primaryDesignation}`}>
        <FullDesignation d={primaryDesignation} />
      </H2>

      <SynonymsContainer>
        {[...synonyms.entries()].map(([idx, s]) =>
          <FullDesignation
            className={Classes.TEXT_LARGE}
            key={idx}
            d={s}
          />
        )}
      </SynonymsContainer>

      <div className={`${Classes.RUNNING_TEXT}`}>
        <DefinitionContainer>
          {entry.usageInfo ? <UsageInfo>&lt;{entry.usageInfo}&gt;</UsageInfo> : null}
          <MathJax.Text text={entry.definition} />
        </DefinitionContainer>

        {[...entry.examples.entries()].map(([idx, item]) =>
          <ExampleContainer key={`example-${idx}`}>
            <Label dir="ltr" className={styles.label}>EXAMPLE:</Label>
            <MathJax.Text text={item} />
          </ExampleContainer>
        )}

        {[...entry.notes.entries()].map(([idx, item]) =>
            <NoteContainer className={`${styles.note}`} key={`note-${idx}`}>
              <Label dir="ltr">Note {idx + 1} to entry:</Label>
              <MathJax.Text text={item} />
            </NoteContainer>
          )}
      </div>

      <footer>
        <dl dir="ltr" className={styles.label}>
          {authSources.map((source, idx) =>
            <>
              <dt key={`${idx}-label`}>Authoritative source(s):</dt>
              <dd key={`${idx}-desc`}>
                {`${source.link || ''}`.trim() !== ''
                  ? <a onClick={() => openAuthSource(`${source.link}`)}>
                      {source.ref || source.link} {source.clause}
                    </a>
                  : <>{source.ref || 'unknown'} {source.clause}</>}
                {source.relationship
                  ? <>— {source.relationship}</>
                  : null}
              </dd>
            </>
          )}
        </dl>
      </footer>
    </div>
  );
};


export default EntryDetails;


const UsageInfo = styled.span`
    color: ${Colors.GRAY2};
    margin-right: 1em;
`;


const SynonymsContainer = styled.div`
  &:not(:empty) {
    margin-bottom: 1rem;
  }

  &:not(:empty)::before {
    content: "Syn.";
    font-style: italic;
  }

  > * {
    margin-left: .75em;

    &:not(:last-child)::after {
      content: ";";
      font-style: italic;
    }
  }
`;


const DefinitionContainer = styled.div`
  font-size: 120%;
  margin-left: 1em;
  margin-bottom: 2rem;
`;


const NoteContainer = styled.div`
  margin-bottom: 1rem;
`;


const ExampleContainer = styled(NoteContainer)`
  font-style: italic;
`;

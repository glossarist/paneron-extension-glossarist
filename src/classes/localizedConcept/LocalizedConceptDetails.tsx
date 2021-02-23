/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import MathJax from 'react-mathjax2';
import { jsx } from '@emotion/core';
import { Classes, H2 } from '@blueprintjs/core';

import { getHTMLDir, WritingDirectionality } from '../../models/lang';
import { Designation } from '../../models/concepts';
import { LocalizedConceptData } from './LocalizedConceptData';
import { FullDesignation } from './designation';
import { openLinkInBrowser } from './util';


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

      <div className={styles.synonyms}>
        {[...synonyms.entries()].map(([idx, s]) => <FullDesignation key={idx} d={s} />)}
      </div>

      <div className={`${Classes.RUNNING_TEXT}`}>
        <div className={`${styles.definition}`}>
          {entry.usageInfo ? <span className={styles.usageInfo}>&lt;{entry.usageInfo}&gt;</span> : null}
          <MathJax.Text text={entry.definition} />
        </div>

        {[...entry.examples.entries()].map(([idx, item]) =>
          <div className={`${styles.example}`} key={`example-${idx}`}>
            <div dir="ltr" className={styles.label}>EXAMPLE:</div>
            <MathJax.Text text={item} />
          </div>
        )}

        {[...entry.notes.entries()].map(([idx, item]) =>
            <div className={`${styles.note}`} key={`note-${idx}`}>
              <div dir="ltr" className={styles.label}>Note {idx + 1} to entry:</div>
              <MathJax.Text text={item} />
            </div>
          )}
      </div>

      <footer>
        <dl dir="ltr" className={styles.label}>
          {entry.authoritative_source.map((source, idx) =>
            <>
              <dt key={`${idx}-label`}>Authoritative source:</dt>
              <dd key={`${idx}-desc`}>
                {`${source.link || ''}`.trim() !== ''
                  ? <a onClick={() => openAuthSource(`${source.link}`)}>
                      {source.ref || source.link} {source.clause}
                    </a>
                  : <>{source.ref || 'unknown'} {source.clause}</>}
              </dd>
            </>
          )}
        </dl>
      </footer>
    </div>
  );
};


export default EntryDetails;

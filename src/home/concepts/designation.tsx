/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { jsx } from '@emotion/core';
import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';
import React from 'react';
import MathJax from 'react-mathjax2';

import {
  Designation,
  Expression,
  Concept,
  ConceptRef
} from '../../models/concepts';

//import styles from './styles.scss';

import { useHelp } from '../help';

import { LazyParentConceptList } from './item';


export const FullDesignation: React.FC<{ d: Designation }> = function ({ d }) {
  function partOfSpeechLabel(d: Expression): JSX.Element | null {
    if (d.partOfSpeech === 'noun') {
      return <><span>{d.gender}</span> <span>{d.grammaticalNumber}</span> noun</>
    } else if (d.partOfSpeech === 'adjective' && d.isParticiple) {
      return <>adj. participle</>
    } else if (d.partOfSpeech === 'adverb' && d.isParticiple) {
      return <>adv. participle</>
    } else {
      return <>{d.partOfSpeech}</>
    }
  }

  const normativeStatusClass = styles[`normativeStatus-${d.normative_status || 'undefined'}`];

  return <span className={`${styles.designation} ${normativeStatusClass}`}>
    <MathJax.Text text={d.designation} />

    <span className={styles.designationMarkers}>
      {d.type === 'expression' && d.partOfSpeech
        ? <span dir="ltr" className={styles.grammar}>{partOfSpeechLabel(d)}</span>
        : null}
      {d.type === 'expression' && d.isAbbreviation
        ? <span dir="ltr" className={styles.grammar} title="Acronym or abbreviation">abbr.</span>
        : null}
      {d.type === 'expression' && d.geographicalArea
        ? <span dir="ltr" className={styles.usage} title="Geographical area of usage">{d.geographicalArea}</span>
        : null}
      {d.normative_status !== 'admitted' && (d.normative_status?.trim() || '') !== ''
        ? <strong
              dir="ltr"
              className={`${styles.normativeStatus} ${styles.label} ${normativeStatusClass}`}
              title="Normative status">
            {d.normative_status}
          </strong>
        : null}
    </span>
  </span>
};


export function getRepresentingDesignation(entry: Concept<any, any>): string {
  const repDesignation = entry.terms[0].designation;

  return `${repDesignation}${entry.domain ? ' <' + entry.domain + '>' : ''}`;
};


export const RepresentingDesignation: React.FC<{
  React: RepositoryViewProps["React"]
  parentConceptIDs?: ConceptRef[]
  entry: Concept<any, any>
}> =
function ({ React, parentConceptIDs, entry }) {
  const representingTerm: Designation =
    entry.terms.filter(d => d.normative_status === 'preferred')[0] ||
    entry.terms.filter(d => d.normative_status === 'admitted')[0] ||
    entry.terms[0];

  const repDesignation = representingTerm?.designation;
  const ref = useHelp(React, 'widgets/representing-designation');

  return <div ref={ref as (el: HTMLDivElement) => void} className={styles.representingDesignation}>
    <MathJax.Text text={repDesignation} />
    {" "}
    {entry.domain ? ' <' + entry.domain + '>' : ''}
    {(parentConceptIDs && parentConceptIDs.length > 0)
      ? <LazyParentConceptList parentConceptIDs={parentConceptIDs} lang={entry.language_code} />
      : null}
  </div>;
};

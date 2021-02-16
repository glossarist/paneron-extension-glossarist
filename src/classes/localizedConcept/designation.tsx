/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import MathJax from 'react-mathjax2';
import { jsx } from '@emotion/core';
import { Designation, Expression } from '../../models/concepts';
import { LocalizedConceptData } from './LocalizedConceptData';


const styles: Record<string, any> = {};


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

  //const normativeStatusClass = styles[`normativeStatus-${d.normative_status || 'undefined'}`];
  const normativeStatusClass = '';

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
      {d.normativeStatus !== 'admitted' && (d.normativeStatus?.trim() || '') !== ''
        ? <strong
              dir="ltr"
              className={`${styles.normativeStatus} ${styles.label} ${normativeStatusClass}`}
              title="Normative status">
            {d.normativeStatus}
          </strong>
        : null}
    </span>
  </span>
};


export function getRepresentingDesignation(entry: LocalizedConceptData): string {
  const repDesignation = entry.terms[0].designation;
  return repDesignation;
  //return `${repDesignation}${entry.domain ? ' <' + entry.domain + '>' : ''}`;
};


// export const RepresentingDesignation: React.FC<{ parentConceptIDs?: ConceptRef[], entry: Concept<any, any> }> =
// function ({ parentConceptIDs, entry }) {
//   const representingTerm: Designation =
//     entry.terms.filter(d => d.normative_status === 'preferred')[0] ||
//     entry.terms.filter(d => d.normative_status === 'admitted')[0] ||
//     entry.terms[0];
// 
//   const repDesignation = representingTerm?.designation;
//   const ref = useHelp('widgets/representing-designation');
// 
//   return <div ref={ref as (el: HTMLDivElement) => void} className={styles.representingDesignation}>
//     <MathJax.Text text={repDesignation} />
//     {" "}
//     {entry.domain ? ' <' + entry.domain + '>' : ''}
//     {(parentConceptIDs && parentConceptIDs.length > 0)
//       ? <LazyParentConceptList parentConceptIDs={parentConceptIDs} lang={entry.language_code} />
//       : null}
//   </div>;
// };

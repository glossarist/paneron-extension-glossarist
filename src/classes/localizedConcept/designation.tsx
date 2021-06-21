/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import MathJax from 'react-mathjax2';
import { Colors } from '@blueprintjs/core';
import { Designation, Expression } from '../../models/concepts';
import { Label } from '../../widgets';
import { LocalizedConceptData } from './LocalizedConceptData';


export interface FullDesignationProps {
  d: Designation
  className?: string
  markersContainerClassName?: string 
}
export const FullDesignation: React.FC<FullDesignationProps> =
function ({ d, className, markersContainerClassName }) {
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

  const normativeStatusStyling: React.CSSProperties = d.normative_status === 'deprecated'
    ? { color: Colors.GRAY1 }
    : {};

  return <DesignationContainer className={className} style={normativeStatusStyling}>
    <MathJax.Text text={d.designation} />

    <DesignationMarkersContainer className={markersContainerClassName}>
      {d.type === 'expression' && d.partOfSpeech
        ? <GrammarMarker dir="ltr">
            {partOfSpeechLabel(d)}
          </GrammarMarker>
        : null}
      {d.type === 'expression' && d.isAbbreviation
        ? <GrammarMarker dir="ltr" title="Acronym or abbreviation">
            abbr.
          </GrammarMarker>
        : null}
      {d.type === 'expression' && d.geographicalArea
        ? <UsageMarker dir="ltr" title="Geographical area of usage">
            {d.geographicalArea}
          </UsageMarker>
        : null}
      {d.normative_status !== 'admitted' && (d.normative_status?.trim() || '') !== ''
        ? <NormativeStatusMarker
              dir="ltr"
              style={normativeStatusStyling}
              title="Normative status">
            {d.normative_status}
          </NormativeStatusMarker>
        : null}
    </DesignationMarkersContainer>
  </DesignationContainer>
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


const DesignationContainer = styled.span`
  font-weight: normal;
  font-family: Georgia, serif;
  margin-bottom: 1rem;

  > * {
    display: inline;
  }
`;

const DesignationMarkersContainer = styled.span`
  font-family: sans-serif;
  font-size: 16px;
  padding-left: .5em;

  > * {
    &:not(:last-child)::after {
      content: ",";
    }
  }
`;

const GrammarMarker = styled.span`
  color: ${Colors.GRAY2};
`;

const UsageMarker = styled.span`
  color: ${Colors.GRAY2};
  text-transform: uppercase;
`;

const NormativeStatusMarker = styled(Label)`
  color: ${Colors.GRAY2};
  font-weight: bold;
`;

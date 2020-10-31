/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { Colors } from '@blueprintjs/core';
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';
import React from 'react';
import MathJax from 'react-mathjax2';

import {
  Designation,
  Expression,
  Concept,
  ConceptRef
} from '../../models/concepts';

import { useHelp } from '../help';

import { LazyParentConceptList } from './item';


export const FullDesignation: React.FC<{
  d: Designation
  className?: string
  markersContainerClassName?: string
  grammarMarkerClassName?: string
  usageMarkerClassName?: string
  normativeStatusMarkerClassName?: string
}> = function ({
  d,
  className,
  markersContainerClassName,
  grammarMarkerClassName,
  usageMarkerClassName,
  normativeStatusMarkerClassName,
}) {
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

  const normativeStatusCSS = d.normative_status === 'deprecated'
    ? css`color: ${Colors.GRAY3};`
    : undefined;

  return (
    <span className={className} css={normativeStatusCSS}>

      <MathJax.Text text={d.designation} />

      <span className={markersContainerClassName}>
        {d.type === 'expression' && d.partOfSpeech
          ? <span dir="ltr" className={grammarMarkerClassName}>
              {partOfSpeechLabel(d)}
            </span>
          : null}
        {d.type === 'expression' && d.isAbbreviation
          ? <span dir="ltr" className={grammarMarkerClassName} title="Acronym or abbreviation">
              abbr.
            </span>
          : null}
        {d.type === 'expression' && d.geographicalArea
          ? <span dir="ltr" className={usageMarkerClassName} title="Geographical area of usage">
              {d.geographicalArea}
            </span>
          : null}
        {d.normative_status !== 'admitted' && (d.normative_status?.trim() || '') !== ''
          ? <Label
                dir="ltr"
                className={normativeStatusMarkerClassName}
                css={normativeStatusCSS}
                title="Normative status">
              {d.normative_status}
            </Label>
          : null}
      </span>

    </span>
  )
};


export function getRepresentingDesignation(entry: Concept<any, any>): string {
  const repDesignation = entry.terms[0].designation;

  return `${repDesignation}${entry.domain ? ' <' + entry.domain + '>' : ''}`;
};


export const RepresentingDesignation: React.FC<{
  React: RepositoryViewProps["React"]
  useObjectData: RepositoryViewProps["useObjectData"]

  parentConceptIDs?: ConceptRef[]
  entry: Concept<any, any>
}> =
function ({ React, useObjectData, parentConceptIDs, entry }) {
  const representingTerm: Designation =
    entry.terms.filter(d => d.normative_status === 'preferred')[0] ||
    entry.terms.filter(d => d.normative_status === 'admitted')[0] ||
    entry.terms[0];

  const repDesignation = representingTerm?.designation;
  const ref = useHelp(React, 'widgets/representing-designation');

  return (
    <RepresentingDesignationRoot ref={ref as (el: HTMLDivElement) => void}>

      <MathJax.Text text={repDesignation} />
      {" "}
      {entry.domain ? ' <' + entry.domain + '>' : ''}

      {(parentConceptIDs && parentConceptIDs.length > 0)
        ? <LazyParentConceptList
            React={React}
            useObjectData={useObjectData}
            parentConceptIDs={parentConceptIDs}
            lang={entry.language_code}
          />
        : null}

    </RepresentingDesignationRoot>
  );
};


const RepresentingDesignationRoot = styled.div`
  white-space: nowrap;

  div {
    // MathJax :(
    display: inline;
  }
`;


export const Label = styled.strong`
  opacity: .5;
  padding: .25rem;
  border: 1px dashed silver;
  margin: .5rem -.25rem;
  text-align: left;
  border-radius: .25em;
  text-shadow: rgba(0, 0, 0, 0.2) .1em .1em .2em;
`

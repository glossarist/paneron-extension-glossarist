/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx, css } from '@emotion/react';
import styled from '@emotion/styled';
import MathJax from 'react-mathjax2';
import { FormGroup, Classes, Colors, Callout, H2 } from '@blueprintjs/core';

import { GenericRelatedItemView } from '@riboseinc/paneron-registry-kit/views/util';

import { getHTMLDirForLanguage, languageTitles } from '../../models/lang';
import type { Designation } from '../../models/concepts';
import type { LocalizedConceptData } from './LocalizedConceptData';
import { FullDesignation } from './designation';
import { openLinkInBrowser, useUniversalConceptUUID } from './util';
import { Label } from '../../widgets';


const styles: Record<string, any> = {};


interface EntryDetailsProps {
  localizedConcept: LocalizedConceptData
  itemID?: string
  className?: string
}
export const EntryDetails: React.FC<EntryDetailsProps> = function ({
  itemID,
  localizedConcept,
  className,
}) {
  const entry = localizedConcept;

  const universalConceptUUID = useUniversalConceptUUID(itemID ?? '');

  if (!universalConceptUUID) {
    console.error("Unable to obtain universal concept UUID", universalConceptUUID);
  }

  const primaryDesignation = entry.terms[0];

  //const parentConceptIDs: string[] = [];

  const dir = getHTMLDirForLanguage(localizedConcept.language_code);

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
    : Object.keys(entry.authoritativeSource ?? {}).length > 0
      ? [entry.authoritativeSource]
      : [];

  const definitionJSX = React.useMemo(() => {
    if (entry.definition) {
      // Normalize definition for older datasets which still use strings
      return [...Object.entries(Array.isArray(entry.definition) ? entry.definition : [entry.definition])].map(([idx, item]) =>
        <DefinitionContainer key={`definition-${idx}`}>
          <MathJax.Text text={item.content ?? item} />
        </DefinitionContainer>
      )
    } else {
      return <Callout icon='warning-sign' dir="ltr" css={css`text-align: left;`}>
        There is no definition for this concept
        in {languageTitles[entry.language_code] ?? entry.language_code}.
        Readers should refer to definition in register’s operating language, if provided.
      </Callout>
    }
  }, [itemID, JSON.stringify(localizedConcept.definition)]);

  return (
    <div
        dir={dir}
        className={`${dir === 'rtl' ? Classes.RTL : ''} ${className ?? ''}`}>

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
        {entry.usageInfo ? <UsageInfo>&lt;{entry.usageInfo}&gt;</UsageInfo> : null}

        {definitionJSX}

        {[...entry.examples.entries()].map(([idx, item]) =>
          <ExampleContainer key={`example-${idx}`}>
            <Label dir="ltr" className={styles.label}>EXAMPLE:</Label>
            <MathJax.Text text={item.content ?? item} />
          </ExampleContainer>
        )}

        {[...entry.notes.entries()].map(([idx, item]) =>
            <NoteContainer className={`${styles.note}`} key={`note-${idx}`}>
              <Label dir="ltr">Note {idx + 1} to entry:</Label>
              <MathJax.Text text={item.content ?? item} />
            </NoteContainer>
          )}
      </div>

      <footer dir="ltr" css={css`
        text-align: left; /* Needed to negate Blueprint’s RTL class. sigh */
      `}>
        <dl dir="ltr" className={styles.label}>
          <dt>Language:</dt>
          <dd>
            {languageTitles[entry.language_code] ?? <code>{entry.language_code ?? 'N/A'}</code>}
          </dd>

          {authSources.map((source, idx) =>
            <React.Fragment key={idx}>
              <dt key={`${idx}-label`}>
                Authoritative source{idx > 0 ? ` ${idx + 1}` : ''}:
              </dt>
              <dd key={`${idx}-desc`}>
                {`${source.link || ''}`.trim() !== ''
                  ? <a onClick={() => openAuthSource(`${source.link}`)}>
                      {source.ref || source.link} {source.clause}
                    </a>
                  : <>{source.ref || 'unknown'} {source.clause}</>}
                {source.relationship
                  ? <>
                      &nbsp;—&nbsp;{source.relationship.type}
                      {source.relationship.type === 'modified'
                        ? <em>&ensp;{source.relationship.modification ?? 'no modification note'}</em>
                        : null}
                    </>
                  : null}
              </dd>
            </React.Fragment>
          )}
        </dl>

        {universalConceptUUID
          ? <FormGroup label={<span dir="ltr">For other languages, see:</span>}>
              <GenericRelatedItemView itemRef={{ classID: 'concept', itemID: universalConceptUUID }} />
            </FormGroup>
          : null}
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

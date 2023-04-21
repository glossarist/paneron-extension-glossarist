/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx, css } from '@emotion/react';
import {
  Button, ButtonGroup,
  Classes,
  ControlGroup, FormGroup, InputGroup,
  TextArea,
  HTMLSelect,
} from '@blueprintjs/core';

import { PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';

import {
  type AuthoritativeSource,
  type Designation,
  type DesignationType,
  NORMATIVE_STATUS_CHOICES,
} from '../../models/concepts';

import {
  defaultLanguage, getHTMLDir, availableLanguageIDs, languageTitles,
  type WritingDirectionality,
  type SupportedLanguage,
} from '../../models/lang';

import { openLinkInBrowser } from './util';
import { DesignationForm } from './DesignationForm';
import type { LocalizedConceptData } from './LocalizedConceptData';


export const LocalizedConceptForm: React.FC<{
  localizedConcept: LocalizedConceptData;
  writingDirectionality: WritingDirectionality;
  className?: string;
  usageInfoClassName?: string;
  onChange?: (newVal: LocalizedConceptData) => void;
}> = function (props) {

  const dir = getHTMLDir(props.writingDirectionality);

  const { localizedConcept } = props;

  const authSources: LocalizedConceptData["authoritativeSource"] = Array.isArray(localizedConcept.authoritativeSource)
    ? localizedConcept.authoritativeSource
    : Object.keys(localizedConcept.authoritativeSource ?? {}).length > 0
      ? [localizedConcept.authoritativeSource]
      : [];

  function handleItemDeletion(field: 'notes' | 'examples' | 'terms' | 'authoritativeSource' | 'definition') {
    return (idx: number) => {
      if (!props.onChange) { return; }
      const e = props.localizedConcept;
      var items = [...e[field]];
      items.splice(idx, 1);
      props.onChange({ ...e, [field]: items });
    };
  }

  function handleItemAddition<T extends 'notes' | 'examples' | 'terms' | 'authoritativeSource' | 'definition'>(field: T, makeNewItem: () => LocalizedConceptData[T][number]) {
    return () => {
      if (!props.onChange) { return; }
      const e = props.localizedConcept;
      props.onChange({ ...e, [field]: [...(Array.isArray(e[field]) ? e[field] : []), makeNewItem()] });
    };
  }

  const handleDesignationDeletion = handleItemDeletion('terms');
  const handleDefinitionDeletion = handleItemDeletion('definition');
  const handleNoteDeletion = handleItemDeletion('notes');
  const handleExampleDeletion = handleItemDeletion('examples');
  const handleAuthSourceDeletion = handleItemDeletion('authoritativeSource');

  const handleDesignationAddition = handleItemAddition('terms', () => ({
    type: 'expression',
    designation: '',
    partOfSpeech: undefined,
  }));
  const handleDefinitionAddition = handleItemAddition('definition', () => ({ content: '' }));
  const handleNoteAddition = handleItemAddition('notes', () => ({ content: '' }));
  const handleExampleAddition = handleItemAddition('examples', () => ({ content: '' }));
  const handleAuthSourceAddition = handleItemAddition('authoritativeSource', () => ({
    ref: 'Enter reference…',
  }));

  function handleAuthSourceChange(idx: number, val: AuthoritativeSource) {
    if (!props.onChange) { return; }

    const e = props.localizedConcept;
    var items = [...e.authoritativeSource];
    items[idx] = val;
    props.onChange({ ...e, authoritativeSource: items });
  }

  function handleDesignationChange(idx: number, val: Designation) {
    if (!props.onChange) { return; }

    const e = props.localizedConcept;
    const items = [...e.terms];
    items[idx] = val;

    props.onChange({
      ...e, terms: items.sort((i1, i2) => {
        if (NORMATIVE_STATUS_CHOICES.indexOf(i1.normative_status || 'admitted') >
          NORMATIVE_STATUS_CHOICES.indexOf(i2.normative_status || 'admitted')) {
          return 1;
        } else if (NORMATIVE_STATUS_CHOICES.indexOf(i1.normative_status || 'admitted') <
          NORMATIVE_STATUS_CHOICES.indexOf(i2.normative_status || 'admitted')) {
          return -1;
        } else {
          return 0;
        }
      })
    });
  }

  function handleItemChange(field: 'notes' | 'examples' | 'definition') {
    return (idx: number, val: string) => {
      if (!props.onChange) { return; }

      const e = props.localizedConcept;

      var items = [...e[field]];
      items[idx] = { content: val };
      props.onChange({ ...e, [field]: items });
    };
  }
  const handleNoteChange = handleItemChange('notes');
  const handleExampleChange = handleItemChange('examples');
  const handleDefinitionChange = handleItemChange('definition');

  function handleUsageInfoChange(newVal: string) {
    if (!props.onChange) { return; }
    props.onChange({ ...localizedConcept, usageInfo: newVal });
  }

  function handleLanguageChange(newVal: SupportedLanguage) {
    if (!props.onChange) { return; }
    props.onChange({ ...localizedConcept, language_code: newVal });
  }

  function designationTypeLabel(idx: number, dt: DesignationType): string {
    if (idx === 0) {
      return "Designation";
    } else if (dt === "symbol") {
      return "Symbol";
    } else {
      return "Synonym";
    }
  }

  return (
    <div className={props.className}>
      {props.onChange
        ? <ButtonGroup css={css`margin-bottom: 1rem;`}>
            <Button icon="add" disabled={!props.onChange} onClick={handleDefinitionAddition} title="Add another definition">Definition</Button>
            <Button icon="add" disabled={!props.onChange} onClick={handleDesignationAddition} title="Add another designation/synonym">Designation</Button>
            <Button icon="add" disabled={!props.onChange} onClick={handleExampleAddition} title="Add an EXAMPLE">EX.</Button>
            <Button icon="add" disabled={!props.onChange} onClick={handleNoteAddition} title="Add a NOTE">NOTE</Button>
            <Button icon="add" disabled={!props.onChange} onClick={handleAuthSourceAddition} title="Add a source">Auth. source</Button>
          </ButtonGroup>
        : null}

      <PropertyDetailView title="Language">
        <HTMLSelect
          value={props.localizedConcept.language_code ?? defaultLanguage}
          options={availableLanguageIDs.map(langID => ({
            value: langID,
            label: languageTitles[langID] ?? langID,
          }))}
          onChange={(evt: React.FormEvent<HTMLSelectElement>) => 
            availableLanguageIDs.indexOf(evt.currentTarget.value as SupportedLanguage) >= 0
              ? handleLanguageChange(evt.currentTarget.value as SupportedLanguage)
              : void 0}
        />
      </PropertyDetailView>

      {props.localizedConcept.terms.map((d, idx) =>
        <PropertyDetailView
            key={`designation-${idx}`}
            title={designationTypeLabel(idx, d.type)}
            secondaryTitle={<>
              {props.onChange
                ? <Button small
                    title="Delete this designation"
                    icon="cross"
                    disabled={idx === 0}
                    onClick={() => handleDesignationDeletion(idx)} />
                : undefined}
            </>}>
          <DesignationForm
            designation={d}
            onChange={props.onChange
              ? ((newD) => handleDesignationChange(idx, newD))
              : undefined}
            writingDirectionality={props.writingDirectionality} />
        </PropertyDetailView>
      )}

      <div className={props.usageInfoClassName}>
        <PropertyDetailView
            title="Usage notes">
          <InputGroup fill
            value={localizedConcept.usageInfo ?? ''}
            id="usageInfo"
            readOnly={!props.onChange}
            onChange={(evt: React.FormEvent<HTMLInputElement>) => props.onChange
              ? handleUsageInfoChange((evt.target as HTMLInputElement).value)
              : void 0} />
        </PropertyDetailView>
      </div>

      {props.localizedConcept.definition.map((item, idx) =>
        <PropertyDetailView
            key={`definition-${idx}`}
            title={`DEFINITION ${idx + 1}`}
            secondaryTitle={props.onChange
              ? <Button small
                title="Delete this definition"
                icon="cross"
                onClick={() => handleDefinitionDeletion(idx)} />
              : undefined}>
          <TextArea fill
            dir={dir}
            className={dir === 'rtl' ? Classes.RTL : undefined}
            value={item.content || ''}
            id={`definition-${idx}`}
            readOnly={!props.onChange}
            intent={!props.localizedConcept.definition ? 'danger' : undefined}
            onChange={(evt: React.FormEvent<HTMLTextAreaElement>) => handleDefinitionChange(idx, (evt.target as HTMLTextAreaElement).value)} />
          {props.onChange
            ? <div css={css`font-size: 90%; margin-top: 1em; line-height: 1`}>
                <p>
                  Use a single phrase specifying the concept and, if possible, reflecting the position of the concept in the concept system.
                  </p>
                <p>
                  Refer to
                    {" "}
                  <a onClick={() => openLinkInBrowser("https://www.iso.org/standard/40362.html")}>ISO 10241-1:2011, 6.4</a>
                  {" "}
                    and
                    {" "}
                  <a onClick={() => openLinkInBrowser("https://www.iso.org/standard/38109.html")}>ISO 704:2009, 6.3</a> for more details about what constitutes a good definition.
                  </p>
              </div>
            : undefined}
        </PropertyDetailView>
      )}

      {props.localizedConcept.examples.map((item, idx) =>
        <PropertyDetailView
            key={`example-${idx}`}
            title={`EXAMPLE ${idx + 1}`}
            secondaryTitle={props.onChange
              ? <Button small
                title="Delete this example"
                icon="cross"
                onClick={() => handleExampleDeletion(idx)} />
              : undefined}>
          <TextArea fill
            dir={dir}
            className={dir === 'rtl' ? Classes.RTL : undefined}
            value={item.content ?? ''}
            id={`example-${idx}`}
            readOnly={!props.onChange}
            onChange={(evt: React.FormEvent<HTMLTextAreaElement>) => {
              evt.persist();
              handleExampleChange(idx, (evt.target as HTMLTextAreaElement).value);
            }} />
        </PropertyDetailView>
      )}

      {props.localizedConcept.notes.map((item, idx) =>
        <PropertyDetailView
            key={`note-${idx}`}
            title={`NOTE ${idx + 1}`}
            secondaryTitle={props.onChange
              ? <Button small
                title="Delete this note"
                icon="cross"
                onClick={() => handleNoteDeletion(idx)} />
              : undefined}>
          <TextArea fill
            dir={dir}
            className={dir === 'rtl' ? Classes.RTL : undefined}
            value={item.content ?? ''}
            id={`note-${idx}`}
            readOnly={!props.onChange}
            onChange={(evt: React.FormEvent<HTMLTextAreaElement>) => {
              evt.persist();
              handleNoteChange(idx, (evt.target as HTMLTextAreaElement).value);
            }} />
        </PropertyDetailView>
      )}

      {authSources.map((src, idx) =>
        <PropertyDetailView
            key={`authSource-${idx}`}
            title={`Authoritative source ${idx + 1}`}
            secondaryTitle={props.onChange
              ? <Button small
                title="Delete this source"
                icon="cross"
                onClick={() => handleAuthSourceDeletion(idx)} />
              : undefined}>
          <AuthSource src={src} onChange={(newVal) => handleAuthSourceChange(idx, newVal)} />
        </PropertyDetailView>
      )}
    </div>
  );
};


const AuthSource: React.FC<{ src: AuthoritativeSource, onChange: (newVal: AuthoritativeSource) => void }> = function ({ src, onChange }) {
  return (
    <>
      <FormGroup label="Ref.:">
        <InputGroup value={src.ref ?? ''} onChange={(evt: React.FormEvent<HTMLInputElement>) => onChange({ ...src, ref: evt.currentTarget.value })} />
      </FormGroup>
      <FormGroup label="Clause:">
        <InputGroup value={src.clause ?? ''} onChange={(evt: React.FormEvent<HTMLInputElement>) => onChange({ ...src, clause: evt.currentTarget.value })} />
      </FormGroup>
      <FormGroup label="Original:">
        <InputGroup value={src.original ?? ''} onChange={(evt: React.FormEvent<HTMLInputElement>) => onChange({ ...src, original: evt.currentTarget.value })} />
      </FormGroup>
      <FormGroup label="Link:">
        <InputGroup value={src.link ?? ''} onChange={(evt: React.FormEvent<HTMLInputElement>) => onChange({ ...src, link: evt.currentTarget.value })} />
      </FormGroup>
      <FormGroup label="Relationship:">
        <ControlGroup>
          <Button
              active={src.relationship?.type === 'identical'}
              onClick={() => onChange({ ...src, relationship: { type: 'identical', modificiation: '' }})}>
            Identical
          </Button>
          <Button
              active={src.relationship?.type === 'modified'}
              onClick={() => onChange({ ...src, relationship: { type: 'modified' }})}>
            Modified
          </Button>
          <InputGroup
            value={src.relationship?.modificiation ?? ''}
            placeholder="Modification note…"
            disabled={src.relationship?.type !== 'modified'}
            onChange={(evt: React.FormEvent<HTMLInputElement>) => onChange({
              ...src,
              relationship: { type: 'modified', modificiation: evt.currentTarget.value },
            })}
          />
        </ControlGroup>
      </FormGroup>
    </>
  );
};


export default LocalizedConceptForm;

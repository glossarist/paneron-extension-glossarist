/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx, css } from '@emotion/core';
import { Button, ButtonGroup, Classes, ControlGroup, HTMLSelect, InputGroup } from '@blueprintjs/core';
import {
  Designation, DesignationType, DESIGNATION_TYPES,
  Expression,
  NormativeStatus, NORMATIVE_STATUS_CHOICES,
  Noun
} from '../../models/concepts';
import { getHTMLDir, WritingDirectionality } from '../../models/lang';


export const DesignationForm: React.FC<{
  designation: Designation;
  writingDirectionality: WritingDirectionality;
  designationClassName?: string;
  designationPropsClassName?: string;
  usageAreaClassName?: string;
  onChange?: (newVal: Designation) => void;
}> = function (props) {
  const { designation: d } = props;

  const dir = getHTMLDir(props.writingDirectionality);

  function handleExpressionAreaEdit(val: string) {
    if (!props.onChange) { return; }
    if (d.type === 'expression') {
      props.onChange({ ...d, geographicalArea: val.trim() || undefined });
    }
  }

  function handleDesignationEdit(expr: string) {
    if (!props.onChange) { return; }
    props.onChange({ ...d, designation: expr });
  }

  function handleDesignationTypeEdit(t: DesignationType) {
    if (!props.onChange) { return; }
    props.onChange({ ...d, type: t } as Designation);
  }

  function handleDesignationNormativeStatusEdit(ns: NormativeStatus) {
    if (!props.onChange) { return; }
    props.onChange({ ...d, normative_status: ns } as Designation);
  }

  function handleExpressionPartOfSpeechEdit(pos: Expression["partOfSpeech"]) {
    if (!props.onChange) { return; }
    if (pos === 'noun') {
      props.onChange({ ...d, partOfSpeech: pos });
    } else {
      // Reset properties only applicable to nouns
      props.onChange({ ...d, partOfSpeech: pos, gender: undefined, grammaticalNumber: undefined } as Designation);
    }
  }

  function handleExpAbbrToggle() {
    if (!props.onChange) { return; }
    if (d.type === 'expression') {
      props.onChange({ ...d, isAbbreviation: (!d.isAbbreviation) || undefined });
    }
  }

  function handleNounGenderEdit(gnd: Noun["gender"] | '') {
    if (!props.onChange) { return; }
    props.onChange({ ...d, partOfSpeech: 'noun', gender: gnd || undefined });
  }

  function handleNounNumberEdit(nmb: Noun["grammaticalNumber"] | '') {
    if (!props.onChange) { return; }
    props.onChange({ ...d, partOfSpeech: 'noun', grammaticalNumber: nmb || undefined });
  }

  function handleExpParticipleToggle() {
    if (!props.onChange) { return; }
    if (d.type === 'expression' && (d.partOfSpeech === 'adjective' || d.partOfSpeech === 'adverb')) {
      props.onChange({ ...d, isParticiple: (!d.isParticiple) || undefined });
    }
  }

  return (
    <>
      <ButtonGroup css={css`margin-bottom: .25rem;`}>
        <Button disabled>Normative status</Button>
        {props.onChange
          ? [...NORMATIVE_STATUS_CHOICES.entries()].map(([nsIdx, ns]) =>
              <Button small minimal
                  key={nsIdx}
                  active={ns === d.normative_status}
                  onClick={() => handleDesignationNormativeStatusEdit(ns)}>
                {ns}
              </Button>
            )
          : <>
              <Button disabled>{d.normative_status ?? 'N/A'}</Button>
            </>}
      </ButtonGroup>

      <InputGroup fill
        css={css`margin-bottom: .25rem;`}
        className={`${props.designationClassName ?? ''} ${dir === 'rtl' ? Classes.RTL : ''}`}
        dir={dir}
        value={d.designation}
        readOnly={!props.onChange}
        onChange={(evt: React.FormEvent<HTMLInputElement>) => {
          evt.persist();
          handleDesignationEdit((evt.target as HTMLInputElement).value);
        }} />

      <div className={props.designationPropsClassName}>
        <ControlGroup>
          {props.onChange
            ? <HTMLSelect
                onChange={(evt: React.FormEvent<HTMLSelectElement>) => {
                  handleDesignationTypeEdit(evt.currentTarget.value as DesignationType);
                }}
                value={d.type}
                options={DESIGNATION_TYPES.map(dt => ({ value: dt }))} />
            : <Button disabled>{d.type}</Button>}

          {d.type === 'expression'
            ? <>
                <InputGroup
                  className={props.usageAreaClassName}
                  placeholder="Area…"
                  readOnly={!props.onChange}
                  onChange={(evt: React.FormEvent<HTMLInputElement>) => handleExpressionAreaEdit(evt.currentTarget.value)}
                  maxLength={5} />

                <HTMLSelect
                    value={d.partOfSpeech}
                    disabled={!props.onChange}
                    onChange={(evt: React.FormEvent<HTMLSelectElement>) => handleExpressionPartOfSpeechEdit(evt.currentTarget.value as Expression["partOfSpeech"])}>
                  <option value={undefined}>PoS</option>
                  <option value="noun" title="Noun">n.</option>
                  <option value="adjective" title="Adjective">adj.</option>
                  <option value="verb" title="Verb">v.</option>
                  <option value="adverb" title="Adverb">adv.</option>
                </HTMLSelect>

                {d.partOfSpeech === 'adjective' || d.partOfSpeech === 'adverb'
                  ? <Button small
                        title="This is a participle form"
                        disabled={!props.onChange}
                        onClick={() => handleExpParticipleToggle()}
                        active={d.isParticiple}>
                      prp.
                    </Button>
                  : null}

                <Button small
                    title="This is an abbreviated form"
                    disabled={!props.onChange}
                    onClick={() => handleExpAbbrToggle()}
                    active={d.isAbbreviation}>
                  abbr.
                </Button>

                {d.partOfSpeech === 'noun'
                  ? <>
                      <HTMLSelect key="gender"
                          title="Grammatical gender"
                          value={d.gender}
                          disabled={!props.onChange}
                          onChange={(evt: React.FormEvent<HTMLSelectElement>) => handleNounGenderEdit(evt.currentTarget.value as Noun["gender"] || '')}>
                        <option value="">gender</option>
                        <option value="masculine" title="Masculine">m.</option>
                        <option value="feminine" title="Feminine">f.</option>
                        <option value="common" title="Common gender">comm.</option>
                        <option value="neuter" title="Neuter/neutral gender">nt.</option>
                      </HTMLSelect>
                      <HTMLSelect key="number"
                          title="Grammatical number"
                          value={d.grammaticalNumber}
                          disabled={!props.onChange}
                          onChange={(evt: React.FormEvent<HTMLSelectElement>) => handleNounNumberEdit(evt.currentTarget.value as Noun["grammaticalNumber"] || '')}>
                        <option value="">number</option>
                        <option value="singular">sing.</option>
                        <option value="plural">pl.</option>
                        <option value="mass">mass</option>
                      </HTMLSelect>
                    </>
                  : null}
              </>
            : null}
        </ControlGroup>
      </div>
    </>
  );
};

import React from 'react';
import { Button, ButtonGroup, Classes, InputGroup, TextArea } from '@blueprintjs/core';
import { Designation, DesignationType, NORMATIVE_STATUS_CHOICES } from '../../models/concepts';
import { getHTMLDir, WritingDirectionality } from '../../models/lang';
import { openLinkInBrowser } from './util';
import { DesignationForm } from './DesignationForm';
import { LocalizedConceptData } from './LocalizedConceptData';
import { PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';


export const LocalizedConceptForm: React.FC<{
  localizedConcept: LocalizedConceptData;
  writingDirectionality: WritingDirectionality;
  className?: string;
  usageInfoClassName?: string;
  onChange?: (newVal: LocalizedConceptData) => void;
}> = function (props) {

  const dir = getHTMLDir(props.writingDirectionality);

  const { localizedConcept } = props;

  function handleItemDeletion(field: 'notes' | 'examples' | 'terms') {
    return (idx: number) => {
      if (!props.onChange) { return; }
      const e = props.localizedConcept;
      var items = [...e[field]];
      items.splice(idx, 1);
      props.onChange({ ...e, [field]: items });
    };
  }

  function handleItemAddition<T extends 'notes' | 'examples' | 'terms'>(field: T, makeNewItem: () => LocalizedConceptData[T][number]) {
    return () => {
      if (!props.onChange) { return; }
      const e = props.localizedConcept;
      props.onChange({ ...e, [field]: [...e[field], makeNewItem()] });
    };
  }

  const handleDesignationDeletion = handleItemDeletion('terms');
  const handleNoteDeletion = handleItemDeletion('notes');
  const handleExampleDeletion = handleItemDeletion('examples');

  const handleDesignationAddition = handleItemAddition('terms', () => ({
    type: 'expression',
    designation: '',
    partOfSpeech: undefined,
  }));
  const handleNoteAddition = handleItemAddition('notes', () => '');
  const handleExampleAddition = handleItemAddition('examples', () => '');

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

  function handleItemChange(field: 'notes' | 'examples') {
    return (idx: number, val: string) => {
      if (!props.onChange) { return; }

      const e = props.localizedConcept;

      var items = [...e[field]];
      items[idx] = val;
      props.onChange({ ...e, [field]: items });
    };
  }
  const handleNoteChange = handleItemChange('notes');
  const handleExampleChange = handleItemChange('examples');

  function handleUsageInfoChange(newVal: string) {
    if (!props.onChange) { return; }
    props.onChange({ ...localizedConcept, usageInfo: newVal });
  }

  function handleDefinitionChange(newVal: string) {
    if (!props.onChange) { return; }
    props.onChange({ ...localizedConcept, definition: newVal });
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
        ? <ButtonGroup>
            <Button icon="add" disabled={!props.onChange} onClick={handleDesignationAddition} title="Add another designation/synonym">Designation</Button>
            <Button icon="add" disabled={!props.onChange} onClick={handleExampleAddition} title="Add an EXAMPLE">EX.</Button>
            <Button icon="add" disabled={!props.onChange} onClick={handleNoteAddition} title="Add a NOTE">NOTE</Button>
          </ButtonGroup>
        : null}

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

      <PropertyDetailView
          title="Definition">
        <TextArea fill
          dir={dir}
          className={dir === 'rtl' ? Classes.RTL : undefined}
          value={props.localizedConcept.definition || ''}
          id="definition"
          readOnly={!props.onChange}
          intent={!props.localizedConcept.definition ? 'danger' : undefined}
          onChange={(evt: React.FormEvent<HTMLTextAreaElement>) => handleDefinitionChange((evt.target as HTMLTextAreaElement).value)} />
        {props.onChange
          ? <>
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
            </>
          : undefined}
      </PropertyDetailView>

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
            value={item}
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
            value={item}
            id={`note-${idx}`}
            readOnly={!props.onChange}
            onChange={(evt: React.FormEvent<HTMLTextAreaElement>) => {
              evt.persist();
              handleNoteChange(idx, (evt.target as HTMLTextAreaElement).value);
            }} />
        </PropertyDetailView>
      )}
    </div>
  );
};


export default LocalizedConceptForm;

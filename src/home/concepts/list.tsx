/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { jsx } from '@emotion/core';
import type React from 'react';

import { debounce } from 'throttle-debounce';
import { remote } from 'electron';

import { IButtonProps, Button, Checkbox } from '@blueprintjs/core';

import { FixedSizeList as List } from 'react-window';

import { callIPC, useIPCValue } from '@riboseinc/coulomb/ipc/renderer';

import { availableLanguages } from '../../models/lang';
import { MultiLanguageConcept, ConceptRef } from '../../models/concepts';

import { useHelp } from '../help';

import { ConceptContext, SourceContext } from '../contexts';
import { ConceptItem } from './item';
import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';

//import styles from './styles.scss';


interface ConceptListProps {
  React: RepositoryViewProps["React"]
  useObjectData: RepositoryViewProps["useObjectData"]

  concepts: MultiLanguageConcept<any>[]
  itemMarker?: (c: MultiLanguageConcept<any>) => JSX.Element
  itemMarkerRight?: (c: MultiLanguageConcept<any>) => JSX.Element

  buttonProps?: IButtonProps
  paddings?: number
  itemHeight?: number

  lang: keyof typeof availableLanguages
  className?: string
}
export const ConceptList: React.FC<ConceptListProps> =
function ({
    React,
    useObjectData,

    lang,
    concepts,
    className,
    itemMarker,
    itemMarkerRight,
    buttonProps,
    paddings,
    itemHeight
  }) {

  const CONTAINER_PADDINGS = paddings || 0;
  const ITEM_HEIGHT = itemHeight || 30;
  const isRTL = lang === 'ara';

  const listContainer = React.useRef<HTMLDivElement>(null);
  const helpRef = useHelp(React, 'widgets/registry-item-list');

  const [listHeight, setListHeight] = React.useState<number>(CONTAINER_PADDINGS);

  const conceptCtx = React.useContext(ConceptContext);
  const listEl = React.useRef<List>(null);

  const sourceCtx = React.useContext(SourceContext);
  const committerEmail = useIPCValue<{}, { email: string }>
  ('db-default-get-current-committer-info', { email: '' }).value.email;

  React.useEffect(() => {
    const updateListHeight = debounce(100, () => {
      setListHeight(listContainer.current?.parentElement?.offsetHeight || CONTAINER_PADDINGS);

      setImmediate(() => {
        if (conceptCtx.ref) {
          scrollTo(conceptCtx.ref)
        }
      });
    });

    window.addEventListener('resize', updateListHeight);

    helpRef(listContainer.current as HTMLElement);

    updateListHeight();

    return function cleanup() {
      window.removeEventListener('resize', updateListHeight);
    }
  }, [listContainer.current]);

  React.useEffect(() => {
    if (conceptCtx.ref) {
      scrollTo(conceptCtx.ref);
    }
  }, [conceptCtx.ref]);

  function scrollTo(ref: ConceptRef) {
    if (listEl && listEl.current) {
      listEl.current.scrollToItem(
        concepts.findIndex(c => c.termid === ref),
        'smart');
    }
  }

  function handleHighlightClick(termid: number) {
      if (conceptCtx.highlightedRefs.indexOf(termid) < 0) {
        conceptCtx.highlightRef(termid);
      } else {
        conceptCtx.unhighlightRef(termid);
      }
  }

  async function addToCollection(collectionID: string, refs: ConceptRef[]) {
    await callIPC<{ objID: string, ids: ConceptRef[], commit: boolean }, { success: true }>
    ('model-collections-add-items', { objID: collectionID, ids: refs, commit: true });
  }

  async function removeFromCollection(collectionID: string, refs: ConceptRef[]) {
    await callIPC<{ objID: string, ids: ConceptRef[], commit: boolean }, { success: true }>
    ('model-collections-remove-items', { objID: collectionID, ids: refs, commit: true });
  }

  function invokeRowContextMenu(ref: ConceptRef) {
    const cm = new remote.Menu();

    // Dedupe
    const refsActedUpon =  [ ...(new Set([ ...conceptCtx.highlightedRefs, ref ])) ];

    for (const collection of sourceCtx.collections) {
      cm.append(new remote.MenuItem({
        label: collection.label,
        enabled:
          collection.creatorEmail === committerEmail &&
          (sourceCtx.active.type !== 'collection' || collection.id !== sourceCtx.active.collectionID),
        click: async () => await addToCollection(collection.id, refsActedUpon),
      }));
    }

    const m = new remote.Menu();
    m.append(new remote.MenuItem({
      label: refsActedUpon.length > 1
        ? `Add ${refsActedUpon.length} concepts to collection`
        : "Add to collection",
      enabled: refsActedUpon.length > 0,
      submenu: cm,
    }));
    m.append(new remote.MenuItem({
      label: refsActedUpon.length > 1
        ? `Remove ${refsActedUpon.length} concepts from current collection`
        : "Remove from current collection",
      enabled:
        refsActedUpon.length > 0 &&
        committerEmail !== '' &&
        sourceCtx.collections.find(c =>
          sourceCtx.active.type === 'collection' &&
          c.id === sourceCtx.active.collectionID)?.creatorEmail === committerEmail,
      click: async () => {
        if (sourceCtx.active.type === 'collection') {
          await removeFromCollection(sourceCtx.active.collectionID, refsActedUpon);
        }
      }
    }));
    m.popup({ window: remote.getCurrentWindow() });
  }

  const Row = ({ index, style }: { index: number, style: object }) => {
    const c = concepts[index];
    const isHighlighted = conceptCtx.highlightedRefs.indexOf(c.termid) >= 0;

    return (
      <Button
          fill minimal
          style={style}
          alignText="left"
          onContextMenu={() => invokeRowContextMenu(c.termid)}
          className={`
            ${styles.lazyConceptListItem}
            ${conceptCtx.ref === c.termid
              ? styles.lazyConceptListItemSelected
              : ''}
          `}
          {...buttonProps}
          onClick={(evt: React.MouseEvent) => {
            if ((evt.target as Element).nodeName === 'INPUT') {
              evt.stopPropagation();
            } else {
              setImmediate(() => conceptCtx.select(c.termid))
            }
          }}>

        <Checkbox
          checked={isHighlighted}
          style={{ margin: '0' }}
          onChangeCapture={(evt) => {
            evt.stopPropagation();
            handleHighlightClick(c.termid);
            return false;
          }} />

        {itemMarker
          ? <span className={styles.itemMarker}>{itemMarker(c)}</span>
          : null}

        <ConceptItem
          React={React}
          lang={lang as keyof typeof availableLanguages}
          concept={c} />

        {itemMarkerRight
          ? <span className={styles.itemMarkerRight}>{itemMarkerRight(c)}</span>
          : null}

      </Button>
    );
  };

  return (
    <div ref={listContainer} className={className}>
      <List
          ref={listEl}
          className={styles.lazyConceptList}
          direction={isRTL ? "rtl" : undefined}
          itemCount={concepts.length}
          width="100%"
          height={listHeight - CONTAINER_PADDINGS}
          itemSize={ITEM_HEIGHT}>
        {Row}
      </List>
    </div>
  );
};


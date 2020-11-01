/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { jsx } from '@emotion/core';
import styled from '@emotion/styled';

import React from 'react';
import yaml from 'js-yaml';

import path from 'path';
import update from 'immutability-helper';

import Mousetrap from 'mousetrap';
import MathJax from 'react-mathjax2';

import { Classes, Colors } from '@blueprintjs/core';

import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';
import { I18nConfigContext, I18nConfigContextSpec } from '@riboseinc/paneron-extension-kit/i18n/context';

//import { app } from 'renderer';

import { ObjectSource } from '../models/query';
import { availableLanguages, SupportedLanguages } from '../models/lang';
import { ConceptRef } from '../models/concepts';
import { ConceptQuery } from '../models/query';
import { GlossaryRegisterRoles, ROLES_FILENAME } from '../models/meta';

import { /*useCollections, */useIDs, useConcepts } from '../hooks';

import {
  ConceptContext, SourceContext,
  ObjectQueryContext, ChangeRequestContext, HelpContext, UserRoleContext,
} from './contexts';
import { ModuleConfig } from './module-config';
import { Sidebar } from './module-sidebar';
import { openHelpPage } from './help';

import * as styling from './styling';

//import styles from './styles.scss';



const MATHJAX_JS_PATH = `MathJax.js?config=AM_HTMLorMML`;


type ModuleProps = ( Omit<Omit<ModuleConfig, 'title'>, 'hotkey'> & Pick<RepositoryViewProps,
  'React'
| 'getRuntimeNodeModulePath'
| 'useObjectData'
| 'useObjectPaths'
| 'useRemoteUsername'>);
export const Module: React.FC<ModuleProps> = function ({
  React, getRuntimeNodeModulePath, useObjectPaths, useObjectData, useRemoteUsername,
  leftSidebar, rightSidebar, MainView, mainToolbar,
}) {

  if (!getRuntimeNodeModulePath) {
    throw new Error("Runtime node module path cannot be retrieved");
  }

  const MATHJAX_PATH = path.join(getRuntimeNodeModulePath('mathjax'), MATHJAX_JS_PATH);

  const [selectedLanguage, selectLanguage] = React.useState<string>(availableLanguages.eng);

  const lang: I18nConfigContextSpec = {
    available: availableLanguages,
    default: availableLanguages.eng,
    selected: selectedLanguage,
    select: selectLanguage,
  };

  // Docs
  const docs = React.useContext(HelpContext);

  // User role
  const committerUsername = useRemoteUsername().value.username || '';

  const rolesResponse = useObjectData({ [ROLES_FILENAME]: 'utf-8' as const }).value[ROLES_FILENAME];
  const roles: GlossaryRegisterRoles = rolesResponse !== null && rolesResponse.encoding === 'utf-8'
    ? yaml.load(rolesResponse.value)
    : null;

  const roleInfo = roles ? roles[committerUsername] : null;
  const isManager = roleInfo?.isManager || undefined;

  const [selectedConceptRef, selectConceptRef] = React.useState<ConceptRef | null>(null);
  const [selectedCRID, selectCRID] = React.useState<string | null>(null);

  // NOTE: CR item here is specific to single-registry concepts, with languages as subkeys.
  // TODO: Once MLGT is migrated to subregistries, CR item must specify registry (subregistry?), item type, and item ID.
  const [selectedCRItem, selectCRItem] = React.useState<string | null>(null);
  const [highlightedConceptRefs, updateHighlightedConceptRefs] = React.useState<ConceptRef[]>([]);
  const [selectedRevisionID, selectRevisionID] = React.useState(null as null | string);

  const DEFAULT_SOURCE = { type: 'catalog-preset', presetName: 'all' } as const;
  const [query, setQuery] = React.useState<ConceptQuery>({ inSource: DEFAULT_SOURCE });

  const _concepts = useConcepts(useObjectPaths, useObjectData, query);

  const concepts = {
    ids: useIDs(useObjectPaths, { inSource: query.inSource || DEFAULT_SOURCE }).value,
    objects: Object.values(_concepts.value).sort((a, b) => a.termid - b.termid),
  };

  //const _collections = useCollections(useObjectPaths, useObjectData, {});
  const collections = {
    objects: []/*Object.values(_collections.value).
      sort((a, b) => a.label.localeCompare(b.label)).
      map(c => update(c, { $unset: ['items' ]}))*/,
  };

  React.useEffect(() => {
    if (localizedConcept !== undefined && localizedConcept !== null) {
      const revs = localizedConcept._revisions;
      if (selectedRevisionID === null) {
        selectRevisionID(revs?.current || null);
      } else if (revs?.tree[selectedRevisionID] === undefined) {
        selectRevisionID(revs?.current || null);
      }
      //selectReviewID(null);
    }
  }, [lang.selected, selectedConceptRef]);

  React.useEffect(() => {
    if (localizedConcept !== undefined && localizedConcept !== null) {
      const revs = localizedConcept._revisions;
      if (selectedRevisionID === null) {
        selectRevisionID(revs?.current);
      }
    }
  }, [selectedRevisionID]);

  React.useEffect(() => {
    function handleReadMore(e: KeyboardEvent) {
      e.preventDefault();
      if (docs.hoveredItem?.readMoreURL) {
        openHelpPage(docs.hoveredItem?.readMoreURL);
      } else {
        console.error("Nothing to open");
      }
      return false;
    }
    Mousetrap.bind('f1', handleReadMore);
  }, [docs.hoveredItem]);


  // Hotkey navigation up/down concept roll
  const currentIndex = React.useMemo(() => (
    concepts.objects.findIndex((c) => c.termid === selectedConceptRef)
  ), [JSON.stringify(concepts.ids), JSON.stringify(query), selectedConceptRef]);

  React.useEffect(() => {
    function selectNext() {
      const ref = getNextRef(currentIndex);
      if (ref) { selectConceptRef(ref); }
    }
    function selectPrevious() {
      const ref = getPreviousRef(currentIndex);
      if (ref) { selectConceptRef(ref); }
    }
    function getNextRef(idx?: number): ConceptRef | undefined {
      if (idx !== undefined && concepts.objects[idx + 1]) {
        return concepts.objects[idx + 1].termid;
      }
      return undefined;
    }
    function getPreviousRef(idx?: number): ConceptRef | undefined  {
      if (idx !== undefined && idx >= 1 && concepts.objects[idx - 1]) {
        return concepts.objects[idx - 1].termid;
      }
      return undefined;
    }

    Mousetrap.bind('j', selectNext);
    Mousetrap.bind('k', selectPrevious);

    return function cleanup() {
      Mousetrap.unbind('j');
      Mousetrap.unbind('k');
    };
  }, [currentIndex]);

  const concept = selectedConceptRef
    ? (_concepts.value[selectedConceptRef] || null)
    : null;
  const localizedConcept = concept
    ? (concept[lang.selected as keyof SupportedLanguages] || null)
    : undefined;
  const revision = localizedConcept && selectedRevisionID
    ? (localizedConcept._revisions?.tree[selectedRevisionID]?.object || null)
    : null;

  // NOTE: Nested context providers below are not-left-indented on purpose. Too many levels.
  // TODO: Configure context providers outside of this JSX?

  return (

    <I18nConfigContext.Provider value={lang}>

    <UserRoleContext.Provider value={{ isManager }}>

    <ChangeRequestContext.Provider value={{
      selected: selectedCRID,
      select: selectCRID,
      selectedItem: selectedCRItem,
      selectItem: selectCRItem,
    }}>

    <MathJax.Context script={`file://${MATHJAX_PATH}`} options={{
      asciimath2jax: {
        useMathMLspacing: true,
        delimiters: [["`","`"]],
        preview: "none",
      },
    }}>

    <ConceptContext.Provider value={{
      active: concept,
      isLoading: _concepts.isUpdating,
      activeLocalized: localizedConcept,

      ref: selectedConceptRef,
      select: selectConceptRef,

      highlightedRefs: highlightedConceptRefs,
      highlightRef: (ref: ConceptRef) =>
        updateHighlightedConceptRefs((refs) => {
          const idx = refs.indexOf(ref);
          if (idx < 0) {
            return [ ...refs, ref ];
          }
          return refs;
        }),
      unhighlightRef: (ref: ConceptRef) =>
        updateHighlightedConceptRefs((refs) => {
          const idx = refs.indexOf(ref);
          if (idx >= 0) {
            return update(refs, { $splice: [[ idx, 1 ]] });
          }
          return refs;
        }),
      highlightOne: (ref: ConceptRef) =>
        updateHighlightedConceptRefs([ ref ]),

      revisionID: selectedRevisionID,
      revision,
      selectRevision: selectRevisionID,
    }}>

    <SourceContext.Provider value={{
      isLoading: _concepts.isUpdating,

      active: query.inSource || DEFAULT_SOURCE,
      collections: collections.objects,
      select: (source: ObjectSource) => setQuery(q => update(q, { inSource: { $set: source } })),

      refs: concepts.ids,
      index: _concepts.value,
      objects: concepts.objects,
    }}>

    <ObjectQueryContext.Provider value={{ query, setQuery }}>

    <ModuleView className={Classes.ELEVATION_1}>
      {leftSidebar.length > 0
        ? <Sidebar
            React={React}
            key="left"
            position="left"
            panelSet={leftSidebar} />
        : null}

      <ModuleMainView key="main">
        <MainView />

        <ModuleToolbar>
          {[...mainToolbar.entries()].map(([idx, ToolbarItemComponent]) =>
            <ToolbarItemComponent React={React} key={idx} />
          )}
        </ModuleToolbar>
      </ModuleMainView>

      {rightSidebar.length > 0
        ? <Sidebar
            React={React}
            key="right"
            position="right"
            panelSet={rightSidebar} />
        : null}
    </ModuleView>

    </ObjectQueryContext.Provider>
    </SourceContext.Provider>
    </ConceptContext.Provider>
    </MathJax.Context>
    </ChangeRequestContext.Provider>
    </UserRoleContext.Provider>
    </I18nConfigContext.Provider>
  );
};


const ModuleView = styled.div`
  flex: 1;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  overflow: hidden;
  z-index: 2;
`

const ModuleToolbar = styled.div`
  padding: ${styling.GRID_SIZE_PX}px;
  background: ${Colors.LIGHT_GRAY2};
  display: flex;
  align-items: center;

  > * {
    margin-right: .5rem;

    &:last-child {
      margin-right: 0;
    }
  }
`

const ModuleMainView = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;

  > :first-child {
    flex: 1;

    .${styling.MODULE_MAIN_VIEW_TOOLBAR_INNER_CLASS_NAME} {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: flex-start;
      padding: 0 0 ${styling.GRID_SIZE_PX}px ${styling.GRID_SIZE_PX}px;
      background: ${Colors.LIGHT_GRAY2};

      > * {
        margin-right: ${styling.GRID_SIZE_PX}px;
        margin-top: ${styling.GRID_SIZE_PX}px;
      }

      :global .bp3-button-group {
        overflow: hidden;
      }
    }
  }
`

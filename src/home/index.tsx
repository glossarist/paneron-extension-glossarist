/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { ClassNames, jsx } from '@emotion/core';
import styled from '@emotion/styled';

import React from 'react';
import yaml from 'js-yaml';

import Mousetrap from 'mousetrap';
// Import needed to define Mousetrap.bindGlobal() as a side-effect:
import 'mousetrap/plugins/global-bind/mousetrap-global-bind';

import { H1, Button, ButtonGroup, Colors } from '@blueprintjs/core';

import { Panel } from '@riboseinc/paneron-extension-kit/widgets/panels';
import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';


import {
  BRANDING_FILENAME, GlossaryBranding,
  GlossaryRegisterMeta, REGISTER_META_FILENAME,
} from '../models/meta';
import { ModuleContext, HelpContext, HoveredItem } from './contexts';
import { useHelp } from './help';
import { ModuleConfig } from './module-config';
import { Module } from './module';

import * as styling from './styling';

/* Module configuration */

// import { default as review } from './modules/review';
// import { default as edit } from './modules/revise';
import { default as browse } from './modules/browse';

// import { default as view } from './modules/view';
// import { default as map } from './modules/map';
// import { default as translate } from './modules/translate';
// import { default as create } from './modules/create';

const MODULE_CONFIG: { [id: string]: ModuleConfig } = {
  // review,
  // edit,
  browse,
  // view,
  // map,
  // translate,
  // create,
};

const MODULES: (keyof typeof MODULE_CONFIG)[] = [
  'browse',
  // 'view',
  // 'edit',
  // 'review',
  // 'translate',
  // 'map',
];

const MODULE_GROUPS: (keyof typeof MODULE_CONFIG)[][] = [
  ['browse'/*, 'view', 'map'*/],
  //['create', 'edit', 'translate'],
  //['review'],
];


/* Main window */

const Window: React.FC<RepositoryViewProps> = function ({
    React, useObjectPaths, useObjectData, makeAbsolutePath,
    useRemoteUsername,
  }) {
  const [activeModuleID, activateModule] = React.useState(MODULES[0]);
  const [moduleOptions, setModuleOptions] = React.useState<any>({});

  const [hoveredItem, setHoveredItem] = React.useState<HoveredItem | null>(null);

  React.useEffect(() => {
    for (const moduleID of MODULES) {
      Mousetrap.bind(MODULE_CONFIG[moduleID].hotkey, () => activateModule(moduleID))
    }
    return function cleanup() {
      for (const hotkey of MODULES.map(moduleID => MODULE_CONFIG[moduleID].hotkey)) {
        Mousetrap.unbind(hotkey);
      }
    };
  }, []);

  React.useEffect(() => {
    setModuleOptions({});
  }, [activeModuleID]);


  const module = MODULE_CONFIG[activeModuleID];

  return (
    <HomeWindow>
      <HelpContext.Provider value={{ hoveredItem, setHoveredItem }}>

        <TopPanel
          React={React}
          useObjectData={useObjectData}
          makeAbsolutePath={makeAbsolutePath}

          activeModuleID={activeModuleID}
          activateModule={activateModule}
        />

        <ModuleContext.Provider value={{ opts: moduleOptions, setOpts: setModuleOptions }}>

          <Module
            React={React}
            useObjectPaths={useObjectPaths}
            useObjectData={useObjectData}
            useRemoteUsername={useRemoteUsername}

            leftSidebar={module.leftSidebar}
            rightSidebar={module.rightSidebar}
            MainView={module.MainView}
            mainToolbar={module.mainToolbar}
          />

        </ModuleContext.Provider>

      </HelpContext.Provider>
    </HomeWindow>
  );
};




const TopPanel: React.FC<{
  React: RepositoryViewProps["React"]
  useObjectData: RepositoryViewProps["useObjectData"]
  makeAbsolutePath: RepositoryViewProps["makeAbsolutePath"]

  activeModuleID: keyof typeof MODULE_CONFIG
  activateModule: (mod: keyof typeof MODULE_CONFIG) => void
}> =
function ({ React, useObjectData, makeAbsolutePath, activeModuleID, activateModule }) {

  const metaFiles = useObjectData({
    [REGISTER_META_FILENAME]: 'utf-8' as const,
    [BRANDING_FILENAME]: 'utf-8' as const,
  });

  const metaRegister = metaFiles.value[REGISTER_META_FILENAME]
  const metaBranding = metaFiles.value[BRANDING_FILENAME]

  const register: GlossaryRegisterMeta | null =
  metaRegister ? yaml.load(metaRegister.value as string) : null;

  const branding: GlossaryBranding | null =
  metaBranding ? yaml.load(metaBranding.value as string) : null;

  //const register = useIPCValue<{ objectID: 'register' }, { object: { name: string, description: string } | null }>
  //('db-default-read', { object: null }, { objectID: 'register' }).value.object;

  //const branding = useIPCValue<{ objectID: 'branding' }, { object: { name: string, symbol?: string } | null }>
  //('db-default-read', { object: null }, { objectID: 'branding' }).value.object;

  const topPanelRef = useHelp(React, 'panels/top-panel');

  return (
    <ClassNames>{({ css, cx }) =>
      <Panel
          isCollapsible

          className={cx(css`${styling.PANEL}`, css`overflow: hidden;`)}
          titleBarClassName={cx(css`${styling.PANEL_TITLE_BAR}`, css`
            justify-content: center;
            z-index: 2;
            position: relative;
          `)}
          contentsClassName={cx(css`${styling.PANEL_CONTENTS}`, css`
            height: 3.75rem;
            padding: 0 ${styling.GRID_SIZE_PX * 2}px .35rem ${styling.GRID_SIZE_PX * 2}px !important;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: space-between;
            background: ${styling.PANEL_LIGHT_BG};
          `)}

          ref={topPanelRef as (item: HTMLDivElement) => void}

          iconCollapsed="caret-down"
          iconExpanded="caret-up">

        {branding?.symbol
          ? <img
              className={css`
                height: 3rem;
                margin-right: ${styling.GRID_SIZE_PX / 2}px;
                flex: 0;
              `}
              src={`file://${makeAbsolutePath(branding.symbol)}`} />
          : null}

        <HeaderAndSettings>
          <AppTitle title={`${register?.name}\n${register?.description}`}>
            {branding?.name || register?.name || "Glossarist"}
          </AppTitle>
        </HeaderAndSettings>

        {MODULE_GROUPS.map((group, idx) =>
          <ModuleSelector key={idx} large>
            {group.map(moduleID =>
              <ModuleButton
                React={React}
                isSelected={moduleID === activeModuleID}
                moduleID={moduleID}
                key={moduleID}
                onSelect={() => activateModule(moduleID)}
              />
            )}
          </ModuleSelector>
        )}
      </Panel>
    }</ClassNames>
  );
};


const HeaderAndSettings = styled.div`
  flex: 1;
  display: flex;
  align-items: baseline;
  flex-flow: row nowrap;
  justify-content: flex-start;
  overflow: hidden;
  margin-right: ${styling.GRID_SIZE_PX}px;
  margin-top: .25em;
`


const AppTitle = styled(H1)`
  padding-left: ${styling.GRID_SIZE_PX}px;
  font-size: 160%;
  color: ${Colors.GRAY3};
  text-transform: uppercase;
  letter-spacing: -.025em;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: ${styling.GRID_SIZE_PX / 2}px;
`


const ModuleSelector = styled(ButtonGroup)`
  &:not(:last-child) {
    margin-right: ${styling.GRID_SIZE_PX}px;
  }
`


const HomeWindow = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
`


const ModuleButton: React.FC<{
  React: RepositoryViewProps["React"]

  isSelected: boolean
  moduleID: keyof typeof MODULE_CONFIG
  onSelect: () => void
}> =
function ({ React, isSelected, moduleID, onSelect }) {
  const ref = useHelp(React, `modules/${moduleID}`);

  return (
    <Button
        elementRef={ref}
        disabled={MODULE_CONFIG[moduleID].disabled === true}
        active={isSelected}
        onClick={onSelect}>
      {MODULE_CONFIG[moduleID].title}
    </Button>
  );
};


export default Window;


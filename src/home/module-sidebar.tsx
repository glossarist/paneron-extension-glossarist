/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { ClassNames, jsx } from '@emotion/core';
import type React from 'react';

import { Panel } from '@riboseinc/paneron-extension-kit/widgets/panels';
import { useHelp } from './help';
import { PanelConfig } from './panel-config';
import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';
import * as styling from './styling';
import styled from '@emotion/styled';

//import styles from './styles.scss';


const SPanel: React.FC<{
  React: RepositoryViewProps["React"]
  cfg: PanelConfig
  contentsClassName?: string
}> = function ({ React, cfg, contentsClassName }) {
  const panelRef = useHelp(React, `panels/${cfg.helpResourceID}`);

  return (
    <ClassNames>{({ css, cx }) =>
      <Panel
          className={cfg.className}

          titleBarClassName={css``}
          contentsClassName={cx(css`${styling.PANEL_CONTENTS}`, { [contentsClassName || '']: true })}
          ref={panelRef as (item: HTMLDivElement) => void}

          isCollapsible={cfg.collapsed !== 'never' ? true : undefined}
          isCollapsedByDefault={cfg.collapsed === 'by-default' ? true : undefined}
          TitleComponent={cfg.TitleComponent}
          TitleComponentSecondary={cfg.TitleComponentSecondary}
          title={cfg.title}>
        <cfg.Contents React={React} {...cfg.props || {}} />
      </Panel>
    }</ClassNames>
  );
};


interface SidebarProps {
  React: RepositoryViewProps["React"]
  position: 'left' | 'right'
  panelSet: PanelConfig[]
}
export const Sidebar: React.FC<SidebarProps> = function({ React, position, panelSet }) {
  const [firstPanel, ...restOfPanels] = panelSet;

  let lastPanel: PanelConfig | null;
  if (panelSet.length > 1) {
    lastPanel = restOfPanels.splice(restOfPanels.length - 1, 1)[0];
  } else {
    lastPanel = null;
  }

  return (
    <ClassNames>{({ css, cx }) =>
      <Panel
          isCollapsible
          iconExpanded={position === 'left' ? 'caret-left' : 'caret-right'}
          iconCollapsed={position === 'left' ? 'caret-right' : 'caret-left'}

          titleBarClassName={css`
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
            width: ${styling.GRID_SIZE_PX * 1.5}px;
          `}
          contentsClassName={css`
            width: 17rem;
            flex: 1;
            display: flex;
            flex-flow: column nowrap;
            overflow: hidden;
          `}

          css={css`
            min-height: unset;
            background: ${styling.PANEL_LIGHT_BG};
          `}

          className={`
            ${position === 'left'
              ? ''
              : css`flex-flow: row-reverse nowrap`}
          `}>

        <FixedPanel>
          <SPanel React={React} cfg={firstPanel} />
        </FixedPanel>

        <RestOfPanels>
          {[...restOfPanels.entries()].map(([idx, cfg]) =>
            <SPanel React={React} key={`${idx}-${cfg.helpResourceID}`} cfg={cfg} />
          )}
        </RestOfPanels>

        {lastPanel
          ? <FixedPanel>
              <SPanel React={React} cfg={lastPanel} />
            </FixedPanel>
          : null}

      </Panel>
    }</ClassNames>
  );
};



const FixedPanel = styled.div`
  flex-shrink: 0;
  max-height: 33vh;
  display: flex;
  flex-flow: column nowrap;
  margin: -${styling.GRID_SIZE_PX / 2}px;
  padding: ${styling.GRID_SIZE_PX / 2}px ${styling.GRID_SIZE_PX / 4}px;
  z-index: 2;

  &:first-child {
    padding-top: ${styling.GRID_SIZE_PX}px;
  }

  &:last-child {
    padding-bottom: ${styling.GRID_SIZE_PX}px;
  }
`;


const RestOfPanels = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  margin: -${styling.PANEL_PADDING_REM}rem;
  padding: ${styling.PANEL_PADDING_REM}rem;
`

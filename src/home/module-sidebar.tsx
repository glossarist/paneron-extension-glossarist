/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { css, jsx } from '@emotion/core';
import type React from 'react';

import { Panel } from '@riboseinc/paneron-extension-kit/widgets/panels';
import { useHelp } from './help';
import { PanelConfig } from './panel-config';
import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';

//import styles from './styles.scss';


const SPanel: React.FC<{
  React: RepositoryViewProps["React"]
  cfg: PanelConfig
}> = function ({ React, cfg }) {
  const panelRef = useHelp(React, `panels/${cfg.helpResourceID}`);

  return (
    <Panel
        className={cfg.className}

        titleBarClassName={styles.panelTitleBar}
        contentsClassName={styles.panelContents}
        ref={panelRef as (item: HTMLDivElement) => void}

        isCollapsible={cfg.collapsed !== 'never' ? true : undefined}
        isCollapsedByDefault={cfg.collapsed === 'by-default' ? true : undefined}
        TitleComponent={cfg.TitleComponent}
        TitleComponentSecondary={cfg.TitleComponentSecondary}
        title={cfg.title}>
      <cfg.Contents {...cfg.props || {}} />
    </Panel>
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
    <Panel
        isCollapsible
        iconExpanded={position === 'left' ? 'caret-left' : 'caret-right'}
        iconCollapsed={position === 'left' ? 'caret-right' : 'caret-left'}

        collapsedClassName={styles.panelCollapsed}
        titleBarClassName={styles.panelTitleBar}
        contentsClassName={styles.panelContents}

        className={`
          ${styles.moduleSidebar}
          ${position === 'left' ? styles.moduleSidebarLeft : styles.moduleSidebarRight}`}>

      <div className={styles.fixedPanel}>
        <SPanel React={React} cfg={firstPanel} />
      </div>

      <div className={styles.restOfPanels}>
        {[...restOfPanels.entries()].map(([idx, cfg]) =>
          <SPanel React={React} key={`${idx}-${cfg.helpResourceID}`} cfg={cfg} />
        )}
      </div>

      {lastPanel
        ? <div className={styles.fixedPanel}>
            <SPanel React={React} cfg={lastPanel} />
          </div>
        : null}

    </Panel>
  );
};

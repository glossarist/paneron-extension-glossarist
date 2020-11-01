import { Colors } from '@blueprintjs/core';
import { css } from 'emotion';


export const GRID_SIZE_PX = 20;
export const PANEL_PADDING_REM = 0.375;
export const PANEL_LIGHT_BG = Colors.LIGHT_GRAY4;

export const PANEL = `
  background: $panelLightBg;
  min-height: unset;
`;

export const PANEL_CONTENTS = `
  padding: $panelPadding;
  background: transparent;
`;

export const PANEL_TITLE_BAR = `
  height: unset;
`;

export const MODULE_MAIN_VIEW_TOOLBAR_INNER_CLASS_NAME = 'moduleViewToolbarInner';

export const PANEL_SEPARATOR_CSS = css`
  margin-top: ${GRID_SIZE_PX}px;
  margin-bottom: ${GRID_SIZE_PX}px;
  background: transparent;
  min-height: unset !important;
  box-shadow: none !important;
  text-align: center;
  font-size: 80%;
  text-transform: uppercase;
  color: ${Colors.LIGHT_GRAY1};
  flex: 1;
  justify-content: flex-end;

  > * {
    background: transparent !important;
  }
`

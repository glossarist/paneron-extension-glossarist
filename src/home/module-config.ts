import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';
import type React from 'react';
import type { PanelConfig } from './panel-config';


export type ToolbarItem = React.FC<{ React: RepositoryViewProps["React"] }>;


export interface ModuleConfig {
  hotkey: string
  title: string
  leftSidebar: PanelConfig[]
  rightSidebar: PanelConfig[]
  MainView: React.FC<any>
  mainToolbar: ToolbarItem[]
  disabled?: true
}

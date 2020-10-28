import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';
import type React from 'react';


export interface PanelConfig {
  title?: string
  TitleComponent?: React.FC<{ isCollapsed?: boolean }>
  TitleComponentSecondary?: React.FC<{ isCollapsed?: boolean }>
  actions?: React.FC<{ React: RepositoryViewProps["React"] }>[]
  Contents: React.FC<{ React: RepositoryViewProps["React"] }>
  objectIndependent?: true
  className?: string
  props?: object
  collapsed?: 'never' | 'by-default'
  helpResourceID?: string
}

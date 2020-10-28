/** @jsx jsx */
/** @jsxFrag React.Fragment */

import log from 'electron-log';
import React from 'react';
import { jsx } from '@emotion/core';

import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';
import HomeView from './home';


Object.assign(console, log);


export const RepositoryView: React.FC<RepositoryViewProps> = (props) => {
  return <HomeView {...props} />;
}

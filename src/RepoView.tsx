/** @jsx jsx */
/** @jsxFrag React.Fragment */

import log from 'electron-log';
import type React from 'react';
import { jsx } from '@emotion/core';

import type { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';

Object.assign(console, log);

import { RegistryView } from '@riboseinc/paneron-registry-kit/views';

import { concept } from './classes/concept';
import { definition } from './classes/definition';
import { designation } from './classes/designation';


const itemConfig = {
  'concept': concept,
  'definition': definition,
  'designation': designation,
};


const subregisters = {
  universal: {
    title: "Universal",
    itemClasses: ['concept'],
  },
  eng: {
    title: "English",
    itemClasses: ['definition', 'designation'],
  },
  fra: {
    title: "French",
    itemClasses: ['definition', 'designation'],
  },
  ara: {
    title: "Arabic",
    itemClasses: ['definition', 'designation'],
  },
}


export const RepositoryView: React.FC<RepositoryViewProps> =
function (props) {
  return <RegistryView
    {...props}
    itemClassConfiguration={itemConfig}
    subregisters={subregisters}
  />
};

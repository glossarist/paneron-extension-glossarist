/** @jsx jsx */
/** @jsxFrag React.Fragment */

import log from 'electron-log';
import type React from 'react';
import { jsx } from '@emotion/core';


Object.assign(console, log);


import { RegistryView } from '@riboseinc/paneron-registry-kit/views';
import { itemClassConfiguration, subregisters } from './registryConfig';


const RepositoryView: React.FC<Record<never, never>> =
function () {
  return <RegistryView
    itemClassConfiguration={itemClassConfiguration}
    subregisters={subregisters}
    keyExpression="obj.data.identifier || `${obj.data.terms?.[0]?.designation}-${obj.id}` || obj.id"
  />
};


export default RepositoryView;

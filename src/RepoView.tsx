/** @jsx jsx */
/** @jsxFrag React.Fragment */

import type React from 'react';
import { jsx } from '@emotion/react';

import { RegistryView } from '@riboseinc/paneron-registry-kit/views';
import CRITERIA_CONFIGURATION from '@riboseinc/paneron-registry-kit/views/FilterCriteria/CRITERIA_CONFIGURATION';
import { itemClassConfiguration, subregisters } from './registryConfig';



const defaultClassID = Object.keys(itemClassConfiguration)[0];
const defaultCriteria = CRITERIA_CONFIGURATION['item-class'].toQuery(
  { classID: defaultClassID },
  { itemClasses: itemClassConfiguration },
);


const RepositoryView: React.FC<Record<never, never>> =
function () {
  return <RegistryView
    itemClassConfiguration={itemClassConfiguration}
    subregisters={subregisters}
    keyExpression="obj.data.identifier || `${obj.data.terms?.[0]?.designation}-${obj.id}` || obj.id"
    defaultSearchCriteria={{ require: 'all', criteria: [{ key: 'item-class', query: defaultCriteria }] }}
  />
};


export default RepositoryView;

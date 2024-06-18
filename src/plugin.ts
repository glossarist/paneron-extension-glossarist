import { makeRegistryExtension, CRITERIA_CONFIGURATION } from '@riboseinc/paneron-registry-kit';

import { itemClassConfiguration } from './registryConfig';


const defaultClassID = Object.keys(itemClassConfiguration)[0];
const defaultCriteria = CRITERIA_CONFIGURATION['item-class'].toQuery(
  { classID: defaultClassID },
  { itemClasses: itemClassConfiguration },
);

const defaultSearchCriteria = {
  require: 'all',
  criteria: [{ key: 'item-class', query: defaultCriteria }],
} as const;

function getQuickSearchPredicate(quickSearchString: string) {
  return `[
    ...(obj.data?.terms || []).map(t => t.designation?.toString()),
    ...(obj.data?.definition || []).map(d => d.content?.toString()),
    ...(obj.data?.notes || []).map(d => d.content?.toString()),
    ...(obj.data?.examples || []).map(e => e.content?.toString()),
    ...(obj.data?.authoritativeSource || []).map(s => s.ref?.toString()),
    obj.data?.identifier?.toString() ?? '',
  ].join('').toLowerCase().indexOf("${quickSearchString.toLowerCase()}") >= 0`;
}

export default makeRegistryExtension({
  name: "Glossarist",
  itemClassConfiguration,
  defaultSearchCriteria: defaultSearchCriteria as any,
  keyExpression: "obj.data?.identifier ? parseInt(obj.data.identifier ?? '0', 10) : `${obj.data.terms?.[0]?.designation}-${obj.id}`",
  getQuickSearchPredicate,
});

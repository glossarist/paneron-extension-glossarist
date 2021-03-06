import { Subregisters } from '@riboseinc/paneron-registry-kit/types';

import concept from './classes/concept';
import localizedConcept from './classes/localizedConcept';

import { priorityLanguages, nonPriorityLanguages, languageTitles } from './models/lang';


const languageSubregisters: Subregisters = {};

for (const langID of [ ...priorityLanguages, ...nonPriorityLanguages ]) {
  languageSubregisters[langID] = {
    title: languageTitles[langID],
    itemClasses: ['localized-concept'],
  };
}

export const itemClassConfiguration = {
  'concept': concept,
  'localized-concept': localizedConcept,
};

export const subregisters = {
  universal: {
    title: "Universal",
    itemClasses: ['concept'],
  },
  ...languageSubregisters,
};

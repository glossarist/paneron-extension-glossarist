import { concept } from './classes/concept';
import { definition } from './classes/definition';
import { designation } from './classes/designation';


export const itemClassConfiguration = {
  'concept': concept,
  'definition': definition,
  'designation': designation,
};


export const subregisters = {
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
};

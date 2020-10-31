//import path from 'path';
import yaml from 'js-yaml';

import log from 'electron-log';

import {
  ObjectDataHook,
  ObjectDataRequest,
  ObjectPathsHook,
  ValueHook,
} from '@riboseinc/paneron-extension-kit/types';
import { ConceptCollection, ConceptRef, MultiLanguageConcept } from './models/concepts';
import { ConceptQuery } from './models/query';



export type UseConceptsHook = (useObjectPaths: ObjectPathsHook, useObjectData: ObjectDataHook, query: ConceptQuery) =>
  ValueHook<Record<string, MultiLanguageConcept<any>>>;

export type UseConceptHook = (useObjectData: ObjectDataHook, id: ConceptRef) =>
  ValueHook<MultiLanguageConcept<any> | undefined>;

export type UseCollectionsHook = (useObjectPaths: ObjectPathsHook, useObjectData: ObjectDataHook, query: ConceptQuery) =>
  ValueHook<Record<string, ConceptCollection>>;

export type UseIDsHook = (useObjectPaths: ObjectPathsHook, query: ConceptQuery) =>
  ValueHook<number[]>;


const useConceptFilePaths = (useObjectPaths: ObjectPathsHook): ValueHook<string[]> => {
  const conceptFilePathQueryResult = useObjectPaths({ pathPrefix: 'concepts' });
  const filePaths = conceptFilePathQueryResult.value.filter(p => p.endsWith('.yaml'));
  return { ...conceptFilePathQueryResult, value: filePaths };
}


export const useConcepts: UseConceptsHook = (useObjectPaths, useObjectData, query) => {
  const filePaths = useConceptFilePaths(useObjectPaths).value;

  const conceptDataQuery: ObjectDataRequest = filePaths.
  map(p => ({ [p]: 'utf-8' as const })).
  reduce((p, c) => ({ ...p, ...c }), {});

  const conceptDataQueryResult = useObjectData(conceptDataQuery);

  const parsedConcepts = Object.entries(conceptDataQueryResult.value).
  map(([path, objectData]) => {
    if (objectData?.encoding === 'utf-8') {
      const data = yaml.load(objectData.value);
      if (data.termid) {
        return { [data.termid]: data };
      }
    }
    return {};
  }).
  reduce((p, c) => ({ ...p, ...c }), {});

  return { ...conceptDataQueryResult, value: parsedConcepts };
};


export const useConcept: UseConceptHook = (useObjectData, ref) => {
  const conceptFilePath = `/concepts/${ref}.yaml`;
  const conceptDataQuery = { [conceptFilePath]: 'utf-8' as const };
  const conceptData = useObjectData(conceptDataQuery).value[conceptFilePath];
  if (conceptData?.encoding === 'utf-8') {
    return yaml.load(conceptData.value);
  }
  return undefined;
};


//export const useCollections: UseCollectionsHook = (useObjectPaths, useObjectData, query) => {
//  return useObjectData({});
//};


export const useIDs: UseIDsHook = (useObjectPaths, query) => {
  const filePathRequestResult = useConceptFilePaths(useObjectPaths);
  const refs: number[] = filePathRequestResult.value.
  map(p => {
    const fileBasename = p.
      replace(/^\//, '').
      replace('concepts/', '').
      replace('.yaml', '');

    try {
      return parseInt(fileBasename, 10);
    } catch (e) {
      log.warn("Unable to parse concept file path into ID", p)
      return undefined;
    }
  }).
  filter(ref => ref !== undefined).
  map(ref => ref as number);

  return {
    ...filePathRequestResult,
    value: refs,
  };
};

//import path from 'path';
import yaml from 'js-yaml';

//import log from 'electron-log';

import {
  ObjectDataHook,
  ObjectDataRequest, ObjectPathsHook,
  ValueHook,
} from '@riboseinc/paneron-extension-kit/types';
import { ConceptCollection, ConceptRef, MultiLanguageConcept } from './models/concepts';
import { ConceptQuery } from './models/query';



export type UseConceptsHook = (useObjectPaths: ObjectPathsHook, useObjectData: ObjectDataHook, query: ConceptQuery) =>
  ValueHook<Record<string, MultiLanguageConcept<any>>>;

export type UseConceptHook = (useObjectPaths: ObjectPathsHook, useObjectData: ObjectDataHook, id: ConceptRef) =>
  ValueHook<MultiLanguageConcept<any>>;

export type UseCollectionsHook = (useObjectPaths: ObjectPathsHook, useObjectData: ObjectDataHook, query: ConceptQuery) =>
  ValueHook<Record<string, ConceptCollection>>;

export type UseIDsHook = (useObjectPaths: ObjectPathsHook, query: ConceptQuery) =>
  ValueHook<number[]>;


export const useConcepts: UseConceptsHook = (useObjectPaths, useObjectData, query) => {
  const dataRequest: ObjectDataRequest = paths.map(path => {
    //return { [path]: 'utf-8' as const };
    const possiblePaths = filepathCandidates(path);
    let request: ObjectDataRequest = {};
    for (const path of possiblePaths) {
      request[path] = 'utf-8' as const;
    }
    return request;
  }).reduce((p, c) => ({ ...p, ...c }), {});

  const data = useObjectData(dataRequest);

  const parsedData = Object.entries(data.value).
  filter(([ _, data ]) => data !== null && data.encoding === 'utf-8').
  map(([ path, data ]) => {
    const item: MultiLanguageConcept<any> = yaml.load(data!.value as string);
    return { [filepathToDocsPath(path)]: item };
  }).
  reduce((p, c) => ({ ...p, ...c }), {});

  return {
    ...data,
    value: parsedData
  };
};


export const useConcept: UseConceptHook = (useObjectPaths, useObjectData, ref) => {
};


export const useCollections: UseCollectionsHook = (useObjectPaths, useObjectData, query) => {
  return useObjectData({});
};


export const useIDs: UseIDsHook = (useObjectPaths, query) => {
  const pathsResponse = useObjectPaths({ pathPrefix: 'concepts' });
  return pathsResponse;
};

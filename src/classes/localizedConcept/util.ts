import React from 'react';
import { DatasetContext } from '@riboseinc/paneron-extension-kit/context';
import { incompleteItemRefToItemPathPrefix } from '@riboseinc/paneron-registry-kit/views/itemPathUtils';


const universalConceptItemPathPrefix = incompleteItemRefToItemPathPrefix({ classID: 'concept' });

/**
 * Returns UUID of umbrella universal concept that links to this localized concept.
 * Returns `null` if no UUID could be determined, `undefined` while loading
 * or if given localized concept UUID is not right.
 */
export function useUniversalConceptUUID(localizedConceptUUID: string): string | null | undefined {
  const { useMapReducedData } = React.useContext(DatasetContext);

  const result = useMapReducedData({
    chains: {
      conceptUUID: {
        mapFunc: localizedConceptUUID
          ? `
              if (key.startsWith("${universalConceptItemPathPrefix}") &&
                  value?.id &&
                  Object.values(value.data?.localizedConcepts ?? {}).indexOf("${localizedConceptUUID}") >= 0) {
                emit(value.id);
              }
            `
          : ``,  // Don’t do anything if empty localizedConceptUUID is given
        // Just return the first result.
        reduceFunc: 'return value?.[0];',
      },
    },
  });

  if (!localizedConceptUUID) {
    return undefined;
  }

  if (result.isUpdating || typeof result.value.conceptUUID !== 'string') {
    return undefined;
  } else {
    return result.value.conceptUUID ?? null;
  }
}



export function openLinkInBrowser(link: string) {
  // Some dance in an attempt to detect Electron without inadvertently including it in a bundle
  if (typeof require !== 'undefined' && require.resolveWeak !== undefined) {
    try {
      const el = __webpack_modules__[require.resolveWeak('electron') as number];
      if (el) {
        el.shell.openExternal(link);
      }
    } catch (e) {
      console.error("Unable to open link in default browser", link, e);
    }
  } else if (typeof window !== 'undefined') {
    try {
      window.location.assign(link);
    } catch (e) {
      console.error("Unable to navigate to link", link, e);
    }
  }
}

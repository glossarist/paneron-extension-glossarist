import type { Plugin } from '@riboseinc/paneron-extension-kit/types';
import log from 'electron-log';
import 'electron';

let plugin: Plugin;

if (process.type === 'browser') {
  plugin = {};

} else if (process.type === 'renderer') {

  try {
    plugin = new Promise((resolve, reject) => {
      try {
        import('./RepoView').then(({ RepositoryView }) => {
          resolve({
            repositoryView: RepositoryView,
          });
        }).catch((e) => {
          log.error("Paneron extension: Error loading repository view", JSON.stringify(e));
          reject(e);
        });
      } catch (e) {
        log.error("Paneron extension: Error loading repository view", JSON.stringify(e));
        resolve({});
      }
    });
  } catch (e) {
    log.error("Failed to create plugin", e);
    plugin = new Promise((resolve) => { resolve({}) });
  }

} else {
  throw new Error("Unsupported process type");

}

export default plugin;

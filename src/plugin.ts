import { makeExtension } from '@riboseinc/paneron-extension-kit';
import datasetInitializer from '@riboseinc/paneron-registry-kit/migrations/initial';
import mainView from './RepoView';

export default makeExtension({
  name: "Glossarist",
  requiredHostAppVersion: '2.0.0',
  mainView,
  datasetInitializer,
  datasetMigrations: {},
});

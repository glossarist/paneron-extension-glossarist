import { makeExtension } from '@riboseinc/paneron-extension-kit';
import 'electron';

export default makeExtension({
  mainView: () => import('./RepoView'),
  name: "Glossarist",
  requiredHostAppVersion: '^1.0.0-beta1',
  datasetMigrations: {},
  datasetInitializer: () => import('./migrations/initial'),
});

import { makeExtension } from '@riboseinc/paneron-extension-kit';
import 'electron';

export default makeExtension({
  mainView: () => import('./RepoView'),
  name: "Glossarist",
  requiredHostAppVersion: '^1.0.0-alpha19',
  datasetMigrations: {},
  datasetInitializer: () => import('./migrations/initial'),
});

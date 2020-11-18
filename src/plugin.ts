import { makeExtension } from '@riboseinc/paneron-extension-kit';
import 'electron';

export default makeExtension({
  repoView: () => import('./RepoView'),
  name: "Glossarist",
})

Glossarist extension for Paneron
================================

Release process
---------------

1. Update version in package.json to `<next version>`.

2. Make your changes.

3. Build the latest version::

       yarn run dist

4. Test by, e.g., adding the `dist` directory in Paneron as local extension
   and using it on a dataset.

5. Repeat steps 2-4 as needed.

6. Tag commit::

       git tag -s <next version>

   Enter some brief message.

7. Publish to NPM::

       npm publish --access public

To upgrade key dependencies if needed::

    yarn upgrade --ignore-scripts @riboseinc/paneron-extension-kit @riboseinc/paneron-registry-kit

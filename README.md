# Glossarist extension for Paneron

## Release process

- Make and test your changes.

- Update version in package.json to `<next version>`.

- ```
  git tag -s <next version>
  ```
  
  Enter some brief message.

- Publish to NPM:

  ```
  npm publish --access public
  ```

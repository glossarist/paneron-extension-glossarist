export function openLinkInBrowser(link: string) {
  try {
    const el = require.resolveWeak
      ? __webpack_modules__[require.resolveWeak('electron') as number]
      : undefined;
    if (el) {
      el.shell.openExternal(link);
    }
  } catch (e) {
    console.error("Unable to open link in default browser", link, e);
    return;
  }

}

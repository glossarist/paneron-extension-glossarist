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

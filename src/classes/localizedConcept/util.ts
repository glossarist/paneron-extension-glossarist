export function openLinkInBrowser(link: string) {
  require('electron').shell.openExternal(link);
}

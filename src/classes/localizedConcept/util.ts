export function openHelpPage(link: string) {
  require('electron').shell.openExternal(link);
}

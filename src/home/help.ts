import memoizeOne from 'memoize-one';
import axios from 'axios';
import { DocsContext, HoveredItem } from './contexts';
import { RepositoryViewProps } from '@riboseinc/paneron-extension-kit/types';


const GENERAL_HELP_ROOT = 'https://www.glossarist.org';
const IN_APP_HELP_ROOT = `${GENERAL_HELP_ROOT}/_in_app_help`;


export function openHelpPage(path: string) {
  require('electron').shell.openExternal(`${GENERAL_HELP_ROOT}${path}`);
}

type HelpResponse = { data: { link?: string, excerpt: string, title: string } };



const memoizedReq = memoizeOne(async (itemID: string): Promise<HelpResponse | undefined> => {
  let resp: HelpResponse;
  try {
    resp = await axios.get(`${IN_APP_HELP_ROOT}/${itemID}.json`);
  } catch (e) {
    console.error("Failed to fetch docs for item", itemID);
    return;
  }
  return resp;
});


export function useHelp(React: RepositoryViewProps["React"], itemID: string): (item: HTMLElement) => void {
  const ctx = React.useContext(DocsContext);
  const [ref, setRef] = React.useState<HTMLElement | null>(document.createElement('div'));
  const [itemHelp, setItemHelp] = React.useState<HoveredItem | null>(null);

  React.useEffect(() => {
    (async () => {
      let _resp: HelpResponse | undefined;
      try {
        _resp = await memoizedReq(itemID);
      } catch (e) {
        _resp = undefined;
      }
      if (!_resp ) {
        setItemHelp(null);
        return;
      }

      const item: HoveredItem = {
        title: _resp.data.title,
        excerpt: _resp.data.excerpt,
        readMoreURL: _resp.data.link || null,
      };

      setItemHelp(item);
    })();
  }, [itemID]);

  React.useEffect(() => {
    function handleMouseOver(evt: MouseEvent) {
      evt.stopPropagation();
      if (JSON.stringify(ctx.hoveredItem) !== JSON.stringify(itemHelp)) {
        setImmediate(() => {
          ctx.setHoveredItem(itemHelp);
        });
      }
    }

    function resetHelp(evt: MouseEvent) {
      evt.stopPropagation();
      ctx.setHoveredItem(null);
    }

    ref?.addEventListener('mouseover', handleMouseOver);
    ref?.addEventListener('mouseleave', resetHelp);

    return function cleanup() {
      ref?.removeEventListener('mouseover', handleMouseOver);
      ref?.removeEventListener('mouseleave', resetHelp);
    }
  }, [itemHelp, ref]);


  return setRef;
}

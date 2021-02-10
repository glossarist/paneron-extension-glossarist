/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { TextArea } from '@blueprintjs/core';
import { jsx } from '@emotion/core';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import { PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';


export interface DefinitionData {
  definition: string
  notes: string[]
  examples: string[]
};

export const definition: ItemClassConfiguration<DefinitionData> = {
  meta: {
    title: "Definition",
    description: "Defined concept",
    id: 'definition',
    alternativeNames: [],
  },
  defaults: {},
  itemSorter: () => 0,
  views: {
    listItemView: (props) => {
      //const c = <GenericRelatedItemView
      //  itemRef={{ classID: 'concept', subregistryID: 'universal', itemID: props.itemData.concept }} />
      return <span className={props.className}>{props.itemData.definition.slice(0, 20)}…</span>
    },
    detailView: (props) => {
      const d = props.itemData;
      return (
        <div>
          <TextArea fill
            readOnly
            value={d.definition || ''}
            id="definition" />

          {[...d.examples.entries()].map(([idx, item]) =>
            <PropertyDetailView
                key={`example-${idx}`}
                title={`EXAMPLE ${idx + 1}`}>
              <TextArea
                fill
                value={item}
                disabled />
            </PropertyDetailView>
          )}

          {[...d.notes.entries()].map(([idx, item]) =>
            <PropertyDetailView
                key={`note-${idx}`}
                title={`NOTE ${idx + 1}`}>
              <TextArea
                fill
                value={item}
                disabled />
            </PropertyDetailView>
          )}
        </div>
      );
    },
    editView: () => <p>oi</p>,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};

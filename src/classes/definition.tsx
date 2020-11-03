/** @jsx jsx */
/** @jsxFrag React.Fragment */

import { TextArea } from '@blueprintjs/core';
import { jsx } from '@emotion/core';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import { GenericRelatedItemView, PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';


interface DefinitionData {
  concept: string
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
      return <span className={props.className}>{props.itemData.concept}</span>
    },
    detailView: (props) => {
      const d = props.itemData;
      return (
        <div>
          <PropertyDetailView title="Abstract concept">
            <GenericRelatedItemView
              itemRef={{ classID: 'concept', subregisterID: 'universal', itemID: d.concept }}
              useRegisterItemData={props.useRegisterItemData}
              getRelatedItemClassConfiguration={props.getRelatedItemClassConfiguration}
            />
          </PropertyDetailView>

          <PropertyDetailView title="Definition">
            <TextArea fill
              readOnly
              value={d.definition || ''}
              id="definition" />
          </PropertyDetailView>

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

/** @jsx jsx */
/** @jsxFrag React.Fragment */

//import React from 'react';
import { NonIdealState } from '@blueprintjs/core';
import { jsx } from '@emotion/core';
//import React from 'react';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';


interface ConceptData {
  identifier: string
};

export const concept: ItemClassConfiguration<ConceptData> = {
  meta: {
    title: "Concept",
    description: "Abstract concept",
    id: 'concept',
    alternativeNames: [],
  },
  defaults: {},
  itemSorter: (p1, p2) => p1.identifier.localeCompare(p2.identifier),
  views: {
    listItemView: (props) => <span className={props.className}>{props.itemData.identifier}</span>,
    detailView: () => <NonIdealState description="There are no details to show for an abstract concept currently." />,
    editView: () => <span></span>,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};

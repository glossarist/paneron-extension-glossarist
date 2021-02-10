/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { Checkbox, InputGroup } from '@blueprintjs/core';
import { jsx } from '@emotion/core';
//import React from 'react';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types';
import { PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import { Designation } from '../models/concepts';


export type DesignationData = Designation


//export function isRTL(lang: keyof SupportedLanguages) {
//  return lang === 'ara';
//}


export const designation: ItemClassConfiguration<DesignationData> = {
  meta: {
    title: "Designation",
    description: "Concept designation (term)",
    id: 'designation',
    alternativeNames: [],
  },
  defaults: {
    normativeStatus: 'preferred',
    type: 'expression',
  },
  itemSorter: () => 0,
  views: {
    listItemView: (props) => {
      return <span className={props.className}>{props.itemData.designation}</span>
    },
    detailView: (props) => {
      const d = props.itemData;

      return (
        <div>
          <InputGroup fill
            value={d.designation}
            readOnly />

          <PropertyDetailView title="Type">
            <InputGroup fill
              value={d.type}
              readOnly />
          </PropertyDetailView>

          {d.type === 'expression'
            ? <>
                <PropertyDetailView title="Geographical area">
                  <InputGroup
                    readOnly
                    value={d.geographicalArea}
                    maxLength={5} />
                </PropertyDetailView>

                <PropertyDetailView title="Part of speech">
                  <InputGroup
                    readOnly
                    value={d.partOfSpeech}
                    maxLength={5} />
                </PropertyDetailView>


                {d.partOfSpeech === 'adjective' || d.partOfSpeech === 'adverb'
                  ? <PropertyDetailView title="Participle form">
                      <Checkbox disabled checked={d.isParticiple} />
                    </PropertyDetailView>
                  : null}

                <PropertyDetailView title="Abbreviated form">
                  <Checkbox
                    disabled
                    checked={d.isAbbreviation} />
                </PropertyDetailView>

                {d.partOfSpeech === 'noun'
                  ? <>
                      <PropertyDetailView title="Grammatical gender">
                        <InputGroup readOnly value={d.gender} />
                      </PropertyDetailView>
                      <PropertyDetailView title="Grammatical number">
                        <InputGroup readOnly value={d.grammaticalNumber} />
                      </PropertyDetailView>
                    </>
                  : null}
              </>
            : null}
        </div>
      )
    },
    editView: () => <p>oi</p>,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};

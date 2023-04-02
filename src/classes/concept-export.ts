import { Liquid } from 'liquidjs';
import { ExportFormatConfiguration } from '@riboseinc/paneron-registry-kit/types/views';
import LocalizedConceptData from './localizedConcept/LocalizedConceptData';
import { RegisterItem } from '@riboseinc/paneron-registry-kit/types/item';
import { ConceptData } from './concept';


const RDFExport: ExportFormatConfiguration<ConceptData> = {
  label: "RDF",
  exportItem: async (itemData, { getObjectData, getBlob, logger }) => {
    const localizedEntryPaths = Object.entries(itemData.data.localizedConcepts).
    map(([ langID, itemID ]) => {
      return `/subregisters/${langID}/localized-concept/${itemID}.yaml`;
    });

    logger?.log("RDF: Localized entry paths", localizedEntryPaths);

    const localizedEntriesResponse = await getObjectData({ objectPaths: localizedEntryPaths });

    logger?.log("RDF: Localized entry resp", localizedEntriesResponse.data);

    const localizedEntries: Record<string, RegisterItem<LocalizedConceptData>> = Object.entries(localizedEntriesResponse.data).
    filter(([, data]) => data !== null).
    map(([path, data]) => {
      const langID = stripLeadingSlash(path).split('/')[1];
      return {
        [langID]: data as RegisterItem<LocalizedConceptData>,
      };
    }).
    reduce((prev, curr) => ({ ...prev, ...curr }), {});

    logger?.log("RDF: Localized entries", localizedEntries);

    const ctx: RDFTemplateContext = {
      page_url: '<url_placeholder>',
      localized_concept_data: localizedEntries,
      languages: ['eng', 'fra', 'ara', 'kor'],
      language_config: {
        eng: {
          lang_en: 'English',
          "iso-639-1": 'en',
        },
        fra: {
          lang_en: 'French',
          "iso-639-1": 'fr',
        },
        ara: {
          lang_en: 'Arabic',
          "iso-639-1": 'ar',
        },
        kor: {
          lang_en: 'Korean',
          "iso-639-1": 'ko',
        },
      }
    };

    logger?.log("RDF: Template context", ctx);

    const renderedRDF: string = await liquidEngine.render(rdfTemplateInstance, ctx);

    logger?.log("RDF: Rendered as", renderedRDF);

    return await getBlob(renderedRDF);
  },
};


export default RDFExport;


const RDF_TEMPLATE = `
{%- assign concept = localized_concept_data["eng"] -%}
{%- assign rdfprofile = "/api/rdf-profile" -%}
{%- assign concept_id = page_url -%}
{%- assign english = localized_concept_data["eng"] -%}
# baseURI: "{{ concept_id }}"
# imports: http://purl.org/dc/terms/
# imports: https://www.geolexica.org/api/rdf-profile
# imports: http://www.w3.org/2004/02/skos/core

@prefix : <{{ concept_id }}> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdf-profile: <{{ rdfprofile }}#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<{{ concept_id }}>
  rdf:type owl:Ontology ;
  owl:imports dcterms: ;
  owl:imports <{{ rdfprofile }}> ;
  owl:imports <http://www.w3.org/2004/02/skos/core> ;
.
:closure
  rdf:type skos:Concept ;

{%- if concept.data.authoritative_source.link %}
  dcterms:source "{{ concept.data.authoritative_source.link }}" ;
{%- endif %}

{%- for lang in languages %}
{%- assign localized_term = localized_concept_data[lang].data -%}
{%- if localized_term.terms.size > 0 %}
  rdf-profile:{{ lang }}Origin rdf-profile:{{ language_config[lang].lang_en }} ;
{%- endif %}
{%- endfor %}
  rdf-profile:termID <{{ page.url }}> ;
  rdfs:label "{{ english.terms.first.designation | escape }}" ;
  skos:notation {{ page.itemid }} ;
{%- for lang in languages %}
{%- assign localized_term = localized_concept_data[lang].data -%}
{%- if localized_term.definition %}
  skos:definition "{{ localized_term.definition | escape }}"@{{ language_config[lang].iso-639-1 }} ;
{%- endif %}
{%- endfor %}
  skos:inScheme rdf-profile:GeolexicaConceptScheme ;

{%- for lang in languages %}
{%- assign localized_term = localized_concept_data[lang].data -%}
{%- for term in localized_term.terms %}
{%- if forloop.first %}
  skos:prefLabel "{{ term.designation | escape }}"@{{ language_config[lang].iso-639-1 }} ;
{%- else %}
  skos:altLabel "{{ term.designation | escape }}"@{{ language_config[lang].iso-639-1 }} ;
{%- endif %}
{%- endfor %}
{%- endfor %}

{%- if concept.dateAccepted %}
  dcterms:dateAccepted "{{ concept.dateAccepted | date: "%F" }}" ;
{%- endif %}

{%- if concept.dateAmended %}
  dcterms:modified "{{ concept.dateAmended | date: "%F" }}" ;
{%- endif %}

{%- if concept.status %}
  :status "{{ concept.status | escape }}" ;
{%- endif %}

{%- if concept.data.terms.first.normative_status %}
  :classification "{{ concept.data.terms.first.normative_status | escape }}" ;
{%- endif %}
.
:linked-data-api
  rdf:type dcterms:MediaTypeOrExtent ;
  skos:prefLabel "linked-data-api" ;
.
`;
interface RDFTemplateContext {
  page_url: string
  localized_concept_data: {
    [langCode: string]: RegisterItem<LocalizedConceptData>,
  }
  languages: string[] // ordered language keys
  language_config: { // language config per language key
    [langCode: string]: {
      lang_en: string
      'iso-639-1': string
    }
  }
}
const liquidEngine = new Liquid();
const rdfTemplateInstance = liquidEngine.parse(RDF_TEMPLATE);


function stripLeadingSlash(aPath: string): string {
  return aPath.replace(/^\//, '');
}

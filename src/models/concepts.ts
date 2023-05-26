import type { StandardRef, StandardClause } from './standards';
import type { SupportedLanguage } from './lang';


/* Concepts */

export const PARENT_RELATIONSHIP = 'parent' as const;

/** Relation as defined by terminology manager. */
export type ConceptRelation =
  { type: string, to: ConceptRef };

/** Reverse relation inferred at runtime. */
export type IncomingConceptRelation =
  { type: string, from: ConceptRef };




/** @deprecated RegistryKit covers this now. */
export const LIFECYCLE_STAGES = [
  'Proposal',
  'Evaluation',
  'Validation',
  'Rejected',
  'Withdrawn',
  'Resolved',
  'Extended procedure',
  'Test',
  'Draft',
] as const;

/** @deprecated RegistryKit covers this now. */
export type LifecycleStage = typeof LIFECYCLE_STAGES[number];


export interface Concept<Ref extends ConceptRef, Lang extends SupportedLanguage> {
  id: Ref
  language_code: Lang
  entry_status: ConceptStatus

  /** @deprecated RegistryKit covers this now. */
  lifecycle_stage?: LifecycleStage
  terms: Designation[]

  /**
   * @deprecated this is part of legacy schema.
   */
  domain?: string

  //subject_field: SubjectFieldLabel

  usageInfo?: string

  // Superfluous in current data schema,
  // which allows only one designation per concept,
  // which would hence be the preferred one.
  // When designations are decoupled from concept,
  // there may be preferred and non-preferred designations.
  //is_preferred: boolean

  definition: string
  notes: Note[]
  examples: Example[]

  // These apply to the definition.

  authoritative_source: AuthoritativeSource

  //lineage_source: LineageSource

  /** @deprecated legacy schema, RegistryKit/proposal history should cover it. */
  date_accepted?: Date

  /** @deprecated legacy schema. */
  release?: string


  // Deprecated:

  //classification?: 'preferred'

  review_date?: Date
  review_status?: string
  review_decision?: 'accepted' | 'rejected'

  lineage_source?: string
  lineage_source_similarity?: number
}


interface AuthoritativeSourceRelationship {
  type: 'identical' | 'modified'
  modificiation?: string
}


/**
 * Currently all properties of authoritative source are optional,
 * but either ref & clause or link must be present.
 */
export type AuthoritativeSource = {
  ref?: StandardRef
  clause?: StandardClause
  link?: string
  original?: string
  relationship?: AuthoritativeSourceRelationship
}


export type SubjectFieldLabel = string;

/** A string that can contain HTML markup. */
type Note = string;

/** A string that can contain HTML markup. */
type Example = string;

type ConceptStatus = 'retired' | 'valid' | 'superseded' | 'proposed'

export type ConceptRef = number;


// Misc.

/** @deprecated */
export interface ConceptCollection {
  id: string
  // ID is global across all collections,
  // regardless of nesting

  creatorEmail?: string

  parentID?: string
  // May not be supported in the widget initially.

  label: string
  items: ConceptRef[]
}

// type GitHash = string;


/* Designations */

/** A designation is also known as a term. */
export type Designation = {
  designation: string
  normative_status?: NormativeStatus
} & TypedDesignation;

/** Whether a designation is preferred. */
// TODO: This clashes with register item status. Should it be reused?
export const NORMATIVE_STATUS_CHOICES = [
  'preferred',
  'admitted',
  'deprecated',
] as const;
export type NormativeStatus = typeof NORMATIVE_STATUS_CHOICES[number];

export type TypedDesignation = Symbol | Expression | Prefix;

/**
 * IMPORTANT: Changing order of designation types
 * REQUIRES changing corresponding types following.
 */
// TODO: Refactor these types to avoid this order specificity
export const DESIGNATION_TYPES = [
  'expression',
  'symbol',
  'prefix',
] as const;
export type DesignationType = typeof DESIGNATION_TYPES[number];
type Symbol = { type: typeof DESIGNATION_TYPES[1] }
type Prefix = { type: typeof DESIGNATION_TYPES[2] }
export type Expression = { type: typeof DESIGNATION_TYPES[0] } & Usage & Grammar

type Usage = {
  geographicalArea?: string
}

type Grammar = {
  /** Alternate forms are NOT synonyms; rather variations of number/tense etc. */
  alternateForms?: string[]
  isAbbreviation?: true
} & (Noun | Verb | Adjective | Adverb | { partOfSpeech?: undefined })
// {} is for unknown part of speech.

export type Noun = {
  partOfSpeech: 'noun'

  // Doesn’t have to be explicit for singulars, unless circumstances require?
  grammaticalNumber?: 'plural' | 'singular' | 'mass'

  gender?: 'masculine' | 'feminine' | 'common' | 'neuter'
}

type Verb = {
  partOfSpeech: 'verb'
}

type MaybeParticiple = {
  isParticiple?: true
}

type Adjective = MaybeParticiple & {
  partOfSpeech: 'adjective'
}

type Adverb = MaybeParticiple & {
  partOfSpeech: 'adverb'
}

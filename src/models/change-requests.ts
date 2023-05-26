/* Specific */

export type LCStageInPreparation = 'Draft';
export type LCStageInReview = 'Proposal' | 'Evaluation' | 'Validation' | 'Extended procedure';
export type LCStageArchived = 'Resolved' | 'Withdrawn' | 'Rejected';
export type LCStage = LCStageInPreparation | LCStageInReview | LCStageArchived | 'Test';

export const LIFECYCLE_STAGES_IN_PREPARATION: readonly LCStageInPreparation[] = [
  'Draft',
] as const;

export const LIFECYCLE_STAGES_IN_REVIEW: readonly LCStageInReview[] = [
  'Proposal',
  'Evaluation',
  'Validation',
  'Extended procedure',
] as const;

export const LIFECYCLE_STAGES_SUCCESS: readonly LCStageArchived[] = [
  'Resolved',
] as const;

export const LIFECYCLE_STAGES_ARCHIVED: readonly LCStageArchived[] = [
  'Resolved',
  'Withdrawn',
  'Rejected',
] as const;

export const LIFECYCLE_STAGES: readonly LCStage[] = [
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

export interface RegistryMeta {
  stage: typeof LIFECYCLE_STAGES[number]
}

export interface SubmitterMeta {
  primaryPerson: {
    name: string
    affiliation: string
    email: string
  }
}

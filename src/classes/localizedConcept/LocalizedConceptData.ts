import {
  AuthoritativeSource,
  Designation
} from '../../models/concepts';


export interface LocalizedConceptData {
  terms: Designation[];
  usageInfo?: string;
  definition: string;
  notes: string[];
  examples: string[];
  authoritative_source: AuthoritativeSource[];
}

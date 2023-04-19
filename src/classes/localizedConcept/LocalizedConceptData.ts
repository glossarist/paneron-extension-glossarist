import type { AuthoritativeSource, Designation } from '../../models/concepts';


export interface LocalizedConceptData {
  terms: Designation[];
  usageInfo?: string;
  definition: string;
  notes: string[];
  examples: string[];
  authoritativeSource: AuthoritativeSource[];
}


export default LocalizedConceptData;

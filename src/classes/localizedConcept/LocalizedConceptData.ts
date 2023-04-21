import type { AuthoritativeSource, Designation } from '../../models/concepts';
import type { SupportedLanguage } from '../../models/lang';


export interface LocalizedConceptData {
  terms: Designation[];
  language_code: SupportedLanguage;
  usageInfo?: string;
  definition: string;
  notes: string[];
  examples: string[];
  authoritativeSource: AuthoritativeSource[];
}


export default LocalizedConceptData;

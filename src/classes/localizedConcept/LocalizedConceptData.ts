import type { AuthoritativeSource, Designation } from '../../models/concepts';
import type { SupportedLanguage } from '../../models/lang';


export interface LocalizedConceptData {
  terms: Designation[];
  language_code: SupportedLanguage;
  usageInfo?: string;
  definition: { content: string }[];
  notes: { content: string }[];
  examples: { content: string }[];
  authoritativeSource: AuthoritativeSource[];
}


export default LocalizedConceptData;

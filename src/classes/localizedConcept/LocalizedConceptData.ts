import type { AuthoritativeSource, Designation } from '../../models/concepts';
import type { SupportedLanguage } from '../../models/lang';


/** Represents a description of a concept in a particular language. */
export interface LocalizedConceptData {
  terms: Readonly<Designation[]>;
  language_code: SupportedLanguage;
  usageInfo?: string;
  definition: Readonly<{ content: string }[]>;
  notes: Readonly<{ content: string }[]>;
  examples: Readonly<{ content: string }[]>;
  authoritativeSource: Readonly<AuthoritativeSource[]>;
}


export default LocalizedConceptData;

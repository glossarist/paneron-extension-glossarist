export const defaultLanguage = 'eng' as const;

export const availableLanguageIDs = [
  'eng',
  'ara',
  'zho',
  'dan',
  'nld',
  'fin',
  'fra',
  'fre',
  'deu',
  'jpn',
  'kor',
  'msa',
  'pol',
  'rus',
  'spa',
  'swe',
  'ces',
  'ita',
  'nno',
  'nob',
  'por',
  'slv',
  'srp',
] as const;

export const languageTitles:
{ [langID in typeof availableLanguageIDs[number]]: string } = {
  'eng': 'English',
  'ara': 'Arabic',
  'zho': 'Chinese',
  'dan': 'Danish',
  'nld': 'Dutch',
  'fin': 'Finnish',
  'fra': 'French',
  'fre': 'French (fre)',
  'deu': 'German',
  'jpn': 'Japanese',
  'kor': 'Korean',
  'msa': 'Malay',
  'pol': 'Polish',
  'rus': 'Russian',
  'spa': 'Spanish',
  'swe': 'Swedish',
  'ces': 'Czech',
  'ita': 'Italian',
  'nno': 'Norwegian Nynorsk',
  'nob': 'Norwegian Bokmål',
  'por': 'Portuguese',
  'slv': 'Slovenian',
  'srp': 'Serbian',
} as const;

const writingDirectionalityOverrides:
Partial<{ [langID in SupportedLanguage]: WritingDirectionality }> = {
  'ara': 'RTL',
};
type WritingDirectionality = 'LTR' | 'RTL' | 'TBRL';
function getHTMLDir(wd: WritingDirectionality): 'rtl' | 'ltr' {
  if (wd === 'RTL') {
    return 'rtl';
  } else {
    return 'ltr';
  }
}
export function getHTMLDirForLanguage(langCode: SupportedLanguage): string {
  return getHTMLDir(
    writingDirectionalityOverrides[langCode ?? defaultLanguage]
    ?? ('LTR' as WritingDirectionality))
}

export const priorityLanguages:
(typeof availableLanguageIDs[number])[] = [
  'eng',
  'fra',
];

export const nonPriorityLanguages =
  availableLanguageIDs.filter(lang => priorityLanguages.indexOf(lang) < 0);

export type SupportedLanguage = typeof availableLanguageIDs[number];

export type AuthoritativeLanguage = typeof defaultLanguage;

export type OptionalLanguage = Exclude<SupportedLanguage, AuthoritativeLanguage>;

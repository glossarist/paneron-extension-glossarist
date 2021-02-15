export const defaultLanguage = 'eng' as const;

export const availableLanguageIDs = [
  'eng',
  'ara',
  'zho',
  'dan',
  'nld',
  'fin',
  'fra',
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

export const availableLanguages:
{ [langID in typeof availableLanguageIDs[number]]: string } = {
  'eng': 'English',
  'ara': 'Arabic',
  'zho': 'Chinese',
  'dan': 'Danish',
  'nld': 'Dutch',
  'fin': 'Finnish',
  'fra': 'French',
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

export const priorityLanguages:
(typeof availableLanguageIDs[number])[] = [
  'eng',
  'fra',
];

export const nonPriorityLanguages =
  availableLanguageIDs.filter(lang => priorityLanguages.indexOf(lang) > 0);

const rtlLanguages:
(typeof availableLanguageIDs[number])[] = [
  'ara',
];

export type SupportedLanguages = typeof availableLanguages;

export type AuthoritativeLanguage = typeof defaultLanguage;

export type OptionalLanguages = Omit<SupportedLanguages, AuthoritativeLanguage>;

export function isRTL(lang: keyof typeof availableLanguages) {
  return rtlLanguages.indexOf(lang) >= 0;
}

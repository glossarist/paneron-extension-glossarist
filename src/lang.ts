export const defaultLanguage = 'eng';


export function isRTL(lang: keyof typeof availableLanguages) {
  return lang === 'ara';
}


export const availableLanguages = {
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

// lib/auditorySequentialConstants.js

// Practice sequences - shorter and simpler
export const practiceForwardSequence = [2, 7]
export const practiceReverseSequence = [5, 3]

export const forwardSequences = [
  [4, 9],
  [3, 8],
  [7, 1, 2],
  [2, 6, 2],
  [6, 3, 5, 1],
  [1, 4, 5, 2],
  [2, 7, 4, 6, 9],
  [2, 4, 7, 1, 6],
  [6, 9, 1, 8, 3, 7],
  [1, 4, 5, 4, 7, 6],
]

export const reverseSequences = [
  [7, 5],
  [2, 7],
  [5, 2, 7],
  [0, 1, 9],
  [4, 7, 3, 5],
  [1, 6, 8, 5],
  [1, 7, 5, 0, 4],
  [3, 5, 2, 1, 7],
  [8, 3, 9, 7, 5, 3],
  [1, 4, 0, 4, 7, 2],
]

export const digitMapEn = {
  // Standard digit words
  zero: "0",
  oh: "0",
  o: "0",
  one: "1",
  won: "1",
  two: "2",
  too: "2",
  to: "2",
  three: "3",
  four: "4",
  for: "4",
  five: "5",
  six: "6",
  sex: "6",
  seven: "7",
  eight: "8",
  ate: "8",
  nine: "9",
  nein: "9",
  
  // Common speech recognition misheard variants
  "0": "0",
  "1": "1", 
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  
  // Additional common mishears
  tree: "3",
  free: "3",
  fore: "4",
  foe: "4",
  fife: "5",
  sicks: "6",
  sick: "6",
  heaven: "7",
  ate: "8",
  hate: "8",
  knight: "9",
  night: "9",
};

// Hindi mappings (Devanagari + common Roman transliterations)
// Additional helper arrays for Devanagari stripping diacritics will be handled in parseTranscript, but we include common spelling variants here
export const digitMapHi = {
  // Zero variants
  "शून्य": "0",
  "सुन्ना": "0",
  "सुन्या": "0",
  "सूना": "0",
  "सून्या": "0",
  sunya: "0",
  shunya: "0",
  suna: "0",
  sunna: "0",
  zero: "0",
  "ज़ीरो": "0",
  "जीरो": "0",
  "जेरो": "0",
  shoonya: "0",
  
  // One variants
  ek: "1",
  "एक": "1",
  "इक": "1",
  ik: "1",
  eka: "1",
  "एकम्": "1",
  "एका": "1",
  
  // Two variants
  do: "2",
  "दो": "2",
  "दू": "2",
  "दौ": "2",
  doo: "2",
  dao: "2",
  "द्वि": "2",
  dwi: "2",
  
  // Three variants
  teen: "3",
  tin: "3",
  "तीन": "3",
  "तिन": "3",
  "ती": "3",
  "त्री": "3",
  treen: "3",
  tri: "3",
  "त्रि": "3",
  "तेन": "3",
  
  // Four variants - including चर and similar sounding words
  char: "4",
  chaar: "4",
  "चार": "4",
  "चर": "4",  // Adding the variant you mentioned
  "चारो": "4",
  "चाहर": "4",
  "छार": "4",
  "चत्वार": "4",
  "चतुर": "4",
  chhaar: "4",
  cchar: "4",
  chatwar: "4",
  chatur: "4",
  // More artifacts and variants
  "चारनौ": "4", // In case "चार नौ" gets concatenated
  "चारनऊ": "4",
  "char नौ": "4",
  
  // Five variants
  paanch: "5",
  "पांच": "5",
  "पाँच": "5",
  "पाच": "5",
  "पान्च": "5",
  "पंच": "5",
  "पञ्च": "5",
  panch: "5",
  pach: "5",
  punch: "5",
  "पांच": "5",
  // More artifacts - handle "पाँच सात" cases
  "पांचसात": "5 7", // In case they get concatenated  
  "पाँचसात": "5 7",
  "paanchsaat": "5 7",
  "panch सात": "5 7",
  "पाँच सात": "5 7", // Exact match for user's case
  
  // Six variants
  chhe: "6",
  chhah: "6",
  "छह": "6",
  "छे": "6",
  "छः": "6",
  "चे": "6",
  "षष्": "6",
  che: "6",
  cheh: "6",
  "छ": "6",
  
  // Seven variants - including साथ (saath) which sounds exactly the same
  saat: "7",
  sat: "7",
  saath: "7",
  "सात": "7",
  "साथ": "7",  // Adding साथ which sounds exactly the same as सात
  "सत": "7",
  "साट": "7",
  "सआत": "7",
  "सअत": "7",
  "सप्त": "7",
  sath: "7",
  sapt: "7",
  "सात्": "7",
  // Handle combinations with other numbers
  "साथनौ": "7", // In case "साथ नौ" gets combined
  "saatनौ": "7",
  "सातनौ": "7",
  
  // Eight variants
  aath: "8",
  ath: "8",
  "आठ": "8",
  "अठ": "8",
  "आट": "8",
  "अट": "8",
  "आत": "8",
  "अष्ट": "8",
  aat: "8",
  att: "8",
  asht: "8",
  "आष्ट": "8",
  
  // Nine variants
  nau: "9",
  "नौ": "9",
  "नो": "9",
  "नव": "9",
  "नौ": "9",
  "नवम्": "9",
  no: "9",
  now: "9",
  nav: "9",
  "न": "9",
  // Handle the specific case from user's example
  "चारनौ": "4 9", // Special case for concatenated चार नौ
  "nauचार": "9 4", // Reverse order
  
  // Additional common mishears and variants
  "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", 
  "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
  
  // Ordinal variants that might be picked up
  "पहला": "1", "दूसरा": "2", "तीसरा": "3", "चौथा": "4", "पांचवा": "5",
  "छठा": "6", "सातवां": "7", "आठवां": "8", "नौवां": "9",
};

// Kannada mappings (Kannada script + common Roman transliterations)
export const digitMapKn = {
  // Zero variants
  "ಸೊನ್ನೆ": "0",
  "ಶೂನ್ಯ": "0",
  "ಸೊನ್": "0",
  "ಸೊನೆ": "0",
  "ಸುನ್ನ": "0",
  "ಸೂನ್ಯ": "0",
  sonne: "0",
  shunya: "0",
  sonna: "0",
  sunna: "0",
  "ಸೊ": "0",
  
  // One variants
  ondu: "1",
  "ಒಂದು": "1",
  "ಒಂದ": "1",
  "ಒಂಟು": "1",
  "ಒಂತು": "1",
  "ಒಂದೂ": "1",
  "ಒಂದೇ": "1",
  ond: "1",
  ontu: "1",
  "ಒ": "1",
  
  // Two variants
  eradu: "2",
  "ಎರಡು": "2",
  "ಇರಡು": "2",
  "ಎರದು": "2",
  "ಎರಾಡು": "2",
  "ಎರಡೇ": "2",
  "ಎರಡೂ": "2",
  iradu: "2",
  eraadu: "2",
  "ಎ": "2",
  
  // Three variants
  mooru: "3",
  "ಮೂರು": "3",
  "ಮೂರ": "3",
  "ಮೋರು": "3",
  "ಮುರು": "3",
  "ಮೂರೇ": "3",
  "ಮೂರೂ": "3",
  "ಮೂ": "3",
  muru: "3",
  moru: "3",
  "ಮ": "3",
  
  // Four variants
  naalku: "4",
  "ನಾಲ್ಕು": "4",
  "ನಾಲ್ಕ": "4",
  "ನಾಲು": "4",
  "ನಾಲಕು": "4",
  "ನಾಲ್": "4",
  "ನಾಲ್ಕೇ": "4",
  "ನಾಲ್ಕೂ": "4",
  nalku: "4",
  naalu: "4",
  nalaku: "4",
  "ನಾ": "4",
  
  // Five variants
  aidu: "5",
  "ಐದು": "5",
  "ಐದ": "5",
  "ಅಯ್ದು": "5",
  "ಐತು": "5",
  "ಐದೇ": "5",
  "ಐದೂ": "5",
  "ಐ": "5",
  aydu: "5",
  aidhu: "5",
  
  // Six variants
  aaru: "6",
  "ಆರು": "6",
  "ಆರ": "6",
  "ಅರು": "6",
  "ಅಾರು": "6",
  "ಆರೇ": "6",
  "ಆರೂ": "6",
  "ಆ": "6",
  aru: "6",
  aur: "6",
  
  // Seven variants
  elu: "7",
  "ಏಳು": "7",
  "ಏಳ": "7",
  "ಇಳು": "7",
  "ಎಳು": "7",
  "ಯೇಳು": "7",
  "ಏಳೇ": "7",
  "ಏಳೂ": "7",
  "ಏ": "7",
  ilu: "7",
  yelu: "7",
  
  // Eight variants
  entu: "8",
  "ಎಂಟು": "8",
  "ಎಂಟ": "8",
  "ಇಂಟು": "8",
  "ಎಂತು": "8",
  "ಎಟು": "8",
  "ಎಂಟೇ": "8",
  "ಎಂಟೂ": "8",
  "ಎಂ": "8",
  intu: "8",
  etu: "8",
  
  // Nine variants
  ombattu: "9",
  "ಒಂಬತ್ತು": "9",
  "ಒಂಬತ್ತ": "9",
  "ಒಂಬತು": "9",
  "ಒಮ್ಬತ್ತು": "9",
  "ಒಂಬತ್": "9",
  "ಒಂಬತ್ತೇ": "9",
  "ಒಂಬತ್ತೂ": "9",
  "ಒಂ": "9",
  ombathu: "9",
  ommbattu: "9",
  ombatu: "9",
  
  // Kannada numerals
  "೦": "0", "೧": "1", "೨": "2", "೩": "3", "೪": "4", 
  "೫": "5", "೬": "6", "೭": "7", "೮": "8", "೯": "9",
  
  // Ordinal variants that might be picked up
  "ಮೊದಲ": "1", "ಎರಡನೇ": "2", "ಮೂರನೇ": "3", "ನಾಲ್ಕನೇ": "4", "ಐದನೇ": "5",
  "ಆರನೇ": "6", "ಏಳನೇ": "7", "ಎಂಟನೇ": "8", "ಒಂಬತ್ತನೇ": "9",
  
  // Common mishears
  "ಒಂದೋ": "1", "ಎರಡೋ": "2", "ಮೂರೋ": "3", "ನಾಲೋ": "4", "ಐದೋ": "5",
  "ಆರೋ": "6", "ಏಳೋ": "7", "ಎಂಟೋ": "8", "ಒಂಬೋ": "9",
};

export const getDigitMap = (lang) => {
  if (lang === "hi") {
    return { ...digitMapEn, ...digitMapHi };
  }
  if (lang === "kn") {
    return { ...digitMapEn, ...digitMapKn };
  }
  return digitMapEn;
};

// Backward compatibility for existing imports
export const digitMap = digitMapEn;

export const dialogContent = [
  "🎶 Namaste, traveler. I am Svarini, the voice of the river and guardian of Svara Gufa.",
  "🌊 These caves sing with the melodies of the ages — carved in stone, whispered in water.",
  "🎵 Listen carefully... the echoes will sing a pattern. You must repeat it, note for note.",
  "🪷 If your memory flows as true as the river, you shall earn the Shell of Memory and the Whispering Horn.",
  "✨ Close your eyes, open your ears... and let the music guide your soul.",
]

export const DIGIT_DISPLAY_TIME = 1000
export const PAUSE_BETWEEN_DIGITS = 200
export const MAX_ERRORS = 2

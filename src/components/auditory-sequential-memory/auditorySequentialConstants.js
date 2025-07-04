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
};

// Hindi mappings (Devanagari + common Roman transliterations)
// Additional helper arrays for Devanagari stripping diacritics will be handled in parseTranscript, but we include common spelling variants here
export const digitMapHi = {
  "शून्य": "0",
  "सुन्ना": "0",
  "सुन्या": "0",
  sunya: "0",
  shunya: "0",
  ek: "1",
  "एक": "1",
  do: "2",
  "दो": "2",
  teen: "3",
  tin: "3",
  "तीन": "3",
  char: "4",
  chaar: "4",
  "चार": "4",
  paanch: "5",
  "पांच": "5",
  "पाँच": "5",
  "पाच": "5",
  panch: "5",
  pach: "5",
  chhe: "6",
  chhah: "6",
  "छह": "6",
  saat: "7",
  sat: "7",
  saath: "7",
  "सात": "7",
  aath: "8",
  ath: "8",
  "आठ": "8",
  nau: "9",
  "नौ": "9",
  zero: "0",
  "ज़ीरो": "0",
  "जीरो": "0",
  shoonya: "0",
};

// Kannada mappings (Kannada script + common Roman transliterations)
export const digitMapKn = {
  "ಸೊನ್ನೆ": "0",
  "ಶೂನ್ಯ": "0",
  sonne: "0",
  shunya: "0",
  ondu: "1",
  "ಒಂದು": "1",
  eradu: "2",
  "ಎರಡು": "2",
  mooru: "3",
  "ಮೂರು": "3",
  naalku: "4",
  "ನಾಲ್ಕು": "4",
  aidu: "5",
  "ಐದು": "5",
  aaru: "6",
  "ಆರು": "6",
  elu: "7",
  "ಏಳು": "7",
  entu: "8",
  "ಎಂಟು": "8",
  ombattu: "9",
  "ಒಂಬತ್ತು": "9",
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

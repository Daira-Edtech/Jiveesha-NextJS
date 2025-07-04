// Test script for transcript parsing

const { getDigitMap } = require('./src/components/auditory-sequential-memory/auditorySequentialConstants.js');

function parseTranscriptTest(transcriptInput, language = "hi") {
  if (!transcriptInput || transcriptInput.trim() === "") {
    return []
  }

  let processedTranscript = transcriptInput
    .toLowerCase()
    // Handle newlines and multiple artifacts
    .replace(/\n/g, " ")
    .replace(/\r/g, " ")
    // Remove common speech recognition artifacts and prefixes (more comprehensive)
    .replace(/you\s*said\s*:?\s*/gi, "")
    .replace(/user\s*said\s*:?\s*/gi, "")
    .replace(/transcript\s*:?\s*/gi, "")
    .replace(/result\s*:?\s*/gi, "")
    .replace(/speech\s*:?\s*/gi, "")
    .replace(/recognized\s*:?\s*/gi, "")
    .replace(/output\s*:?\s*/gi, "")
    .replace(/text\s*:?\s*/gi, "")
    .replace(/listening\s*:?\s*/gi, "")
    .replace(/heard\s*:?\s*/gi, "")
    // Remove quotes and speech marks
    .replace(/["'"`''""]/g, "")
    // Remove punctuation but keep spaces
    .replace(/[.,!?:;()[\]{}]/g, " ")
    // Remove common Hindi diacritics that might confuse matching
    .replace(/[ंँः]/g, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim()

  console.log("Original transcript:", transcriptInput)
  console.log("Processed transcript:", processedTranscript)

  // Replace word numbers with digits based on current language
  const currentDigitMap = getDigitMap(language);
  
  // Sort by length (longest first) to avoid partial matches
  const sortedWords = Object.keys(currentDigitMap).sort((a, b) => b.length - a.length);

  for (const word of sortedWords) {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Use word boundaries for exact matching, but also try without for partial words
    const regexWithBoundary = new RegExp(`\\b${escapedWord}\\b`, "gi");
    const regexWithoutBoundary = new RegExp(escapedWord, "gi");
    
    if (processedTranscript.match(regexWithBoundary)) {
      processedTranscript = processedTranscript.replace(regexWithBoundary, ` ${currentDigitMap[word]} `);
    } else if (processedTranscript.match(regexWithoutBoundary)) {
      processedTranscript = processedTranscript.replace(regexWithoutBoundary, ` ${currentDigitMap[word]} `);
    }
  }

  console.log("After word replacement:", processedTranscript)

  // Extract digits and clean up - now supporting multi-digit mappings
  let finalResult = processedTranscript
    .split(/\s+/) // Split by spaces
    .filter(token => token.trim() !== "") // Remove empty tokens
    .map(token => {
      // Check if token is already a digit sequence (like "5 7")
      if (/^[\d\s]+$/.test(token)) {
        return token.split(/\s+/).filter(d => /^\d$/.test(d)).map(Number);
      }
      // Check if token is a single digit
      if (/^\d$/.test(token)) {
        return [Number(token)];
      }
      return [];
    })
    .flat() // Flatten the array
    .filter(num => !isNaN(num)); // Remove any NaN values

  console.log("Final result:", finalResult)

  if (finalResult.length > 0) {
    return finalResult;
  }

  // Fallback: try to extract just digits
  const numbersAndSpaces = processedTranscript.replace(/[^\d\s]/g, " ")
  const cleaned = numbersAndSpaces.trim().replace(/\s+/g, " ")

  console.log("Fallback cleaned numbers:", cleaned)

  if (cleaned === "") {
    console.log("No digits found")
    return []
  }

  // Try space-separated first
  const spaceSplit = cleaned.split(" ").filter((s) => s !== "" && /^\d$/.test(s))
  if (spaceSplit.length > 0) {
    const result = spaceSplit.map(Number)
    console.log("Space-separated result:", result)
    return result
  }

  // Try concatenated digits
  const concatenated = cleaned.replace(/\s+/g, "")
  if (concatenated.length > 0 && /^\d+$/.test(concatenated)) {
    const result = concatenated.split("").map(Number)
    console.log("Concatenated result:", result)
    return result
  }

  console.log("No valid digits found")
  return []
}

// Test with the user's exact input
console.log("=== Testing user's input ===");
const userInput = "youSaid:\nचार नौyouSaid:\nपाँच सात";
const result = parseTranscriptTest(userInput, "hi");
console.log("Expected: [4, 9] or [5, 7]");
console.log("Got:", result);

console.log("\n=== Testing individual parts ===");
console.log("Testing 'चार नौ':");
console.log(parseTranscriptTest("चार नौ", "hi"));

console.log("Testing 'पाँच सात':");
console.log(parseTranscriptTest("पाँच सात", "hi"));

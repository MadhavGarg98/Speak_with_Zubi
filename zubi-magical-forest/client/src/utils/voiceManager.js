/**
 * Intelligent Voice Manager for Hindi + English speech synthesis
 * - Detects language dynamically
 * - Removes emojis and decorative symbols
 * - Prevents overlapping speech
 * - Smooth voice tuning
 */

// Hindi Unicode range detection
const HINDI_REGEX = /[\u0900-\u097F]/;

/**
 * Clean text for speech synthesis:
 * - Remove emojis and extended pictographics
 * - Remove decorative symbols (stars, sparkles, etc.)
 * - Normalize whitespace
 */
export function cleanTextForSpeech(text) {
  return text
    // Remove emoji presentation and extended pictographic
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    // Remove common decorative unicode symbols
    .replace(/[\u2700-\u27BF\u2600-\u26FF\u2B50-\u2B55\u2728\u2764\u2665\u2666\u2663\u2660]/g, "")
    // Remove variation selectors
    .replace(/[\uFE00-\uFE0F]/g, "")
    // Remove zero-width joiners
    .replace(/\u200D/g, "")
    // Normalize multiple spaces/newlines
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Detect dominant language of text
 * Returns: "hi-IN" for Hindi, "en-IN" for English/Hinglish
 */
export function detectLanguage(text) {
  const cleaned = text.replace(/[^a-zA-Z\u0900-\u097F]/g, "");
  if (!cleaned) return "en-IN";

  let hindiChars = 0;
  let totalChars = cleaned.length;

  for (const char of cleaned) {
    if (HINDI_REGEX.test(char)) {
      hindiChars++;
    }
  }

  const hindiRatio = hindiChars / totalChars;
  // If more than 40% Hindi characters, use Hindi voice
  return hindiRatio > 0.4 ? "hi-IN" : "en-IN";
}

/**
 * Cancel any ongoing speech immediately
 */
export function cancelSpeech() {
  window.speechSynthesis.cancel();
}

/**
 * Speak text with intelligent language detection and voice tuning
 * @param {string} text - Raw text to speak
 * @param {function} onStart - Called when speech begins
 * @param {function} onEnd - Called when speech ends
 * @returns {SpeechSynthesisUtterance} The utterance object
 */
export function speak(text, { onStart, onEnd } = {}) {
  // Cancel any previous speech to prevent overlapping
  cancelSpeech();

  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText) {
    onEnd?.();
    return null;
  }

  const lang = detectLanguage(cleanedText);
  const utterance = new SpeechSynthesisUtterance(cleanedText);

  utterance.lang = lang;
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  // Try to find the best matching voice
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    // Try exact lang match first
    let voice = voices.find(
      (v) => v.lang === lang && !v.localService === false
    );
    // Fallback to any voice starting with the lang prefix
    if (!voice) {
      const prefix = lang.split("-")[0];
      voice = voices.find((v) => v.lang.startsWith(prefix));
    }
    if (voice) {
      utterance.voice = voice;
    }
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
  return utterance;
}

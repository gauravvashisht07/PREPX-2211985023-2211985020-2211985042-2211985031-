/**
 * aiEvaluator.js (Backend Utility)
 * Advanced rule-based AI answer evaluator.
 * Evaluates userAnswer against the correctAnswer using:
 *   A. Text normalization
 *   B. Keyword extraction & matching from correctAnswer
 *   C. N-gram phrase similarity
 *   D. Length & structure quality checks
 *
 * Returns: { score: 0–10, feedback: string, suggestions: string }
 * No external API required.
 */

// ─────────────────────────────────────────────
//  A. TEXT NORMALIZATION
//  Strips punctuation, lowercases, trims whitespace
// ─────────────────────────────────────────────

/**
 * Normalize text for comparison:
 * lowercase → strip punctuation → collapse whitespace
 */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenize normalized text into individual words,
 * filtering out stopwords to focus on meaningful terms.
 */
const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'can', 'to',
  'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'it',
  'its', 'this', 'that', 'and', 'or', 'not', 'so', 'if', 'as',
  'each', 'all', 'both', 'more', 'also', 'than', 'then', 'when',
  'which', 'who', 'what', 'how', 'where', 'why', 'we', 'they',
]);

function tokenize(normalizedText) {
  return normalizedText
    .split(' ')
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

// ─────────────────────────────────────────────
//  B. KEYWORD EXTRACTION & MATCHING
//  Extract unique content keywords from the correct answer,
//  then count how many appear in the user's answer.
// ─────────────────────────────────────────────

function extractKeywords(text) {
  return [...new Set(tokenize(normalize(text)))];
}

/**
 * keywordMatchScore (max 4 pts)
 * Rewards coverage of correct-answer keywords in the user's answer.
 */
function scoreKeywordMatch(userNorm, correctKeywords) {
  if (correctKeywords.length === 0) return { pts: 2, matchedCount: 0, totalCount: 0, missingKeywords: [] };

  const matched = correctKeywords.filter(kw => userNorm.includes(kw));
  const ratio = matched.length / correctKeywords.length;
  const missing = correctKeywords.filter(kw => !userNorm.includes(kw)).slice(0, 5); // top 5 missing

  let pts = 0;
  if (ratio >= 0.8) pts = 4;
  else if (ratio >= 0.6) pts = 3;
  else if (ratio >= 0.4) pts = 2;
  else if (ratio >= 0.2) pts = 1;

  return { pts, matchedCount: matched.length, totalCount: correctKeywords.length, missingKeywords: missing };
}

// ─────────────────────────────────────────────
//  C. PHRASE SIMILARITY (Bigram overlap)
//  Compares consecutive word-pairs (bigrams) between
//  userAnswer and correctAnswer for semantic closeness.
// ─────────────────────────────────────────────

function buildBigrams(tokens) {
  const bigrams = new Set();
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.add(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bigrams;
}

/**
 * similarityScore (max 3 pts)
 * Measures phrase-level overlap using bigrams.
 */
function scoreSimilarity(userTokens, correctTokens) {
  const userBigrams = buildBigrams(userTokens);
  const correctBigrams = buildBigrams(correctTokens);

  if (correctBigrams.size === 0) return 1; // insufficient data, be lenient

  let overlapCount = 0;
  for (const bigram of correctBigrams) {
    if (userBigrams.has(bigram)) overlapCount++;
  }

  const ratio = overlapCount / correctBigrams.size;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.3) return 2;
  if (ratio >= 0.1) return 1;
  return 0;
}

// ─────────────────────────────────────────────
//  D. LENGTH & STRUCTURE QUALITY
// ─────────────────────────────────────────────

/**
 * lengthScore (max 2 pts)
 * Rewards thorough answers; penalizes very short ones.
 */
function scoreLength(userRaw) {
  const wordCount = userRaw.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount >= 60) return { pts: 2, wordCount };
  if (wordCount >= 30) return { pts: 1, wordCount };
  return { pts: 0, wordCount };
}

/**
 * structureBonus (max 1 pt)
 * Rewards use of commas, colons, bullets, numbering — signals organized thinking.
 */
function scoreStructure(userRaw) {
  const hasStructure =
    userRaw.includes(':') ||
    userRaw.includes(',') ||
    userRaw.includes('1.') ||
    userRaw.includes('•') ||
    /\d\.\s/.test(userRaw) ||
    userRaw.includes('-');
  return hasStructure ? 1 : 0;
}

// ─────────────────────────────────────────────
//  FEEDBACK + SUGGESTION GENERATOR
// ─────────────────────────────────────────────

function buildFeedback(score, wordCount, matchedCount, totalKeywords, similarityPts, structurePts) {
  const feedbackLines = [];

  // Overall verdict
  if (score >= 8) feedbackLines.push('✅ Excellent answer — well explained and matches key concepts.');
  else if (score >= 5) feedbackLines.push('⚡ Good answer, but needs more detail or coverage.');
  else feedbackLines.push('⚠️ Answer is weak or incomplete compared to the expected response.');

  // Keyword feedback
  const coverageRatio = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 100) : 0;
  feedbackLines.push(`📌 Keyword coverage: ${matchedCount}/${totalKeywords} key terms matched (${coverageRatio}%).`);

  // Similarity feedback
  if (similarityPts >= 2) feedbackLines.push('✅ Strong phrase-level match with the expected answer.');
  else if (similarityPts === 1) feedbackLines.push('Partial phrase match — some key ideas are present.');
  else feedbackLines.push('Low phrase overlap — answer diverges from expected concepts.');

  // Length feedback
  if (wordCount >= 60) feedbackLines.push(`✅ Good answer length (${wordCount} words).`);
  else if (wordCount >= 30) feedbackLines.push(`Answer is short (${wordCount} words) — more explanation would help.`);
  else feedbackLines.push(`Answer is very short (${wordCount} words) — insufficient depth.`);

  // Structure feedback
  if (structurePts === 1) feedbackLines.push('✅ Good structure — lists or punctuation aid clarity.');
  else feedbackLines.push('Adding structure (lists, colons) improves readability.');

  return feedbackLines.join('\n');
}

function buildSuggestions(score, missingKeywords, wordCount, structurePts) {
  const tips = [];

  if (missingKeywords.length > 0) {
    tips.push(`Include these important concepts: ${missingKeywords.map(k => `"${k}"`).join(', ')}.`);
  }
  if (wordCount < 30) {
    tips.push('Add more explanation and concrete examples to demonstrate understanding.');
  }
  if (structurePts === 0) {
    tips.push('Use bullet points or numbered lists to organize multi-part answers.');
  }
  if (score < 5) {
    tips.push('Study the model answer and rephrase key points in your own words.');
  }

  return tips.length > 0
    ? tips.join('\n')
    : '✅ No major issues. Review for conciseness and ensure all edge cases are covered.';
}

// ─────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────

/**
 * evaluateAnswer(question, userAnswer, correctAnswer)
 *
 * Combines keyword matching, phrase similarity, length, and structure
 * into a reliable 0–10 score with actionable feedback.
 *
 * @param {string} question     - The interview question text
 * @param {string} userAnswer   - The student's answer
 * @param {string} correctAnswer - The expected/reference answer
 * @returns {{ score: number, feedback: string, suggestions: string }}
 */
export function evaluateAnswer(question, userAnswer, correctAnswer) {
  // Normalize all inputs
  const userNorm = normalize(userAnswer);
  const correctNorm = normalize(correctAnswer);
  const userTokens = tokenize(userNorm);
  const correctTokens = tokenize(correctNorm);

  // Extract keywords from correct answer to use as ground truth
  const correctKeywords = extractKeywords(correctAnswer);

  // ── Score each dimension ──
  const keywordResult = scoreKeywordMatch(userNorm, correctKeywords);
  const similarityPts = scoreSimilarity(userTokens, correctTokens);
  const lengthResult = scoreLength(userAnswer);
  const structurePts = scoreStructure(userAnswer);

  // ── Aggregate: keyword(4) + similarity(3) + length(2) + structure(1) = 10 ──
  const rawScore = keywordResult.pts + similarityPts + lengthResult.pts + structurePts;
  const score = Math.min(Math.max(rawScore, 0), 10);

  return {
    score,
    feedback: buildFeedback(
      score,
      lengthResult.wordCount,
      keywordResult.matchedCount,
      keywordResult.totalCount,
      similarityPts,
      structurePts
    ),
    suggestions: buildSuggestions(
      score,
      keywordResult.missingKeywords,
      lengthResult.wordCount,
      structurePts
    ),
  };
}

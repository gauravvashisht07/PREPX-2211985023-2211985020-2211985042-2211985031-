/**
 * aiEvaluator.js (Backend Utility)
 * Mirror of the frontend evaluator — used by POST /api/ai/evaluate.
 *
 * Scoring model (total 10 pts):
 *   - Keyword match from correctAnswer   → max 4 pts
 *   - Bigram phrase similarity           → max 3 pts
 *   - Answer length                      → max 2 pts
 *   - Structural quality (lists, colons) → max 1 pt
 */

// ── Stopwords to filter from keyword extraction ──
const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'to', 'of', 'in', 'for', 'on', 'with',
  'at', 'by', 'from', 'it', 'its', 'this', 'that', 'and', 'or', 'not',
  'so', 'if', 'as', 'each', 'all', 'both', 'more', 'also', 'than', 'then',
  'when', 'which', 'who', 'what', 'how', 'where', 'why', 'we', 'they',
]);

// A. Normalize: lowercase + remove punctuation + collapse spaces
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Tokenize into meaningful words (remove stopwords and short words)
function tokenize(normalizedText) {
  return normalizedText
    .split(' ')
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

// B. Extract unique content keywords from a text
function extractKeywords(text) {
  return [...new Set(tokenize(normalize(text)))];
}

// B. Count how many keywords appear in the user's normalized answer
function scoreKeywordMatch(userNorm, correctKeywords) {
  if (correctKeywords.length === 0) return { pts: 2, matchedCount: 0, totalCount: 0, missingKeywords: [] };

  const matched = correctKeywords.filter(kw => userNorm.includes(kw));
  const ratio = matched.length / correctKeywords.length;
  const missing = correctKeywords.filter(kw => !userNorm.includes(kw)).slice(0, 5);

  let pts = 0;
  if (ratio >= 0.8) pts = 4;
  else if (ratio >= 0.6) pts = 3;
  else if (ratio >= 0.4) pts = 2;
  else if (ratio >= 0.2) pts = 1;

  return { pts, matchedCount: matched.length, totalCount: correctKeywords.length, missingKeywords: missing };
}

// C. Build bigrams (pairs of consecutive tokens) for phrase comparison
function buildBigrams(tokens) {
  const bigrams = new Set();
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.add(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bigrams;
}

// C. Score based on how many bigrams in correctAnswer appear in userAnswer
function scoreSimilarity(userTokens, correctTokens) {
  const userBigrams = buildBigrams(userTokens);
  const correctBigrams = buildBigrams(correctTokens);

  if (correctBigrams.size === 0) return 1;

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

// D. Length scoring — rewards detailed answers
function scoreLength(userRaw) {
  const wordCount = userRaw.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount >= 60) return { pts: 2, wordCount };
  if (wordCount >= 30) return { pts: 1, wordCount };
  return { pts: 0, wordCount };
}

// D. Structure bonus — rewards organized formatting
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

// Build the human-readable feedback string
function buildFeedback(score, wordCount, matchedCount, totalKeywords, similarityPts, structurePts) {
  const lines = [];

  if (score >= 8) lines.push('✅ Excellent answer — well explained and matches key concepts.');
  else if (score >= 5) lines.push('⚡ Good answer, but needs more detail or coverage.');
  else lines.push('⚠️ Answer is weak or incomplete compared to the expected response.');

  const coverageRatio = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 100) : 0;
  lines.push(`📌 Keyword coverage: ${matchedCount}/${totalKeywords} key terms matched (${coverageRatio}%).`);

  if (similarityPts >= 2) lines.push('✅ Strong phrase-level match with the expected answer.');
  else if (similarityPts === 1) lines.push('Partial phrase match — some key ideas are present.');
  else lines.push('Low phrase overlap — answer diverges from expected concepts.');

  if (wordCount >= 60) lines.push(`✅ Good answer length (${wordCount} words).`);
  else if (wordCount >= 30) lines.push(`Answer is short (${wordCount} words) — more explanation would help.`);
  else lines.push(`Answer is very short (${wordCount} words) — insufficient depth.`);

  if (structurePts === 1) lines.push('✅ Good structure — lists or punctuation aid clarity.');
  else lines.push('Adding structure (lists, colons) would improve readability.');

  return lines.join('\n');
}

// Build prioritized improvement suggestions
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
    : '✅ No major issues. Review for conciseness and ensure edge cases are addressed.';
}

/**
 * evaluateAnswer(question, userAnswer, correctAnswer)
 * Main evaluation function for the /api/ai/evaluate endpoint.
 * @returns {{ score: number, feedback: string, suggestions: string }}
 */
export function evaluateAnswer(question, userAnswer, correctAnswer) {
  const userNorm = normalize(userAnswer);
  const correctNorm = normalize(correctAnswer);
  const userTokens = tokenize(userNorm);
  const correctTokens = tokenize(correctNorm);
  const correctKeywords = extractKeywords(correctAnswer);

  const keywordResult = scoreKeywordMatch(userNorm, correctKeywords);
  const similarityPts = scoreSimilarity(userTokens, correctTokens);
  const lengthResult = scoreLength(userAnswer);
  const structurePts = scoreStructure(userAnswer);

  const rawScore = keywordResult.pts + similarityPts + lengthResult.pts + structurePts;
  const score = Math.min(Math.max(rawScore, 0), 10);

  return {
    score,
    feedback: buildFeedback(score, lengthResult.wordCount, keywordResult.matchedCount, keywordResult.totalCount, similarityPts, structurePts),
    suggestions: buildSuggestions(score, keywordResult.missingKeywords, lengthResult.wordCount, structurePts),
  };
}

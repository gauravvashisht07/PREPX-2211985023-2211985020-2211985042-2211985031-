/**
 * aiInsights.js
 * Rule-based AI insight engine for the dashboard.
 * Analyzes user progress data and generates personalized suggestions.
 */

// ─────────────────────────────────────────────
//  Thresholds and topic labels
// ─────────────────────────────────────────────
const TOPIC_NAMES = { DSA: 'DSA', OS: 'Operating Systems', DBMS: 'DBMS', CN: 'Computer Networks', HR: 'HR' };

// ─────────────────────────────────────────────
//  Identify weakest topics from topicStats
// ─────────────────────────────────────────────
function getWeakTopics(topicStats) {
  if (!topicStats) return [];
  return Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      pct: stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0,
    }))
    .filter(t => t.pct < 50)
    .sort((a, b) => a.pct - b.pct);
}

// ─────────────────────────────────────────────
//  Main insight generator
//  Input: progress object from /api/progress
//  Returns: { insights: string[], priority: 'high' | 'medium' | 'low' }
// ─────────────────────────────────────────────
export function generateInsights(progress) {
  if (!progress) {
    return {
      insights: ['Complete a few questions to unlock personalized AI insights.'],
      priority: 'low',
    };
  }

  const solved = progress.solvedQuestions?.length || 0;
  const streak = progress.streak || 0;
  const topicStats = progress.topicStats || {};
  const insights = [];

  // ── 1. Streak analysis ──
  if (streak === 0) {
    insights.push('🔥 Start a daily practice streak today — consistency is key to interview success.');
  } else if (streak < 3) {
    insights.push(`🔥 You're on a ${streak}-day streak! Keep pushing — 7 days unlocks the momentum effect.`);
  } else if (streak >= 7) {
    insights.push(`🔥 Impressive ${streak}-day streak! You're in the top tier of consistent learners.`);
  } else {
    insights.push(`🔥 ${streak}-day streak active — you're building excellent habits.`);
  }

  // ── 2. Overall solved count ──
  if (solved === 0) {
    insights.push('📚 Start with Easy DSA questions — they build the foundation for all interview rounds.');
  } else if (solved < 10) {
    insights.push(`📚 You've solved ${solved} questions. Target 20 solved questions to gain solid baseline coverage.`);
  } else if (solved < 25) {
    insights.push(`📚 Good progress at ${solved} questions. Focus on Medium difficulty to level up.`);
  } else {
    insights.push(`📚 Outstanding — ${solved} questions solved! Hard questions are your next frontier.`);
  }

  // ── 3. Weak topic recommendations ──
  const weakTopics = getWeakTopics(topicStats);
  if (weakTopics.length > 0) {
    const weakest = weakTopics[0];
    insights.push(`🎯 Priority focus: ${TOPIC_NAMES[weakest.topic] || weakest.topic} — only ${weakest.pct}% coverage. Solve at least 3 questions today.`);
    if (weakTopics.length > 1) {
      const others = weakTopics.slice(1, 3).map(t => TOPIC_NAMES[t.topic] || t.topic).join(' and ');
      insights.push(`⚠️ Also needs attention: ${others}. Companies heavily test these areas.`);
    }
  } else if (Object.keys(topicStats).length > 0) {
    insights.push('✅ All topics have above 50% coverage. Now focus on Hard questions and speed.');
  }

  // ── 4. Interview readiness ──
  if (solved >= 30 && streak >= 5) {
    insights.push('🚀 You\'re interview-ready! Schedule mock sessions to simulate real pressure.');
  } else if (solved >= 15) {
    insights.push('💡 Tip: Combine question-solving with Mock Interviews for a complete preparation loop.');
  }

  // ── 5. MCQ accuracy (if available) ──
  const dsaStats = topicStats.DSA;
  if (dsaStats && dsaStats.solved > 5 && dsaStats.total > 0) {
    const dsaPct = Math.round((dsaStats.solved / dsaStats.total) * 100);
    if (dsaPct >= 80) {
      insights.push('⭐ Your DSA mastery is strong — recruiters notice candidates who excel in data structures.');
    }
  }

  // Priority based on how critical the situation is
  const priority = solved === 0 ? 'high' : weakTopics.length > 2 ? 'high' : streak < 3 ? 'medium' : 'low';

  return { insights, priority };
}

// ─────────────────────────────────────────────
//  Notification Generator
// ─────────────────────────────────────────────
export function generateNotifications(progress) {
  if (!progress) return [];
  
  const { insights } = generateInsights(progress);
  const notes = [];
  
  // Map insights to notification objects
  insights.slice(0, 3).forEach((msg, i) => {
    let type = 'AI_SUGGESTION';
    if (msg.includes('🔥')) type = 'DAILY_REMINDER';
    if (msg.includes('📚')) type = 'PROGRESS_UPDATE';
    if (msg.includes('⭐')) type = 'ACHIEVEMENT';

    notes.push({
      id: `ai-note-${Date.now()}-${i}`,
      type,
      title: type === 'AI_SUGGESTION' ? 'Strategic Insight' : 
             type === 'DAILY_REMINDER' ? 'Streak Alert' : 
             type === 'PROGRESS_UPDATE' ? 'Mastery Update' : 'Milestone Unlocked',
      message: msg.replace(/[🔥📚🎯💡✅⭐⚠️]/g, '').trim(),
      date: new Date().toISOString(),
      read: false
    });
  });

  return notes;
}

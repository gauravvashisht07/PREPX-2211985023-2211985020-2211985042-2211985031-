/**
 * aiResumeFeedback.js
 * Rule-based AI resume analyzer.
 * Evaluates completeness, length, and strength of each resume section.
 */

// ─────────────────────────────────────────────
//  Helper: count meaningful words in a string
// ─────────────────────────────────────────────
function wordCount(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ─────────────────────────────────────────────
//  Generate feedback for the personal section
// ─────────────────────────────────────────────
function analyzePersonal(personal) {
  const issues = [];
  const tips = [];
  let score = 0;

  const requiredFields = ['name', 'email', 'phone', 'location', 'github'];
  const filled = requiredFields.filter(f => personal[f]?.trim());
  score += filled.length; // up to 5

  if (!personal.linkedin) issues.push('LinkedIn profile is missing — recruiters frequently check this.');
  if (!personal.summary || wordCount(personal.summary) < 20) {
    issues.push('Professional summary is too short or absent. A strong summary is your first impression.');
    tips.push('Write a 3–4 sentence summary highlighting your domain, experience, and career goal.');
  } else if (wordCount(personal.summary) > 120) {
    issues.push('Summary is too long — keep it concise (50–80 words).');
    score += 1;
  } else {
    score += 2;
  }

  if (!personal.github) issues.push('GitHub link is missing — essential for technical roles.');
  else score += 1;

  return { score: Math.min(score, 8), issues, tips };
}

// ─────────────────────────────────────────────
//  Generate feedback for the skills section
// ─────────────────────────────────────────────
function analyzeSkills(skills) {
  const issues = [];
  const tips = [];
  let score = 0;

  if (!skills || skills.length === 0) {
    issues.push('Skills section is empty — this is critical for ATS and recruiter screening.');
    tips.push('Add at least 2 skill categories: Technical Skills and Tools/Frameworks.');
    return { score: 0, issues, tips };
  }

  const allItems = skills.map(s => s.items || '').join(' ');
  const totalSkills = allItems.split(',').filter(s => s.trim()).length;

  if (totalSkills < 5) {
    issues.push(`Only ${totalSkills} skills listed — add more to improve ATS ranking.`);
    tips.push('Include programming languages, frameworks, databases, and tools separately.');
  } else if (totalSkills < 10) {
    score += 2;
    tips.push('Good start — a few more relevant tools (e.g., Docker, Git, AWS) can help.');
  } else {
    score += 4;
  }

  if (skills.length < 2) {
    tips.push('Break skills into categories like "Languages", "Frameworks", and "Tools" for clarity.');
  } else {
    score += 2;
  }

  return { score: Math.min(score, 6), issues, tips };
}

// ─────────────────────────────────────────────
//  Generate feedback for projects section
// ─────────────────────────────────────────────
function analyzeProjects(projects) {
  const issues = [];
  const tips = [];
  let score = 0;

  const validProjects = projects.filter(p => p.title?.trim());
  if (validProjects.length === 0) {
    issues.push('No projects listed — projects are the most important section for fresh graduates.');
    tips.push('Add 2–3 strong projects with a clear title, tech stack, and 2–3 bullet point achievements.');
    return { score: 0, issues, tips };
  }

  if (validProjects.length < 2) {
    issues.push('Only 1 project found — aim for 2–3 to demonstrate varied skills.');
    score += 1;
  } else {
    score += 2;
  }

  validProjects.forEach((p, i) => {
    const descWords = wordCount(p.description);
    if (descWords < 15) {
      issues.push(`Project "${p.title || i + 1}" description is too short — describe impact, not just features.`);
      tips.push(`For "${p.title || 'Project ' + (i + 1)}", add quantified results: "Improved X by Y%" or "Reduced Z from A to B".`);
    } else {
      score += 1;
    }
    if (!p.tech?.trim()) {
      issues.push(`Project "${p.title || i + 1}" is missing tech stack — always list technologies used.`);
    } else {
      score += 1;
    }
  });

  return { score: Math.min(score, 8), issues, tips };
}

// ─────────────────────────────────────────────
//  Main exported function
//  Returns: { overallScore: 0–100, sections: [...], tips: [...] }
// ─────────────────────────────────────────────
export function analyzeResume(resumeData) {
  const { personal, skills, projects, experience, education } = resumeData;

  const personalResult = analyzePersonal(personal || {});
  const skillsResult = analyzeSkills(skills || []);
  const projectsResult = analyzeProjects(projects || []);

  // Experience check
  const hasExperience = experience?.some(e => e.company?.trim());
  const experienceNote = hasExperience
    ? { label: 'Experience', status: 'good', note: '✅ Experience section is present.' }
    : { label: 'Experience', status: 'warning', note: '⚠️ No work experience listed. Add internships, part-time work, or volunteer roles.' };

  // Education check
  const hasEducation = education?.some(e => e.institution?.trim());
  const educationNote = hasEducation
    ? { label: 'Education', status: 'good', note: '✅ Education section is complete.' }
    : { label: 'Education', status: 'error', note: '❌ Education section is missing — this is essential.' };

  // Compute overall score (out of 100)
  const raw = personalResult.score + skillsResult.score + projectsResult.score;
  const maxRaw = 8 + 6 + 8; // 22 max
  const overallScore = Math.round((raw / maxRaw) * 100);

  // Compile all actionable tips
  const allTips = [...personalResult.tips, ...skillsResult.tips, ...projectsResult.tips];

  return {
    overallScore,
    sections: [
      { label: 'Personal Info', score: personalResult.score, max: 8, issues: personalResult.issues },
      { label: 'Skills', score: skillsResult.score, max: 6, issues: skillsResult.issues },
      { label: 'Projects', score: projectsResult.score, max: 8, issues: projectsResult.issues },
      { label: experienceNote.label, status: experienceNote.status, note: experienceNote.note },
      { label: educationNote.label, status: educationNote.status, note: educationNote.note },
    ],
    tips: allTips.length > 0
      ? allTips
      : ['✅ Resume looks complete. Tailor it further for each job posting using target keywords.'],
  };
}

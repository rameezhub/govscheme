// FIX #3: Education check now PARTICIPATES in scoring (8 total criteria, not 7)
// Previously: education was a hard-filter that could cause eligible:false with 100% score — contradictory
// After: education is criterion #8, unmet = ineligible consistently

const EDUCATION_ORDER = [
  'illiterate', 'primary', 'secondary',
  'higher_secondary', 'graduate', 'post_graduate', 'doctorate'
];

const checkEligibility = (user, scheme) => {
  const { eligibility } = scheme;
  const unmetCriteria = [];
  let matchScore = 0;
  const totalCriteria = 8; // FIX: was 7, education now scores

  // 1. Age
  const minAge = eligibility.minAge ?? 0;
  const maxAge = eligibility.maxAge ?? 120;
  if (user.age >= minAge && user.age <= maxAge) {
    matchScore++;
  } else {
    unmetCriteria.push(`Age must be between ${minAge} and ${maxAge} (yours: ${user.age})`);
  }

  // 2. Max income
  if (eligibility.maxIncome !== null && eligibility.maxIncome !== undefined) {
    if (user.annualIncome <= eligibility.maxIncome) {
      matchScore++;
    } else {
      unmetCriteria.push(`Annual income must be ≤ ₹${eligibility.maxIncome.toLocaleString('en-IN')} (yours: ₹${user.annualIncome.toLocaleString('en-IN')})`);
    }
  } else {
    matchScore++;
  }

  // 3. Min income
  if (eligibility.minIncome && user.annualIncome < eligibility.minIncome) {
    unmetCriteria.push(`Annual income must be ≥ ₹${eligibility.minIncome.toLocaleString('en-IN')}`);
  } else {
    matchScore++;
  }

  // 4. State
  const allowedStates = eligibility.allowedStates || ['All'];
  if (allowedStates.includes('All') || allowedStates.includes(user.state)) {
    matchScore++;
  } else {
    unmetCriteria.push(`Scheme available in: ${allowedStates.join(', ')} (yours: ${user.state})`);
  }

  // 5. Category
  const allowedCategories = eligibility.categories || ['All'];
  if (allowedCategories.includes('All') || allowedCategories.includes(user.category)) {
    matchScore++;
  } else {
    unmetCriteria.push(`Scheme for categories: ${allowedCategories.join(', ')} (yours: ${user.category})`);
  }

  // 6. Gender
  const allowedGenders = eligibility.allowedGenders || ['All'];
  if (allowedGenders.includes('All') || allowedGenders.includes(user.gender)) {
    matchScore++;
  } else {
    unmetCriteria.push(`Scheme for gender: ${allowedGenders.join(', ')} (yours: ${user.gender})`);
  }

  // 7. Occupation
  const allowedOccupations = eligibility.occupations || ['All'];
  if (allowedOccupations.includes('All') || allowedOccupations.includes(user.occupation)) {
    matchScore++;
  } else {
    unmetCriteria.push(`Scheme for occupations: ${allowedOccupations.join(', ')} (yours: ${user.occupation})`);
  }

  // 8. Education — FIX: now scores (was scoring-less hard filter before)
  const minEdu = eligibility.minEducation;
  if (minEdu && minEdu !== 'none') {
    const requiredIdx = EDUCATION_ORDER.indexOf(minEdu);
    const userIdx = EDUCATION_ORDER.indexOf(user.educationLevel);
    if (userIdx >= requiredIdx) {
      matchScore++;
    } else {
      unmetCriteria.push(`Minimum education required: ${minEdu} (yours: ${user.educationLevel})`);
    }
  } else {
    matchScore++; // No education restriction
  }

  const eligible = unmetCriteria.length === 0;
  const matchPercentage = Math.round((matchScore / totalCriteria) * 100);

  return { eligible, matchScore, matchPercentage, unmetCriteria };
};

const getRecommendations = (user, schemes, lang = 'en') => {
  const results = [];

  for (const scheme of schemes) {
    if (!scheme.isActive) continue;
    const { eligible, matchScore, matchPercentage, unmetCriteria } = checkEligibility(user, scheme);
    if (eligible) {
      results.push({
        scheme: scheme.getLocalized(lang),
        matchScore,
        matchPercentage,
        unmetCriteria
      });
    }
  }

  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
};

module.exports = { checkEligibility, getRecommendations };

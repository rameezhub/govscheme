const Scheme = require('../models/Scheme');
const { getRecommendations, checkEligibility } = require('../utils/recommendationEngine');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * FIX #4: Recommendations now uses lean() and field projection to reduce memory.
 * Still loads all schemes server-side for scoring (required by the engine),
 * but avoids fetching unnecessary multilang fields we won't use.
 */

const getPersonalizedRecommendations = catchAsync(async (req, res) => {
  const user = req.user;
  const lang = req.query.lang || user.preferredLanguage || 'en';
  const categoryFilter = req.query.category;

  const query = { isActive: true };
  if (categoryFilter) query.category = categoryFilter;

  // FIX #4: Use lean() for raw objects — faster than full Mongoose documents
  // BUT we still need getLocalized(), so we use full documents but with select to slim payload
  const schemes = await Scheme.find(query)
    .select('name description benefits category eligibility requiredDocuments officialLink applicationLink ministry launchYear isActive schemeCode createdAt updatedAt')
    .lean(false); // need methods

  const recommendations = getRecommendations(user, schemes, lang);

  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const start = (page - 1) * limit;
  const paginatedResults = recommendations.slice(start, start + limit);

  res.status(200).json({
    success: true,
    data: {
      total: recommendations.length,
      page,
      pages: Math.ceil(recommendations.length / limit),
      limit,
      userProfile: {
        age: user.age,
        gender: user.gender,
        state: user.state,
        category: user.category,
        occupation: user.occupation,
        annualIncome: user.annualIncome,
        educationLevel: user.educationLevel
      },
      recommendations: paginatedResults
    }
  });
});

const checkSchemeEligibility = catchAsync(async (req, res, next) => {
  const lang = req.query.lang || req.user.preferredLanguage || 'en';

  const scheme = await Scheme.findOne({ _id: req.params.schemeId, isActive: true });
  if (!scheme) return next(new AppError('Scheme not found.', 404));

  const result = checkEligibility(req.user, scheme);

  res.status(200).json({
    success: true,
    data: {
      scheme: scheme.getLocalized(lang),
      eligible: result.eligible,
      matchScore: result.matchScore,
      matchPercentage: result.matchPercentage,
      unmetCriteria: result.unmetCriteria,
      requiredDocuments: scheme.requiredDocuments
    }
  });
});

const getRecommendationSummary = catchAsync(async (req, res) => {
  const user = req.user;
  const lang = req.query.lang || user.preferredLanguage || 'en';

  const schemes = await Scheme.find({ isActive: true })
    .select('name description benefits category eligibility isActive schemeCode');
  const allRecommendations = getRecommendations(user, schemes, lang);

  const byCategory = allRecommendations.reduce((acc, item) => {
    const cat = item.scheme.category;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat]++;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: {
      totalEligible: allRecommendations.length,
      totalSchemes: schemes.length,
      byCategory,
      topMatches: allRecommendations.slice(0, 3).map((r) => ({
        name: r.scheme.name,
        category: r.scheme.category,
        matchPercentage: r.matchPercentage
      }))
    }
  });
});

module.exports = {
  getPersonalizedRecommendations,
  checkSchemeEligibility,
  getRecommendationSummary
};

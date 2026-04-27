/**
 * Extracts and validates pagination params from request query.
 * Returns { page, limit, skip }.
 */
const getPagination = (query, { defaultLimit = 10, maxLimit = 50 } = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), maxLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Builds a standard pagination meta object.
 */
const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  pages: Math.ceil(total / limit),
  limit,
  hasNextPage: page < Math.ceil(total / limit),
  hasPrevPage: page > 1
});

module.exports = { getPagination, buildPaginationMeta };

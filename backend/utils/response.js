/**
 * Standardized API response helpers.
 * Usage: res.success({ user }) / res.fail('Not found', 404)
 */

const responseHelper = (req, res, next) => {
  /**
   * Send a success response
   * @param {object} data - Payload to send
   * @param {string} message - Optional message
   * @param {number} statusCode - HTTP status (default 200)
   */
  res.success = (data = {}, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(Object.keys(data).length > 0 && { data })
    });
  };

  /**
   * Send a created (201) success response
   */
  res.created = (data = {}, message = 'Created successfully') => {
    return res.success(data, message, 201);
  };

  /**
   * Send a paginated response
   */
  res.paginated = (items, { total, page, limit }, message = 'Success') => {
    return res.status(200).json({
      success: true,
      message,
      data: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
        items
      }
    });
  };

  next();
};

module.exports = responseHelper;

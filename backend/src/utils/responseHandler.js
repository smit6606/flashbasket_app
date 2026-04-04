/**
 * Standardized API response handler
 */
const responseHandler = {
  success: (res, message = 'Success', data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  error: (res, message = 'Something went wrong', statusCode = 500, error = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(error && { error: error.message || error }),
    });
  },

  notFound: (res, message = 'Resource not found') => {
    return responseHandler.error(res, message, 404);
  },

  badRequest: (res, message = 'Bad request') => {
    return responseHandler.error(res, message, 400);
  },

  unauthorized: (res, message = 'Unauthorized access') => {
    return responseHandler.error(res, message, 401);
  },

  forbidden: (res, message = 'Forbidden access') => {
    return responseHandler.error(res, message, 403);
  },
};

module.exports = responseHandler;

/**
 * Standardizes API responses across the platform.
 */
export const sendSuccess = (res, data, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message = 'Error', status = 500, error = null) => {
  return res.status(status).json({
    success: false,
    message,
    ...(error && process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

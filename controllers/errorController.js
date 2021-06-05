const errorController = (err, req, res, next) => {
  if (err.direct) {
    if (process.env.NODE_ENV === 'development') {
      return res.status(err.code).json({
        success: false,
        message: err.message,
        error: err,
        stack: err.stack,
      });
    }
    return res.status(err.code).json({
      success: false,
      message: err.message,
    });
  }
  let code = err.code || 500;
  if (err.code && (err.code > 500 || err.code < 200)) {
    code = 500;
  }
  return res.status(code).json({
    success: false,
    message: err.message || 'Something went wrong',
    error: err,
  });
};

module.exports = errorController;

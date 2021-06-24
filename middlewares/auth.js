const { auth } = require('../utils/firebase');
const catchAsync = require('../utils/catchAsync');
const APIError = require('../utils/apiError');

const authMiddleware = {
  protected: catchAsync(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new APIError('Please login first', 401));
    }
    try {
      const decodedToken = await auth.verifyIdToken(authorization);
      if (decodedToken.phone_number) {
        return next();
      }
      return next(new APIError('Please login again', 401));
    } catch (_) {
      return next(new APIError('Please login again', 401));
    }
  }),
};

module.exports = authMiddleware;

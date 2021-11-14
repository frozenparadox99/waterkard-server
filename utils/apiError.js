class APIError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code || 500;
    this.direct = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = APIError;

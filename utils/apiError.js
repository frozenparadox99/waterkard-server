class APIError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.direct = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = APIError;

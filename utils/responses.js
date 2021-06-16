const responses = {
  successfulRequest: (res, status, data) =>
    res.status(status).json({
      success: true,
      data,
    }),
  failedRequest: (res, status, message) =>
    res.status(status).json({
      success: false,
      message,
    }),
  failedRequestWithData: (res, status, data) => {
    res.status(status).json({
      success: false,
      data,
    });
  },
  failedRequestWithErrors: (res, status, errors) => {
    res.status(status).json({
      success: false,
      errors,
    });
  },
  successfulCall: data => ({
    success: true,
    data,
  }),
  failedCall: message => ({
    success: false,
    data: message,
  }),
};

module.exports = responses;

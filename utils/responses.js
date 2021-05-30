const responses = {
  successfulRequest: (res, status, data) =>
    res.status(status).json({
      success: true,
      data: {
        ...data,
      },
    }),
  failedRequest: (res, status, message) =>
    res.status(status).json({
      success: false,
      message,
    }),
  successfulCall: data => ({
    success: true,
    data: {
      ...data,
    },
  }),
  failedCall: message => ({
    success: false,
    data: message,
  }),
};

module.exports = responses;

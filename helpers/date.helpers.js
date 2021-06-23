const { successfulCall, failedCall } = require('../utils/responses');

const dateHelpers = {
  createDateFromString: strDate => {
    const separated = strDate.split('/');
    separated.forEach(el => parseInt(el, 10));
    for (const i in separated) {
      if (isNaN(separated[i])) {
        return failedCall('Invalid date');
      }
    }
    if (
      separated[0] > 31 ||
      separated[0] < 0 ||
      separated[1] > 12 ||
      separated[1] < 1 ||
      separated[2] < 2000
    ) {
      return failedCall('Invalid date');
    }
    return successfulCall(
      new Date(separated[2], separated[1] - 1, separated[0])
    );
  },
};

module.exports = dateHelpers;

const Joi = require('joi');
const mongoose = require('mongoose');
const { failedRequestWithErrors } = require('../../utils/responses');

const groupValidators = {
  addGroup: (req, res, next) => {
    const schema = Joi.object({
      vendor: Joi.string()
        .alphanum()
        .required()
        .custom((value, helpers) => {
          if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
          }
          return value;
        })
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Vendor is required';
                break;
              case 'any.invalid':
                er.message = 'Invalid vendor. Please enter a valid vendor';
                break;
              default:
                er.message = 'Invalid input for vendor';
            }
          });
          return errors;
        }),
      name: Joi.string()
        .required()
        .trim()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Group name is required';
                break;
              default:
                er.message = 'Invalid input for group name';
            }
          });
          return errors;
        }),
      description: Joi.string()
        .required()
        .trim()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Group description is required';
                break;
              default:
                er.message = 'Invalid input for group description';
            }
          });
          return errors;
        }),
    });
    const result = schema.validate(req.body, {
      abortEarly: false,
    });
    if (result?.error?.details?.length > 0) {
      const errors = result.error.details.map(el => ({
        path: el.path[0],
        message: el.message,
      }));
      return failedRequestWithErrors(res, 400, errors);
    }
    return next();
  },
};

module.exports = groupValidators;

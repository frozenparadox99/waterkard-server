const Joi = require('joi');
const mongoose = require('mongoose');
const { failedRequestWithErrors } = require('../../utils/responses');

const driverValidators = {
  addDriver: (req, res, next) => {
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
      group: Joi.string()
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
                er.message = 'Group is required';
                break;
              case 'any.invalid':
                er.message = 'Invalid Group. Please enter a valid Group';
                break;
              default:
                er.message = 'Invalid input for Group';
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
                er.message = 'Driver name is required';
                break;
              default:
                er.message = 'Invalid input for Driver name';
            }
          });
          return errors;
        }),
      mobileNumber: Joi.string()
        .pattern(new RegExp(/^\+91[0-9]{10}$/i))
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = "Driver's mobile number is required";
                break;
              case 'string.pattern.base':
                er.message =
                  'Invalid mobile number. Please enter an Indian number';
                break;
              default:
                er.message = "Invalid input for driver's mobile number";
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

module.exports = driverValidators;

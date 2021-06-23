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
                er.message = 'Invalid group. Please enter a valid group';
                break;
              default:
                er.message = 'Invalid input for group';
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
  addTransaction: (req, res, next) => {
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
      driver: Joi.string()
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
                er.message = 'Driver is required';
                break;
              case 'any.invalid':
                er.message = 'Invalid driver. Please enter a valid driver';
                break;
              default:
                er.message = 'Invalid input for driver';
            }
          });
          return errors;
        }),
      customer: Joi.string()
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
                er.message = 'Customer is required';
                break;
              case 'any.invalid':
                er.message = 'Invalid customer. Please enter a valid customer';
                break;
              default:
                er.message = 'Invalid input for customer';
            }
          });
          return errors;
        }),
      soldJars: Joi.number()
        .min(0)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              default:
                er.message = 'Invalid input for sold jars';
            }
          });
          return errors;
        }),
      emptyCollected: Joi.number()
        .min(0)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              default:
                er.message = 'Invalid input for empty jars collected';
            }
          });
          return errors;
        }),
      product: Joi.string()
        .required()
        .valid('18L', '20L')
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Product is required';
                break;
              default:
                er.message = 'Invalid input for product';
            }
          });
          return errors;
        }),
      date: Joi.string()
        .required()
        .trim()
        .pattern(new RegExp(/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/i))
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Date is required';
                break;
              case 'string.pattern.base':
                er.message = 'Invalid date';
                break;
              default:
                er.message = 'Invalid input for date';
            }
          });
          return errors;
        }),
    })
      .or('soldJars', 'emptyCollected')
      .error(errors => {
        errors.forEach(er => {
          switch (er.code) {
            case 'object.missing':
              er.message =
                'Either sold jars or empty jars collected is required';
              break;
            default:
              break;
          }
        });
        return errors;
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

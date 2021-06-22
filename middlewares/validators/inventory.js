const Joi = require('joi');
const mongoose = require('mongoose');
const { failedRequestWithErrors } = require('../../utils/responses');

const inventoryValidators = {
  addTotalInventory: (req, res, next) => {
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
      coolJarStock: Joi.number()
        .min(0)
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Cool jar stock is required';
                break;
              case 'number.min':
                er.message = 'Cool jar stock cannot be negative';
                break;
              default:
                er.message = 'Invalid input for cool jar stock';
            }
          });
          return errors;
        }),
      bottleJarStock: Joi.number()
        .min(0)
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Bottle jar stock is required';
                break;
              case 'number.min':
                er.message = 'Bottle jar stock cannot be negative';
                break;
              default:
                er.message = 'Invalid input for bottle jar stock';
            }
          });
          return errors;
        }),
      dateAdded: Joi.string()
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
  removeTotalInventory: (req, res, next) => {
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
      coolJarStock: Joi.number()
        .min(0)
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Cool jar stock is required';
                break;
              case 'number.min':
                er.message = 'Cool jar stock cannot be negative';
                break;
              default:
                er.message = 'Invalid input for cool jar stock';
            }
          });
          return errors;
        }),
      bottleJarStock: Joi.number()
        .min(0)
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Bottle jar stock is required';
                break;
              case 'number.min':
                er.message = 'Bottle jar stock cannot be negative';
                break;
              default:
                er.message = 'Invalid input for bottle jar stock';
            }
          });
          return errors;
        }),
      dateAdded: Joi.string()
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
  loadDailyInventory: (req, res, next) => {
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
      load18: Joi.number()
        .min(0)
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Load for 18L jars is required';
                break;
              case 'number.min':
                er.message = 'Load of 18L jars cannot be negative';
                break;
              default:
                er.message = 'Invalid input for load of 18L jars';
            }
          });
          return errors;
        }),
      load20: Joi.number()
        .min(0)
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Load of 20L jars is required';
                break;
              case 'number.min':
                er.message = 'Load of 20L jars cannot be negative';
                break;
              default:
                er.message = 'Invalid input for load of 20L jars';
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
  unloadDailyInventory: (req, res, next) => {
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
      unloadReturned18: Joi.number()
        .min(0)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Unload of 18L jars is required';
                break;
              case 'number.min':
                er.message = 'Unload of 18L jars cannot be negative';
                break;
              default:
                er.message = 'Invalid input for unload of 18L jars';
            }
          });
          return errors;
        }),
      unloadReturned20: Joi.number()
        .min(0)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Unload of 20L jars is required';
                break;
              case 'number.min':
                er.message = 'Unload of 20L jars cannot be negative';
                break;
              default:
                er.message = 'Invalid input for unload of 20L jars';
            }
          });
          return errors;
        }),
      unloadEmpty18: Joi.number()
        .min(0)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              default:
                er.message = 'Invalid input for empty 18L jars';
            }
          });
          return errors;
        }),
      unloadEmpty20: Joi.number()
        .min(0)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              default:
                er.message = 'Invalid input for empty 20L jars';
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
      .or(
        'unloadReturned18',
        'unloadReturned20',
        'unloadEmpty18',
        'unloadEmpty20'
      )
      .error(errors => {
        errors.forEach(er => {
          switch (er.code) {
            case 'object.missing':
              er.message =
                'One of unload returned or unload empty for 18L or 20L is required';
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
  getExpectedUnload: (req, res, next) => {
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
    });
    const result = schema.validate(req.query, {
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

module.exports = inventoryValidators;

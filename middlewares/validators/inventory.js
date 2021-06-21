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
                er.message = 'Load for 18L jar is required';
                break;
              default:
                er.message = 'Invalid input for 18L load';
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
                er.message = 'Load for 20L jar is required';
                break;
              default:
                er.message = 'Invalid input for 20L load';
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
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Unload for 18L jar is required';
                break;
              default:
                er.message = 'Invalid input for 18L unload';
            }
          });
          return errors;
        }),
      unloadReturned20: Joi.number()
        .min(0)
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Unload for 20L jar is required';
                break;
              default:
                er.message = 'Invalid input for 20L unload';
            }
          });
          return errors;
        }),
      unloadEmpty18: Joi.number()
        .min(0)
        .default(0)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              default:
                er.message = 'Invalid input for 18L unload';
            }
          });
          return errors;
        }),
      unloadEmpty20: Joi.number()
        .min(0)
        .default(0)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              default:
                er.message = 'Invalid input for 20L unload';
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

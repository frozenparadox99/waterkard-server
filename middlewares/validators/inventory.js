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
                er.message = 'Load of 18L jars is required';
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
        .required()
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
        .required()
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
        .required()
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
        .required()
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
      .and(
        'unloadReturned18',
        'unloadReturned20',
        'unloadEmpty18',
        'unloadEmpty20'
      )
      .error(errors => {
        errors.forEach(er => {
          switch (er.code) {
            case 'object.and':
              er.message =
                'Please enter unload returned and unload empty values for both 18L and 20L jars';
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
  getDailyInventoryStatus: (req, res, next) => {
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
  getDailyTransactionsByCustomer: (req, res, next) => {
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
      page: Joi.number()
        .min(1)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'number.min':
                er.message = 'Minimum page is 1';
                break;
              default:
                er.message = 'Invalid input for page';
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
  getDailyJarAndPayment: (req, res, next) => {
    const schema = Joi.object({
      id: Joi.string()
        .alphanum()
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
                er.message = 'Jar and payment is required';
                break;
              case 'any.invalid':
                er.message =
                  'Invalid jar and payment. Please enter a valid jar and payment';
                break;
              default:
                er.message = 'Invalid input for jar and payment';
            }
          });
          return errors;
        }),
      vendor: Joi.string()
        .alphanum()
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
      .xor('id', 'vendor')
      .xor('id', 'driver')
      .xor('id', 'date')
      .and('vendor', 'driver', 'date')
      .error(errors => {
        errors.forEach(er => {
          switch (er.code) {
            case 'object.xor':
              er.message = 'Invalid input';
              break;
            case 'object.and':
              er.message = 'Vendor, driver and date are required';
              break;
            default:
              break;
          }
        });
        return errors;
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
  updateDailyTransaction: (req, res, next) => {
    const schema = Joi.object({
      jarAndPayment: Joi.string()
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
                er.message = 'Jar and payment is required';
                break;
              case 'any.invalid':
                er.message =
                  'Invalid jar and payment. Please enter a valid jar and payment';
                break;
              default:
                er.message = 'Invalid input for jar and payment';
            }
          });
          return errors;
        }),
      transaction: Joi.string()
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
                er.message = 'Transaction is required';
                break;
              case 'any.invalid':
                er.message =
                  'Invalid transaction. Please enter a valid transaction';
                break;
              default:
                er.message = 'Invalid input for transaction';
            }
          });
          return errors;
        }),
      soldJars: Joi.number()
        .min(0)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'number.min':
                er.message = 'Minimum sold jars is 0';
                break;
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
              case 'number.min':
                er.message = 'Minimum empty collected is 0';
                break;
              default:
                er.message = 'Invalid input for empty collected';
            }
          });
          return errors;
        }),
    }).or('soldJars', 'emptyCollected');
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
  updateUnload: (req, res, next) => {
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
            case 'object.or':
              er.message =
                'Please enter one of unload returned and unload empty values for 18L or 20L jars';
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

module.exports = inventoryValidators;

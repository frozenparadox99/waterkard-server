const Joi = require('joi');
const mongoose = require('mongoose');
const { failedRequestWithErrors } = require('../../utils/responses');

const vendorValidators = {
  registerVendor: (req, res, next) => {
    const schema = Joi.object({
      coolJarStock: Joi.number()
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
      defaultGroupName: Joi.string()
        .trim()
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Default group name is required';
                break;
              default:
                er.message = 'Invalid input for default group name';
            }
          });
          return errors;
        }),
      firstDriverName: Joi.string()
        .trim()
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = "Driver's name is required";
                break;
              default:
                er.message = "Invalid input for driver's name";
            }
          });
          return errors;
        }),
      firstDriverMobileNumber: Joi.string()
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
      fullBusinessName: Joi.string()
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Business name is required';
                break;
              default:
                er.message = 'Invalid input for business name';
            }
          });
          return errors;
        }),
      fullVendorName: Joi.string()
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Vendor name is required';
                break;
              default:
                er.message = 'Invalid input for vendor name';
            }
          });
          return errors;
        }),
      brandName: Joi.string()
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Brand name is required';
                break;
              default:
                er.message = 'Invalid input for brand name';
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
                er.message = "Business' mobile number is required";
                break;
              case 'string.pattern.base':
                er.message =
                  'Invalid mobile number. Please enter an Indian number';
                break;
              default:
                er.message = "Invalid input for business' mobile number";
            }
          });
          return errors;
        }),
      country: Joi.string()
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Country is required';
                break;
              default:
                er.message = 'Invalid input for country';
            }
          });
          return errors;
        }),
      state: Joi.string()
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'State is required';
                break;
              default:
                er.message = 'Invalid input for state';
            }
          });
          return errors;
        }),
      city: Joi.string()
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'City is required';
                break;
              default:
                er.message = 'Invalid input for city';
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
  getVendor: (req, res, next) => {
    const schema = Joi.object({
      mobileNumber: Joi.string()
        .pattern(new RegExp(/^\+91[0-9]{10}$/i))
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Vendor mobile number is required';
                break;
              case 'string.pattern.base':
                er.message =
                  'Invalid mobile number. Please enter an Indian number';
                break;
              default:
                er.message = 'Invalid input for vendor mobile number';
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
  updateVendor: (req, res, next) => {
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
      fullBusinessName: Joi.string().error(errors => {
        errors.forEach(er => {
          switch (er.code) {
            case 'any.required':
              er.message = 'Business name is required';
              break;
            default:
              er.message = 'Invalid input for business name';
          }
        });
        return errors;
      }),
      fullVendorName: Joi.string().error(errors => {
        errors.forEach(er => {
          switch (er.code) {
            case 'any.required':
              er.message = 'Vendor name is required';
              break;
            default:
              er.message = 'Invalid input for vendor name';
          }
        });
        return errors;
      }),
      brandName: Joi.string().error(errors => {
        errors.forEach(er => {
          switch (er.code) {
            case 'any.required':
              er.message = 'Brand name is required';
              break;
            default:
              er.message = 'Invalid input for brand name';
          }
        });
        return errors;
      }),
      mobileNumber: Joi.string()
        .pattern(new RegExp(/^\+91[0-9]{10}$/i))
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = "Business' mobile number is required";
                break;
              case 'string.pattern.base':
                er.message =
                  'Invalid mobile number. Please enter an Indian number';
                break;
              default:
                er.message = "Invalid input for business' mobile number";
            }
          });
          return errors;
        }),
    }).or('fullBusinessName', 'fullVendorName', 'brandName', 'mobileNumber');
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
  getHomeScreen: (req, res, next) => {
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
      date: Joi.string()
        .trim()
        .pattern(new RegExp(/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/i))
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
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

module.exports = vendorValidators;

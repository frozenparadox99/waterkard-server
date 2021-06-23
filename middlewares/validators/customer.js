const Joi = require('joi');
const mongoose = require('mongoose');
const { failedRequestWithErrors } = require('../../utils/responses');

const customerValidators = {
  registerCustomer: (req, res, next) => {
    const schema = Joi.object({
      typeOfCustomer: Joi.string()
        .required()
        .valid('Regular', 'Event')
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Customer type is required';
                break;
              default:
                er.message = 'Invalid input for customer type';
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
                er.message = 'Customer name is required';
                break;
              default:
                er.message = 'Invalid input for customer name';
            }
          });
          return errors;
        }),
      email: Joi.string()
        .email()
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = "Customer's email is required";
                break;
              case 'string.email':
                er.message = 'Invalid email address';
                break;
              default:
                er.message = "Invalid input for customer's email address";
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
                er.message = "Customer's mobile number is required";
                break;
              case 'string.pattern.base':
                er.message =
                  'Invalid mobile number. Please enter an Indian number';
                break;
              default:
                er.message = "Invalid input for customer's mobile number";
            }
          });
          return errors;
        }),
      address: Joi.object({
        type: Joi.string().required().valid('Point'),
        coordinates: Joi.array().length(2).items(Joi.number()),
      })
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Address is required';
                break;
              default:
                er.message = 'Invalid input for address';
            }
          });
          return errors;
        }),
      area: Joi.string()
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Area is required';
                break;
              default:
                er.message = 'Invalid input for area';
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
      pincode: Joi.string()
        .pattern(new RegExp(/^[0-9]{6}$/i))
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Pincode is required';
                break;
              case 'string.pattern.base':
                er.message = 'Invalid pincode. Please enter an Indian pincode';
                break;
              default:
                er.message = 'Invalid input for pincode';
            }
          });
          return errors;
        }),
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
      rate: Joi.number()
        .positive()
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Rate is required';
                break;
              case 'number.positive':
                er.message = 'Rate cannot be negative';
                break;
              default:
                er.message = 'Invalid input for rate';
            }
          });
          return errors;
        }),
      balanceJars: Joi.number()
        .min(0)
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Balance of jars is required';
                break;
              case 'number.min':
                er.message = 'Balance cannot be negative';
                break;
              default:
                er.message = 'Invalid input for balance of jars';
            }
          });
          return errors;
        }),
      deposit: Joi.number()
        .min(0)
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Deposit is required';
                break;
              case 'number.min':
                er.message = 'Deposit cannot be negative';
                break;
              default:
                er.message = 'Invalid input for deposit';
            }
          });
          return errors;
        }),
      dispenser: Joi.number()
        .min(0)
        .required()
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Number of dispensers is required';
                break;
              case 'number.min':
                er.message = 'Number of dispensers cannot be negative';
                break;
              default:
                er.message = 'Invalid input for number of dispensers';
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
  getCustomers: (req, res, next) => {
    const schema = Joi.object({
      type: Joi.string()
        .valid('Regular', 'Event')
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              default:
                er.message = 'Invalid input for customer type';
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
              case 'any.invalid':
                er.message = 'Invalid vendor. Please enter a valid vendor';
                break;
              default:
                er.message = 'Invalid input for vendor';
            }
          });
          return errors;
        }),
      product: Joi.string()
        .valid('18L', '20L')
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              default:
                er.message = 'Invalid input for product';
            }
          });
          return errors;
        }),
      group: Joi.string()
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
              case 'any.invalid':
                er.message = 'Invalid group. Please enter a valid group';
                break;
              default:
                er.message = 'Invalid input for group';
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
};

module.exports = customerValidators;

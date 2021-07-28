const Joi = require('joi');
const mongoose = require('mongoose');
const { failedRequestWithErrors } = require('../../utils/responses');

const driverPaymentValidators = {
  addDriverPayment: (req, res, next) => {
    const schema = Joi.object({
      product: Joi.string()
        .valid('18L', '20L')
        .when('from', { is: 'Customer', then: Joi.required() })
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
      mode: Joi.string()
        .required()
        .valid('Cash', 'Online', 'Cheque')
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Mode of payment is required';
                break;
              default:
                er.message = 'Invalid input for mode of payment';
            }
          });
          return errors;
        }),
      from: Joi.string()
        .required()
        .valid('Driver', 'Customer')
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Payer is required';
                break;
              default:
                er.message = 'Invalid input for payer';
            }
          });
          return errors;
        }),
      to: Joi.string()
        .required()
        .valid('Vendor', 'Driver')
        .when('from', { is: 'Driver', then: Joi.invalid('Driver') })
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Payee is required';
                break;
              default:
                er.message = 'Invalid input for payee';
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
      customer: Joi.string()
        .alphanum()
        .when('from', { is: 'Customer', then: Joi.required() })
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
      amount: Joi.number()
        .required()
        .min(1)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Amount is required';
                break;
              default:
                er.message = 'Invalid input for amount';
            }
          });
          return errors;
        }),
      onlineAppForPayment: Joi.string()
        .trim()
        .when('mode', { is: 'Online', then: Joi.required() })
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Please specify the app used for payment';
                break;
              default:
                er.message = 'Invalid input for online app for payment';
            }
          });
          return errors;
        }),
      chequeDetails: Joi.string()
        .trim()
        .when('mode', { is: 'Cheque', then: Joi.required() })
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Please specify cheque details';
                break;
              default:
                er.message = 'Invalid input for cheque details';
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
  getDriverPayments: (req, res, next) => {
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
  getDriverPaymentsByDriver: (req, res, next) => {
    const schema = Joi.object({
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

module.exports = driverPaymentValidators;

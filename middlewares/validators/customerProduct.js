const Joi = require('joi');
const mongoose = require('mongoose');
const { failedRequestWithErrors } = require('../../utils/responses');

const customerProductValidators = {
  addCustomerProduct: (req, res, next) => {
    const schema = Joi.object({
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
};

module.exports = customerProductValidators;

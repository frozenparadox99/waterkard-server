const Joi = require('joi');
const mongoose = require('mongoose');
const { failedRequestWithErrors } = require('../../utils/responses');

const groupValidators = {
  addOrder: (req, res, next) => {
    const schema = Joi.object({
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
      product: Joi.string()
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
                er.message = 'Product is required';
                break;
              case 'any.invalid':
                er.message = 'Invalid product. Please enter a valid product';
                break;
              default:
                er.message = 'Invalid input for product';
            }
          });
          return errors;
        }),
      preferredDate: Joi.string()
        .required()
        .trim()
        .pattern(new RegExp(/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/i))
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Preferred date is required';
                break;
              case 'string.pattern.base':
                er.message = 'Invalid preferred date';
                break;
              default:
                er.message = 'Invalid input for preferred date';
            }
          });
          return errors;
        }),
      jarQty: Joi.number()
        .required()
        .min(1)
        .error(errors => {
          errors.forEach(er => {
            switch (er.code) {
              case 'any.required':
                er.message = 'Jar quantity description is required';
                break;
              default:
                er.message = 'Invalid input for jar quantity';
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

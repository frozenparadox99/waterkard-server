const mongoose = require('mongoose');
const Customer = require('../../models/customerModel');
const CustomerProduct = require('../../models/customerProductModel');
const Order = require('../../models/orderModel');
const TotalInventory = require('../../models/totalInventoryModel');
const dateHelpers = require('../../helpers/date.helpers');
const catchAsync = require('../../utils/catchAsync');
const APIError = require('../../utils/apiError');
const { successfulRequest } = require('../../utils/responses');

const customerController = {
  registerCustomer: catchAsync(async (req, res, next) => {
    const {
      typeOfCustomer,
      name,
      mobileNumber,
      address,
      city,
      area,
      pincode,
      email,
      group,
      vendor,
      product,
      balanceJars,
      dispenser,
      deposit,
      rate,
    } = req.body;

    let customer;

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const totalInv = await TotalInventory.findOne({ vendor }, null, {
        session,
      });
      if (!totalInv) {
        return next(
          new APIError(
            'Inventory does not exist for this vendor. Please create it first',
            400
          )
        );
      }
      customer = await Customer.create(
        [
          {
            typeOfCustomer,
            name,
            email,
            mobileNumber,
            address,
            city,
            area,
            pincode,
            group,
            vendor,
          },
        ],
        { session }
      );

      const customerProduct = await CustomerProduct.create(
        [
          {
            product,
            balanceJars,
            dispenser,
            deposit,
            rate,
            customer: customer[0]._id,
          },
        ],
        { session }
      );
      if (
        product === '18L' &&
        totalInv.godownCoolJarStock < parseInt(balanceJars, 10)
      ) {
        await session.abortTransaction();
        return next(new APIError('Not enough stock. Please try again', 400));
      }
      if (
        product === '20L' &&
        totalInv.godownBottleJarStock < parseInt(balanceJars, 10)
      ) {
        await session.abortTransaction();
        return next(new APIError('Not enough stock. Please try again', 400));
      }
      if (product === '18L') {
        totalInv.customerCoolJarBalance += parseInt(balanceJars, 10);
        totalInv.godownCoolJarStock -= parseInt(balanceJars, 10);
      }
      if (product === '20L') {
        totalInv.customerBottleJarBalance += parseInt(balanceJars, 10);
        totalInv.godownBottleJarStock -= parseInt(balanceJars, 10);
      }
      await totalInv.save();
      // commit the changes if everything was successful
      await session.commitTransaction();
    } catch (error) {
      // if anything fails above just rollback the changes here

      // this will rollback any changes made in the database
      await session.abortTransaction();

      // logging the error
      // console.error('-----------------------------------');
      console.error(error);

      // rethrow the error
      return next(new APIError('Failed to add customer', 500));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, { customer: customer[0] });
  }),
  updateCustomer: catchAsync(async (req, res, next) => {
    const {
      id,
      typeOfCustomer,
      name,
      email,
      mobileNumber,
      address,
      city,
      area,
      pincode,
      group,
    } = req.body;
    const obj = {
      typeOfCustomer,
      name,
      email,
      mobileNumber,
      address,
      city,
      area,
      pincode,
      group,
    };
    for (const p in obj) {
      if (!obj[p]) {
        delete obj[p];
      }
    }
    const customer = await Customer.findByIdAndUpdate(
      id,
      {
        ...obj,
      },
      {
        new: true,
      }
    );
    if (!customer) {
      return next(new APIError('Customer not found', 400));
    }
    return successfulRequest(res, 200, { customer });
  }),
  updateCustomersGroups: catchAsync(async (req, res, next) => {
    const { updatedCustomersGroups } = req.body;
    const promises = [];
    for (const ele of updatedCustomersGroups) {
      promises.push(
        Customer.findByIdAndUpdate(
          ele.customer,
          { group: ele.group },
          {
            new: true,
          }
        )
      );
    }
    const customers = await Promise.all(promises);
    if (customers.length > 0) {
      return successfulRequest(res, 200, {
        message: "Customers' groups updated",
      });
    }
    return next(new APIError("Customers' groups not updated", 500));
  }),
  addCustomerProduct: catchAsync(async (req, res, next) => {
    const { product, balanceJars, dispenser, deposit, rate, customer } =
      req.body;
    const cust = await Customer.findById(customer);
    if (!cust) {
      return next(new APIError('Customer does not exist', 400));
    }
    // 1) Get products for the current customer
    const currentProductsForCustomer = await CustomerProduct.find({
      customer,
    });

    // 2) Check the number of products. If it is 2 then no more can be added.
    if (
      currentProductsForCustomer.length &&
      currentProductsForCustomer.length >= 2
    ) {
      return next(
        new APIError('Only two products for a customer can be added', 400)
      );
    }

    // 3) If it is 1 then store its product type
    if (
      currentProductsForCustomer.length &&
      currentProductsForCustomer.length === 1
    ) {
      const currentProductType = currentProductsForCustomer[0].product;
      // 4) Compare the product type with the product in req.body. If its the same then the product can't be added
      if (currentProductType === product) {
        return next(
          new APIError('This product already exists for this customer', 400)
        );
      }
    }

    // 5) Proceed with adding the product

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const totalInv = await TotalInventory.findOne(
        { vendor: cust.vendor },
        null,
        {
          session,
        }
      );
      if (!totalInv) {
        return next(
          new APIError(
            'Inventory does not exist for this vendor. Please create it first',
            400
          )
        );
      }
      const customerProduct = await CustomerProduct.create(
        [
          {
            product,
            balanceJars,
            dispenser,
            deposit,
            rate,
            customer,
          },
        ],
        { session }
      );
      if (
        product === '18L' &&
        totalInv.godownCoolJarStock < parseInt(balanceJars, 10)
      ) {
        await session.abortTransaction();
        return next(new APIError('Not enough stock. Please try again', 400));
      }
      if (
        product === '20L' &&
        totalInv.godownBottleJarStock < parseInt(balanceJars, 10)
      ) {
        await session.abortTransaction();
        return next(new APIError('Not enough stock. Please try again', 400));
      }
      if (product === '18L') {
        totalInv.customerCoolJarBalance += parseInt(balanceJars, 10);
        totalInv.godownCoolJarStock -= parseInt(balanceJars, 10);
      }
      if (product === '20L') {
        totalInv.customerBottleJarBalance += parseInt(balanceJars, 10);
        totalInv.godownBottleJarStock -= parseInt(balanceJars, 10);
      }
      await totalInv.save();
      // commit the changes if everything was successful
      await session.commitTransaction();
    } catch (error) {
      // if anything fails above just rollback the changes here

      // this will rollback any changes made in the database
      await session.abortTransaction();

      // logging the error
      // console.error('-----------------------------------');
      console.error(error);

      // rethrow the error
      return next(new APIError('Failed to add product', 500));
    } finally {
      // ending the session
      session.endSession();
    }

    return successfulRequest(res, 201, {});
  }),
  getCustomerProducts: catchAsync(async (req, res, next) => {
    const { customerId } = req.query;
    const custProds = await CustomerProduct.find({ customer: customerId });

    if (!custProds) {
      return next(new APIError('No product found for the customer', 400));
    }

    return successfulRequest(res, 200, {
      customerProducts: custProds,
    });
  }),
  getCustomers: catchAsync(async (req, res, next) => {
    const { vendor, group, product, date, typeOfCustomer } = req.query;
    const page = parseInt(req.query.page || 1, 10);
    const skip = (page - 1) * 20;
    const limit = 20;
    const parsedDate = dateHelpers.createDateFromString(date || '');
    if (!parsedDate.success) {
      return next(new APIError('Invalid date', 400));
    }
    const customerMatchStage = {
      $match: {
        vendor: mongoose.Types.ObjectId(vendor),
      },
    };
    const jarAndPaymentsLookup = {
      let: {
        vendor: '$vendor',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$vendor', '$$vendor'],
                },
              ],
            },
          },
        },
      ],
    };
    const finalMatch = {
      $match: {
        $expr: {
          $and: [
            {
              $eq: ['$_id', '$jarAndPayments.transactions.customer'],
            },
          ],
        },
      },
    };
    if (group) {
      customerMatchStage.$match = {
        ...customerMatchStage.$match,
        group: mongoose.Types.ObjectId(group),
      };
    }
    if (typeOfCustomer) {
      customerMatchStage.$match = {
        ...customerMatchStage.$match,
        typeOfCustomer,
      };
    }
    const props = [
      { name: 'group', val: group && mongoose.Types.ObjectId(group) },
      { name: 'date', val: parsedDate.data },
    ];
    if (group || date) {
      props.forEach(el => {
        if (el.val) {
          jarAndPaymentsLookup.let = {
            ...jarAndPaymentsLookup.let,
            [el.name]: el.val,
          };
          jarAndPaymentsLookup.pipeline[0].$match.$expr.$and.push({
            $eq: [`$${el.name}`, `$$${el.name}`],
          });
        }
      });
    }
    if (product) {
      finalMatch.$match.$expr.$and.push({
        $eq: [product, '$jarAndPayments.transactions.product'],
      });
    }
    const customers = await Customer.aggregate([
      {
        $facet: {
          customers: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                vendor: 1,
                name: 1,
                group: 1,
              },
            },
            {
              $sort: {
                name: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $lookup: {
                from: 'dailyjarandpayments',
                ...jarAndPaymentsLookup,
                as: 'jarAndPayments',
              },
            },
            {
              $unwind: {
                path: '$jarAndPayments',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $unwind: {
                path: '$jarAndPayments.transactions',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              ...finalMatch,
            },
            {
              $group: {
                _id: '$jarAndPayments.transactions.customer',
                totalEmptyCollected: {
                  $sum: '$jarAndPayments.transactions.emptyCollected',
                },
                totalSold: {
                  $sum: '$jarAndPayments.transactions.soldJars',
                },
                name: { $first: '$name' },
              },
            },
          ],
          groups: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                group: 1,
              },
            },
            {
              $lookup: {
                from: 'groups',
                let: {
                  group: '$group',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$group'],
                      },
                    },
                  },
                  {
                    $project: {
                      name: 1,
                    },
                  },
                ],
                as: 'group',
              },
            },
            {
              $unwind: {
                path: '$group',
                preserveNullAndEmptyArrays: false,
              },
            },
          ],
          drivers: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                group: 1,
              },
            },
            {
              $lookup: {
                from: 'drivers',
                let: {
                  group: '$group',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$group', '$$group'],
                      },
                    },
                  },
                  {
                    $project: {
                      name: 1,
                    },
                  },
                ],
                as: 'driver',
              },
            },
            {
              $unwind: {
                path: '$driver',
                preserveNullAndEmptyArrays: false,
              },
            },
          ],
          deposits: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                vendor: 1,
                name: 1,
                _id: 1,
              },
            },
            {
              $sort: {
                name: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $lookup: {
                from: 'customerproducts',
                localField: '_id',
                foreignField: 'customer',
                as: 'customerProducts',
              },
            },
            {
              $unwind: {
                path: '$customerProducts',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $group: {
                _id: '$_id',
                totalDeposit: {
                  $sum: '$customerProducts.deposit',
                },
                totalBalance: {
                  $sum: '$customerProducts.balanceJars',
                },
                name: { $first: '$name' },
              },
            },
          ],
          mobileNumbers: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                vendor: 1,
                name: 1,
                group: 1,
                mobileNumber: 1,
              },
            },
            {
              $sort: {
                name: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          addresses: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                vendor: 1,
                name: 1,
                group: 1,
                address: 1,
              },
            },
            {
              $sort: {
                name: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
        },
      },
    ]);
    const customersFinal = customers[0].deposits.map(el => {
      let details = customers[0].customers.filter(
        ele => ele._id.toString() === el._id.toString()
      )[0];
      const groupRes =
        customers[0].groups.filter(
          ele => ele._id.toString() === el._id.toString()
        )[0]?.group?.name || '';
      const driverRes =
        customers[0].drivers.filter(
          ele => ele._id.toString() === el._id.toString()
        )[0]?.driver?._id || undefined;
      const mobileRes =
        customers[0].mobileNumbers.filter(
          ele => ele._id.toString() === el._id.toString()
        )[0]?.mobileNumber || undefined;
      const addressRes =
        customers[0].addresses.filter(
          ele => ele._id.toString() === el._id.toString()
        )[0]?.address || undefined;
      if (!details) {
        details = {
          totalEmptyCollected: 0,
          totalSold: 0,
        };
      }
      details.group = groupRes;
      details.driver = driverRes;
      details.mobileNumber = mobileRes;
      details.address = addressRes;
      return {
        ...el,
        ...details,
      };
    });
    return successfulRequest(res, 200, {
      customers: customersFinal,
      final: customers[0].deposits.length < limit,
    });
  }),
  getCustomersByDate: catchAsync(async (req, res, next) => {
    let { date } = req.query;
    const { vendor } = req.query;
    const parsedDate = date
      ? dateHelpers.createDateFromString(date)
      : dateHelpers.createDateFromString(
          `${new Date().getDate()}/${
            new Date().getMonth() + 1
          }/${new Date().getFullYear()}`
        );
    const page = parseInt(req.query.page || 1, 10);
    const skip = (page - 1) * 20;
    const limit = 20;
    if (!parsedDate.success) {
      return next(new APIError('Invalid date', 400));
    }
    date = parsedDate.data;
    let customersToday = new Set();
    const ordersToday = await Order.aggregate([
      {
        $match: {
          vendor: mongoose.Types.ObjectId(vendor),
          preferredDate: date,
        },
      },
      {
        $project: {
          customer: 1,
        },
      },
    ]);
    ordersToday.forEach(el => {
      customersToday.add(el.customer);
    });
    customersToday = Array.from(customersToday);
    const customerMatchStage = {
      $match: {
        _id: {
          $in: customersToday,
        },
      },
    };
    const jarAndPaymentsLookup = {
      let: {
        vendor: '$vendor',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$vendor', '$$vendor'],
                },
              ],
            },
          },
        },
      ],
    };
    const finalMatch = {
      $match: {
        $expr: {
          $and: [
            {
              $eq: ['$_id', '$jarAndPayments.transactions.customer'],
            },
          ],
        },
      },
    };
    const customers = await Customer.aggregate([
      {
        $facet: {
          customers: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                vendor: 1,
                name: 1,
                group: 1,
              },
            },
            {
              $sort: {
                name: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $lookup: {
                from: 'dailyjarandpayments',
                ...jarAndPaymentsLookup,
                as: 'jarAndPayments',
              },
            },
            {
              $unwind: {
                path: '$jarAndPayments',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $unwind: {
                path: '$jarAndPayments.transactions',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              ...finalMatch,
            },
            {
              $group: {
                _id: '$jarAndPayments.transactions.customer',
                totalEmptyCollected: {
                  $sum: '$jarAndPayments.transactions.emptyCollected',
                },
                totalSold: {
                  $sum: '$jarAndPayments.transactions.soldJars',
                },
                name: { $first: '$name' },
              },
            },
          ],
          groups: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                group: 1,
              },
            },
            {
              $lookup: {
                from: 'groups',
                let: {
                  group: '$group',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$group'],
                      },
                    },
                  },
                  {
                    $project: {
                      name: 1,
                    },
                  },
                ],
                as: 'group',
              },
            },
            {
              $unwind: {
                path: '$group',
                preserveNullAndEmptyArrays: false,
              },
            },
          ],
          drivers: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                group: 1,
              },
            },
            {
              $lookup: {
                from: 'drivers',
                let: {
                  group: '$group',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$group', '$$group'],
                      },
                    },
                  },
                  {
                    $project: {
                      name: 1,
                    },
                  },
                ],
                as: 'driver',
              },
            },
            {
              $unwind: {
                path: '$driver',
                preserveNullAndEmptyArrays: false,
              },
            },
          ],
          deposits: [
            {
              ...customerMatchStage,
            },
            {
              $project: {
                vendor: 1,
                name: 1,
                _id: 1,
              },
            },
            {
              $sort: {
                name: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $lookup: {
                from: 'customerproducts',
                localField: '_id',
                foreignField: 'customer',
                as: 'customerProducts',
              },
            },
            {
              $unwind: {
                path: '$customerProducts',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $group: {
                _id: '$_id',
                totalDeposit: {
                  $sum: '$customerProducts.deposit',
                },
                totalBalance: {
                  $sum: '$customerProducts.balanceJars',
                },
                name: { $first: '$name' },
              },
            },
          ],
        },
      },
    ]);
    const customersFinal = customers[0].deposits.map(el => {
      let details = customers[0].customers.filter(
        ele => ele._id.toString() === el._id.toString()
      )[0];
      const groupRes =
        customers[0].groups.filter(
          ele => ele._id.toString() === el._id.toString()
        )[0]?.group?.name || '';
      const driverRes =
        customers[0].drivers.filter(
          ele => ele._id.toString() === el._id.toString()
        )[0]?.driver?._id || undefined;
      if (!details) {
        details = {
          totalEmptyCollected: 0,
          totalSold: 0,
        };
      }
      details.group = groupRes;
      details.driver = driverRes;
      return {
        ...el,
        ...details,
      };
    });
    return successfulRequest(res, 200, {
      customers: customersFinal,
      final: customers[0].deposits.length < limit,
    });
  }),
  getCustomerDeposits: catchAsync(async (req, res, next) => {
    const { vendor } = req.query;
    const customers = await Customer.find(
      { vendor },
      {
        name: 1,
      }
    );
    if (customers.length === 0) {
      return next(
        new APIError(
          "You don't have any customers. Please add a customer first",
          400
        )
      );
    }
    const customerIds = [];
    customers.forEach(ele => {
      customerIds.push(ele._id);
    });
    const customerProducts = await CustomerProduct.find(
      {
        customer: { $in: customerIds },
      },
      { deposit: 1, product: 1, customer: 1 }
    );
    const customersFinal = [];
    customers.forEach(ele => {
      const products = customerProducts.filter(
        el => el.customer.toString() === ele._id.toString()
      );
      customersFinal.push({ _id: ele._id, name: ele.name, products });
    });
    return successfulRequest(res, 200, { customers: customersFinal });
  }),
};

module.exports = customerController;

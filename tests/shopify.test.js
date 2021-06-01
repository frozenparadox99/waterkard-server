const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  shopName: 'waterkard-store.myshopify.com',
  apiKey: '721d26c4190be60dab3886eaff47ba9f',
  password: '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',
});

// shopify.order
//   .list({ limit: 5 })
//   .then((orders) => console.log(orders))
//   .catch((err) => console.error(err));

// shopify.order
//   .get(3744813809735)
//   .then((order) => {
//     console.log(JSON.stringify(order, null, 4));
//     let tags = order.tags;
//     console.log(tags);
//     shopify.order
//       .update(3744813809735, {
//         tags: `${tags}, Test Tag`,
//       })
//       .then((data) => {
//         console.log(JSON.stringify(data, null, 4));
//         console.log(data.tags);
//       });
//   })
//   .catch((err) => console.error(err));

// shopify.order
//   .get(3781372870727)
//   .then((order) => {
//     console.log(JSON.stringify(order, null, 4));
//     let tags = order.tags;
//     console.log(tags);
//     console.log(order.updated_at);
//     // console.log(order.shipping_address);
//     // console.log(order.line_items);
//   })
//   .catch((err) => console.error(err));

// shopify.product
//   .get(4621325205575)
//   .then((product) => {
//     console.log("Here");
//     console.log(product);
//     console.log(JSON.stringify(product, null, 4));
//   })
//   .catch((err) => console.error(err));

// shopify.product
//   .list({ ids: "4621325205575,4779025530951" })
//   .then((p) => {
//     console.log(p);
//     console.log(p.length);
//     p.map((el) => {
//       console.log(el.handle);
//     });
//   })
//   .catch((err) => console.log(err));

shopify.customer
  .list()
  .then(console.log)
  .catch(err => console.log(err));
// shopify.customer.create({});

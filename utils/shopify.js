const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  shopName: 'waterkard-store.myshopify.com',
  apiKey: '721d26c4190be60dab3886eaff47ba9f',
  password: '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',
});

module.exports = shopify;

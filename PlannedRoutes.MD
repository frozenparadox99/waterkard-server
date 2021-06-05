#### Planned Routes and Requirement

#### Vendors

##### Post Routes

- **Auth**
- _/vendor/auth/register_ : Register a new vendor
- Request

```javascript
{
    "coolJarStock": 10,
    "bottleJarStock": 11,
    "defaultGroupName":"Group 1",
    "firstDriverName":"John Doe",
    "firstDriverPhoneNumber":"+919991112223",
    "fullBusinessName":"Bizness",
    "brandName":"Nike",
    "mobileNumber":"Bizness",
    "country":"India",
    "city":"Mumbai",
    "state":"Maharashtra",
    "fullVendorName": "vendorxyz"
}
```

- Response

```javascript
{
  "success": true,
  "data": {
    "message": "Vendor created",
    "vendor": {
      "defaultGroupName": "Group 1",
      "firstDriverPhoneNumber": "+919991112223",
      "state": "Maharashtra",
      "fullBusinessName": "Bizness",
      "fullVendorName": "vendorxyz",
      "mobileNumber": "Bizness",
      "city": "Mumbai",
      "country": "India",
      "brandName": "Nike",
      "firstDriverName": "John Doe",
      "id": "Nwi2N8ZHdc14bzsfUeSv",
      "group": "Rl0a8FlOTztpZgikaq75",
      "driver": "5y1mRIWZkWOn4eKcC9xk",
      "product": "rpdQ2y8SXw6LVq3SHvVa",
      "totalInventory": "qPSS9MRM2JZz6YoUyHP7"
    }
  }
}
```

**Inventory**

- _/vendor/inventory/daily-load_ : Jars loaded for the day
- _/vendor/inventory/daily-unload_ : Jars unloaded for the day
- _/vendor/inventory/total-add-stock_ : Add jars in stock
- _/vendor/inventory/total-remove-stock_ : Remove jars from stock
  **Customer**
- _/vendor/customer_ : Create customer for vendor
- _/vendor/customer/add-product_ : Add product to customer's usual request
  **Group**
- _/vendor/group_ : Create a group for the vendor (Each group will have a driver)
  **Driver**
- _/vendor/driver_ : Add driver
  **Order**
- _/vendor/order_ : Create order
  **Product**
- _/vendor/product_ : Add product (18L or 20L)
- _/vendor/dispenser_ : Add dispenser
  **Payments**
- _/vendor/customer/payment_ : Create payment for customer
- _/vendor/driver/payment_ : Create payment for driver
- _/vendor/customer/deposit_ : Deposit advance from customer

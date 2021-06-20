<!-- prettier-ignore -->
#### Planned Routes and Requirements

- Base route : **/api/v1/**

#### Vendors

##### Post Routes

1. **Auth**

- **POST** _/vendor/auth/register_ : Register a new vendor
- Request

```json
{
  "coolJarStock": 10,
  "bottleJarStock": 11,
  "defaultGroupName": "Group 1",
  "firstDriverName": "John Doe",
  "firstDriverMobileNumber": "+911111122231",
  "fullBusinessName": "Bizness",
  "brandName": "Nike",
  "mobileNumber": "+919111112223",
  "country": "India",
  "city": "Mumbai",
  "state": "Maharashtra",
  "fullVendorName": "Vendor 1"
}
```

- Response

```json
{
  "success": true,
  "data": {}
  }
}
```

2. **Inventory**

- **POST** _/vendor/inventory/daily-load_ : Jars loaded for the day

- Request

```json
{
  "vendor": "60cb5fc78863255d0c1bb95b",
  "driver": "60cb5fc88863255d0c1bb95f",
  "date": "22/06/2021",
  "load18": 20,
  "load20": 15
}
```

- Response

```json
{
  "success": true,
  "data": {}
}
```

- **POST** _/vendor/inventory/daily-unload_ : Jars unloaded for the day
- _/vendor/inventory/total-add-stock_ : Add jars in stock
- **POST** _/vendor/inventory/total-remove-stock_ : Remove jars from stock
- **GET** _/vendor/inventory/get-expected-unload?vendor=60cb5fc78863255d0c1bb95b&driver=60cb5fc88863255d0c1bb95f&date=22/06/2021_: Get expected unload for a driver on a given date
- Response

```json
{
  "success": true,
  "data": {
    "expectedReturned20": 6,
    "expectedEmpty20": 5
    "expectedReturned18": "some number"
    "expectedEmpty20": "some number"
  }
}
```

3.  **Customer**

- **POST** _/vendor/customer_ : Create customer for vendor
- Request

```json
{
  "typeOfCustomer": "Regular",
  "name": "Customer 1",
  "mobileNumber": "+919739789874",
  "address": {
    "type": "Point",
    "coordinates": [52.6345, 78.2534]
  },
  "city": "Mumbai",
  "area": "Some Area",
  "pincode": "123456",
  "email": "abc@gmail.com",
  "group": "60cb5fc78863255d0c1bb95d",
  "vendor": "60cb5fc78863255d0c1bb95b",
  "product": "18L",
  "balanceJars": 10,
  "dispenser": 1,
  "deposit": 0,
  "rate": 50
}
```

- **POST** _/vendor/customer/add-product_ : Add product to customer's usual request

4.  **Group**

- _/vendor/group_ : Create a group for the vendor (Each group will have a driver)

5.  **Driver**

- **POST** _/vendor/driver_ : Add driver
- **POST** _/vendor/driver/add-transaction_ : Add transaction for the day (Will be changed to another endpoint later)
- Request

```json
{
  "vendor": "60cb5fc78863255d0c1bb95b",
  "driver": "60cb5fc88863255d0c1bb95f",
  "customer": "60cb7096190cf36244603acf",
  "soldJars": 9,
  "emptyCollected": 5,
  "product": "20L",
  "date": "22/06/2021"
}
```

- Response (For first transaction of the day)

```json
{
  "success": true,
  "data": {
    "created": {
      "_id": "60cf59b446af3d397cad8f3d",
      "vendor": "60cb5fc78863255d0c1bb95b",
      "driver": "60cb5fc88863255d0c1bb95f",
      "date": "2021-06-21T18:30:00.000Z",
      "transactions": [
        {
          "_id": "60cf59b446af3d397cad8f3e",
          "customer": "60cb7096190cf36244603acf",
          "soldJars": 9,
          "emptyCollected": 5,
          "product": "20L"
        }
      ],
      "createdAt": "2021-06-20T15:07:32.534Z",
      "updatedAt": "2021-06-20T15:07:32.534Z"
    }
  }
}
```

6.  **Order**

- **POST** _/vendor/order_ : Create order
- Request

```json
{
  "preferredDate": "9/07/2021",
  "customer": "60cc1a931b815f3630a51118",
  "product": "60cc1ae11b815f3630a5111e",
  "vendor": "60cb5fc78863255d0c1bb95b",
  "jarQty": 24
}
```

- Response

```json
{
  "success": true,
  "data": {}
  }
}
```

7.  **Product**

- **POST** _/vendor/product_ : Add product (18L or 20L)
- **POST** _/vendor/dispenser_ : Add dispenser

8.  **Payments**

- **POST** _/vendor/customer/payment_ : Create payment for customer
- **POST** _/vendor/driver/payment_ : Create payment for driver
- **POST** _/vendor/customer/deposit_ : Deposit advance from customer

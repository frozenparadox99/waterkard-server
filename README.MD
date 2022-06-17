# Project: WaterKard

## End-point: Register Vendor
### Method: POST
>```
>http://localhost:4000/api/v1/vendor/auth/register
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "coolJarStock": 100,
    "bottleJarStock": 100,
    "defaultGroupName": "Group1",
    "firstDriverName":"Matt Damon",
    "firstDriverMobileNumber":"+913234567890",
    "fullBusinessName":"Ferrari",
    "brandName":"Ford",
    "mobileNumber":"+918234567891",
    "country":"India",
    "city":"Mumbai",
    "state":"Maharashtra",
    "fullVendorName": "Vendor Ford"
}

```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Add Order
### Method: POST
>```
>http://localhost:4000/api/v1/vendor/order
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "preferredDate": "9/07/2021",
    "customer": "60cc1a931b815f3630a51118",
    "product": "60cc1ae11b815f3630a5111e",
    "vendor": "60cb5fc78863255d0c1bb95b",
    "jarQty": 24
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Add Daily Transaction
### Method: POST
>```
>http://localhost:4000/api/v1/vendor/driver/add-transaction
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "vendor": "614d7d9e06745123506d4ce1",
    "driver": "614d7d9e06745123506d4ce5",
    "customer": "614d8921b1a16f2670a05198",
    "soldJars": 4,
    "emptyCollected": 0,
    "product": "20L",
    "date": "27/09/2021",
    "status": "completed"
}

{
    "customer": "abcd",
    "vendor": "614d7d9e06745123506d4ce1",
    "driver": "614d7d9e06745123506d4ce5",
    "date": "25/09/2021",
    "status": "skipped"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Daily Load
### Method: POST
>```
>http://localhost:4000/api/v1/vendor/inventory/daily-load
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "vendor": "614d7d9e06745123506d4ce1",
    "driver": "614d7d9e06745123506d4ce5",
    "date": "27/09/2021",
    "load18": 10,
    "load20": 10
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Expected Unload
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/inventory/get-expected-unload?driver=614d7d9e06745123506d4ce5&vendor=614d7d9e06745123506d4ce1&date=26/09/2021
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|driver|614d7d9e06745123506d4ce5|
|vendor|614d7d9e06745123506d4ce1|
|date|26/09/2021|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Daily Unload
### Method: POST
>```
>http://localhost:4000/api/v1/vendor/inventory/daily-unload
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "vendor": "614d7d9e06745123506d4ce1",
    "driver": "614d7d9e06745123506d4ce5",
    "date": "26/09/2021",
    "unloadReturned18": 36,
    "unloadReturned20": 40,
    "unloadEmpty18": 0,
    "unloadEmpty20": 0
}



```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Customers
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/customer?vendor=6182074daa0c3b001d9171be&date=3/11/2021
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|vendor|6182074daa0c3b001d9171be|
|date|3/11/2021|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Vendor
### Method: GET
>```
>http://localhost:4000/api/v1/vendor?mobileNumber=%2B919711210515
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|mobileNumber|%2B919711210515|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Groups for Vendor
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/group/all?vendor=60d419d78297b273c4a2b570
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|vendor|60d419d78297b273c4a2b570|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Home Screen for Vendor
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/home?vendor=60cb5fc78863255d0c1bb95b
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|vendor|60cb5fc78863255d0c1bb95b|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Customers by Order Date
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/customers-by-date?vendor=60d5e6c449ea7ea8385f4db7
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|vendor|60d5e6c449ea7ea8385f4db7|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Daily Inventory Status
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/inventory/daily-status?vendor=60d5e6c449ea7ea8385f4db7&date=3/8/2021&driver=60d5e6c449ea7ea8385f4dbb
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|vendor|60d5e6c449ea7ea8385f4db7|
|date|3/8/2021|
|driver|60d5e6c449ea7ea8385f4dbb|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update Customer
### Method: PATCH
>```
>http://localhost:4000/api/v1/vendor/customer
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "id": "60d5e47b49ea7ea8385f4d89",
    "name": "Kishore"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update Customers Groups
### Method: PATCH
>```
>http://localhost:4000/api/v1/vendor/customer/groups
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "updatedCustomersGroups": [
{"customer": "60d5e73d49ea7ea8385f4dc8", "group": "60d5e6c449ea7ea8385f4db9"},
{"customer":"60d5e88c49ea7ea8385f4e11" ,"group": "60d5e81c49ea7ea8385f4e03"}
]
}

```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Driver Login
### Method: POST
>```
>http://localhost:4000/api/v1/driver/login
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "mobileNumber": "+919090897890",
    "password": "K2GO8O"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Customer Deposits
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/customer/deposits?vendor=6130ff6458a525001d9cfd8e
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|vendor|6130ff6458a525001d9cfd8e|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Add Driver Payment
### Method: POST
>```
>http://localhost:4000/api/v1/vendor/driver/payment
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "from": "Customer",
    "to": "Driver",
    "vendor": "60d5e6c449ea7ea8385f4db7",
    "driver": "60feb6fd0e7a61001c6b075c",
    "date": "30/7/2021",
    "customer": "6101539be638e9001ce220ed",
    "product": "18L",
    "mode": "Online",
    "onlineAppForPayment": "UPI",
    "amount": 30
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Driver Payments
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/driver/payments?vendor=60d5e6c449ea7ea8385f4db7
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|vendor|60d5e6c449ea7ea8385f4db7|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Driver's Customers
### Method: GET
>```
>http://localhost:4000/api/v1/driver/customers?driver=60feb6fd0e7a61001c6b075c
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|driver|60feb6fd0e7a61001c6b075c|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Driver's Payments
### Method: GET
>```
>http://localhost:4000/api/v1/driver/payments?driver=60d5e6c449ea7ea8385f4dbb
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|driver|60d5e6c449ea7ea8385f4dbb|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Driver's Customers' Details
### Method: GET
>```
>http://localhost:4000/api/v1/driver/customers/details?driver=60feb6fd0e7a61001c6b075c
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|driver|60feb6fd0e7a61001c6b075c|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Daily Transactions By Customer
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/transactions?vendor=60cb5fc78863255d0c1bb95b&customer=60cb7096190cf36244603acf&page=1
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|vendor|60cb5fc78863255d0c1bb95b|
|customer|60cb7096190cf36244603acf|
|page|1|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update Daily Transaction
### Method: PATCH
>```
>http://localhost:4000/api/v1/vendor/transactions
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "jarAndPayment": "60d6a5e7478506287832a197",
    "transaction": "60d6a5e7478506287832a198",
    "soldJars": 9
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Stock Details
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/stock-details?vendor=6129d9e08ca191001d359a46
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|vendor|6129d9e08ca191001d359a46|
|date|28/06/2021|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Register Customer
### Method: POST
>```
>http://localhost:4000/api/v1/vendor/customer
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "typeOfCustomer":"Regular",
    "name":"Matthew McConaughy",
    "mobileNumber":"+919234567890",
    "address":{"type": "Point", "coordinates": [79.05,77.5]},
    "city":"Mumbai",
    "pincode":"500010",
    "group":"614d7d9e06745123506d4ce3",
    "vendor":"614d7d9e06745123506d4ce1",
    "product":"18L",
    "balanceJars":0,
    "dispenser":0,
    "deposit":500,
    "rate":25,
    "email":"mat1@gmail.com",
    "area":"Borewell"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Remove from Total Stock
### Method: POST
>```
>http://localhost:4000/api/v1/vendor/inventory/total-remove-stock
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "coolJarStock":0, 
    "bottleJarStock":5, 
    "dateAdded":"27/08/2021", 
    "vendor": "6128efb45d65fd5518e6b8c5"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update Vendor
### Method: PATCH
>```
>http://localhost:4000/api/v1/vendor
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Body (**raw**)

```json
{
    "vendor": "6130ff6458a525001d9cfd8e",
    "fullVendorName": "Sushant Lenka"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Customer Invoice
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/customer/invoice?vendor=6133087cd93312001d54d36e&customer=61330ab8d93312001d54d3aa&startDate=20/01/2021&endDate=20/10/2021
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|vendor|6133087cd93312001d54d36e|
|customer|61330ab8d93312001d54d3aa|
|startDate|20/01/2021|
|endDate|20/10/2021|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Customer By Id
### Method: GET
>```
>http://localhost:4000/api/v1/vendor/customer/id?vendor=6130ff6458a525001d9cfd8&customer=6131000c58a525001d9cfdba
>```
### Headers

|Content-Type|Value|
|---|---|
|Accept|*/*|


### Headers

|Content-Type|Value|
|---|---|
|User-Agent|Thunder Client (https://www.thunderclient.io)|


### Query Params

|Param|value|
|---|---|
|vendor|6130ff6458a525001d9cfd8|
|customer|6131000c58a525001d9cfdba|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)

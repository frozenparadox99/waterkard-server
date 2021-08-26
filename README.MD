### Further Work

##### Driver Module

-

##### Vendor Module

- Statistics to be made for the current day (Excluding missing, total and godown stock)
- While unloading, calculate that daily inventory's missing jars. Add new fields in total inventory to store overall missing jars. Add the daily inventory's missing jars to the vendor's total inventory field of missing jars.
- Today's sold jars have to be calculated via aggregation always.
- Remove stock to balance missing jars. Add a description field. If it contains 'missing', then subtract that amount from missing, and if it is more than the missing present, subtract the remaining portion from added stock.
- While getting customers for home page, add a sold boolean to show red or green status.
- To calculate customer balance, during add transaction -> customer balance = customer balance + sold - empty returned
- To calculate daily inventory's group balance -> sold - empty collected for that group on that day
- While loading daily inventory, subtract from godown stock, then while unloading add to godown stock. Total stock = Godown stock + Customer balance sum

# Databricks notebook source
## reading the data

import pandas as pd

df1 = pd.read_csv("/Volumes/main/default/supply_chain_inventory_management_data/Inventory_Stock_Data.csv");
df1

df2 = pd.read_csv("/Volumes/main/default/supply_chain_inventory_management_data/Sales_Shipment_Data.csv")
df2

df3=pd.read_csv("/Volumes/main/default/supply_chain_inventory_management_data/retail_store_inventory.csv")
df3

df4 = pd.read_csv("/Volumes/main/default/supply_chain_inventory_management_data/supply_chain_data.csv")
df4

df5 = pd.read_csv("/Volumes/main/default/supply_chain_inventory_management_data/warehouse_district_store.csv")
df5

df6 = pd.read_csv("/Volumes/main/default/supply_chain_inventory_management_data/warehouse_national_central_medical_store.csv")
df6

df7 = pd.read_csv("/Volumes/main/default/supply_chain_inventory_management_data/warehouse_regional_warehouse.csv")
df7

# COMMAND ----------

# -- total records in the raw data

print("Inventory_Stock_Data = ",len(df1))
print("Sales_Shipment_Data = ",len(df2))
print("retail_store_inventory = ",len(df3))
print("supply_chain_data = ",len(df4))
print("warehouse_district_store = ",len(df5))
print("warehouse_national_central_medical_store = ",len(df6))
print("warehouse_regional_warehouse = ",len(df7))

# COMMAND ----------

# MAGIC %sql
# MAGIC
# MAGIC -- count of data records stored in the bronze layer 
# MAGIC
# MAGIC SELECT COUNT(*) AS bronze_inventory_stock_data
# MAGIC FROM main.default.bronze_inventory_stock_data;
# MAGIC
# MAGIC SELECT COUNT(*) AS bronze_retail_store_inventory
# MAGIC FROM main.default.bronze_retail_store_inventory;
# MAGIC
# MAGIC SELECT COUNT(*) AS bronze_sales_shipment_data
# MAGIC FROM main.default.bronze_sales_shipment_data;
# MAGIC
# MAGIC SELECT COUNT(*) AS bronze_supply_chain_data
# MAGIC FROM main.default.bronze_supply_chain_data;
# MAGIC
# MAGIC SELECT COUNT(*) AS bronze_warehouse_district_store
# MAGIC FROM main.default.bronze_warehouse_district_store;
# MAGIC
# MAGIC SELECT COUNT(*) AS bronze_warehouse_national_central_medical_store
# MAGIC FROM main.default.bronze_warehouse_national_central_medical_store;
# MAGIC
# MAGIC SELECT COUNT(*) AS bronze_warehouse_regional_warehouse
# MAGIC FROM main.default.bronze_warehouse_regional_warehouse;

# COMMAND ----------

# MAGIC %sql
# MAGIC -- count of data records stored in the silver layer 
# MAGIC
# MAGIC SELECT COUNT(*) AS silver_inventory_stock_data
# MAGIC FROM main.default.silver_inventory_stock_data;
# MAGIC
# MAGIC -- SELECT COUNT(*) AS silver_retail_store_inventory
# MAGIC -- FROM main.default.silver_retail_store_inventory;
# MAGIC
# MAGIC -- SELECT COUNT(*) AS silver_sales_shipment_data
# MAGIC -- FROM main.default.silver_sales_shipment_data;
# MAGIC
# MAGIC -- SELECT COUNT(*) AS silver_supply_chain_data
# MAGIC -- FROM main.default.silver_supply_chain_data;
# MAGIC
# MAGIC -- SELECT COUNT(*) AS silver_warehouse_district_store
# MAGIC -- FROM main.default.silver_district_store;
# MAGIC
# MAGIC -- SELECT COUNT(*) AS silver_warehouse_national_central_medical_store
# MAGIC -- FROM main.default.silver_national_medical_store;
# MAGIC
# MAGIC -- SELECT COUNT(*) AS silver_warehouse_regional_warehouse
# MAGIC -- FROM main.default.silver_regional_warehouse;
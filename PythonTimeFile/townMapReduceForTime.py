import pandas as pd 
from datetime import date
import pymongo
from bson.code import Code
import time


myclient = pymongo.MongoClient()
mydb = myclient["thedrifters"]
hdbWArea = mydb["hdbWArea"]
hdbWArea = mydb["hdbWArea"]
map = Code("function (){emit(this.Area.Town, this.ResalePrice);}")
reduce = Code("function (key,value){return Array.avg(value);}")
start = time.time()
result = hdbWArea.map_reduce(map,reduce,"myresults").find().sort("_id")
end = time.time()
print(end - start)
json = "["
for r in result:
	json += str(r) + ","
json = json[:-1] + "]"

# print(json)
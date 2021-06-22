import pandas as pd 
from datetime import date
import pymongo
from bson.code import Code


myclient = pymongo.MongoClient()
mydb = myclient["thedrifters"]
hdbWArea = mydb["hdbWArea"]
map = Code("function (){emit(this.Area.Town, this.ResalePrice);}")
reduce = Code("function (key,value){return Array.avg(value);}")
result = hdbWArea.map_reduce(map,reduce,"myresults")

json = "["
for r in result.find().sort("_id"):
	json += str(r) + ","
json = json[:-1] + "]"

print(json)
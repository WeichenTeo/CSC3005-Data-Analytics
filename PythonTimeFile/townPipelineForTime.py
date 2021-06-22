import pandas as pd 
from datetime import date
import pymongo
from bson.code import Code
import time


myclient = pymongo.MongoClient()
mydb = myclient["thedrifters"]
hdb = mydb["hdb"]
map = Code("function (){emit(this.Area.Town, this.ResalePrice);}")
reduce = Code("function (key,value){return Array.avg(value);}")
result = hdb.map_reduce(map,reduce,"myresults")

pipeline= [
    {"$lookup":
        {
            "from": "area",
            "localField": "Area",
            "foreignField": "_id",
            "as": "Area"
        }},
        {"$unwind":"$Area"},
        {
        "$group":{
            "_id" :"$Area.Town",
            "avg_price":{"$avg":"$ResalePrice"
        }}
    },
    {
    '$sort':{
        '_id':1
    }}
]

start = time.time()
hdb.aggregate(pipeline)
end = time.time()
print(end - start)
# json = "["
# for r in (hdb.aggregate(pipeline)):
#     json += str(r) + ","
# json = json[:-1] + "]"

# print(json)
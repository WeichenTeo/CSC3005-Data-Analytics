import pandas as pd 
from datetime import date
import pymongo
from bson.code import Code
import time


myclient = pymongo.MongoClient()
mydb = myclient["thedrifters"]
hdbWArea = mydb["hdbWArea"]

pipeline= [{
    '$group':{
        '_id' :"$Area.Town",
        'avg_price':{'$avg':"$ResalePrice"}
    }}
    ,{
    '$sort':{
    	'_id':1
    }}
]
start = time.time()
hdbWArea.aggregate(pipeline)
end = time.time()
print(end - start)
# json = "["
# for r in (hdbWArea.aggregate(pipeline)):
#     json += str(r) + ","
# json = json[:-1] + "]"

# print(json)
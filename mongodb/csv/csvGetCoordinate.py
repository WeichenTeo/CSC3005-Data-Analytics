import pandas as pd 
from datetime import date
import pymongo
import sys

#get input
postalCode = sys.argv[1]
#Read csv
zipcode = pd.read_csv("sg_zipcode_mapper.csv", encoding = "ISO-8859-1") 
zipcode = zipcode.loc[zipcode["postal"] == int(postalCode)].iloc[0]
longitude = zipcode["longitude"] if("longitude" in zipcode) else zipcode["longtitude"]
print(str(zipcode["latitude"])+"%2C"+ str(longitude))

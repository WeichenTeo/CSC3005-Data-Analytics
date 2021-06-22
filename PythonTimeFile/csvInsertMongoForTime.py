import pandas as pd 
from datetime import date
import pymongo
import sys
import time


#get input
# receivedFileName=sys.argv[1]
#Read csv
zipcode = pd.read_csv("sg_zipcode_mapper.csv", encoding = "ISO-8859-1") 
zipcode = zipcode.rename(columns={"blk_no":"block","road_name":"street_name"})
resaleFlat = pd.read_csv("resale-flat-prices-based-on-registration-date-from-jan-2017-onwards.csv", encoding = "ISO-8859-1") 

#Merge data into single dataframe
combined = pd.merge(resaleFlat, zipcode, on=['block','street_name']).sort_values(by=['town']).dropna()

#Retrieve individual column with unique values
towns = sorted(combined["town"].drop_duplicates())
flatType = sorted(combined["flat_type"].drop_duplicates())
storeyRange = sorted(combined["storey_range"].drop_duplicates())
flatModel = sorted(combined["flat_model"].drop_duplicates())

#database connection
myclient = pymongo.MongoClient()
mydb = myclient["thedrifters"]
areaCollection = mydb["area"]
hdbCollection = mydb["hdb"]
hdbWAreaCollection = mydb["hdbWArea"]
for i in range(10):
	print(i)
	totalTime = 0.0
	totalTimeWArea = 0.0
	hdbCollection.delete_many({})
	areaCollection.delete_many({})
	hdbWAreaCollection.delete_many({})

	#Initialise dictionary to store id
	insertStreetDict = {}
	#Loop through all town
	for town in towns:
		#Retrieve all streetname belong to the town
		streetName = combined.loc[combined['town'] == town]
		#Loop through those streetname
		for index, row in streetName.iterrows():
			#insert into town collection
			start = time.time()
			_id = areaCollection.insert_one({
				"Name":row["street_name"],
				"Town": town,
				"CreatedDate": str(date.today()),
				"CreatedBy":0,
				"UpdatedDate": None,
				"UpdatedBy": None
			}).inserted_id
			totalTime += time.time() - start
			insertStreetDict[row["street_name"]] = _id

	#Loop through the entire csv
	for index, row in combined.iterrows():
		#Retrieve the id corresponding to the field
		streetNameID = insertStreetDict[row["street_name"]]
		#Spelling mistake in the excel "longtitude", 
		#By default will retrieve the correct spelling
		#But will retrieve the mispell row otherwise
		longitude = row["longitude"] if("longitude" in row) else row["longtitude"]
		#Calculate the end date
		leaseEndDate = int(row["month"].split("-")[0]) + int(row["remaining_lease"].split(" years")[0])
		#insert into hdb collection
		start = time.time()
		hdbCollection.insert_one({
				"Block": row["block"],
				"Floor": row["floor_area_sqm"],
				"Latitude": row["latitude"],
				"Longitude": longitude,
				"PostalCode": row["postal"],
				"LeaseCommenceDate": row["lease_commence_date"],
				"LeaseEndDate": leaseEndDate,
				"ResalePrice": row["resale_price"],
				"Area": streetNameID,
				"FlatType": row["flat_type"],
				"FlatModel": row["flat_model"],
				"StoreyRange": row["storey_range"],
				"CreatedDate": str(date.today()),
				"CreatedBy":0,
				"UpdatedDate": None,
				"UpdatedBy": None
			})
		totalTime += time.time() - start
		#insert into hdbWArea collection
		start = time.time()
		hdbWAreaCollection.insert_one({
				"Block": row["block"],
				"Floor": row["floor_area_sqm"],
				"Latitude": row["latitude"],
				"Longitude": longitude,
				"PostalCode": row["postal"],
				"LeaseCommenceDate": row["lease_commence_date"],
				"LeaseEndDate": leaseEndDate,
				"ResalePrice": row["resale_price"],
				"Area": {
					"Town":row["street_name"],
					"StreetName": row["street_name"]
					},
				"FlatType": row["flat_type"],
				"FlatModel": row["flat_model"],
				"StoreyRange": row["storey_range"],
				"CreatedDate": str(date.today()),
				"CreatedBy":0,
				"UpdatedDate": None,
				"UpdatedBy": None
			})
		totalTimeWArea += time.time() - start

print("Total Time:",(totalTime / 10))
print("Total Time With Area:",(totalTimeWArea / 10))
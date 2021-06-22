import pandas as pd 
import mysql.connector
import sys
from datetime import date
import time

totalTime = 0.0
#get input
receivedFileName="resale-flat-prices-based-on-registration-date-from-jan-2017-onwards.csv"
#database connection
mysqldb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="Dragon954321!",
  database="thedrifters"
)

mycursor = mysqldb.cursor()

#Read csv
zipcode = pd.read_csv("sg_zipcode_mapper.csv", encoding = "ISO-8859-1") 
zipcode = zipcode.rename(columns={"blk_no":"block","road_name":"street_name"})
resaleFlat = pd.read_csv(receivedFileName, encoding = "ISO-8859-1") 

#Merge data into single dataframe
combined = pd.merge(resaleFlat, zipcode, on=['block','street_name']).sort_values(by=['town']).dropna()

#Retrieve individual column with unique values
towns = sorted(combined["town"].drop_duplicates())
flatType = sorted(combined["flat_type"].drop_duplicates())
storeyRange = sorted(combined["storey_range"].drop_duplicates())
flatModel = sorted(combined["flat_model"].drop_duplicates())

#SQL statement for insert into table
insertTown = "INSERT INTO Town(Name, CreatedBy) VALUES (%s, 0)"
insertStreet = "INSERT INTO StreetName(Name, CreatedBy, TownID) VALUES (%s, 0, %s)"
for i in range(10):
	mycursor.execute("DELETE FROM StreetName")
	mycursor.execute("DELETE FROM Town")
	mycursor.execute("DELETE FROM FlatType")
	mycursor.execute("DELETE FROM FlatModel")
	mycursor.execute("DELETE FROM StoreyRange")
	mycursor.execute("DELETE FROM ResaleHdb")
	#Initialise dictionary to store id
	insertStreetDict = {}
	#Loop through all town
	for town in towns:
		#try to run the code
		try:
			#Insert into mysql
			start = time.time()
			mycursor.execute(insertTown, (town,))
			totalTime += time.time() - start
			#Get the id of inserted data
			townId = mycursor.lastrowid
		#exception thrown by mysql
		except mysql.connector.Error as e:
			#custom sql state when found duplicate data
			if e.sqlstate == "45000":
				#existing row id is returned
				townId = e.msg
			#other sql state, raise exception
			else:
				raise Exception(e)
		#Retrieve all streetname belong to the town
		streetName = combined.loc[combined['town'] == town]
		#Loop through those streetname
		for index, row in streetName.iterrows():
			#try to run the code
			try:
				#Insert into mysql
				start = time.time()
				mycursor.execute(insertStreet, (row["street_name"],townId))
				totalTime += time.time() - start
				#Get the id of inserted data
				streetId = mycursor.lastrowid
			#exception thrown by mysql
			except mysql.connector.Error as e:
				#custom sql state when found duplicate data
				if e.sqlstate == "45000":
					#existing row id is returned
					streetId = e.msg
				#other sql state, raise exception
				else:
					raise Exception(e)
			#Store the streetId into dictionary
			insertStreetDict[row["street_name"]] = streetId

	#SQL statement for insert into table
	insertFType = "INSERT INTO FlatType(Type, CreatedBy) VALUES (%s, 0)"
	#Initialise dictionary to store id
	insertFTypeDict = {}
	#Loop through all flat type
	for fType in flatType:
		#try to run the code
		try:
			#Insert into mysql
			start = time.time()
			mycursor.execute(insertFType, (fType,))
			totalTime += time.time() - start
			#Get the id of inserted data
			fTypeId = mycursor.lastrowid
		#exception thrown by mysql
		except mysql.connector.Error as e:
			#custom sql state when found duplicate data
			if e.sqlstate == "45000":
				#existing row id is returned
				fTypeId = e.msg
			#other sql state, raise exception
			else:
				raise Exception(e)
		#Store the flat type id into dictionary
		insertFTypeDict[fType] = fTypeId

	#SQL statement for insert into table
	insertFModel = "INSERT INTO FlatModel(Model, CreatedBy) VALUES (%s, 0)"
	#Initialise dictionary to store id
	insertFModelDict = {}
	#Loop through all flat model
	for model in flatModel:
		#try to run the code
		try:
			#Insert into mysql
			start = time.time()
			mycursor.execute(insertFModel, (model,))
			totalTime += time.time() - start
			#Get the id of inserted data
			fModelId = mycursor.lastrowid
		#exception thrown by mysql
		except mysql.connector.Error as e:
			#custom sql state when found duplicate data
			if e.sqlstate == "45000":
				#existing row id is returned
				fModelId = e.msg
			#other sql state, raise exception
			else:
				raise Exception(e)
		#Store the flat model id into dictionary
		insertFModelDict[model] = fModelId

	#SQL statement for insert into table
	insertStoreyRange = "INSERT INTO StoreyRange(StoreyRange, CreatedBy) VALUES (%s, 0)"
	#Initialise dictionary to store id
	insertStoreyRangeDict = {}
	#Loop through all storey range
	for sRange in storeyRange:
		#try to run the code
		try:
			#Insert into mysql
			start = time.time()
			mycursor.execute(insertStoreyRange, (str(sRange),))
			totalTime += time.time() - start
			#Get the id of inserted data
			sRangeId = mycursor.lastrowid
		#exception thrown by mysql
		except mysql.connector.Error as e:
			#custom sql state when found duplicate data
			if e.sqlstate == "45000":
				#existing row id is returned
				sRangeId = e.msg
			#other sql state, raise exception
			else:
				raise Exception(e)
		#Store the storey model id into dictionary
		insertStoreyRangeDict[sRange] = sRangeId

	#SQL statement for insert into table
	insertResaleHdb = "INSERT INTO ResaleHdb(Block, FloorArea, Latitude, Longitude, PostalCode, LeaseCommenceDate, LeaseEndDate, ResalePrice, CreatedBy, StreetNameID, FlatTypeID, StoreyRangeID, FlatModelID) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 0, %s, %s, %s, %s)"
	#Loop through the 
	for index, row in combined.iterrows():
		#Retrieve the id corresponding to the field
		flatTypeID = insertFTypeDict[row["flat_type"]]
		flatModelID = insertFModelDict[row["flat_model"]]
		storeyRangeID = insertStoreyRangeDict[row["storey_range"]]
		streetNameID = insertStreetDict[row["street_name"]]
		#Spelling mistake in the excel "longtitude", 
		#By default will retrieve the correct spelling
		#But will retrieve the mispell row otherwise
		longitude = row["longitude"] if("longitude" in row) else row["longtitude"]
		#Calculate the end date
		leaseEndDate = int(row["month"].split("-")[0]) + int(row["remaining_lease"].split(" years")[0])
		#Procedure to insert hdb
		insertHdbProc = "insert_into_resale"
		#Arguments for the procedure
		insertArgs = [row["block"],row["floor_area_sqm"],row["latitude"],longitude,row["postal"],row["lease_commence_date"],leaseEndDate,row["resale_price"],0,streetNameID,flatTypeID,storeyRangeID,flatModelID]
		#Call the procedure with the arguments
		start = time.time()
		mycursor.callproc(insertHdbProc, insertArgs)
		totalTime += time.time() - start

print("Total Time:",(totalTime / 10))
#Commit the db
mysqldb.commit()
#Close the connection
mycursor.close()
mysqldb.close()
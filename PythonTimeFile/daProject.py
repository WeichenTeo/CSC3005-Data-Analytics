import pandas as pd
import numpy as np
import requests
import json
from datetime import datetime
from dateutil.relativedelta import relativedelta
pd.set_option('max_columns',None)
# pd.set_option('display.max_rows',None)

#get input
receivedFileName="resale-flat-prices-based-on-registration-date-from-jan-2017-onwards.csv"
zipcode = pd.read_csv("sg_zipcode_mapper.csv", encoding = "ISO-8859-1")
zipcode = zipcode.rename(columns={"blk_no":"block","road_name":"street_name"})
resaleFlat = pd.read_csv(receivedFileName, encoding = "ISO-8859-1")

#Merge data into single dataframe
combined = pd.merge(resaleFlat, zipcode, on=['block','street_name']).sort_values(by=['town']).dropna()

df = pd.DataFrame(data = combined)

# check if there is any null data
np.where(df.applymap(lambda x: x == ''))

df = df.rename(columns={"remaining_lease":"end_date"})
df = df.sort_values(by=['street_name'])
df["point_of_interest"] = 0
df = df.reset_index(drop=True)
# 0 is false
# 1 is true
for i, row in df.iterrows():
    try:
        datetime_object = datetime(2020, 2 ,2)
        if "month" in row["end_date"]:
            ttSplit = row["end_date"].split("years")
            year = int(ttSplit[0].strip()) * 12
            monthSplit = ttSplit[1].split("month")
            month = int(monthSplit[0].strip())
            totalMonth = year + month
        else:
            monthSplit = row["end_date"].split("years")
            totalMonth = int(monthSplit[0].strip()) * 12
            row["month"] = row["month"].replace("-", " ")
            datetime_object = datetime.strptime(row["month"], '%Y %m')
        #get the end date value
        endDate = datetime_object + relativedelta(months=+totalMonth)
        df.at[i, 'end_date'] = '{0}-{1:02}'.format(endDate.year ,endDate.month)

        #print(df.loc[i,'street_name'])
        if i == 0 or (df.loc[i, 'street_name'] != df.loc[i-1, 'street_name']):
            #place api
            urlAPI = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+str(row["latitude"])+','+ str(row["longtitude"]) +'&radius=500&type=shopping_mall&key=AIzaSyCJO7Y5uy8gF-y03PjMMBtPRQSjjpirb44'
            r = requests.post(url=urlAPI)

            # extracting response text
            result = r.text
            res = json.loads(result)
            #check if there is any point of interest return
            if res["status"] == "OK":
                pointOfInterest= 1
            else:
                pointOfInterest = 0
        else:
            pointOfInterest = df.at[i-1, 'point_of_interest']
        df.at[i, 'point_of_interest'] = pointOfInterest
    except KeyError as e:
        print(e)

df = df.drop(['block','street_name','searchval','building','postal.1','month'], axis=1)
print(df)

# there is no null data
# df["travelTime"] = 0
# googledf = df.copy()
# googledf = googledf.drop_duplicates(subset='street_name',keep='first')
# print(df)
# index = googledf.index
# for i, row in googledf.iterrows():
#     try:
#         destination = "822166"
#         # defining the api-endpoint
#         urlAPI = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&region=sg&mode=transit&origins='+str(row["latitude"])+','+ str(row["longtitude"]) +'&destinations='+destination+'&key=AIzaSyCJO7Y5uy8gF-y03PjMMBtPRQSjjpirb44 '
#
#         r = requests.post(url = urlAPI)
#
#         # extracting response text
#         result = r.text
#
#         res = json.loads(result)
#
#         travelTime = res["rows"][0]["elements"][0]["duration"]["text"]
#         print(travelTime)
#
#         if "hour" in travelTime:
#             ttSplit = travelTime.split("hour")
#             hour = int(ttSplit[0].strip()) * 60
#             minSplit = ttSplit[1].split("min")
#             min = int(minSplit[0].strip())
#             totalTime = hour + min
#         else:
#             minSplit = travelTime.split("min")
#             totalTime = int(minSplit[0].strip())
#
#         # googledf.iloc[i] = {"travelTime":totalTime}
#         # print("total time = ", totalTime," Row ", googledf.iloc[i])
#
#         #print(res["rows"][0]["elements"][0]["duration"]["text"])
#     except KeyError as e:
#         print(e)
#         #print(result)
#
# googledf = googledf.drop(['town', 'month','block','street_name','flat_model','remaining_lease','lease_commence_date','searchval','building','postal.1','postal'], axis=1)
#
# print(googledf)


#print(df)


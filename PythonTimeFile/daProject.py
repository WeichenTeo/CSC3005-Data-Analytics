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

df = df.sort_values(by=['street_name'])
df["point_of_interest"] = 0
df = df.reset_index(drop=True)
# 0 is false
# 1 is true
for i, row in df.iterrows():
    try:
       # datetime_object = datetime(2020, 2 ,2)
        if "month" in row["remaining_lease"]:
            ttSplit = row["remaining_lease"].split("years")
            year = int(ttSplit[0].strip()) * 12
            monthSplit = ttSplit[1].split("month")
            month = int(monthSplit[0].strip())
            totalMonth = year + month
        else:
            monthSplit = row["remaining_lease"].split("years")
            totalMonth = int(monthSplit[0].strip()) * 12
        endDatetime = datetime.strptime(row["month"], '%Y-%m')
        #get the end date value
        endDate = endDatetime + relativedelta(months=+totalMonth)
        currentDate = datetime.now()
        numberOfMonth = (endDate.year - currentDate.year) * 12 + (endDate.month - currentDate.month)
        df.at[i, 'remaining_lease'] = numberOfMonth
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

flatType = sorted(df["flat_type"].drop_duplicates())
flatType
i = 1
for x in flatType:
    df["flat_type"] = df["flat_type"].replace([x], i)
    i = i + 1

storeyRange = sorted(df["storey_range"].drop_duplicates())
storeyRange
i = 1
for x in storeyRange:
    df["storey_range"] = df["storey_range"].replace([x], i)
    i = i + 1

flatModel = sorted(df["flat_model"].drop_duplicates())
flatModel
i = 1
for x in flatModel:
    df["flat_model"] = df["flat_model"].replace([x], i)
    i = i + 1

df

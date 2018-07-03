show dbs

use fit5148_db

//Task A.1
/*Task A.1*/
// mongoimport --host localhost --db fit5148_db --collection climate1 --type csv --file /Users/hlj/Desktop/mongodb/ClimateData-Part1.csv --headerline

//mongoimport --host localhost --db fit5148_db --collection fire1 --type csv --file /Users/hlj/Desktop/mongodb/FireData-Part1.csv --headerline


//Task A2
db.climate.find({"Date":"2017-12-15"}).pretty()

//Task A3

db.fire.find({"Surface Temperature (Celcius)":{$gte:65,$lte:100}},{"Longitude":1,"Latitude":1,"Confidence":1,"_id":0})


//Task A4 Find surface temperature (°C), air temperature (°C), relative humidity and maximum wind speed on 15th and 16th of December 2017. 

db.fire.aggregate([
    {$match:{$or:[{"Date":"2017-12-15"},{"Date":"2017-12-16"}]}},
    {$unwind:"$Date"},
    {$lookup:{from: "climate1", 
              localField:"Date",
              foreignField:"Date", 
              as: "completed_Date"}},
    {$unwind:"$completed_Date"},
    {$project:{"Surface Temperature (Celcius)":1, 
               "completed_Date.Air Temperature(Celcius)":1,
               "completed_Date.Relative Humidity":1, 
               "completed_Date.Max Wind Speed":1}}]).pretty()


//A5 Find datetime, air temperature (°C), surface temperature (°C) and confidence when the confidence is between 80 and 100. 
db.fire.aggregate([
{$lookup:
    {
        from: "climate1",
        localField: "Date",
        foreignField : "Date",
        as: "completed_Date"}
},
{$unwind:"$completed_Date"},
{$project:{completed_Date:0,"_id":0}},
{$project:{
"Datetime":1,"Air Temperature(Celcius)":1,
"Surface Temperature (Celcius)": 1,"Confidence":1}
},
{
    $match:{"Confidence":{$gt:80,$lt:100}}}
]).pretty()



//A6Find top 10 records with highest surface temperature (°C).
db.fire.find().sort({"Surface Temperature (Celcius)":-1}).limit(10).pretty()



//A7Find the number of fire in each day. You are required to only display total number of fire and the date in the output.
db.fire.aggregate([
{$group:{_id:"$Date",NumberOfFire:{$sum:1}}},{$project:{"Date":"$_id","NumberOfFire":1,"_id":0}}
])



//A8Find the average surface temperature (°C) for each day. You are required to only display average surface temperature (°C) and the date in the output.

db.fire.aggregate([
{$group:{_id:"$Date",AverageSurfaceTemp:{$avg:"$Surface Temperature (Celcius)"}}},{$project:{"Date":"$_id","AverageSurfaceTemp":1,"_id":0}}
])

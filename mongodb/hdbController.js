const { all } = require('./api-routes');

allHdb = require('./Model/ResaleHDBModel')
allHdbWithArea = require('./Model/ResaleHDBWithAreaModel')
spawn = require("child_process").spawn;
const {  performance } = require('perf_hooks');


//Town average price for resale price group by town
exports.getAveragePriceForEachArea = function(req,res){
    //Start the timer
    var t0 = performance.now();
    //Perform aggregrate pipeline to get average price of the hdb flat group by town 
    allHdbWithArea.aggregate([{
        $group:{
            _id:"$Area.Town",
            AveragePrice:{'$avg':"$ResalePrice"}
        }}
        ,{
        $sort:{
            _id:1
        }},{ 
        $project:{
            "Name": "$_id", "AveragePrice": "$AveragePrice"
        }
    }]).exec(function(err,data) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        //return the data to frontend
        res.json(
             {data}
        );

    });
    //Stop the timer
    var t1 = performance.now();
    //Calculate the difference
    console.log("getAveragePriceForEachArea took " + (t1 - t0) + "ms");
}
//Get the average price using map reduce
exports.getAvgPriceMap = function(req, res)
{
    //Start the timer
    var t0 = performance.now();
    //Execute the town map reduce python file
    const townMapReduce = spawn("python",["townMapReduce.py"]); 
    townMapReduce.stdout.on("data", function (data) {
        //Print the retrieve data
        console.log(`stdout: ${data}`);
      });
    //End the timer
    var t1 = performance.now();
     //Calculate the differences to retrieve the time taken to execute the run the file
    console.log("map reduce town took " + (t1 - t0) + "ms");
    //Start the timer
    var t2 = performance.now();
    //Execute the townpipeline python file with multiple documents
    const townPipeline = spawn("python",["townPipeline.py"]); //Execute Python Script to Insert data into MYSQL and pass in Uploaded file name as an argument
    townPipeline.stdout.on("data", function (data) {
        console.log(`stdout: ${data}`);
    });
    //End the timers
    var t3 = performance.now();
    //Calculate the differences to retrieve the time taken to execute the run the file
    console.log("town pipeline took " + (t3 - t2) + "ms");
    //Start the timer
    var t4 = performance.now();
    //Execute the townpipeline python file
    const townPiplelineArea = spawn("python",["townPipelineWArea.py"]); //Execute Python Script to Insert data into MYSQL and pass in Uploaded file name as an argument
    townPiplelineArea.stdout.on("data", function (data) {
        console.log(`stdout: ${data}`);
      });
      //End the timers
    var t5 = performance.now();
      //Calculate the differences to retrieve the time taken to execute the run the file
    console.log("town pipeline with area took " + (t5 - t4) + "ms");

    res.json({
        status: "success",
        message: "Average data retrieved successfully"
    });
   
}
//Join the two collection together
exports.getAllHDB = function(req, res){
    //Start the timer
    var t0 = performance.now();
    //Perform a join using aggregate
    allHdb.aggregate([{$lookup:
        {
            from: "area",
            localField: "Area",
            foreignField: "_id",
            as: "Area"
        }
    }]).sort('Area.Name').exec(function(err,hdb) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        //return the hdb json 
        res.json(
         hdb
        );

    });
    //End the timer
    var t1 = performance.now();
    //Calculate the differences and print
    console.log("getAllHDB took " + (t1 - t0) + "ms");
 }

 //Get all HDB Info from resale hdb collection with area 
 //Sort by the streetname
exports.getAllHDBWithArea= function(req, res){
    //Start the timer
    var t0 = performance.now();
    allHdbWithArea.find({}).sort('Area.StreetName').exec(function(err,hdb) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        //add the data to the array to create a json to return all hdb to the frontend
       var data = [];
        for(var i = 0; i< hdb.length; i++) {

            var array = {
                resalehdbid: hdb[i]._id,
               block :hdb[i].Block,
               Town: hdb[i].Area.Town,
               StreetName: hdb[i].Area.StreetName,
               PostalCode: hdb[i].Postal,
               StoreyRange: hdb[i].StoreyRange,
               type: hdb[i].FlatType,
               ResalePrice: hdb[i].ResalePrice
            };
            data.push(array);
        }
        
        //Return the json 
        res.json(
            data
        );
    });
    //End the timer
    var t1 = performance.now();
    //Calculate the differences and print
    console.log("getAllHDBWithArea took " + (t1 - t0) + "ms");
 }


//Get Flat filter by price
 exports.getAllByPrice = function(req,res){
     //Start the timer
       var t0 = performance.now();
        var max = req.body.maxPrice;
        var min = req.body.minPrice;
        //Allow user to input min and max price they like to filter, sort price by resale price desc
        allHdb.find({ResalePrice: {$gte:min}, ResalePrice:{$lte:max}}).sort('-ResalePrice').exec(function (err, hdb){
            if (err != null)
            {
                console.log(err);
                res.send(err);
            }
            
            res.json(
               hdb
        );
    });
    //end the timer
    var t1 = performance.now();
    //Calculate the differences and print
    console.log("getAllByPrice took " + (t1 - t0) + "ms");
 }
//Get Flat filter by price with area collection
 exports.getAllByPriceWithArea = function(req,res){
     //Start the timer
    var t0 = performance.now();
     var max = req.body.maxPrice;
     var min = req.body.minPrice;
       //Allow user to input min and max price they like to filter, sort price by resale price desc
     allHdbWithArea.find({ResalePrice: {$gte:min}, ResalePrice:{$lte:max}}).sort('-ResalePrice').exec(function (err, hdb){
         if (err != null)
         {
             console.log(err);
             res.send(err);
         }
         res.json(
            hdb
     );
 });
 //end the timer
 var t1 = performance.now();
     //Calculate the differences and print
 console.log("getAllByPriceWithArea took " + (t1 - t0) + "ms");
}

//Delete flat by id 
//parameter: hdbid
 exports.deletehdb = function (req, res) {
     //start the timer
    var t0 = performance.now();
    allHdb.remove({
        _id: req.params.hdb_id
    }, function (err, allHdb) {
        if (err)
            res.send(err);
res.json({
            status: "success",
            message: 'Selected HDB deleted'
        });
    });
    //end the timer
    var t1 = performance.now();
    //Calculate the differences and print
    console.log("deletehdb took " + (t1 - t0) + "ms");
};
//Delete flat by id  with area
//parameter: hdbid
exports.deletehdbWithArea = function (req, res) {
       //start the timer
    var t0 = performance.now();
    allHdbWithArea.remove({
        _id: req.params.deleteID
    }, function (err, allHdb) {
        if (err)
            res.send(err);
res.json({
            status: "success",
            message: 'Selected HDB deleted'
        });
    });
       //end the timer
    var t1 = performance.now();
    //Calculate the differences and print
    console.log("deletehdbWithArea took " + (t1 - t0) + "ms");
};
//Retrieve HDB data by HdbId
exports.getAllById =function(req, res){
    //Start the timer
    var t0 = performance.now();
    allHdb.findById(req.params.hdb_id, function (err, hdb) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json(hdb);
    });
    //End the timer
    var t1 = performance.now();
     //Calculate the differences and print
    console.log("getHdbById took " + (t1 - t0) + "ms");
}
//Retrieve HDB data with area by HdbId
exports.getAllWithAreaById =function(req, res){
 //Start the timer
    var t0 = performance.now();
    allHdbWithArea.findById(req.params.id, function (err, hdb) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        //Convert the data retrieved to the json format to send to front end
        var data = {
            resalehdbid: hdb._id,
           block :hdb.Block,
           Town: hdb.Area.Town,
           StreetName: hdb.Area.StreetName,
           PostalCode: hdb.Postal,
           StoreyRange: hdb.StoreyRange,
           type: hdb.FlatType,
           ResalePrice: hdb.ResalePrice
        };

        res.json([data]);
    });
    //End the timer
    var t1 = performance.now();
    //Calculate the differences and print
    console.log("getHdbByIdWithArea took " + (t1 - t0) + "ms");
}
//Update hdb info , able to update resale price
exports.updatehdb = function (req, res) {
    //start the timer
    var t0 = performance.now();
    //Find the data to update 
    allHdb.findById(req.params.hdb_id, function (err, allHdb) {
            if (err)
                res.send(err);
            allHdb.ResalePrice = req.body.ResalePrice;
            allHdb.UpdatedDate = Date.now();
            allHdb.UpdatedBy = 123;
            //Update the data
            allHdb.save(function (err) {
                if (err)
                    res.json(err);
                res.json(allHdb);
            });
        });
        //stop the timer
        var t1 = performance.now();
        //Calculate the differences and print
        console.log("updatehdb took " + (t1 - t0) + "ms");
    };
    //Update hdb info resale price with area
exports.updatehdbWithArea = function (req, res) {
    //start the timer
    var t0 = performance.now();
    //Find the data to update 
    allHdbWithArea.findById(req.params.resalehdbid, function (err, allHdb) {
            if (err)
                res.send(err);
            allHdb.ResalePrice = req.body.ResalePrice;
            allHdb.UpdatedDate = Date.now();
            allHdb.UpdatedBy = 123;
            //update data
            allHdb.save(function (err) {
                if (err)
                    res.json(err);
                res.json(allHdb);
            });
        });
           //stop the timer
        var t1 = performance.now();
           //Calculate the differences and print
        console.log("updatehdbWithArea took " + (t1 - t0) + "ms");
    };
    //insert new hdb with area
    exports.newhdbWithArea =  function (req, res) {
        var sum = 0;
        var time = 0;
        for (var i = 0; i<10; i++){
           
            var hdb = new allHdbWithArea();
            //set the body to model
            hdb.Block = req.body.Block;
            hdb.Floor = req.body.Floor;
            hdb.Latitude = req.Latitude;
            hdb.longitude = req.body.Longitude;
            hdb.Postal = req.body.Postal;
            hdb.LeaseCommenceDate = req.body.LeaseCommenceDate;
            hdb.LeaseEndDate = req.body.LeaseEndDate;
            hdb.ResalePrice = req.body.ResalePrice;
            hdb.Area = req.body.Area;
            hdb.FlatType = req.body.FlatType;
            hdb.FlatModel = req.body.FlatModel;
            hdb.StoreyRange = req.body.StoreyRange;
            hdb.CreatedDate = Date.now();
            hdb.CreatedBy = 123;
            hdb.UpdatedDate = Date.now();
            hdb.UpdatedBy = 123;
            //start timer
            var t0 = performance.now();
            //Insert to db
            hdb.save(function(err){
               
               
            });
            //end timer
            var t1 = performance.now();
            time = t1-t0;
            sum += time;
        
        }
        res.json(sum);
        //print the average time
       console.log("newhdbWithArea",sum/10);

    }
    //insert new hdb without area (area  required areaid)
    exports.newhdb =  function (req, res) {
        var sum = 0;
        var time = 0;
        for (var i = 0; i<10; i++){
        //start timer
        var t0 = performance.now();
        var hdb = new allHdb();
        hdb.Block = req.body.Block;
        hdb.Floor = req.body.Floor;
        hdb.Latitude = req.Latitude;
        hdb.longitude = req.body.Longitude;
        hdb.Postal = req.body.Postal;
        hdb.LeaseCommenceDate = req.body.LeaseCommenceDate;
        hdb.LeaseEndDate = req.body.LeaseEndDate;
        hdb.ResalePrice = req.body.ResalePrice;
        hdb.Area = req.body.Area;
        hdb.FlatType = req.body.FlatType;
        hdb.FlatModel = req.body.FlatModel;
        hdb.StoreyRange = req.body.StoreyRange;
        hdb.CreatedDate = Date.now();
        hdb.CreatedBy = 123;
        hdb.UpdatedDate = Date.now();
        hdb.UpdatedBy = 123;
        //Insert to database
        hdb.save(function(err){
            res.json(hdb);
        });
        //end timer
        var t1 = performance.now();
        time = t1- t0;
        sum += time;
        }
          //print the average time
        console.log("newhdbWithArea",sum)/10;
    }
    //get unique storey
    exports.getUniqueStorey = function(req, res){
        var t0 = performance.now();
        allHdb.find({}).distinct('StoreyRange').exec(function(err,hdb) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            res.json(hdb);
        });
        var t1 = performance.now();
        console.log("getUniqueStorey took " + (t1 - t0) + "ms");
    }

    //get unique storey with area
    exports.getUniqueStoreyWithArea = function(req, res){
        var t0 = performance.now();
        allHdbWithArea.find({}).distinct('StoreyRange').exec(function(err,hdb) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            res.json(hdb);
        });
        var t1 = performance.now();
        console.log("getUniqueStoreyWithArea took " + (t1 - t0) + "ms");
    }

    //get flat model
    exports.getFlatModel = function(req, res){
        var t0 = performance.now();
        allHdb.find({}).distinct('FlatModel').exec(function(err,hdb) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            res.json(hdb);
        });
        var t1 = performance.now();
        console.log("getFlatModel took " + (t1 - t0) + "ms");
    }

        //get flat model with area 
        exports.getFlatModelWithArea = function(req, res){
            var t0 = performance.now();
            allHdbWithArea.find({}).distinct('FlatModel').exec(function(err,hdb) {
                if (err) {
                    res.json({
                        status: "error",
                        message: err,
                    });
                }
                res.json(hdb);
            });
            var t1 = performance.now();
            console.log("getFlatModel took " + (t1 - t0) + "ms");
        }

      //get flat type
      exports.getFlatType = function(req, res){
        var t0 = performance.now();
        allHdb.find({}).distinct('FlatType').exec(function(err,hdb) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            res.json(hdb);
        });
        var t1 = performance.now();
        console.log("getFlatType took " + (t1 - t0) + "ms");
    }

        //get flat type with area
        exports.getFlatTypeWithArea = function(req, res){
        var t0 = performance.now();
        allHdbWithArea.find({}).distinct('FlatType').exec(function(err,hdb) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            res.json(hdb);
        });
        var t1 = performance.now();
        console.log("getFlatType took " + (t1 - t0) + "ms");
    }

//Insert the csv file 
exports.panda = function(req,res){
    
    var t0 = performance.now();
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" });
      }
    
      // accessing the file
      const myFile = req.files.file;
      console.log(myFile.name);
      //  mv() method places the file inside  directory
      myFile.mv(`${__dirname}/${myFile.name}`, function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send({ msg: "Error occured" });
        }
      });
    var dataToSend;
   //Python script to insert csv data to MongoDB
   const pythonMongo = spawn("python", ["csv/csvInsertMongo.py", `${myFile.name}`]); //Execute Python Script to Insert data into MYSQL and pass in Uploaded file name as an argument

   pythonMongo.stdout.on("data", function (data) {
     console.log(`stdout: ${data}`);
   });
 
    pythonMongo.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend)
    var t1 = performance.now();
    console.log("panda took " + (t1 - t0) + "ms");
    });
}

let crypto = require('crypto');

//Generate salt
 let generateSalt = rounds => {
    if (rounds >= 15) {
        throw new Error(`${rounds} is greater than 15,Must be less that 15`);
    }
    if (typeof rounds !== 'number') {
        throw new Error('rounds param must be a number');
    }
    if (rounds == null) {
        rounds = 12;
    }
    return crypto.randomBytes(Math.ceil(rounds / 2)).toString('hex').slice(0, rounds);
};

//comparing salt data
let compare = (password, hash,salt) => {
  
    if (password == null || hash == null) {
        throw new Error('password and hash is required to compare');
    }
    let passwordData = hasher(password, salt);
    if (passwordData.hashedpassword === hash) {
        return true;
    }
    return false
};

let hash = (password, salt) => {
    if (password == null || salt == null) {
        throw new Error('Must Provide Password and salt values');
    }
    if (typeof password !== 'string' || typeof salt !== 'string') {
        throw new Error('password must be a string and salt must either be a salt string or a number of rounds');
    }
    return hasher(password, salt);
};
//Hash the password
let hasher = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        hashedpassword: value
    };
};
Users = require('./Model/UserModel')
//For testing purpose to insert to the table
// Handle create user actions
exports.newUser = function (req, res) {
    let salt = generateSalt(10);
    
    var User = new Users();
    User.Name = req.body.Name;
    User.Email = req.body.Email;
    var getHashValue =  hash(req.body.Password, salt);
    User.Password =getHashValue.hashedpassword;
    User.Salt = getHashValue.salt;
    User.CreatedDate = Date.now();
    User.CreatedBy = 132;
    User.CreatedDate = Date.now();
    User.CreatedBy = 213;
// save the user and check for errors
    User.save(function (err) {
        if (err)
         res.json(err);
res.json(User);
    });
};

//Login to the application
exports.Login= function(req, res){
    var t0 = performance.now();
    var enteredEmail = req.body.Email;
    var enteredPassword = req.body.Password;
    Users.findOne({Email: enteredEmail}).exec(function(err,user){
        //retrieve user data and validate if it is the valid user
        if (user !=null){
            var userid = user._id;
            var email = user.Email;
            var password = user.Password;
            var salt = user.Salt;
            let match = compare(enteredPassword, password,salt);
            
            if (match) {
                res.status(200).json({
                    status: "Success",
                    message: "Login Successfully",
                    data:user
                  });
            }
            else{
                res.json({
                    status:"Failed",
                    message:"Invalid email or Password"
                })
                
            }
        }
        else{
            res.json({
                status:"Failed",
                message:"Invalid email or Password"
            })
        }
    });
       
    var t1 = performance.now();
    console.log("Login took " + (t1 - t0) + "ms");
 }
//GoogleAPI
 exports.getGoogleAPI =function(req, res){
    var oPostalCode = req.body.orginPostalCode;
     var dPostalCode = req.body.destinationPostalCode;

   var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='+oPostalCode +'&destinations='+dPostalCode+'&key=AIzaSyAsgJVEWKhCsX2Ao4jzXZ6TY3IHKcmdtI0'
    //Send request to retrieve the distance and duration
   const request = require('request');
    request(url, { json: true }, (err, result, body) => {
    if (err) { return console.log(err); }
    console.log(body);
    var distance  = body.rows[0].elements[0].distance.text;
    var duration = body.rows[0].elements[0].duration.text;
    res.json({
      "distance" :distance,
      "duration": duration
    })
    });
    
 }

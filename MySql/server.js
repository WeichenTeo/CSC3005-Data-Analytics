const express = require("express");
const { spawn } = require("child_process");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
const sql = require("./app/models/db.js");
let crypto = require("crypto");
const { performance } = require("perf_hooks");
// logger
let logger = (func) => {
  console.log(func);
};

// middle ware
app.use(express.static("public")); //to access the files in public folder
app.use(cors()); // it enables all cors requests
app.use(fileUpload());

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Drifters." });
});

let hasher = (password, salt) => {
  let hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  let value = hash.digest("hex");
  return {
    salt: salt,
    hashedpassword: value,
  };
};

let hash = (password, salt) => {
  if (password == null || salt == null) {
    throw new Error("Must Provide Password and salt values");
  }
  if (typeof password !== "string" || typeof salt !== "string") {
    throw new Error(
      "password must be a string and salt must either be a salt string or a number of rounds"
    );
  }
  return hasher(password, salt);
};

//comparing salt data
let compare = (password, hash, salt) => {
  if (password == null || hash == null) {
    throw new Error("password and hash is required to compare");
  }
  let passwordData = hasher(password, salt);
  if (passwordData.hashedpassword === hash) {
    return true;
  }
  return false;
};

//Retrieve min max API wait for Frontend finish their part
app.post("/login", (req, res) => {
  var email = req.body.Email;
  var password = req.body.Password;

  sql.query("CALL retrieve_user_by_email(?)", [email], (err, result) => {
    //Using Stored Procedure instead of SQL queries
    if (err) {
      console.log("error: ", result);
    }
    console.log(": ", result[0][0]);

    if (result[0][0] != null) {
      var sqlEmail = result[0][0].Email;
      var sqlPassword = result[0][0].Password;
      var sqlSalt = result[0][0].Salt;
      let match = compare(password, sqlPassword, sqlSalt);

      if (match) {
        res.status(200).json({
          status: "Success",
          message: "Login Successfully",
          data: result[0][0],
        });
      } else {
        res.json({
          status: "Failed",
          message: "Invalid email or Password",
        });
      }
    }
  });
});

//file upload api
app.post("/upload", (req, res) => {
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" });
  }

  // accessing the file
  const myFile = req.files.file;

  //  mv() method places the file inside  directory
  myFile.mv(`${__dirname}/${myFile.name}`, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Error occured" });
    }
  });

  const python = spawn("python", ["csvInsertMySQL.py", `${myFile.name}`]); //Execute Python Script to Insert data into MYSQL and pass in Uploaded file name as an argument

  python.stdout.on("data", function (data) {
    console.log(`stdout: ${data}`);
  });
  console.log("went pass python");
});

//Delete API wait for Frontend finish their part
app.delete("/deletefromresale/:deleteID", (req, res) => {
  var t0 = performance.now();
  var receivedFromReact = req.params.deleteID;
  //  console.log("React pass over liao");
  console.log("Parameter", req.params.deleteID);
  sql.query(
    "CALL delete_from_resale(?)",
    [receivedFromReact],
    (err, result) => {
      //Using Stored Procedure instead of SQL queries
      if (err) {
        console.log("error: ", result);

        res.json({
          status: "failed",
          message: err,
        });
      } else {
        res.json({
          status: "Success",
          message: "Record Deleted Successfully",
        });
      }

      var t1 = performance.now();
      console.log("delete took " + (t1 - t0) + "ms");
    }
  );
});

//Retrieve min max API wait for Frontend finish their part
app.post("/minmax", (req, res) => {
  var t0 = performance.now();
  var receivedFromReactmin = req.body.Min;
  var receivedFromReactmax = req.body.Max;
  sql.query(
    "CALL retrieve_min_max(?,?)",
    [receivedFromReactmin, receivedFromReactmax],
    (err, result) => {
      //Using Stored Procedure instead of SQL queries
      if (err) {
        console.log("error: ", err);
        res.json({
          status: "Failed",
          message: "There is an error",
          data: err,
        });
        return;
      } else {
        res.json({
          status: "Succecss",
          message: "Successfully retrieved",
          data: result,
        });
      }
      // result(null, res);
    }
  );
  var t1 = performance.now();
  console.log("minmax took " + (t1 - t0) + "ms");
});
/*----------------------------------------------------------------
the json format to follow for update
{
            "Block": "53",
            "Floor": 84,
            "Latitude": 1.28884723459285,
            "Longtitude": 103.813450564855,
            "Postal": "150053",
            "LeaseCommenceDate": 1986,
            "LeaseEndDate": 2084,
            "price": 486000,
            "id":9,
            "flatTypeId": 2,
            "storeyrangeid": 3,
            "ModelId": 1,
            "StreetId": 5,
            "user":1
}
*/
app.put("/updateallresale/:resalehdbid", (req, res) => {
  var hdbId = req.body.resalehdbid;
  var newPrice = req.body.ResalePrice;

  var t0 = performance.now();
  sql.query(
    "CALL update_resale_price(?,?)",
    [newPrice, hdbId],
    (err, result) => {
      //Using Stored Procedure instead of SQL queries
      if (err) {
        console.log("error: ", err);
        res.json({
          status: "Failed",
          message: "There is an error",
          data: err,
        });
        return;
      } else {
        res.json({
          status: "Succecss",
          message: "Successfully updated",
          data: result,
        });
      }
    }
  );
  var t1 = performance.now();
  console.log("updateresaleprice took " + (t1 - t0) + "ms");
});
app.get("/getAverageResalePrice", (req, res) => {
  var t0 = performance.now();
  sql.query("CALL retrieve_avg_resale_price_by_town()", [], (err, result) => {
    if (err) {
      console.log("error: ", err);
      res.json({
        status: "Failed",
        message: "There is an error",
        data: err,
      });
      return;
    } else {
      res.json({
        status: "Succecss",
        message: "Successfully Retrieved",
        data: result[0],
      });
    }
  });
  var t1 = performance.now();
  console.log("updateresale took " + (t1 - t0) + "ms");
});
/*
insert json format:
{
            "Block": "53",
            "Floor": 84,
            "Latitude": 1.28884723459285,
            "Longtitude": 103.813450564855,
            "Postal": "098767",
            "LeaseCommenceDate": 1986,
            "LeaseEndDate": 2084,
            "price": 486000,
            "flatTypeId": 2,
            "storeyrangeid": 3,
            "ModelId": 1,
            "StreetId": 5,
            "user":1
}
 */
app.post("/googleAPI", (req, res) => {
  var oPostalCode = req.body.orginPostalCode;
     var dPostalCode = req.body.destinationPostalCode;

   var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='+oPostalCode +'&destinations='+dPostalCode+'&key=AIzaSyAsgJVEWKhCsX2Ao4jzXZ6TY3IHKcmdtI0'
    
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
});

app.post("/insertintoresale", (req, res) => {
  var newBlock = req.body.Block;
  var newFloorArea = req.body.Floor;
  var newLat = req.body.Latitude;
  var newLong = req.body.Longtitude;
  var newPostal = req.body.Postal;
  var newLeaseCommenceDate = req.body.LeaseCommenceDate;
  var newLeaseEndDate = req.body.LeaseEndDate;
  var newPrice = req.body.price;
  var newUserUpdated = req.body.user;
  var newStreetId = req.body.StreetId;
  var newFlatTypeId = req.body.flatTypeId;
  var newStoreyrangeid = req.body.storeyrangeid;
  var newModelId = req.body.ModelId;

  var t0 = performance.now();
  sql.query(
    "CALL insert_into_resale(?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      newBlock,
      newFloorArea,
      newLat,
      newLong,
      newPostal,
      newLeaseCommenceDate,
      newLeaseEndDate,
      newPrice,
      newUserUpdated,
      newStreetId,
      newFlatTypeId,
      newStoreyrangeid,
      newModelId,
    ],
    (err, result) => {
      //Using Stored Procedure instead of SQL queries
      if (err) {
        console.log("error: ", err);
        res.json({
          status: "Failed",
          message: "There is an error",
          data: err,
        });
        return;
      } else {
        res.json({
          status: "Succecss",
          message: "Successfully Inserted",
          data: result,
        });
      }
    }
  );
  var t1 = performance.now();
  console.log("updateresale took " + (t1 - t0) + "ms");
});


require("./app/routes/streetname_with_town.routes.js")(app);
require("./app/routes/hdb_storeyrange.routes.js")(app);
require("./app/routes/all.routes.js")(app);
require("./app/routes/flattype.routes.js")(app);
require("./app/routes/flatmodel.routes.js")(app);
// set port, listen for requests
app.listen(4500, () => {
  //Originally listening on port 3000
  console.log("Server is running on port 4500.");
});

// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
const fileUpload = require("express-fileupload");

// Initialise the app
let app = express();

let cors = require("cors");

// Import routes
let apiRoutes = require("./api-routes");
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/thedrifters', { useNewUrlParser: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// middle ware
app.use(express.static("public")); //to access the files in public folder
app.use(cors()); // it enables all cors requests
app.use(fileUpload());

// Use Api routes in the App
app.use(apiRoutes);
// Launch app to listen to specified port
app.listen(4500, function () {
    console.log("Running on port " + 4500);
});
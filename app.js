const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
// const mongoose = require('mongoose');

const app = express();
app.set("port", 3000);
app.use(cors());
app.use("/", express.static(path.join(__dirname, '/angular-src/shakespeer/dist/shakespeer/')));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(bodyParser.json({ limit: "20mb"} ));

app.get('/api/data', function(req, res) {
    res.status(200).send("Hello world!");
});

const server = app.listen(app.get("port"), () => {
    console.log("Starting the server at port: " + app.get("port"));
});

// mongoose.Promise = global.Promise;
// console.log("Trying to connect to MongoDB...");
// mongoose.connect(config.database, {
//     useNewUrlParser: true
// }).then(
//     () => {
//         console.log("Successfully connected to MongoDB!");
//     }
// );
const express = require("express");
require("dotenv").config()
const cors = require("cors");

const PORT = 8085;
const CONN_STR = "mongodb://mongodb:27017";

let DB_CONNECTED = false;

const getMongoDB = async () => {
    const MongoClient = require('mongodb').MongoClient;
    let logConnString = "mongodb://mongodb:27017";

    console.log(`Connecting to database using ${logConnString}`);
    let db;
    try {
      const client = await MongoClient.connect(CONN_STR, { useNewUrlParser: true, useUnifiedTopology: true });
      db = await client.db("mern-k8s");
      DB_CONNECTED = true;
      console.log("Connected to the database");

    } catch (e) {
      console.log("Error connecting to the database");
      console.log(e.toString());
    }
    return db;
}
let db;
getMongoDB().then(_db => db = _db);

let app = express();
app.use(cors())
app.use(express.json());

const log = (route, message) => {
    const now = new Date();
    const date = `${now.getDay()}/${(now.getMonth()+1).toString().padStart(2, "0")}/${now.getFullYear()}`;
    const time = `${(now.getHours()).toString().padStart(2, "0")}:${(now.getMinutes()).toString().padStart(2, "0")}:${(now.getSeconds()).toString().padStart(2, "0")}`;
    const log = `[${date} ${time}] - (${route}) - ${message}`;
    console.log(log);
 }

app.get("/health", (req, res) => {
  log("/health", "GET request");
  res.send({status: "Ok", dbConnected: DB_CONNECTED}).status(200);
});
 
app.get("/entries", async (req, res) => {
    log("/entries", "GET request");
    let entries = [];
    try {
      let collection = await db.collection("entries")
      entries = await collection.find({}).toArray();
    } catch (e) {
      log("/entries", e.toString());
    }
    res.send(entries).status(200);
});

app.post("/entry", async (req, res) => {
    log("/entry", `POST request ${JSON.stringify(req.body)}`);
    let result;
    try {
      let collection = await db.collection("entries");
      result = await collection.insertOne(req.body);
    } catch (e) {
      log("/entry", e.toString());
    }
    res.send(result).status(201);
});

app.get("/clear", async (req, res) => {
    log("/clear", "GET request");
    let result;
    try {
      let collection = await db.collection("entries");
      result = await collection.deleteMany({});
    } catch(e) {
      log("/clear", e.toString());
    }
    res.send(result).status(200);
})

app.put("/update", async (req, res) => {
  log("/update", `PUT request ${JSON.stringify(req.body)}`);
  let result;
  try {
    let collection = await db.collection("entries");
    let filter = {};
    result = await collection.updateOne(
      filter,
      {$set: req.body},
    );
  } catch(e) {
    log("/update", e.toString());
  }
  res.send(result).status(200);
})
  
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
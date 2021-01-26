var express = require("express");
var app = express();

const port = process.env.PORT || 3000

app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
let db;

MongoClient.connect("mongodb+srv://testboy:testboy@cluster0.pkzla.mongodb.net/vue2assignment?retryWrites=true&w=majority"
, (err, client) => {
    db = client.db('vue2assignment')
})

// dispaly a message for root path to show that API is working
app.get('/', function (req, res) {
    res.send('Select a collection, e.g., /collection/messages')
})

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)

    // console.log('collection name:', req.collection)
    return next()
})

// retrieve info from DB
app.get('/collection/:collectionName', (req, res) => {
    req.collection.find({}).toArray((e, results) => {
    if (e) return next(e)
    res.send(results)
    })
})

// insert info into DB
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})

app.use(function(req, res, next) {
    // allow different IP address
    res.header("Access-Control-Allow-Origin"
    ,
    "*");
    // allow different header fields
    res.header("Access-Control-Allow-Headers"
    ,
    "*");
    next();
});

app.listen(port, function() {
    console.log("Hi");
});
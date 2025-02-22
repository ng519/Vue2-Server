var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");

const port = process.env.PORT || 3000
const ObjectID = require('mongodb').ObjectID

app.use(express.json());
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

app.use(function(req, res, next) {
    console.log("In comes a " + req.method + " to " + req.url);
    next();
});

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
        requestHandler(req, res);
    })
})

app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne(
        { _id: new ObjectID(req.params.id) }, 
        (e, results) => {
            if (e) return next(e)
            res.send(results)
            requestHandler(req, res);
        })
})


// insert info into DB
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
        requestHandler(req, res);
    })
})

// Update space avail.
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        { _id: new ObjectID(req.params.id) },
        { $set: req.body },
        { safe: true, multi: false },
        (e, result) => {
            if (e) return next(e)
                res.send((result.result.n === 1) ?
                {msg: 'success'} : { msg: 'error'})
                requestHandler(req, res);
    })
})

function requestHandler(request, response) {
    console.log("In comes a request to: " + request.url);
    response.end("Hello, world!");
}

app.listen(port, function() {
    console.log("Hi");
});
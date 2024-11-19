// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Connect to MongoDB
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Use static files
app.use(express.static('public'));
// Set up handlebars
app.set('view engine', 'hbs');
// Set up routes
app.get('/', function(req, res) {
    res.render('index');
});
// Get all comments
app.get('/comments', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("commentDB");
        dbo.collection("comments").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});
// Post a comment
app.post('/comment', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("commentDB");
        dbo.collection("comments").insertOne(req.body, function(err, result) {
            if (err) throw err;
            console.log("1 document inserted");
            res.sendStatus(200);
            db.close();
        });
    });
});
// Start server
app.listen(3000, function() {
    console.log('Server started');
});
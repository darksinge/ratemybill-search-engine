var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var clc = require('cli-color');

var lunrRoute = require('./routes/lunr');
// var tfidfRoute = require('./routes/tfidf');

const PORT = 8081;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'application/json'}));

app.all('/', function(req, res) {
    return res.send('use /search or /tfidf');
});

app.use('/engine/search', lunrRoute);
// app.use('/engine/tfidf', tfidfRoute);

app.listen(8081, function() {
    console.log(clc.red.bold('Server listening on port ' + PORT + '...'));
    lunrRoute.buildIndex();
});



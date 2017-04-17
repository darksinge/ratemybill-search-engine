var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var lunrRoute = require('./routes/lunr');
// var tfidfRoute = require('./routes/tfidf');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'application/json'}));

app.all('/', function(req, res) {
    return res.send('use /search or /tfidf');
});

app.use('/engine/search', lunrRoute);
// app.use('/engine/tfidf', tfidfRoute);

app.listen(8081, function() {
    console.log('Server listening on port 8081.');
});

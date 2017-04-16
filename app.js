var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var lunrRoute = require('./routes/lunr');
var tfidfRoute = require('./routes/tfidf');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'application/json'}));

app.use('/search', lunrRoute);
app.use('/tfidf', tfidfRoute);

app.get('/', function(req, res) {
    return res.json({
        data: 'please use the `/search` route'
    });
});

app.listen(8081, function() {
    console.log('Server listening on port 8081.');
});
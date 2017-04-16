/**
 * `tfidf.js`
 * ----------------------------
 */

var express = require('express');
var router = express.Router();

var fs = require('fs');
var parse = require('csv-parse');
var path = require('path');

// var inputFilePath = path.join(__dirname, './dense_matrix.csv');
var inputFilePath = path.join(__dirname, '../data/test_data.csv');
var headers;
var tfidf = [];
var tfidfOverflow = [];
var fsOptions = {};
var startTime = Date.now();
var rowTimer = startTime;
var readStream = fs.createReadStream(inputFilePath, fsOptions);
var didComputeTfidf = false;
var rowNumCount = 0;

router.get('/tfidf/:token', function(req, res) {
    var token = req.params.token;

    var col = headers.indexOf(token);
    
    if (col === -1) {
        return res.json({
            error: "search returned no results"
        });
    }

    var data = {};
    for (i in tfidf) {
        var temp = Number(tfidf[i][col]);
        if (temp !== NaN && temp > 0) {
            data[tfidf[i][0]] = temp;
        }
    }

    return res.json({
        results: data
    });

});

router.get('/tfidf/:row/:col', function(req, res) {

    if (!didComputeTfidf) {
        return res.status(503).json({
            error: 'server still computing tf-idf, please try again in a few seconds!'
        });
    }

    var row = Number(req.params.row);
    var col = Number(req.params.col);

    if ((!row || !col) && (isNaN(row) || isNaN(col))) return res.status(400).json({ 
        error: "malformed request"
    });

    var w_tf_idf = tfidf[row][col];

    if (typeof w_tf_idf === 'undefined') return res.status(400).json({
        error: "index out of bounds"
    });

    return res.json({
        weightedTfIdf: w_tf_idf,
        token: headers[col],
        document: tfidf[row][0]
    });
});

module.exports = router;

readStream.pipe(parse())
.on('data', function(row) {

    if (!headers) {
        headers = row;
        return;
    }

    tfidf.push(row);

    if (rowNumCount % 100 == 0 && rowNumCount != 0) {
        var secondsPassed = ((Date.now() - rowTimer) / 1000);
        if (secondsPassed > 1.5) {
            tfidfOverflow.concat(tfidf);
            tfidf = [];
        }
        console.log('read lines ' + (rowNumCount - 100) + ' - ' + rowNumCount + ' in ' + secondsPassed + 's');
        rowTimer = Date.now();
    }
    rowNumCount++;

})
.on('end', function() {
    onReadStreamCompletion()
})
.on('error', function(e) {
    console.error(e.message);
    onReadStreamCompletion()
})
.on('close', function(e) {
    if (e) console.error(e.message);
    onReadStreamCompletion()
});

function onReadStreamCompletion() {
    didComputeTfidf = true;
    if (tfidfOverflow.length > 0) {
        tfidfOverflow.concat(tfidf);
        tfidf = [];
        tfidf = tfidfOverflow;
    }

    console.log("TF-IDF complete in " + ((Date.now() - startTime) / 1000) + 's');
}
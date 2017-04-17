/**
* `lunr.js`
* -----------------
*/

'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var lunr = require('lunr');
var indexer = require(path.join(__dirname, '../indexer/index'));

// var documents = [];
var idx;
var indexDidLoad = false;

router.use(function(req, res, next) {
    if (!indexDidLoad) return res.status(503).json({
        error: "server processing data, please try again in a few minutes."
    });
    return next();
});

router.get('/', function(req, res) {
    var q = req.query.q || req.params.q;

    if (!q) return res.status(401).json({
        error: 'searchTerms is undefined!'
    });

    var results = idx.search(q);

    return res.json({
        results: results
    });
});

router.use('/:token', function(req, res) {
    var token = req.params.token;
    return res.json({
        results: idx.search(token)
    });
});

module.exports = router;

buildIndex();

function buildIndex() {
    
    var indexFilePath = path.join(__dirname, '../indexer/prebuild.json');
    if (fs.existsSync(indexFilePath)) {
        idx = indexer.loadIndex(indexFilePath);
        indexDidLoad = true;
    }
    
    var documentsPath = process.env.NODE_ENV === 'production' ? path.join(__dirname, '../data/documents') : path.join(__dirname, '../data/testDocuments');
    var buildFilePath = path.join(__dirname, '../indexer/buildIndex.js');
    
    const exec = require('child_process').exec;
    exec('node ' + buildFilePath + ' -d ' + documentsPath, function(err, stdout, stderr) {
        if (err) {
            console.error('stderr: ', stderr);
        }
        console.log('stdout: ', stdout);
    });
    
}



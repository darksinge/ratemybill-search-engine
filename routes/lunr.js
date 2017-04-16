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

var documentsPath = path.join(__dirname, '../data/documents');
var documents = [];
var idx;

var indexStartTime = Date.now();

parseDocuments();

router.use(function(req, res, next) {
    if (!idx) return res.status(503).json({
        error: "server processing data, please try again in a few minutes."
    });
    return next();
});

router.use('/', function(req, res) {
    var searchTerms = req.params.searchTerms;

    if (!searchTerms) return res.status(401).json({
        error: 'searchTerms is undefined!'
    });

    var results = idx.search(searchTerms);

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

function parseDocuments() {
    console.log('parsing documents in ' + documentsPath + '...');
    fs.readdir(documentsPath, (err, files) => {
        if (err) return console.error(err.message);
        
        files.forEach(filePath => {
            fs.readFile(documentsPath + '/' + filePath, 'utf8', (err, data) => {
                if (err) console.error(err.message);

                documents.push({
                    name: filePath,
                    text: data
                });

                if (documents.length >= files.length) {
                    parseCompletionHandler();
                }
            });
        });
    });
}

function parseCompletionHandler() {
    console.log('indexing ' + documents.length + ' documents...');
    idx = lunr(function() {
        this.ref('name');
        this.field('text');
        documents.forEach(doc => {
            this.add(doc);
        }, this);
    });
    console.log('indexing completed in ' + ((Date.now() - indexStartTime) / 1000) + 's');
}

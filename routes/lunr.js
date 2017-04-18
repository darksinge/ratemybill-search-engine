/**
* `lunr.js`
* -----------------
*/

'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var readline = require('readline');
<<<<<<< HEAD
var lunr = require('elasticlunr');
=======
var lunr = require('lunr');
>>>>>>> ccc8fc35e76cd0d2b6be790c5c1836d6081acf82
var clc = require('cli-color');
var indexer = require(path.join(__dirname, '../indexer/index'));

// var documents = [];
<<<<<<< HEAD
var index;
=======
var idx;
>>>>>>> ccc8fc35e76cd0d2b6be790c5c1836d6081acf82
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
module.exports.buildIndex = buildIndex;

function buildIndex() {
    
    var indexFilePath = path.join(__dirname, '../indexer/prebuild.json');
    if (fs.existsSync(indexFilePath)) {
<<<<<<< HEAD
        index = indexer.loadIndex(indexFilePath);
=======
        idx = indexer.loadIndex(indexFilePath);
>>>>>>> ccc8fc35e76cd0d2b6be790c5c1836d6081acf82
        indexDidLoad = true;
    }
    
    var documentsPath = process.env.NODE_ENV === 'production' ? path.join(__dirname, '../data/documents') : path.join(__dirname, '../data/testDocuments');
    var buildFilePath = path.join(__dirname, '../indexer/buildIndex.js');
    
    var msgFormat = clc.xterm(40);
    
    var args = ['-d', documentsPath]
    
    console.log(msgFormat.bold('\n**** Rebuilding index ****'));
    const spawn = require('child_process').spawn;
    const proc = spawn('node ' + buildFilePath, args, {shell: true});
    
    proc.stdout.on('data', function(data) {
        data = data.toString('utf8');
        if (data.includes('%')) {
<<<<<<< HEAD
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0, null);
            process.stdout.write(msgFormat('progress: '));
            process.stdout.write(msgFormat(data));
=======
            if (process.env.NODE_ENV === 'development') {
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0, null);
                process.stdout.write(msgFormat('progress: '));
                process.stdout.write(msgFormat(data));
            } else {
                console.log(data);
            }
>>>>>>> ccc8fc35e76cd0d2b6be790c5c1836d6081acf82
        } else {
            console.log(msgFormat(data));
        }
    });
}

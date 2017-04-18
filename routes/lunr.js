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
var lunr = require('elasticlunr');
var clc = require('cli-color');
var indexer = require(path.join(__dirname, '../indexer/index'));

var index;
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

    var results = index.search(q);

    return res.json({
        results: results
    });
});

router.use('/:token', function(req, res) {
    var token = req.params.token;
    return res.json({
        results: index.search(token)
    });
});

module.exports = router;
module.exports.buildIndex = buildIndex;

function buildIndex() {
    
    // var indexFilePath = path.join(__dirname, '../indexer/prebuild.json');
    // if (fs.existsSync(indexFilePath)) {
    //     index = indexer.loadIndex(indexFilePath);
    //     indexDidLoad = true;
    // }
    
    var documentsPath = process.env.NODE_ENV === 'production' ? path.join(__dirname, '../data/documents') : path.join(__dirname, '../data/testDocuments');
    var buildFilePath = path.join(__dirname, '../indexer/buildIndex.js');
    
    var msgFormat = clc.xterm(40);
    
    var args = ['-d', documentsPath];
    
    console.log(msgFormat.bold('\n**** Rebuilding index ****'));
    const spawn = require('child_process').spawn;
    const proc = spawn('node ' + buildFilePath, args, {shell: true});
    
    proc.stdout.on('data', function(data) {
        data = data.toString();
        if (data.includes('%')) {
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0, null);
            process.stdout.write(msgFormat('progress: '));
            process.stdout.write(msgFormat(data));
        } else {
            console.log(msgFormat(data));
        }
    });
}

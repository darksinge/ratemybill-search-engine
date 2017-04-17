/**
 * `buildIndex.js`
 * -------------------
 * Creates an index for a search engine
 */
var fs = require('fs');
var path = require('path');
var lunr = require('lunr');

var documentsPath = process.stdin;
var indexStartTime = Date.now();

fs.readdir(documentsPath, function(err, files) {
    
    if (err) throw err;
    
    var documents = [];
    
    files.forEach(function(filePath) {
        fs.readFile(documentsPath + '/' + filePath, 'utf8', function(err, data) {
            if (err) console.error(err.message);
            
            documents.push({
                name: filePath,
                body: data
            });
            
            if (documents.length >= files.length) {
                readDirCompletionHandler(documents);
            }
        });
    });
});

function readDirCompletionHandler(documents) {
    var idx = lunr(function() {
        this.ref('name');
        this.field('body');
        
        documents.forEach(function(doc) {
            this.add(doc);
        }, this);
        
    });
    
    console.log('indexing completed in ' + ((Date.now() - indexStartTime) / 1000) + 's');
    buildIndex(idx, 'prebuild.json');
}

function buildIndex(data, fout) {
    console.log('Writing index to disk...');
    var index = JSON.string(data);
    fs.writeFile(path.join(__dirname, fout), index, function(e) {
        if (e) return console.error(e.message);
        console.log('Index build complete, saved to ' + fout);
    });
}
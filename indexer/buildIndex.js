/**
 * `buildIndex.js`
 * -------------------
 * Creates an index for a search engine
 */
var fs = require('fs');
var path = require('path');
var lunr = require('lunr');
var timeformatter = require('./timeformatter');

var indexStartTime;
var documentsPath = '';

process.argv.forEach(function(val, index, array) {
   if (val === '-d') documentsPath = array[index+1];
});

if (!fs.existsSync(documentsPath)) throw new Error('Documents path not found!');

fs.readdir(documentsPath, function(err, folders) {
    if (err) throw err;
    var files = [];
    for (var i = 0; i < folders.length; i++) {
        var dirname = documentsPath + '/' + folders[i];
        process.stdout.write('\tin ' + dirname + '...');
        var f = fs.readdirSync(dirname);
        for (var n = 0; n < f.length; n++) {
            f[n] = dirname + '/' + f[n];
        }
        files = files.concat(f);
    }
    readDir(files);
});

function readDir(files) {
    var documents = [];
    files.forEach(function(filePath) {
        fs.readFile(filePath, 'utf8', function(err, data) {
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
    
    if (files.length === 0) {
        process.stdout.write('\n0 files were read into indexer!');
    }
    
}

function readDirCompletionHandler(documents) {
    indexStartTime = Date.now();
    var idx = lunr(function() {
        this.ref('name');
        this.field('body');
        
        documents.forEach(function(doc, index, array) {
            process.stdout.write(Number((index/array.length)*100).toFixed(2) + '%');
            this.add(doc);
        }, this);
        
    });
    
    buildIndex(idx, 'prebuild.json');
}

function buildIndex(data, fout) {
    var index = JSON.stringify(data);
    fout = path.join(__dirname, fout);
    fs.writeFile(fout, index, function(e) {
        if (e) return console.error(e.message);
        process.stdout.write('\nIndexing complete in ' + timeformatter((Date.now()-indexStartTime) / 1000));
    });
}
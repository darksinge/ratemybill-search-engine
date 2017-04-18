/**
 * `buildIndex.js`
 * -------------------
 * Creates an index for a search engine
 */
var fs = require('fs');
var path = require('path');
var lunr = require('elasticlunr');
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
        var f = fs.readdirSync(dirname);
        for (var n = 0; n < f.length; n++) {
            f[n] = {
                pathName: dirname + '/' + f[n],
                fileName: f[n]
            };
        }
        files = files.concat(f);
    }
    buildIndex(files);
});

function buildIndex(files) {
    process.stdout.write("processing files...");
    
    var index = lunr(function() {
        this.setRef('id');
        this.addField('body');
        this.saveDocument(false);
    });
    
    indexStartTime = Date.now();
    
    var count = files.length;
    
    function nextFile(current) {
        if (!current) current = 0;
        var document = files[current]['pathName'];
        try {
            var data = fs.readFileSync(document, 'utf8');
        
            var entry = {
                id: files[current]['fileName'],
                body: data
            };
    
            index.addDoc(entry);
        } catch(e) {
            process.stdout.write('Error: ' + e);
        }
        if (current < files.length - 1) {
            if (current % 50 === 0) process.stdout.write(Number((current / count) * 100).toFixed(2) + '%');
            setImmediate(nextFile(++current));
        } else {
            process.stdout.write('100%');
            process.stdout.write('\nIndexing complete in ' + timeformatter((Date.now()-indexStartTime) / 1000));
            dump(index, 'prebuild.json');
        }
    }
    nextFile();
}

function dump(index, outfileName) {
    var fout = path.join(__dirname, outfileName);
    try {
        process.stdout.write("\nSerializing index");
        var serializedIndex = index.toJSON();
        process.stdout.write("\nWriting index to disk");
        fs.truncateSync(fout, 0);
        fs.writeFile(fout, serializedIndex, function(err) {
            if (err) {
                process.stdout.write('\nERROR: ' + err);
            } else {
                process.stdout.write('\nDone!');
            }
        });
    } catch (e) {
        process.stdout.write('\nERROR: ' + e);
    }
}
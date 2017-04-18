var lunr = require('elasticlunr');
var fs = require('fs');

function loadIndex(fin) {
    console.log('Loading index from memory...');
    
    try {
        var data = fs.readFileSync(fin, 'utf8');
        var serialized = JSON.parse(data);
    } catch (e) {
        console.error(e.message);
        return null;
    }

    var idx = lunr.Index.load(serialized);
    console.log('Done! Loaded index from ' + fin);
    return idx;

}

module.exports.loadIndex = loadIndex;
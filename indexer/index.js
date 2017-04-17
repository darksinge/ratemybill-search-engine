var lunr = require('lunr');
var fs = require('fs');

function loadIndex(fin) {
    console.log('Loading index from memory...');
    
    try {
        var data = fs.readFileSync(fin, 'utf8');
        var idx = lunr.Index.load(JSON.parse(data));
        console.log('Done! Loaded index from ' + fin);
        return idx;
        
    } catch (e) {
        console.error(e.message);
        return null;
    }
}

module.exports.loadIndex = loadIndex;
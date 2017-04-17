
function format(time) {
// Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var min = ~~((time - (hrs*3600)) / 60);
    var secs = time - (hrs*3600) - (min*60);
    
    var ret = "";
    
    if (hrs > 0) {
        ret += hrs + 'hours ';
    }
    ret += min + ' minutes ' + secs + ' seconds';
    return ret;
}

module.exports = format;
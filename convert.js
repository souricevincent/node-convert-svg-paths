const fs = require('fs');
const path = require('path');
const DOMParser = require('xmldom').DOMParser;
const svgpath = require('svgpath');

const folderOriginalsSvg = 'originals_svg';

/**
 * Check if folder "originals_svg" exist
 */
if(!fs.existsSync(path.join(__dirname, folderOriginalsSvg))) {
    console.log(`Create folder "${folderOriginalsSvg}" and put your originals svg !`);
    return;
}

var originalsSvgFiles = fs.readdirSync(path.join(__dirname, folderOriginalsSvg))


var results = [];

originalsSvgFiles.forEach(file => {

    if(path.extname(file) === '.svg') {
        var xml = fs.readFileSync(path.join(__dirname, folderOriginalsSvg, file), {encoding: 'utf-8'});

        var doc = new DOMParser().parseFromString(xml, 'text/xml');

        var paths = doc.documentElement.getElementsByTagName('path');

        var arrayPaths = [];
        for (var i = 0; i < paths.length; i++) {
            var svgPathTransformed = new svgpath(paths[i].getAttribute('d'))
                .unarc()
                .unshort()
                .rel()
                .round(1)
                .iterate(function(segment, index, x, y) {
                    // Afin de rajouter des courbes sur tous les segments
                    if (segment[0] === 'l') {
                        // ['courbe', segmentX, segmentY, inflexionX, inflexionY, toX, toY]
                        segment = ['c', segment[1], segment[2], segment[1], segment[2], segment[1], segment[2]]
                    }
                    return [segment]
                }).toString()
                .toString()
            ;
            
            arrayPaths.push(svgPathTransformed);
        }
        results.push({[file]: arrayPaths})
    }
    
});

console.log(results);

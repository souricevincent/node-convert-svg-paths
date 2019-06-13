const fs = require('fs');
const path = require('path');
const DOMParser = require('xmldom').DOMParser;
const svgpath = require('svgpath');

const folderOriginalsSvg = 'originals_svg';
const folderConvertedsSvg = 'converteds_svg';

/**
 * Check if folder "originals_svg" exist
 */
if(!fs.existsSync(path.join(__dirname, folderOriginalsSvg))) {
    console.log(`Create folder "${folderOriginalsSvg}" and put your originals svg !`);
    return;
}

var originalsSvgFiles = fs.readdirSync(path.join(__dirname, folderOriginalsSvg))


var results = [];
var xml, doc, DOMPaths;

originalsSvgFiles.forEach(file => {

    if(path.extname(file) === '.svg') {
        xml = fs.readFileSync(path.join(__dirname, folderOriginalsSvg, file), {encoding: 'utf-8'});
        doc = new DOMParser().parseFromString(xml, 'text/xml');
        DOMPaths = doc.documentElement.getElementsByTagName('path');

        var arrayPaths = [];
        for (var i = 0; i < DOMPaths.length; i++) {
            var svgPathTransformed = new svgpath(DOMPaths[i].getAttribute('d'))
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
                })
                .toString()
            ;
            
            arrayPaths.push(svgPathTransformed);

            // Set new svg with new path in doc
            DOMPaths[i].setAttribute('d', svgPathTransformed);

        }

        fs.writeFile(path.join(__dirname, folderConvertedsSvg, file), doc, (err) => {
            if (err) throw err;
            console.log(`${file} converted in "${folderConvertedsSvg}" folder`);
        });

        results.push({[file]: arrayPaths})
    }
    
});

console.log(results);

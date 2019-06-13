const fs = require('fs');
const path = require('path');
const DOMParser = require('xmldom').DOMParser;
const svgpath = require('svgpath');

const args = process.argv.slice(2);

const file = path.join(__dirname, args[0]);

if(!fs.existsSync(file)) {
    console.log(`${file} not found !`);
    return;
}

fs.readFile(file, {encoding: 'utf-8'}, (err, xml) => {

    var doc = new DOMParser().parseFromString(xml, 'text/xml');

    var paths = doc.documentElement.getElementsByTagName('path');

    var resultPaths = [];

    for (var i = 0; i < paths.length; i++) {

        var transformed = new svgpath(paths[i].getAttribute('d'))
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


        resultPaths.push(transformed);
    }
    console.log('d:', resultPaths);
});



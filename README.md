## Start

> "node-convert-svg-paths" is a command line tool

Clone the project, `cd ./node-convert-svg-paths`, `npm install`. Is good

## convert svg paths with node
 
Put your svg in `originals_svg` folder and your terminal, type the commande `node convert.js`. 🧙

You can get the svg transform path in your terminal or get svg transform file in `converted_svg` folder.
 
#### The svg path is converted with :

###### .rel() -> self
Converts all path commands to relative. Useful to reduce output size.

###### .unshort() -> self
Converts smooth curves T/t/S/s with "missed" control point to generic curves (Q/q/C/c).

###### .unarc() -> self
Replaces all arcs with bezier curves.

###### .round(1) -> self
Round all coordinates to given decimal precision. By default round to integer. Useful to reduce resulting output string size.

###### .toString() -> string
Returns final path string.

###### And
I added to that a function to apply curves on all segments with `.iterate(function(segment, index, x, y) [, keepLazyStack]) -> self`. (path to cubic)

> You can change config in `convert.js` if you want a absolute path svg or other...

## Why ?

For all the people who have already tried to morph svg will have noticed that to match a path with another path is complicated.
I use illustrator to make my vector drawing and there are some essential practices to respect:
The number of points must be equal between path "to" and path "b".
The direction of the path must match.
And the starting point of the path.

Despite all these precautions, my morphing may not work because my paths may contain relative or absolute, no curves while the other path is waiting for a curve, etc ...
To overcome these problems I created "node-convert-svg-paths" to handle the problem before sending it to the client

## Morphing

I use [animejs](https://animejs.com/documentation/#motionPath) for my motion path.
```
anime({
  targets: '.st0',
  d: [
    "yourNewPath",
    "yourNewPath"
  ],
  autoplay: true,
  easing: 'easeOutQuad',
  duration: 2000,
  loop: true
})
```

## Resources
 
This plugin is based on [svgpath](https://github.com/fontello/svgpath) for manipulate svg path.

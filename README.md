# mathjax-node-svg2img

This module extends [mathjax-node](https://www.npmjs.com/package/mathjax-node) using [svg2img](https://www.npmjs.com/package/svg2img).

It can be used as a drop-in replacement for mathjax-node. This is an improvement on the archived project, [mathjax-node-svg2png](https://github.com/pkra/mathjax-node-svg2png). 
svg2img does not require PhantomJS. PhantomJS is not actively maintained and troublesome to containerize.

Use

    npm install mathjax-node-svg2img

to install mathjax-node-svg2img and its dependencies.

## Use

This module is used like mathjax-node, extending the input `data` object with new options

    png: true                           // enable PNG generation
    pngHeight: desired height (in px)   // Override height
    pngWidth: desired width (in px)     // Override width
    scale: 1                            // scaling factor to apply during conversion

Similarly, mathjax-node's `result` object is extended with new keys `png` (containing the resulting data-uri string), `pngWidth`, and `pngHeight` (png width and height in pixel).

    png:                   // PNG results
    pngWidth:              // width (in px)
    pngHeight:             // height (in px)

/*************************************************************************
 *
 *  mathjax-node-svg2img
 *
 *  A drop-in replacement for mathjax-node which adds PNG data-uri
 *  using svg2img. Currently only supports png, but could be extended to 
 *  support jpg following example in svg2img doc.
 *
 * ----------------------------------------------------------------------
 *
 *  Copyright (c) 2016 The MathJax Consortium
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

 const mathjax = require('mathjax-node');
 const svg2img = require('svg2img');
 
 // input `data` extends mathjax-node input `data`.
 // Additional values are:
 //
 // png: true         // enable PNG generation
 // pngWidth        // PNG width (in pixel)
 // pngHeight       // PNG width (in pixel)
 // scale: 1,         // scaling factor to apply during conversion
 
 // `result` data extends the mathjax-node `result` data.
 // Additional values are
 //
 // png             // data URI in base64
 // pngWidth        // PNG width (in pixel)
 // pngHeight       // PNG width (in pixel)
 //
 
 const cbTypeset = function(data, callback) {
     var svg = data.svg;
     if (data.png) data.svg = true;
     mathjax.typeset(data, function(result) {
         data.svg = svg;
         if (result.error) callback(result);
         if (data.png) convert(result, data, callback);
         else callback(result, data);
     });
 };
 
 // main API, callback and promise compatible
 exports.typeset = function (data, callback) {
     if (callback) cbTypeset(data, callback);
     else return new Promise(function (resolve, reject) {
         cbTypeset(data, function (output, input) {
             if (output.errors) reject(output.errors);
             else resolve(output, input);
         });
     });
 };
 
 
 const convert = function(result, data, callback) {
     const EXTOPX = result.ex || 6;
     const scale = result.scale || 1;
     const resultWidth = result.width.slice(0,-2) * EXTOPX * scale;
     const resultHeight = result.height.slice(0, -2) * EXTOPX * scale;
     if (data.pngWidth && data.pngHeight) {
         result.pngHeight = data.pngHeight;
         result.pngWidth = data.pngWidth;
     } else if (data.pngWidth) {
         result.pngHeight = data.pngWidth / (resultWidth / resultHeight);
         result.pngWidth = data.pngWidth;
     } else if (data.pngHeight) {
         result.pngWidth = data.pngHeight / (resultHeight / resultWidth);
         result.pngGeight = data.pngHeight;
     } else {
         result.pngHeight = resultHeight;
         result.pngWidth = resultWidth;
     }
     svg2img(result.svg, {width: result.pngWidth, height: result.pngHeight}, (error, buffer) => {
         result.png = 'data:image/png;base64,' + buffer.toString('base64');
         callback(result);
     });
 };
 
 
 exports.start = mathjax.start;
 exports.config = mathjax.config;
 
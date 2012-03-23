/* <zoom>
 *
 * Used for matching zoom properties.
 * 
 * CSS1: <number> | <percentage> | normal
 * 
 * TODO:  If this is set to a non-zero value, also set -moz-transform
 * http://www.fix-css.com/2011/05/css-zoom/
 */

"use strict";

var base = require('./base');
var number = require('./number');
var percentage = require('./percentage');
var util = require('../../util');
var validate = require('./validate');

var Zoom = base.baseConstructor();

util.extend(Zoom.prototype, base.base, {
	name: "zoom",

	allowed: [
		{
			validation: [],
			values: [
				number,
				percentage,
				'normal'
			]
		}
	]
});

exports.parse = base.simpleParser(Zoom);

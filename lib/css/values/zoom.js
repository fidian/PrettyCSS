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
var util = require('../../util');

var Zoom = base.baseConstructor();

util.extend(Zoom.prototype, base.base, {
	name: "zoom",

	allowed: [
		{
			validation: [
			],
			values: [
				'normal'
			],
			valueObjects: [
				'number',
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(Zoom);

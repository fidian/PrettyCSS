/* <outline-width>
 *
 * Used for matching outline-width properties.
 *
 * CSS2: <border-width> | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var OutlineWidth = base.baseConstructor();

util.extend(OutlineWidth.prototype, base.base, {
	name: "outline-width",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			],
			valueObjects: [
				'border-width-single'
			]
		}	
	]
});

exports.parse = base.simpleParser(OutlineWidth);

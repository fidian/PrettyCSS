/* <outline-width>
 *
 * Used for matching outline-width properties.
 *
 * CSS2: <border-width> | inherit
 * CSS3:  outline-offset
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');
var borderWidthSingle = require('./border-width-single');
var OutlineWidth = base.baseConstructor();

util.extend(OutlineWidth.prototype, base.base, {
	name: "outline-width",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				borderWidthSingle,
				'inherit'
			]
		}	
	]
});

exports.parse = base.simpleParser(OutlineWidth);

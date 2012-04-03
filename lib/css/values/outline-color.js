/* <outline-color>
 *
 * Used for matching outline-color properties.
 *
 * CSS2: <color> | invert | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var OutlineColor = base.baseConstructor();

util.extend(OutlineColor.prototype, base.base, {
	name: "outline-color",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'invert',
				'inherit'
			],
			valueObjects: [
				'color'
			]
		}
	]
});

exports.parse = base.simpleParser(OutlineColor);

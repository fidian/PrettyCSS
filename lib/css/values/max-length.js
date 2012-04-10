/* <max-length>
 *
 * Used for the max-width and max-height properties
 *
 * CSS2:  <length> | <percentage> | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var MaxLength = base.baseConstructor();

util.extend(MaxLength.prototype, base.base, {
	name: "max-length",

	allowed: [
		{
			validation: [
				validate.minimumCss(2),
				validate.positiveValue()
			],
			values: [
				"none",
				"inherit"
			],
			valueObjects: [
				'length',
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(MaxLength);

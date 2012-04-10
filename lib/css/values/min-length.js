/* <min-length>
 *
 * Used for the min-width and min-height properties
 *
 * CSS2:  <length> | <percentage> | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var MinLength = base.baseConstructor();

util.extend(MinLength.prototype, base.base, {
	name: "min-length",

	allowed: [
		{
			validation: [
				validate.minimumCss(2),
				validate.positiveValue()
			],
			values: [
				"inherit"
			],
			valueObjects: [
				'length',
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(MinLength);

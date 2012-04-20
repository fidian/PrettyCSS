/* <font-face-numerical-fraction-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: diagonal-fractions | stacked-fractions
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-numeric-fraction-values",

	allowed: [
		{
			validation: [],
			values: [
				"diagonal-fractions",
				"stacked-fractions"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


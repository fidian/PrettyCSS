/* <font-face-numerical-spacing-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: proportional-nums | tabular-nums
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-numeric-spacing-values",

	allowed: [
		{
			validation: [],
			values: [
				"proportional-nums",
				"tabular-nums"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


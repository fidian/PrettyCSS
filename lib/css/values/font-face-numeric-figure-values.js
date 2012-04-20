/* <font-face-numerical-figure-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: lining-nums | oldstyle-nums
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-numeric-figure-values",

	allowed: [
		{
			validation: [],
			values: [
				"lining-nums",
				"oldstyle-nums"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


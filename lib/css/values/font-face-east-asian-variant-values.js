/* <font-face-east-asian-variant-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: jis78 | jis83 | jis90 | jis04 | simplified | traditional
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-east-asian-variant-values",

	allowed: [
		{
			validation: [],
			values: [
				"jis78",
				"jis83",
				"jis90",
				"jis04",
				"simplified",
				"traditional"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


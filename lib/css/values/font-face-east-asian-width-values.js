/* <font-face-east-asian-width-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: full-width | proportional-width
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-east-asian-width-values",

	allowed: [
		{
			validation: [],
			values: [
				"full-width",
				"proportional-width"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


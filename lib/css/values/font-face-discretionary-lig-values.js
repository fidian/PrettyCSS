/* <font-face-discretionary-lig-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: discretionary-ligatures | no-discretionary-ligatures
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-discretionary-lig-values",

	allowed: [
		{
			validation: [],
			values: [
				"discretionary-ligatures",
				"no-discretionary-ligatures"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


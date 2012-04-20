/* <font-face-common-lig-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: common-ligatures | no-common-ligatures
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-common-lig-values",

	allowed: [
		{
			validation: [],
			values: [
				"common-ligatures",
				"no-common-ligatures"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


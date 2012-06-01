/* <font-face-contextual-lig-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: contextual-ligatures | no-contextual-ligatures
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-contextual-lig-values",

	allowed: [
		{
			validation: [],
			values: [
				"contextual-ligatures",
				"no-contextual-ligatures"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


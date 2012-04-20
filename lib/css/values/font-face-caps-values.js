/* <font-face-caps-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: small-caps | all-small-caps | petite-caps | all-petite-caps | tilting-caps | unicase
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-historical-lig-values",

	allowed: [
		{
			validation: [],
			values: [
				"historical-ligatures",
				"no-historical-ligatures"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


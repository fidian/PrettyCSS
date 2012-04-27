/* <animation-fill-mode-single>
 *
 * CSS3:  none | forwards | backwards | both
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "animation-fill-mode-single",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"none",
				"forwards",
				"backwards",
				"both"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

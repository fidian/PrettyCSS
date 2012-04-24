/* <direction>
 *
 * CSS3:  ltr | rtl | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "direction",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit",
				"ltr",
				"rtl"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

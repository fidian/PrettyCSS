/* <box-sizing>
 *
 * CSS3:  content-box | border-box | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "box-sizing",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"content-box",
				"border-box",
				"padding-box",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

/* <border-image-repeat-single>
 *
 * CSS3:  stretch | repeat | round | space
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "border-image-repeat-single",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"stretch",
				"repeat",
				"round",
				"space"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

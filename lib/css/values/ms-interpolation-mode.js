/* -ms-interpolation-mode
 *
 * IE7:  nearest-neighbor | bicubic
 * IE9 drops support
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "ms-interpolation-mode",

	allowed: [
		{
			validation: [
				validate.browserOnly('ie'),
				validate.browserUnsupported('ie9')
			],
			values: [
				"nearest-neighbor",
				"bicubic"
			]
		
		}
	]
});

exports.parse = base.simpleParser(Val);


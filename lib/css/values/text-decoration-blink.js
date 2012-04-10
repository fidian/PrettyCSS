/* <text-decoration-blink>
 *
 * Used to add consistent validation rules for the "blink" value
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationBlink = base.baseConstructor();

util.extend(TextDecorationBlink.prototype, base.base, {
	name: "text-decoration-blink",

	allowed: [
		{
			validation: [
				validate.browserUnsupported('IE'),
				validate.browserUnsupported('Chrome'),
				validate.browserUnsupported('Safari')
			],
			values: [
				"blink"
			]
		}
	]
});

exports.parse = base.simpleParser(TextDecorationBlink);

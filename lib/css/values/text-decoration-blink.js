/* <text-decoration-blink>
 *
 * Used to add consistent validation rules for the "blink" value
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Offset = base.baseConstructor();

util.extend(Offset.prototype, base.base, {
	name: "offset",

	allowed: [
		{
			validation: [
				validate.browserUnsupported('IE'),
				validate.browserUnsupported('Chrome'),
				validate.browserUnsupported('Safari')
			],
			values: [
				"auto",
				"inherit"
			],
			valueObjects: [
				'length',
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(Offset);

/* <text-decoration-blink>
 *
 * Used to add consistent validation rules for the "blink" value
 */

"use strict";

var base = require('./base');
var length = require('./length');
var percentage = require('./percentage');
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
				length,
				percentage,
				"auto",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(Offset);

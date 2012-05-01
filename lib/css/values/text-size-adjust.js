/* <text-size-adjust>
 *
 * Used for adjusting text size on mobile browsers.
 *
 * Not official.
 *
 * none | auto | inherit | <percentage>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "text-size-adjust",

	allowed: [
		{
			validation: [
			],
			values: [
				'none',
				'auto',
				'inherit'
			],
			valueObjects: [
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

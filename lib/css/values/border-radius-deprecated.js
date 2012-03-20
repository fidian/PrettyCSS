/* <border-radius-deprecated>
 *
 * Same as <border-radius> except emits deprecated notice
 */

"use strict";

var base = require('./base');
var borderRadius = require('./border-radius');
var util = require('../../util');
var validate = require('./validate');

var BorderRadiusDeprecated = base.baseConstructor();

util.extend(BorderRadiusDeprecated.prototype, base.base, {
	name: "offset",

	allowed: [
		{
			validation: [
				validate.deprecated(null, "border-radius")
			],
			values: [
				borderRadius
			]
		}
	]
});

exports.parse = base.simpleParser(BorderRadiusDeprecated);

/* <border-radius-single-deprecated>
 *
 * Same as <border-radius-single> except emits deprecated notice
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderRadiusSingleDeprecated = base.baseConstructor();

util.extend(BorderRadiusSingleDeprecated.prototype, base.base, {
	name: "offset",

	allowed: [
		{
			validation: [
				validate.deprecated(null, "border-*-*-radius")
			],
			valueObjects: [
				'border-radius-single'
			]
		}
	]
});

exports.parse = base.simpleParser(BorderRadiusSingleDeprecated);

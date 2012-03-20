/* <max-length>
 *
 * Used for the max-width and max-height properties
 *
 * CSS2:  <length> | <percentage> | inherit
 * CSS3:  Drops support for auto
 */

"use strict";

var base = require('./base');
var length = require('./length');
var percentage = require('./percentage');
var util = require('../../util');
var validate = require('./validate');

var MaxLength = base.baseConstructor();

util.extend(MaxLength.prototype, base.base, {
	name: "max-length",

	allowed: [
		{
			validation: [
				validate.minimumCss(2),
				validate.positiveValue()
			],
			values: [
				length,
				percentage,
				"none",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(MaxLength);

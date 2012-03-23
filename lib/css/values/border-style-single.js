/* <border-style>
 *
 * Used by border-style as well as outline-style, thus does NOT have
 * "hidden" as an allowed value
 *
 * CSS1:  none | dotted | dashed | solid | double | groove | ridge | inset | outset
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderStyleSingle = base.baseConstructor();

util.extend(BorderStyleSingle.prototype, base.base, {
	name: "border-style-single",

	allowed: [
		{
			validation: [],
			values: [
				"none",
				"dotted",
				"dashed",
				"solid",
				"double",
				"groove",
				"ridge",
				"inset",
				"outset"
			]
		}
	]
});

exports.parse = base.simpleParser(BorderStyleSingle);

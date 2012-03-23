/* <text-decoration-style>
 *
 * CSS3:  solid | double | dotted | dashed | wavy
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationStyle = base.baseConstructor();

util.extend(TextDecorationStyle.prototype, base.base, {
	name: "text-decoration-style",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"solid",
				"double",
				"dotted",
				"dashed",
				"wavy",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(TextDecorationStyle);

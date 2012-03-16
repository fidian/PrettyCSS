/* <border-style>
 *
 * CSS1:  none | dotted | dashed | solid | double | groove | ridge | inset | outset
 * CSS2:  inherit
 */
var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderStyle = base.baseConstructor();

util.extend(BorderStyle.prototype, base.base, {
	name: "border-style",

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
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(BorderStyle);

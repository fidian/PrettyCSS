/* <border-width-single>
 *
 * CSS1:  thin | medium | thick | <length>
 * CSS2:  inherit
 */
var base = require('./base');
var length = require('./length');
var util = require('../../util');
var validate = require('./validate');

var BorderWidthSingle = base.baseConstructor();

util.extend(BorderWidthSingle.prototype, base.base, {
	name: "border-width-single",

	allowed: [
		{
			validation: [],
			values: [
				"thin",
				"medium",
				"thick",
				length
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

exports.parse = base.simpleParser(BorderWidthSingle);

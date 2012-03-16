/* <border-radius-single-deprecated>
 *
 * Same as <border-radius-single> except emits deprecated notice
 */
var base = require('./base');
var borderRadiusSingle = require('./border-radius-single');
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
			values: [
				borderRadiusSingle
			]
		}
	]
});

exports.parse = base.simpleParser(BorderRadiusSingleDeprecated);

/* <min-length>
 *
 * Used for the min-width and min-height properties
 *
 * CSS2:  <length> | <percentage> | inherit
 * CSS3:  Drops support for auto
 */
var base = require('./base');
var length = require('./length');
var percentage = require('./percentage');
var util = require('../../util');
var validate = require('./validate');

var MinLength = base.baseConstructor();

util.extend(MinLength.prototype, base.base, {
	name: "min-length",

	allowed: [
		{
			validation: [
				validate.minimumCss(2),
				validate.positiveValue()
			],
			values: [
				length,
				percentage,
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(MinLength);

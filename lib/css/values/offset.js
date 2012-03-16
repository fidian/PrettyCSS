/* <offset>
 *
 * Used for the left, right, top and bottom properties
 *
 * CSS2:  <length> | <percentage> | auto | inherit
 * CSS3:  Drops support for auto
 */
var base = require('./base');
var length = require('./length');
var percentage = require('./percentage');
var util = require('../../util');
var validate = require('./validate');

var Offset = base.baseConstructor();

util.extend(Offset.prototype, base.base, {
	name: "offset",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				length,
				percentage,
				"auto",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(Offset);

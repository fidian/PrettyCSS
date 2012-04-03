/* <offset>
 *
 * Used for the left, right, top and bottom properties
 *
 * CSS2:  <length> | <percentage> | auto | inherit
 * CSS3:  Drops support for auto
 */

"use strict";

var base = require('./base');
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
				"auto",
				"inherit"
			],
			valueObjects: [
				'length',
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(Offset);

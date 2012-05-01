/* <border-image-width-single>
 *
 * CSS3:  <length> | <percentage> | <number> | auto
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "border-image-width-single",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"auto"
			],
			valueObjects: [
				'length',
				'percentage',
				'number'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

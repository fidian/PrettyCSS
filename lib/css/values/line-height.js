/* <line-height>
 *
 * CSS1:  normal | <number> | <length> | <percentage>
 * CSS2:  inherit
 * CSS3:  none
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var LineHeight = base.baseConstructor();

util.extend(LineHeight.prototype, base.base, {
	name: "line-height",

	allowed: [
		{
			validation: [],
			values: [
				"normal"
			]
		},
		{
			validation: [
				validate.positiveValue()
			],
			valueObjects: [
				'number',
				'length',
				'percentage'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit"
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"none"
			]
		}
	]
});

exports.parse = base.simpleParser(LineHeight);

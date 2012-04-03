/* <height>
 *
 * <length> | <percentage> | auto | inherit
 * CSS2.1 adds inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var DisplayType = base.baseConstructor();

util.extend(DisplayType.prototype, base.base, {
	name: "display-type",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			valueObjects: [ 
				'length',
				'percentage'
			]
		},
		{
			validation: [],
			values: [ 
				'auto'
			]
		},
		{
			validation: [
				validate.minimumCss(2.1)
			],
			values: [
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(DisplayType);

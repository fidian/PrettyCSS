/* <width>
 *
 * <length> | <percentage> | auto | inherit
 * CSS2.1 adds inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Width = base.baseConstructor();

util.extend(Width.prototype, base.base, {
	name: "width",

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

exports.parse = base.simpleParser(Width);

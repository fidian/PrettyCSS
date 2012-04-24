/* <height>
 *
 * <length> | <percentage> | auto | inherit
 * CSS2.1 adds inherit
 *
 * TODO:  If a percentage and it isn't a whole number, convert to em
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Height = base.baseConstructor();

util.extend(Height.prototype, base.base, {
	name: "height",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			valueObjects: [ 
				'length'	
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
				validate.minimumCss(2),
				validate.positiveValue()
			],
			valueObjects: [ 
				'percentage'
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

exports.parse = base.simpleParser(Height);

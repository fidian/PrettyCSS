/* <padding-width>
 *
 * Used for matching padding and padding-* properties.
 *
 * CSS1: <length> | <percentage> | auto
 * CSS2: inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var PaddingWidth = base.baseConstructor();

util.extend(PaddingWidth.prototype, base.base, {
	name: "padding-width",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			values: [ 
				'auto'
			],
			valueObjects: [
				'length',
				'percentage'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(PaddingWidth);

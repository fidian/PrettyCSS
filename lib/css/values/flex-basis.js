/* <flex-basis>
 *
 * CSS3: <length> | <percentage> | inherit | initial | unset
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FlexBasis = base.baseConstructor();

util.extend(FlexBasis.prototype, base.base, {
	name: "flex-basis",

	allowed: [
		{
			validation: [
				validate.minimumCss(3),
				validate.browserUnsupported('ie10'),
				validate.positiveValue()
			],
			valueObjects: [
				'length',
				'percentage'
			]
		},
		{
			validation: [
				validate.minimumCss(3),
				validate.browserUnsupported('ie10'),
			],
			values: [
				'auto',
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(FlexBasis);

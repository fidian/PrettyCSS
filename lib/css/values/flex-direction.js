/* <flex-direction>
 *
 * CSS3: row | row-reverse | column | column-reverse | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FlexDirection = base.baseConstructor();

util.extend(FlexDirection.prototype, base.base, {
	name: "flex-direction",

	allowed: [
		{
			validation: [
				validate.minimumCss(3),
				validate.browserUnsupported('ie10'),
			],
			values: [
				'row',
				'row-reverse',
				'column',
				'column-reverse',
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(FlexDirection);


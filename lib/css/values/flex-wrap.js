/* <flex-wrap>
 *
 * CSS3: nowrap | wrap | wrap-reverse | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FlexWrap = base.baseConstructor();

util.extend(FlexWrap.prototype, base.base, {
	name: "flex-wrap",

	allowed: [
		{
			validation: [
				validate.minimumCss(3),
				validate.browserUnsupported('ie10'),
			],
			values: [
				'nowrap',
				'wrap',
				'wrap-reverse',
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(FlexWrap);

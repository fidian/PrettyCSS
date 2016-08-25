/* <flex-resize>
 *
 * Used for matching flex-grow, flex-shrink, and flex properties
 *
 * CSS3: <number> | inherit | initial | unset
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FlexResize = base.baseConstructor();

util.extend(FlexResize.prototype, base.base, {
	name: "flex-resize",

	allowed: [
		{
			validation: [
				validate.minimumCss(3),
				validate.browserUnsupported('ie10'),
				validate.positiveValue()
			],
			valueObjects: [
				'number'
			]
		},
		{
			validation: [
				validate.minimumCss(3),
				validate.browserUnsupported('ie10'),
			],
			values: [
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(FlexResize);

/* <order>
 *
 * Used for matching flex-grow, flex-shrink, and flex properties
 *
 * CSS3: <number> | inherit | initial | unset
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Order = base.baseConstructor();

util.extend(Order.prototype, base.base, {
	name: "order",

	allowed: [
		{
			validation: [
				validate.minimumCss(3),
				validate.browserUnsupported('ie10'),
				validate.positiveValue(),
				validate.numberPortionIsInteger()
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

exports.parse = base.simpleParser(Order);

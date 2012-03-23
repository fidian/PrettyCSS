/* <opacity>
 *
 * CSS3: inherit | <alphavalue>
 *
 * <alphavalue> is a number from 0.0 to 1.0
 */

"use strict";

var base = require('./base');
var number = require('./number');
var util = require('../../util');
var validate = require('./validate');

var Opacity = base.baseConstructor();

util.extend(Opacity.prototype, base.base, {
	name: "opacity",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'inherit'
			]
		},
		{
			validation: [
				validate.minimumCss(3),
				validate.withinRange(0.0, 1.0)
			],
			values: [
				number
			]
		}
	]
});

exports.parse = base.simpleParser(Opacity);

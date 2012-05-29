/* <font-face-units-per-em>
 *
 * CSS2:  <number>
 *
 * Not in CSS3, "inherit" and "all" are not allowed.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-units-per-em",

	allowed: [
		{
			validation: [
				validate.maximumCss(2),
				validate.minimumCss(2),
				validate.notForwardCompatible(3),
				validate.positiveValue()
			],
			valueObjects: [ 
				"number"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

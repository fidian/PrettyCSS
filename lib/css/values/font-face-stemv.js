/* <font-face-stemv>
 *
 * CSS2:  <number>
 *
 * Not in CSS3, "inherit" and "all" are not allowed.
 * TODO:  If this is used, units-per-em must be specified
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-stemv",

	allowed: [
		{
			validation: [
				validate.maximumCss(2),
				validate.minimumCss(2),
				validate.notForwardCompatible(3)
			],
			valueObjects: [ 
				"number"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

/* <bg-repeat>
 *
 * CSS1:  repeat | repeat-x | repeat-y | no-repeat
 * CSS2:  inherit
 * Helper for background-repeat in CSS3
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var bgRepeat = base.baseConstructor();

util.extend(bgRepeat.prototype, base.base, {
	name: "bg-repeat",

	allowed: [
		{
			validation: [],
			values: [ 
				"repeat",
				"repeat-x",
				"repeat-y",
				"no-repeat"
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(bgRepeat);

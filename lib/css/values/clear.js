/* clear
 *
 * CSS1:  none, left, right, both
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Clear = base.baseConstructor();

util.extend(Clear.prototype, base.base, {
	name: "clear",

	allowed: [
		{
			validation: [],
			values: [ 
				'none',
				'left',
				'right',
				'both'
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

exports.parse = base.simpleParser(Clear);

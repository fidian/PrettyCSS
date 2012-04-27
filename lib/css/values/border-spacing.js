/* <border-spacing>
 *
 * CSS2:  <length> <length>? | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderSpacing = base.baseConstructor();

util.extend(BorderSpacing.prototype, base.base, {
	name: "border-spacing",

	allowed: [
		{
			validation: [],
			valueObjects: [ 
				'length1-2'
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

exports.parse = base.simpleParser(BorderSpacing);

/* <text-indent>
 *
 * CSS1: <length> | <percentage>
 * CSS2: inherit
 * CSS3: hanging | each-line
 *
 */

"use strict";

var base = require('./base');
var length = require('./length');
var percentage = require('./percentage');
var util = require('../../util');
var validate = require('./validate');

var TextIndent = base.baseConstructor();

util.extend(TextIndent.prototype, base.base, {
	name: "text-indent",

	allowed: [
		{
			validation: [],
			values: [ 
				length,
				percentage
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				"inherit"
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"hanging",
				"each-line"		
			]
		}
	]
});

exports.parse = base.simpleParser(TextIndent);

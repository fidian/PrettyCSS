 /* <list-style-position>
 *
 * CSS1: inside | outside
 * CSS2: inherit
 * CSS3: hanging 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var ListStylePosition = base.baseConstructor();

util.extend(ListStylePosition.prototype, base.base, {
	name: "list-style-position",

	allowed: [
		{
			validation: [],
			values: [
				"inside",
				"outside",
				"none"
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
				"hanging"
			]
		}
		
	]
});

exports.parse = base.simpleParser(ListStylePosition);


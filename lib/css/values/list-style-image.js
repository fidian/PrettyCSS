 /* <list-style-image>
 *
 * CSS1: <image> | none
 * CSS2: inherit
 * 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var ListStyleImage = base.baseConstructor();

util.extend(ListStyleImage.prototype, base.base, {
	name: "list-style-image",

	allowed: [
		{
			validation: [],
			values: [
				"none"
			],
			valueObjects: [
				'image'
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

exports.parse = base.simpleParser(ListStyleImage);


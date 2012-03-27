 /* <list-style-image>
 *
 * CSS1: <url> | none
 * CSS2: inherit
 * 
 */

"use strict";

var base = require('./base');
var str = require('./string');
var url = require('./url');
var util = require('../../util');
var validate = require('./validate');

var ListStyleImage = base.baseConstructor();

util.extend(ListStyleImage.prototype, base.base, {
	name: "list-style-image",

	allowed: [
		{
			validation: [],
			values: [
				url,
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
		}
		
	]
});

exports.parse = base.simpleParser(ListStyleImage);


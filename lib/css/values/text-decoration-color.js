/* <text-decoration-color>
 *
 * CSS3:  <color>
 */

"use strict";

var base = require('./base');
var color = require('./color');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationColor = base.baseConstructor();

util.extend(TextDecorationColor.prototype, base.base, {
	name: "text-decoration-color",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				color,
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(TextDecorationColor);

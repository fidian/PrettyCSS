/* <outline>
 *
 * Used for matching outline-style properties.
 *
 * CSS2: [ <outline-color> || <outline-style> || <outline-width> ] | inherit
 *
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');
var outlineColor = require('./outline-color');
var outlineStyle = require('./outline-style');
var outlineWidth = require('./outline-width');
var Outline = base.baseConstructor();

util.extend(Outline.prototype, base.base, {
	name: "outline",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				outlineColor,
				outlineStyle,
				outlineWidth,
				'inherit'
			]
		}	
	]
});

exports.parse = base.simpleParser(Outline);

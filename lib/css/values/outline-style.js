/* <outline-style>
 *
 * Used for matching outline-style properties.
 *
 * CSS2: <border-style-single> | inherit
 * CSS3: auto
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var OutlineStyle = base.baseConstructor();

util.extend(OutlineStyle.prototype, base.base, {
	name: "outline-style",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			],
			valueObjects: [
				'border-style-single'
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'auto'
			]
		}	
	]
});

exports.parse = base.simpleParser(OutlineStyle);

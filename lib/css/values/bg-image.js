/* <bg-image>
 *
 * CSS1:  <image> | none
 * CSS2:  inherit
 * Helper for background-image in CSS3
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BgImage = base.baseConstructor();

util.extend(BgImage.prototype, base.base, {
	name: "bg-image",

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

exports.parse = base.simpleParser(BgImage);

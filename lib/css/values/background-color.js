/* background-color
 *
 * CSS1:  <color> | transparent
 * CSS2:  <color> | transparent | inherit
 * CSS2.1:  Same as CSS2
 * CSS3:  <color>     transparent is part of <color> and inherit was removed
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundColor = base.baseConstructor();

util.extend(BackgroundColor.prototype, base.base, {
	name: "background-color",

	allowed: [
		{
			validation: [
				validate.minimumCss(2),
				validate.browserUnsupported('ie7'),
				validate.browserQuirk('ie8')  // Requires !DOCTYPE
			],
			values: [
				"inherit"  // Also matches inherit in <color>, so list this first
			]
		},
		{
			validation: [],
			values: [ 
				'transparent'
			],
			valueObjects: [
				'color'
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"initial"
			]
		}
	]
});

exports.parse = base.simpleParser(BackgroundColor);

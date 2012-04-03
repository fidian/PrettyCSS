/* <opacity>
 *
 * CSS3: inherit | <alphavalue>
 *
 * <alphavalue> is a number from 0.0 to 1.0
 *
 * TODO:  Should also specify "filter: alpha(opacity=40)" for IE8 and earlier
 * TODO:  Check if "filter: progid:DXImageTransform.Microsoft.Alpha(opacity=40)"
 * is still used?  Should work through IE8 according to MSDN
 * http://msdn.microsoft.com/en-us/library/ms532967(v=vs.85).aspx
 * TODO:  Point to this reference:
 * http://css-tricks.com/css-transparency-settings-for-all-broswers/
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Opacity = base.baseConstructor();

util.extend(Opacity.prototype, base.base, {
	name: "opacity",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'inherit'
			]
		},
		{
			validation: [
				validate.minimumCss(3),
				validate.withinRange(0.0, 1.0)
			],
			valueObjects: [
				'number'
			]
		}
	]
});

exports.parse = base.simpleParser(Opacity);

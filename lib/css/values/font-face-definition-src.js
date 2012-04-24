/* <font-face-definition-src>
 *
 * CSS2:  <url>
 *
 * Not in CSS3, "inherit" and "all" are not allowed.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-definition-src",

	allowed: [
		{
			validation: [
				validate.maximumCss(2),
				validate.minimumCss(2)
			],
			valueObjects: [ 
				"url"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

/* <animation-direction-single>
 *
 * CSS3:  normal | reverse | alternate | alternate-reverse
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "animation-direction-single",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"normal",
				"reverse",
				"alternate",
				"alternate-reverse"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

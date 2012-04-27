/* <transition-duration-single>
 *
 * CSS3:  <time>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "transition-duration-single",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			valueObjects: [
				'time'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

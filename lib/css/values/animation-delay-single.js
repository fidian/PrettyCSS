/* <animation-delay-single>
 *
 * CSS3:  <time>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "animation-delay-single",

	allowed: [
		{
			validation: [],
			valueObjects: [
				'time'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

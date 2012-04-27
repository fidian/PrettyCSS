/* <animation-play-state-single>
 *
 * CSS3:  running | paused
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "animation-play-state-single",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"running",
				"paused"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

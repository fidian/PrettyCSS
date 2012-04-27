/* <animation-timing-function-single>
 *
 * CSS3:  ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | <steps> | <cubic-bezier>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "animation-timing-function-single",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"ease",
				"linear",
				"ease-in",
				"ease-out",
				"ease-in-out",
				"step-start",
				"step-end"
			],
			valueObjects: [
				'steps',
				'cubic-bezier'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

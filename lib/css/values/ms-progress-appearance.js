/* -ms-progress-appearance
 *
 * IE8:  bar | ring
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var ProgressAppearance = base.baseConstructor();

util.extend(ProgressAppearance.prototype, base.base, {
	name: "ms-progress-appearance",

	allowed: [
		{
			validation: [
				validate.browserOnly('ie8')
			],
			values: [
				"bar",
				"ring"
			]
		
		}
	]
});

exports.parse = base.simpleParser(ProgressAppearance);


/* <image>
 *
 * Any image can be a URL or a gradient.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "image",

	allowed: [
		{
			validation: [
			],
			valueObjects: [
				'url',
				'linear-gradient',
				'moz-linear-gradient',
				'ms-linear-gradient',
				'o-linear-gradient'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

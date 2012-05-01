/* <moz-user-select>
 *
 * Not official
 * none | text | all | element | inherit | -moz-none
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "moz-user-select",

	allowed: [
		{
			validation: [
			],
			values: [
				'none',
				'text',
				'all',
				'element',
				'inherit',
				'-moz-none'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

/* <ms-user-select>
 *
 * Not official
 * none | text | element | auto
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "ms-user-select",

	allowed: [
		{
			validation: [
			],
			values: [
				'none',
				'text',
				'element',
				'auto'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

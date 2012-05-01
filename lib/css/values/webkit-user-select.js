/* <webkit-user-select>
 *
 * Not official
 *
 * auto | none | text
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "webkit-user-select",

	allowed: [
		{
			validation: [
			],
			values: [
				'auto',
				'none',
				'text'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

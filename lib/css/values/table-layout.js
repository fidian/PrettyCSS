/* <table-layout>
 *
 * CSS2:
 * inherit | auto | fixed
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "table-layout",

	allowed: [
		{
			validation: [
			],
			values: [
				'inherit',
				'auto',
				'fixed'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

/* <webkit-font-smoothing>
 *
 * Browser only, not part of a spec
 *
 * inherit | none | antialiased | subpixel-antialiased
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "webkit-font-smoothing",

	allowed: [
		{
			validation: [
			],
			values: [
				'inherit',
				'none',
				'antialiased',
				'subpixel-antialiased'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

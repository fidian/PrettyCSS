/* <animation-name-single>
 *
 * CSS3:  none | <ident>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "animation-name-single",

	allowed: [
		{
			validation: [],
			values: [
				"none"
			],
			valueObjects: [
				'ident'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

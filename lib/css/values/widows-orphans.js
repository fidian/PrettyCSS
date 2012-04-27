/* <widows-orphans>
 *
 * CSS2: <integer> | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "widows-orphans",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			]
		},
		{
			validation: [
				validate.minimumCss(2),
				validate.numberPortionIsInteger(),
				validate.positiveValue()
			],
			valueObjects: [
				'number'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

/* <z-index>
 *
 * CSS2: auto | <integer> | inherit
 */

"use strict";

var base = require('./base');
var number = require('./number');
var util = require('../../util');
var validate = require('./validate');

var ZIndex = base.baseConstructor();

util.extend(ZIndex.prototype, base.base, {
	name: "z-index",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'auto',
				'inherit'
			]
		},
		{
			validation: [
				validate.minimumCss(2),
				validate.numberPortionIsInteger()
			],
			values: [
				number
			]
		}
	]
});

exports.parse = base.simpleParser(ZIndex);

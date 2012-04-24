/* <font-face-font-stretch-single>
 *
 * CSS2:  normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-font-stretch-single",

	allowed: [
		{
			validation: [],
			values: [ 
				'normal',
				'ultra-condensed',
				'extra-condensed',
				'condensed',
				'semi-condensed',
				'semi-expanded',
				'expanded',
				'extra-expanded',
				'ultra-expanded'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

/* <webkit-text-stroke-width>
 *
 * CSS3:  <border-width-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "webkit-text-stroke-width",

	allowed: [
		{
			validation: [
				validate.browserOnly('s')
			],
			valueObjects: [
				'border-width-single'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

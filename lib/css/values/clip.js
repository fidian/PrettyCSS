/* <clip>
 *
 * CSS2:  <shape> | auto | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "clip",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"auto",
				"inherit"
			],
			valueObjects: [
				'shape'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

/* <shape>
 *
 * Used for the "clip" property
 *
 * CSS2:  <rect>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "shape",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			valueObjects: [
				'rect'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

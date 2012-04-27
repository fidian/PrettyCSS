/* <page-break-inside>
 *
 * CSS2:  avoid | auto | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "page-break-inside",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				"inherit",
				"auto",
				"avoid"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

/* <page-break-edge>
 *
 * CSS2:  avoid | auto | inherit | always | left | right
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "page-break-edge",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				"inherit",
				"auto",
				"avoid",
				"always",
				"left",
				"right"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

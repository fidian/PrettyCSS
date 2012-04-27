/* <page-size>
 *
 * CSS2:  <length> <length>? | auto | portrait | landscape | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "page-size",

	allowed: [
		{
			validation: [
				validate.minimumCss(2),
				validate.maximumCss(2),
				validate.notForwardCompatible(2.1)
			],
			values: [ 
				"inherit",
				"auto",
				"portrait",
				"landscape"
			],
			valueObjects: [ 
				'length1-2'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

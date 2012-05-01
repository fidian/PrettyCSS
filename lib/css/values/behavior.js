/* <behavior>
 *
 * IE only
 * <url>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "behavior",

	allowed: [
		{
			validation: [
				validate.browserOnly('ie')
			],
			valueObjects: [ 
				"url"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

/* <moz-force-broken-image-icon>
 *
 * Should be 0 (don't show) or 1 (force show).
 * Mozilla recommends you use a proper alt tag instead.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "moz-force-broken-image-icon",

	allowed: [
		{
			validation: [
				validate.withinRange(0, 1)
			],
			valueObjects: [ 
				'integer'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);

/* <time>
 *
 * Times are units with an "s" or "ms" identifiers.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "time",

	allowed: [
		{
			validation: [],
			values: []
		},
		{
			validation: [
			],
			values: [
				base.makeRegexp('[-+]?{n}(s|ms)')
			]
		}
	],

	getUnit: function () {
		var out = this.firstToken().content.replace(/[-+0-9.]/g, '');
		return out;
	},

	// Strip unit
	getValue: function () {
		var out = this.firstToken().content.replace(/[^-+0-9.]/g, '');
		return out;
	},

	// Add unit back
	setValue: function (newValue) {
		this.firstToken().content = newValue.toString() + this.getUnit();
	}
});

exports.parse = base.simpleParser(Val);

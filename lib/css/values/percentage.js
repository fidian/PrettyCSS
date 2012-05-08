/* <percentage>
 *
 * Percentages should be integer values from 0.  CSS1 allows floating
 * point numbers, but CSS2 does not.  Allow reading them, but round to the
 * nearest integer.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Percentage = base.baseConstructor();

util.extend(Percentage.prototype, base.base, {
	name: "percentage",

	allowed: [
		{
			validation: [],
			values: [ 
				base.makeRegexp('[-+]?{n}%')
			]
		}
	],

	getValue: function () {
		var v = this.firstToken().content;
		v = v.substr(0, v.length - 1);
		return v;
	},

	setValue: function (newValue) {
		this.firstToken().content = newValue.toString() + '%';
	}
});

exports.parse = base.simpleParser(Percentage);

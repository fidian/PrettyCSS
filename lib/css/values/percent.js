/* <percent>
 *
 * Percents should be integer values from 0 to 100%.  CSS1 allows floating
 * point numbers, but CSS2 does not.  Allow reading them, but round to the
 * nearest integer.
 */

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Percent = base.baseConstructor();

util.extend(Percent.prototype, base.base, {
	name: "percent",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			values: [ 
				base.makeRegexp('[-+]?{n}%')
			]
		}
	],

	getValue: function () {
		var v = this.list[0].content;
		v = v.substring(0, v.length - 2);
		v = Math.round(+ v);
		return v;
	},

	toString: function () {
		this.debug('toString');
		return this.getValue() + '%';
	}
});

exports.parse = base.simpleParser(Percent);

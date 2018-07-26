/* <length>
 *
 * Lengths can be 0 (without a unit identifier) or a UNIT token that represents
 * either an absolute or relative length.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Length = base.baseConstructor();

util.extend(Length.prototype, base.base, {
	name: "length",

	allowed: [
		{
			validation: [],
			values: [ 
				"0"
			]
		},
		{
			validation: [
				validate.numberPortionIsNotZero()
			],
			values: [
				base.makeRegexp('[-+]?{n}(em|ex)')
			]
		},
		{
			validation: [
				validate.numberPortionIsNotZero(),
				validate.suggestUsingRelativeUnits()
			],
			values: [ 
				// px were made an absolute length as of CSS2.1
				base.makeRegexp('[-+]?{n}(in|cm|mm|pt|pc|px)')
			]
		},
		{
			validation: [
				validate.numberPortionIsNotZero(),
				validate.minimumCss(3)
			],
			values: [ 
				base.makeRegexp('[-+]?{n}(ch|rem|vw|vh|vm|vmin|vmax)')
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
		return +out;
	},

	// Add unit back
	setValue: function (newValue) {
		this.firstToken().content = newValue.toString() + this.getUnit();
	},

	toString: function () {
		return this.toStringChangeCase(false);
	},

	toStringChangeCase: function (changeCase) {
		this.debug('toString');
		var unit = this.firstToken().content;

		if (changeCase && ! this.preserveCase) {
			unit = unit.toLowerCase();
		}

		if (this.bucket.options.autocorrect) {
			if (unit.match(/^[-+]?0+([a-z]+)?$/)) {
				unit = '0';  // No need for a unit designator - may actually cause problems
			} else {
				unit = unit.replace(/^-0+/, '-').replace(/^0+/, '');
			}
		}

		return unit;
	}
});

exports.parse = base.simpleParser(Length);
